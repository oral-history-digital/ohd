# Use pre-built Rails base image with Java and Node.js
FROM ghcr.io/yotkadata/rails-base:latest

# Create the 'vscode' user matching devcontainer.json remoteUser
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000
RUN groupadd --gid $USER_GID $USERNAME \
  && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
  && apt-get update && apt-get install -y sudo \
  && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Copy dependency files first for better layer caching
COPY Gemfile Gemfile.lock* package.json yarn.lock ./

# Install JS dependencies only (Ruby gems already in base image)
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy your application code (this layer changes most often)
COPY . .

# Optionally: Check versions for sanity
RUN java -version && node -v && yarn -v
