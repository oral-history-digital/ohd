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

# Copy your application code (this is fast unless you have a huge repo)
COPY . .

# Optionally: Check versions for sanity
RUN java -version && node -v && yarn -v
