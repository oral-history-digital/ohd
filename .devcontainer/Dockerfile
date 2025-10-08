# Use pre-built Rails base image with Java and Node.js
FROM ghcr.io/yotkadata/rails-base:latest

# Create the 'vscode' user matching devcontainer.json remoteUser
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000
RUN groupadd --gid $USER_GID $USERNAME \
  && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
  && apt-get update && apt-get install -y sudo xvfb wget gnupg unzip curl \
  && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update && apt-get install -y google-chrome-stable \
  && wget -O /tmp/chromedriver.zip "https://chromedriver.storage.googleapis.com/$(curl -s https://chromedriver.storage.googleapis.com/LATEST_RELEASE)/chromedriver_linux64.zip" \
  && unzip /tmp/chromedriver.zip -d /tmp \
  && mv /tmp/chromedriver /usr/local/bin/ \
  && chmod +x /usr/local/bin/chromedriver \
  && rm /tmp/chromedriver.zip \
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
