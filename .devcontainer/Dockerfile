FROM debian:trixie-slim

LABEL maintainer="Thibaud FAURIE"
LABEL maintainer.email="thibaud.faurie@openrichmedia.org"

ENV NVM_VERSION=0.40.3
ENV NODE_MAJOR=24
ENV PNPM_VERSION=10

RUN apt update
RUN apt install -y curl git

# Install NVM
RUN curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh" | bash

# Install Node.js
RUN /bin/bash -c "source /root/.bashrc && nvm install ${NODE_MAJOR} && nvm use ${NODE_MAJOR} && nvm alias default ${NODE_MAJOR}"
# Install PNPM
RUN /bin/bash -c "source /root/.bashrc && corepack enable pnpm && corepack use pnpm@${PNPM_VERSION}"

# Clean apt cache
RUN apt clean