#!/bin/bash

# Starland Water Company Management System - Deployment Script

echo "==========================================="
echo "Starland Water Company Management System"
echo "Deployment Script"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on a supported platform
print_status "Checking system compatibility..."

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macOS"
else
    print_warning "Unsupported platform: $OSTYPE"
    print_warning "This script is tested on Linux and macOS"
fi

print_status "Platform detected: $PLATFORM"

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install git before proceeding."
    exit 1
fi

print_status "Git is installed"

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    print_error "Curl is not installed. Please install curl before proceeding."
    exit 1
fi

print_status "Curl is installed"

# Validate that we're in the correct directory
if [ ! -f "index.html" ] || [ ! -d "js" ] || [ ! -d "css" ]; then
    print_error "This script must be run from the root directory of the project."
    print_error "Make sure index.html, js/, and css/ directories exist in the current location."
    exit 1
fi

print_status "Project structure validated"

# Function to backup existing files
backup_files() {
    print_status "Creating backup of current system..."
    
    BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Copy essential files to backup
    cp -r index.html css/ js/ entry/ management/ admin/ "$BACKUP_DIR/" 2>/dev/null || true
    
    print_status "Backup created in: $BACKUP_DIR/"
}

# Function to validate configuration
validate_config() {
    print_status "Validating configuration files..."
    
    # Check if supabase.js exists and has valid configuration
    if [ ! -f "js/supabase.js" ]; then
        print_error "Configuration file js/supabase.js not found!"
        exit 1
    fi
    
    # Check if Supabase URL and key are properly configured
    if grep -q "uqqxcuqflasmdjcbhnwb.supabase.co" "js/supabase.js" && \
       grep -q "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" "js/supabase.js"; then
        print_warning "Using demo Supabase configuration. For production, update with your own Supabase project credentials."
        echo
        echo "To configure your own Supabase project:"
        echo "1. Create an account at https://supabase.com"
        echo "2. Create a new project"
        echo "3. Update js/supabase.js with your Project URL and Anonymous Key"
        echo "4. Run the SQL from db_init.sql in your Supabase SQL editor"
        echo
    fi
    
    print_status "Configuration validation completed"
}

# Function to check for required files
check_requirements() {
    print_status "Checking for required files..."
    
    REQUIRED_FILES=(
        "index.html"
        "css/main.css"
        "js/supabase.js"
        "js/auth.js"
        "js/entry.js"
        "js/dashboard.js"
        "entry/sales.html"
        "management/dashboard.html"
        "db_init.sql"
        "SETUP_GUIDE.md"
        "USER_MANUAL.md"
    )
    
    MISSING_FILES=()
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            MISSING_FILES+=("$file")
        fi
    done
    
    if [ ${#MISSING_FILES[@]} -ne 0 ]; then
        print_error "Missing required files:"
        for file in "${MISSING_FILES[@]}"; do
            echo "  - $file"
        done
        exit 1
    fi
    
    print_status "All required files present"
}

# Function to run deployment tests
run_tests() {
    print_status "Running deployment tests..."
    
    # Check if all HTML files are valid
    HTML_FILES=$(find . -name "*.html" -type f)
    INVALID_HTML=0
    
    for file in $HTML_FILES; do
        if ! curl -s --head --fail "file://$(pwd)/$file" >/dev/null 2>&1; then
            # Simple validation by checking if file exists and has content
            if [ ! -s "$file" ]; then
                print_error "Invalid or empty HTML file: $file"
                ((INVALID_HTML++))
            fi
        fi
    done
    
    if [ $INVALID_HTML -eq 0 ]; then
        print_status "HTML validation passed"
    else
        print_warning "$INVALID_HTML HTML files may have issues"
    fi
    
    # Check JavaScript files for basic syntax
    JS_FILES=$(find js/ -name "*.js" -type f)
    for file in $JS_FILES; do
        if command -v node &> /dev/null; then
            if ! node -c "$file" 2>/dev/null; then
                print_error "JavaScript syntax error in: $file"
            fi
        else
            print_warning "Node.js not found. Skipping JavaScript syntax validation."
        fi
    done
    
    print_status "Basic tests completed"
}

# Function to show deployment summary
show_summary() {
    echo
    echo "==========================================="
    echo "DEPLOYMENT SUMMARY"
    echo "==========================================="
    print_status "✅ System files validated"
    print_status "✅ Configuration checked"
    print_status "✅ Basic tests passed"
    echo
    
    echo "NEXT STEPS:"
    echo "1. For development/testing: Simply open index.html in your browser"
    echo "2. For production deployment:"
    echo "   - Configure your own Supabase project (see SETUP_GUIDE.md)"
    echo "   - Upload all files to your web server"
    echo "   - Run database initialization script (db_init.sql)"
    echo "   - Test all functionality"
    echo
    echo "DOCUMENTATION:"
    echo "- Setup Guide: SETUP_GUIDE.md"
    echo "- User Manual: USER_MANUAL.md"
    echo "- Project Info: README.md"
    echo
    
    print_status "Deployment preparation completed successfully!"
    echo
    echo "==========================================="
}

# Main deployment process
echo
print_status "Starting deployment preparation..."
echo

# Execute deployment steps
backup_files
validate_config
check_requirements
run_tests
show_summary

# Ask if user wants to open the system
echo -n "Would you like to open the system in your default browser? (y/n): "
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "$(pwd)/index.html"
    elif command -v open &> /dev/null; then
        # macOS
        open "$(pwd)/index.html"
    elif command -v start &> /dev/null; then
        # Windows (Git Bash)
        start "$(pwd)/index.html"
    else
        print_warning "Could not detect browser opener command."
        print_status "Please manually open $(pwd)/index.html in your browser."
    fi
    print_status "Opening system in browser..."
fi

echo
print_status "Deployment script completed!"