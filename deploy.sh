#!/bin/bash

# Configuration
DOCKER_USERNAME="mrdevx"
IMAGE_NAME="nn-landing"
SERVER_USER="root"
SERVER_IP="91.107.249.14"
SERVER_DEPLOY_PATH="/root/nn-landing"

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check if DOCKER_TOKEN is set
if [ -z "$DOCKER_TOKEN" ]; then
    echo "Error: DOCKER_TOKEN environment variable is not set"
    echo "Please set it with: export DOCKER_TOKEN=your_docker_hub_token"
    exit 1
fi

# Docker Hub login using token
echo -e "${GREEN}Logging into Docker Hub...${NC}"
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

# Get the current version from package.json and git hash
VERSION=$(node -p "require('./package.json').version")
GIT_HASH=$(git rev-parse --short HEAD)
TAG="${VERSION}-${GIT_HASH}"

echo -e "${GREEN}Building Docker image...${NC}"
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} .
docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest

echo -e "${GREEN}Pushing to Docker Hub...${NC}"
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest

echo -e "${GREEN}Deploying to server...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_DEPLOY_PATH} && \
  echo \"Logging into Docker Hub...\" && \
  echo \"$DOCKER_TOKEN\" | docker login -u \"$DOCKER_USERNAME\" --password-stdin && \
  echo \"Pulling latest image...\" && \
  docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:latest && \
  echo \"Stopping existing container...\" && \
  docker compose down && \
  echo \"Starting new container...\" && \
  docker compose up -d && \
  echo \"Cleaning up old images...\" && \
  docker image prune -f && \
  echo \"Logging out from Docker Hub...\" && \
  docker logout"

echo -e "${GREEN}Logging out from Docker Hub locally...${NC}"
docker logout

echo -e "${GREEN}Deployment completed successfully!${NC}" 