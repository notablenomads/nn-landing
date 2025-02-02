#!/bin/bash

# Exit on any error
set -e

# Configuration
APP_NAME="nn-landing"
DOCKER_HUB_USERNAME="mrdevx"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Helper functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }

# Check if Docker Hub token is set
if [ -z "$DOCKER_HUB_TOKEN" ]; then
    log_error "DOCKER_HUB_TOKEN environment variable is not set"
    echo "Please set it with: export DOCKER_HUB_TOKEN=your_docker_hub_token"
    exit 1
fi

# Step 1: Docker Hub Authentication
log_info "Step 1: Authenticating with Docker Hub"
echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin || {
    log_error "Failed to authenticate with Docker Hub"
    exit 1
}

# Get version and build image
VERSION=$(node -p "require('./package.json').version")
GIT_HASH=$(git rev-parse --short HEAD)
TAG="${VERSION}-${GIT_HASH}"
LATEST="latest"

# Step 2: Build and tag images
log_info "Step 2: Building Docker image..."
docker build -t "${DOCKER_HUB_USERNAME}/${APP_NAME}:${TAG}" \
            -t "${DOCKER_HUB_USERNAME}/${APP_NAME}:${LATEST}" .

# Step 3: Push images
log_info "Step 3: Pushing to Docker Hub..."
docker push "${DOCKER_HUB_USERNAME}/${APP_NAME}:${TAG}"
docker push "${DOCKER_HUB_USERNAME}/${APP_NAME}:${LATEST}"

# Logout from Docker Hub
docker logout

log_success "Build and push completed successfully!"
log_info "Image tags pushed:"
echo "  - ${DOCKER_HUB_USERNAME}/${APP_NAME}:${TAG}"
echo "  - ${DOCKER_HUB_USERNAME}/${APP_NAME}:${LATEST}" 