# documentation: https://raw.githubusercontent.com/linuxserver/docker-baseimage-kasmvnc/refs/heads/master/README.md

FROM ghcr.io/linuxserver/baseimage-kasmvnc:ubuntunoble

# Replace shell with bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# --- System Mirror & Basic Tools ---
RUN sed -i 's|http://archive.ubuntu.com/ubuntu/|http://mirror.as.kamatera.com/ubuntu/|g' /etc/apt/sources.list /etc/apt/sources.list.d/ubuntu.sources || true && \
    sed -i 's|http://security.ubuntu.com/ubuntu/|http://mirror.as.kamatera.com/ubuntu/|g' /etc/apt/sources.list /etc/apt/sources.list.d/ubuntu.sources || true && \
    apt-get update && \
    apt-mark hold snapd && \
    apt-get install -y --no-install-recommends wget gnupg ca-certificates curl git gh && \
    rm -rf /var/lib/apt/lists/*

# --- Node.js v20 & Build Essentials ---
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential libpulse-dev && \
    wget https://nodejs.org/dist/v20.17.0/node-v20.17.0-linux-x64.tar.xz && \
    tar -xJf node-v20.17.0-linux-x64.tar.xz -C /usr/local --strip-components=1 && \
    rm node-v20.17.0-linux-x64.tar.xz && \
    npm install -g yarn && \
    rm -rf /var/lib/apt/lists/*

# --- Browser & Playwright ---
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get update && \
    apt-get install -y --no-install-recommends ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb && \
    npm install -g playwright && \
    npx playwright install-deps && \
    rm -rf /var/lib/apt/lists/*

# --- Global NPM Packages ---
RUN npm install -g opencode-ai \
    "@modelcontextprotocol/server-filesystem" \
    "@modelcontextprotocol/server-sequential-thinking"

# --- Docker CLI & System Utilities ---
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y --no-install-recommends docker-ce-cli docker-compose-plugin rsync iputils-ping python3-pip openjdk-17-jdk psmisc tmux && \
    usermod -aG docker abc && \
    rm -rf /var/lib/apt/lists/*

# --- Git Configuration ---
RUN git config --global user.name "louiscklaw" && \
    git config --global user.email "louiscklaw@users.noreply.github.com"

# --- Conda & Python Environment ---
ENV CONDA_PLUGINS_AUTO_ACCEPT_TOS=true
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O install_miniconda.sh && \
    bash install_miniconda.sh -b -p /opt/conda && \
    rm install_miniconda.sh && \
    /opt/conda/bin/conda install python~=3.11.0 pip -y && \
    /opt/conda/bin/pip install --no-cache-dir requests && \
    /opt/conda/bin/conda clean --all -f

ENV PATH="/opt/conda/bin:${PATH}"
