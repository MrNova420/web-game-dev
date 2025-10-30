#!/bin/bash

##############################################################################
# Dynasty of Emberveil - Auto Install and Play Script
# 
# This script automatically:
# 1. Checks system requirements
# 2. Installs Node.js if needed
# 3. Installs dependencies
# 4. Builds the game
# 5. Starts the game server
# 6. Opens the game in your browser
##############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fancy banner
echo -e "${PURPLE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║      ██████╗ ██╗   ██╗███╗   ██╗ █████╗ ███████╗████████╗   ║
║      ██╔══██╗╚██╗ ██╔╝████╗  ██║██╔══██╗██╔════╝╚══██╔══╝   ║
║      ██║  ██║ ╚████╔╝ ██╔██╗ ██║███████║███████╗   ██║      ║
║      ██║  ██║  ╚██╔╝  ██║╚██╗██║██╔══██║╚════██║   ██║      ║
║      ██████╔╝   ██║   ██║ ╚████║██║  ██║███████║   ██║      ║
║      ╚═════╝    ╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝   ╚═╝      ║
║                                                               ║
║             OF EMBERVEIL - Auto Install & Play                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}🎮 Welcome to Dynasty of Emberveil Auto-Installer!${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Step 1: Check system requirements
print_status "Checking system requirements..."
echo ""

# Check OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

print_success "Operating System: ${MACHINE}"

# Step 2: Check for Node.js
print_status "Checking for Node.js..."

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: ${NODE_VERSION}"
    
    # Check if version is >= 18
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_warning "Node.js version is older than v18. Recommended to upgrade."
        echo "Visit https://nodejs.org to download the latest version."
    fi
else
    print_error "Node.js is not installed!"
    print_warning "Please install Node.js 18+ from https://nodejs.org"
    echo ""
    echo "Installation instructions:"
    echo "  - Mac: brew install node"
    echo "  - Linux: sudo apt install nodejs npm (or use nvm)"
    echo "  - Windows: Download from https://nodejs.org"
    echo ""
    exit 1
fi

# Check for npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: v${NPM_VERSION}"
else
    print_error "npm is not installed!"
    exit 1
fi

echo ""

# Step 3: Navigate to project directory
print_status "Navigating to project directory..."
cd "$(dirname "$0")"
print_success "Current directory: $(pwd)"
echo ""

# Step 4: Install dependencies
print_status "Installing dependencies..."
echo -e "${YELLOW}This may take a few minutes...${NC}"
echo ""

if npm install; then
    print_success "Dependencies installed successfully!"
else
    print_error "Failed to install dependencies!"
    exit 1
fi

echo ""

# Step 5: Build the game
print_status "Building the game..."
echo ""

if npm run build; then
    print_success "Game built successfully!"
else
    print_error "Failed to build the game!"
    exit 1
fi

echo ""

# Step 6: Check available ports
print_status "Checking available ports..."

PORT=3000
if command -v lsof &> /dev/null; then
    while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; do
        print_warning "Port $PORT is in use, trying next port..."
        PORT=$((PORT + 1))
    done
fi

print_success "Will use port: $PORT"
echo ""

# Step 7: Start the game server
print_status "Starting game server..."
echo ""

# Create a simple server start script
cat > /tmp/dynasty_server.js << 'SERVEREOF'
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🎮 Dynasty of Emberveil is running!`);
  console.log(`\n🌐 Open your browser and visit:`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`\n✨ Enjoy your adventure in Emberveil!\n`);
});
SERVEREOF

cp /tmp/dynasty_server.js ./dynasty_server.js

echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║  🎮  Dynasty of Emberveil is starting...             ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Try to open browser automatically
sleep 2

URL="http://localhost:${PORT}"

print_status "Attempting to open game in browser..."

if command -v xdg-open &> /dev/null; then
    xdg-open "$URL" 2>/dev/null &
    print_success "Browser opened (Linux)"
elif command -v open &> /dev/null; then
    open "$URL" 2>/dev/null &
    print_success "Browser opened (Mac)"
elif command -v start &> /dev/null; then
    start "$URL" 2>/dev/null &
    print_success "Browser opened (Windows)"
else
    print_warning "Could not automatically open browser"
    echo -e "${CYAN}Please open your browser and visit: ${URL}${NC}"
fi

echo ""
echo -e "${PURPLE}════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}    Game Controls:${NC}"
echo -e "${PURPLE}    WASD - Move${NC}"
echo -e "${PURPLE}    Space - Jump${NC}"
echo -e "${PURPLE}    Mouse - Look around${NC}"
echo -e "${PURPLE}    Click icons - Open menus${NC}"
echo -e "${PURPLE}════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Start the server
PORT=$PORT node dynasty_server.js
