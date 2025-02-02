#!/bin/bash

# Exit on any error
set -e

# Configuration
SERVER_IP="91.107.249.14"
SERVER_USER="root"
APP_NAME="nn-landing"
DOMAIN="landing.notablenomads.com"
DOCKER_HUB_USERNAME="mrdevx"
DEPLOY_PATH="/root/nn-landing"

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

# Check if required commands exist
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "Required command '$1' is not installed."
        exit 1
    fi
}

# Check if Docker Hub token is set
if [ -z "$DOCKER_HUB_TOKEN" ]; then
    log_error "DOCKER_HUB_TOKEN environment variable is not set"
    echo "Please set it with: export DOCKER_HUB_TOKEN=your_docker_hub_token"
    exit 1
fi

# Check required commands
check_command "docker"
check_command "ssh"

# Step 1: Build and push Docker image
log_info "Step 1: Building and pushing Docker image"

# Login to Docker Hub
log_info "Logging in to Docker Hub..."
echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin

# Get version and build image
VERSION=$(node -p "require('./package.json').version")
GIT_HASH=$(git rev-parse --short HEAD)
TAG="${VERSION}-${GIT_HASH}"

log_info "Building Docker image..."
docker build -t ${DOCKER_HUB_USERNAME}/${APP_NAME}:${TAG} .
docker tag ${DOCKER_HUB_USERNAME}/${APP_NAME}:${TAG} ${DOCKER_HUB_USERNAME}/${APP_NAME}:latest

log_info "Pushing to Docker Hub..."
docker push ${DOCKER_HUB_USERNAME}/${APP_NAME}:${TAG}
docker push ${DOCKER_HUB_USERNAME}/${APP_NAME}:latest

# Logout from Docker Hub locally
docker logout

# Step 2: Deploy to server
log_info "Step 2: Deploying to server"

# Create deployment script for remote execution
cat << 'REMOTESCRIPT' > /tmp/deploy-landing.sh
#!/bin/bash

# Configuration
DEPLOY_PATH="/root/nn-landing"
DOCKER_HUB_USERNAME="mrdevx"
APP_NAME="nn-landing"

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

# Create required directories
mkdir -p ${DEPLOY_PATH}/certbot/conf
mkdir -p ${DEPLOY_PATH}/certbot/www

cd ${DEPLOY_PATH}

# Login to Docker Hub
echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin

# Pull latest image
docker pull ${DOCKER_HUB_USERNAME}/${APP_NAME}:latest

# Stop and remove existing containers
docker compose down || true

# Start the services
docker compose up -d

# Logout from Docker Hub
docker logout

echo -e "${GREEN}Deployment completed!${NC}"
REMOTESCRIPT

# Make the script executable
chmod +x /tmp/deploy-landing.sh

# Copy files to server
log_info "Copying configuration files to server..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${DEPLOY_PATH}"
scp docker-compose.yml nginx.conf /tmp/deploy-landing.sh ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/

# Execute deployment script on server
log_info "Executing deployment script on server..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_PATH} && chmod +x deploy-landing.sh && DOCKER_HUB_TOKEN=${DOCKER_HUB_TOKEN} ./deploy-landing.sh"

# Clean up
rm /tmp/deploy-landing.sh

log_success "Deployment completed successfully!"
echo -e "\n🌍 Your application should now be running at https://${DOMAIN}"
echo -e "\n📝 Next steps:"
echo "1. Set up SSL certificates using: ./scripts/ssl-cert.sh --domain ${DOMAIN}"
echo "2. Monitor the logs with: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_PATH} && docker compose logs -f'" 