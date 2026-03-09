# Dev container image.
# Extends the shared base image (built from Dockerfile.base at repo root) with
# dev-only tooling: browser testing, VNC access, and the vscode user.
#
# System packages, Node.js, Yarn, and BUNDLE_PATH are already provided by the
# base image — do not reinstall them here.
#
# To rebuild the base image, trigger the "Build and Push Base Image" workflow
# in GitHub Actions (or push a change to Dockerfile.base on main).
FROM ghcr.io/oral-history-digital/ohd-base:latest

# Dev-only packages: browser testing (Capybara/Selenium) + VNC for visual debugging
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    chromium-driver \
    sudo \
    xvfb \
    x11vnc \
    novnc \
    websockify \
    wget \
    unzip \
  && ln -sf /usr/bin/chromium /usr/local/bin/google-chrome \
  && ln -sf /usr/bin/chromedriver /usr/local/bin/chromedriver \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Create the vscode user matching devcontainer.json remoteUser
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000
RUN groupadd --gid $USER_GID $USERNAME \
  && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
  && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME

# Copy dependency files first for better layer caching
COPY Gemfile Gemfile.lock* package.json yarn.lock ./

# Pre-install gems into /usr/local/bundle (not /workspace, which is volume-mounted).
# On first container start, Docker auto-populates the bundle-data named volume
# from this image layer, so bundle install is skipped by setup-dev.sh.
RUN gem install bundler \
  && bundle config set --global path /usr/local/bundle \
  && bundle config set --global without production \
  && bundle config set --global jobs $(nproc) \
  && bundle config set --global retry 3 \
  && bundle install

# Install JS dependencies (also layer-cached)
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy application code (changes most often — keep last)
COPY . .

RUN java -version && node -v && yarn -v
