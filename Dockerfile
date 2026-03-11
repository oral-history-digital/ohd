# Multi-stage production Dockerfile

# =============================================================================
# Stage 1: Base - app user and working directory
# =============================================================================
# System dependencies, Node.js, Yarn, and JAVA_HOME are all provided by the
# shared base image. See Dockerfile.base and .github/workflows/publish-base-image.yml.
FROM ghcr.io/oral-history-digital/ohd-base:latest AS base

# Create app user (non-root for security; production-only concern)
RUN groupadd --gid 1000 appuser \
  && useradd --uid 1000 --gid appuser --shell /bin/bash --create-home appuser

# Set working directory
WORKDIR /app

# =============================================================================
# Stage 2: Builder - Install dependencies
# =============================================================================
FROM base AS builder

# Install bundler
RUN gem install bundler:2.5.14

# Copy dependency files for layer caching
COPY Gemfile Gemfile.lock ./
COPY package.json yarn.lock ./

# Configure bundler for production (no development/test gems)
# Note: Not using --deployment flag to allow platform flexibility in Docker
RUN bundle config set --local without 'development:test' \
  && bundle config set --local jobs $(nproc) \
  && bundle config set --local retry 3

# Install gems
RUN bundle install --verbose

# Install Node packages
RUN yarn install --frozen-lockfile --production --network-timeout 600000

# =============================================================================
# Stage 3: Assets - Precompile assets
# =============================================================================
FROM builder AS assets

# Copy application code
COPY . .

# Create dummy secrets for asset precompilation
# (Real secrets will be mounted at runtime)
RUN bundle exec rails secret > /tmp/secret.txt \
  && export SECRET_KEY_BASE=$(cat /tmp/secret.txt) \
  && ruby -ropenssl -e 'File.write("/tmp/oidc_signing_key.pem", OpenSSL::PKey::RSA.new(2048).to_pem)' \
  && mkdir -p config \
  && echo "production:\n  secret_key_base: $(cat /tmp/secret.txt)" > config/secrets.yml \
  && echo "00000000000000000000000000000000" > config/master.key \
  && echo "production:\n  adapter: mysql2\n  pool: 5\n  timeout: 5000\n  database: dummy\n  username: root\n  password: ''\n  host: localhost" > config/database.yml \
  && rm -f config/credentials.yml.enc

# Precompile assets (without database connection or credentials)
RUN RAILS_ENV=production \
    NODE_ENV=production \
    SECRET_KEY_BASE=$(cat /tmp/secret.txt) \
    OIDC_SIGNING_KEY="$(cat /tmp/oidc_signing_key.pem)" \
    OIDC_ISSUER=http://localhost \
    DATACITE_CLIENT_ID_PRODUCTION=dummy \
    DATACITE_PASSWORD_PRODUCTION=dummy \
    DISABLE_DATABASE_ENVIRONMENT_CHECK=1 \
    SOLR_URL=http://localhost:8983/solr/default \
    bundle exec rake assets:precompile

# =============================================================================
# Stage 4: Runtime - Minimal production image
# =============================================================================
FROM base AS runtime

# Install only runtime system dependencies (no build tools)
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    --no-install-recommends \
    # Runtime only - no build-essential
    default-mysql-client \
    libmariadb3 \
    libxml2 \
    libxslt1.1 \
    libmagickwand-6.q16-6 \
    libffi8 \
    default-jre-headless \
    # PDF generation via rails-latex gem (required)
    texlive-base \
    texlive-xetex \
    fonts-freefont-ttf \
    fonts-noto \
    # Utilities
    curl \
    netcat-openbsd \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy bundler from builder with appuser ownership so runtime bundle install
# works when /usr/local/bundle is mounted as a named volume in local dev.
COPY --from=builder --chown=appuser:appuser /usr/local/bundle /usr/local/bundle

# Copy application
COPY --chown=appuser:appuser . /app

# Copy node_modules and precompiled assets from previous stages
COPY --from=assets --chown=appuser:appuser /app/node_modules /app/node_modules
COPY --from=assets --chown=appuser:appuser /app/public/packs /app/public/packs

# Create directories for runtime data
RUN mkdir -p \
    tmp/cache \
    tmp/pids \
    tmp/sockets \
    tmp/files \
    log \
    storage \
    /usr/local/bundle \
  && chown -R appuser:appuser \
    /usr/local/bundle \
    tmp \
    log \
    storage

# Switch to non-root user
USER appuser

# Expose Puma port
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Default environment
ENV RAILS_ENV=production \
    RACK_ENV=production \
    NODE_ENV=production \
    RAILS_SERVE_STATIC_FILES=false \
    RAILS_LOG_TO_STDOUT=true \
    PORT=3000

# Default command (can be overridden in docker-compose or Capistrano)
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
