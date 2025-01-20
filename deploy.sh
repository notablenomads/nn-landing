#!/bin/bash

# Configuration
DOCKER_USERNAME="notablenomads"  # Replace with your Docker Hub username
IMAGE_NAME="nn-landing"
CONTAINER_NAME="nn-landing"
SERVER_USER="root"
SERVER_IP="91.107.249.14"
SERVER_DEPLOY_PATH="/root/nn-landing"

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

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

echo -e "${GREEN}Copying docker-compose.yml to server...${NC}"
scp docker-compose.yml ${SERVER_USER}@${SERVER_IP}:${SERVER_DEPLOY_PATH}/

echo -e "${GREEN}Deploying to server...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_DEPLOY_PATH} && \
  echo \"Pulling latest image...\" && \
  docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:latest && \
  echo \"Stopping existing container...\" && \
  docker compose down && \
  echo \"Starting new container...\" && \
  docker compose up -d && \
  echo \"Cleaning up old images...\" && \
  docker image prune -f"

echo -e "${GREEN}Deployment completed successfully!${NC}" 