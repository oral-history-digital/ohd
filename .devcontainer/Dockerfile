FROM ruby:3.0.7

# Install system dependencies
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
    default-mysql-client \
    docker.io \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18.x
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

# Verify Node.js version
RUN node -v

# Install yarn
RUN npm install -g yarn

# Set up the working directory
WORKDIR /workspace

# Install Ruby dependencies
COPY Gemfile Gemfile.lock* /workspace/
RUN bundle install

# Copy package.json and yarn.lock for Node.js dependencies
COPY package.json yarn.lock /workspace/
# Install dependencies, but don't copy node_modules from the host
RUN yarn install --network-timeout 600000

# Note: We don't copy the entire project here
# The volume mount will handle that, and we want to avoid copying node_modules