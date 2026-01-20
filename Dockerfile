# Multi-stage production Dockerfile

# =============================================================================
# Stage 1: Base - System dependencies and language runtimes
# =============================================================================
FROM ruby:3.3.4-slim AS base

# Install system dependencies first
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    --no-install-recommends \
    # Build essentials
    build-essential \
    pkg-config \
    cmake \
    autoconf \
    git \
    ca-certificates \
    curl \
    gnupg \
    xz-utils \
    # Database clients
    default-mysql-client \
    libmariadb-dev \
    # Ruby gem native dependencies
    libxml2-dev \
    libxslt1-dev \
    libmagickwand-dev \
    libffi-dev \
    # Java for Solr integration and mini_racer
    default-jdk-headless \
    # PDF generation via rails-latex gem (required)
    texlive-base \
    texlive-xetex \
    texlive-lang-all \
    fonts-freefont-ttf \
    fonts-noto \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install Node.js 22.x LTS directly from official binaries
# Current active LTS with support until April 2027 (matches package.json engines: >=18 <=22)
# TODO: Test and upgrade to Node 24 LTS after verification in development
ARG NODE_VERSION=22.22.0
RUN curl -fsSL https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz -o /tmp/node.tar.xz \
  && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
  && rm /tmp/node.tar.xz \
  && node --version \
  && npm --version

# Install Yarn package manager (Classic Stable)
RUN npm install -g yarn@1.22.22 \
  && yarn --version

# Set JAVA_HOME for gems that need Java headers
ENV JAVA_HOME=/usr/lib/jvm/default-java

# Create app user (non-root for security)
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
  && mkdir -p config \
  && echo "production:\n  secret_key_base: $(cat /tmp/secret.txt)" > config/secrets.yml \
  && echo "00000000000000000000000000000000" > config/master.key \
  && echo "production:\n  adapter: mysql2\n  pool: 5\n  timeout: 5000\n  database: dummy\n  username: root\n  password: ''\n  host: localhost" > config/database.yml \
  && rm -f config/credentials.yml.enc

# Precompile assets (without database connection or credentials)
RUN RAILS_ENV=production \
    NODE_ENV=production \
    SECRET_KEY_BASE=$(cat /tmp/secret.txt) \
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

# Copy bundler from builder
COPY --from=builder /usr/local/bundle /usr/local/bundle

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
  && chown -R appuser:appuser \
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
