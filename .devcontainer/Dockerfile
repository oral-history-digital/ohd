FROM ruby:3.0.7

# Force compiling native gems
ENV BUNDLE_FORCE_RUBY_PLATFORM=1

# Create the 'vscode' user matching devcontainer.json remoteUser
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000
RUN groupadd --gid $USER_GID $USERNAME \
  && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
  && apt-get update && apt-get install -y sudo \
  && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME

# Install system dependencies, JDK11, TeXLive, fonts, MySQL client & Docker CLI
RUN apt-get update && apt-get install -y \
    git \
    default-jdk \
    texlive-base \
    texlive-xetex \
    texlive-lang-all \
    fonts-freefont-ttf \
    fonts-noto \
    ca-certificates \
    curl \
    gnupg \
    netcat-openbsd \
    default-mysql-client \
    docker.io \
  && rm -rf /var/lib/apt/lists/*

# Install Node.js 18.x
RUN mkdir -p /etc/apt/keyrings \
  && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
       | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
  && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" \
       | tee /etc/apt/sources.list.d/nodesource.list \
  && apt-get update && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

# Install yarn
RUN npm install -g yarn

# Set working directory
WORKDIR /workspace

# Install Ruby gems
COPY Gemfile Gemfile.lock* /workspace/
RUN bundle install --jobs=4 --retry=3

# Install JS packages
COPY package.json yarn.lock /workspace/
RUN yarn install --frozen-lockfile --network-timeout 600000

# Verification
RUN java -version && node -v && yarn -v