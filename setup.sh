#!/bin/bash

# Soul Beacon Setup Script
echo "🌟 Setting up Soul Beacon Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Check if Python is installed (for AlgoKit)
if ! command -v python3 &> /dev/null; then
    print_warning "Python 3 is not installed. AlgoKit features will be limited."
else
    PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    
    if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 10 ]); then
        print_warning "Python 3.10+ is required for AlgoKit. Current version: $(python3 --version)"
        print_warning "Please upgrade Python or install via Homebrew: brew install python@3.11"
        SKIP_ALGOKIT=true
    else
        print_success "Python $(python3 --version) detected"
        SKIP_ALGOKIT=false
    fi
fi

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Install workspace dependencies
print_status "Installing frontend dependencies..."
cd frontend && npm install && cd ..

print_status "Installing backend dependencies..."
cd backend && npm install && cd ..

print_status "Installing shared dependencies..."
cd shared && npm install && cd ..

print_status "Installing smart contracts dependencies..."
cd smart-contracts && npm install && cd ..

# Set up environment files
print_status "Setting up environment files..."

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    print_success "Created frontend/.env.local from template"
else
    print_warning "frontend/.env.local already exists"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    print_success "Created backend/.env from template"
else
    print_warning "backend/.env already exists"
fi

# Install AlgoKit if Python is available
if command -v python3 &> /dev/null && [ "$SKIP_ALGOKIT" != true ]; then
    print_status "Installing AlgoKit..."
    if command -v pip3 &> /dev/null; then
        pip3 install algokit
        print_success "AlgoKit installed successfully"
    else
        print_warning "pip3 not found. Please install AlgoKit manually: pip install algokit"
    fi
elif [ "$SKIP_ALGOKIT" = true ]; then
    print_warning "Skipping AlgoKit installation due to Python version requirements"
    print_status "To install AlgoKit later:"
    print_status "1. Install Python 3.10+: brew install python@3.11"
    print_status "2. Install AlgoKit: pip3 install algokit"
fi

# Build shared package
print_status "Building shared package..."
cd shared && npm run build && cd ..

print_success "🎉 Soul Beacon setup complete!"
print_status ""
print_status "Next steps:"
print_status "1. Configure your environment variables in:"
print_status "   - frontend/.env.local"
print_status "   - backend/.env"
print_status ""
print_status "2. Start the development servers:"
print_status "   npm run dev"
print_status ""
print_status "3. For smart contracts (if AlgoKit is installed):"
print_status "   cd smart-contracts"
print_status "   algokit localnet start"
print_status "   npm run deploy"
print_status ""
print_status "Happy coding! 🚀"
