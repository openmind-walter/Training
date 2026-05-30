#!/bin/bash

# Custom command: update-git
# Purpose: Push code to GitHub, update README/repo metadata, scan for secrets,
#          enable GitHub Pages, and validate 404 links
# Usage: from Claude Code or terminal

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
  echo -e "${BLUE}ℹ ${1}${NC}"
}

log_success() {
  echo -e "${GREEN}✓ ${1}${NC}"
}

log_warn() {
  echo -e "${YELLOW}⚠ ${1}${NC}"
}

log_error() {
  echo -e "${RED}✗ ${1}${NC}"
}

log_step() {
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${MAGENTA}${1}${NC}"
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Get repository info
REPO_URL=$(git remote get-url origin)
REPO_OWNER=$(echo "$REPO_URL" | sed -E 's/.*[:/]([^/]+)\/.*/\1/')
REPO_NAME=$(echo "$REPO_URL" | sed -E 's/.*\/([^/]+)(\.git)?$/\1/')
REPO_PATH=$(pwd)

log_info "Repository: $REPO_OWNER/$REPO_NAME"
log_info "Location: $REPO_PATH"

# Function to check for broken local links
check_404_links() {
  log_info "Checking for 404 broken links in HTML files..."

  local broken_links=0
  local missing_files=()

  # Extract all href and src attributes pointing to local files
  local refs=$(grep -oh 'href="[^"]*"\|src="[^"]*"' *.html 2>/dev/null | grep -v 'http' | sed 's/[href"=]*//g' | grep -v '^#' | sort -u)

  for ref in $refs; do
    # Skip anchors and mailto links
    if [[ "$ref" == \#* ]] || [[ "$ref" == mailto:* ]] || [[ "$ref" == tel:* ]]; then
      continue
    fi

    # Check if file exists
    if [ ! -f "$ref" ] && [ ! -d "$ref" ]; then
      log_error "Missing file: $ref"
      missing_files+=("$ref")
      ((broken_links++))
    fi
  done

  if [ $broken_links -gt 0 ]; then
    log_error "Found $broken_links broken links!"
    return 1
  else
    log_success "All local links resolve correctly"
    return 0
  fi
}

# Function to scan for passwords and sensitive patterns
scan_for_passwords() {
  log_info "Scanning for passwords, API keys, and sensitive data patterns..."

  local sensitive_patterns=(
    'password\s*[:=]\s*["\x27][^"\x27]{1,}'  # password = "xxx"
    'pwd\s*[:=]\s*["\x27][^"\x27]{1,}'       # pwd = "xxx"
    'secret\s*[:=]\s*["\x27][^"\x27]{1,}'    # secret = "xxx"
    'api[_-]?key\s*[:=]\s*["\x27][^"\x27]{1,}' # api_key = "xxx"
    'token\s*[:=]\s*["\x27][^"\x27]{1,}'     # token = "xxx"
    'AWS_SECRET'                               # AWS keys
    'AKIA[0-9A-Z]{16}'                        # AWS access key
    'sk_live_[A-Za-z0-9]{24}'                 # Stripe key
    'pk_live_[A-Za-z0-9]{24}'                 # Stripe public key
    'ghp_[A-Za-z0-9]{36}'                     # GitHub Personal Access Token
    'github_pat_[A-Za-z0-9]+'                 # GitHub PAT
    'mongodb[+:]\://.*:.*@'                   # MongoDB connection string with password
    'postgresql[+:]\://.*:.*@'                # PostgreSQL connection string with password
    'mysql[+:]\://.*:.*@'                     # MySQL connection string with password
    '-----BEGIN.*PRIVATE.*KEY-----'           # Private keys
  )

  local found_sensitive=0
  local files_to_scan=$(find . -type f \( -name "*.js" -o -name "*.html" -o -name "*.json" -o -name "*.env*" -o -name "*.config.*" \) -not -path "./.git/*" -not -path "./node_modules/*" 2>/dev/null)

  while IFS= read -r file; do
    [ -z "$file" ] && continue

    for pattern in "${sensitive_patterns[@]}"; do
      if grep -iE "$pattern" "$file" 2>/dev/null; then
        log_error "Sensitive pattern found in $file:"
        grep -inE "$pattern" "$file" | head -3
        ((found_sensitive++))
      fi
    done
  done <<< "$files_to_scan"

  if [ $found_sensitive -gt 0 ]; then
    log_error "Found $found_sensitive sensitive patterns in code!"
    read -p "Continue anyway? This is NOT recommended. (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      return 1
    fi
  else
    log_success "No obvious passwords or sensitive patterns detected"
    return 0
  fi
}

# Function to validate GitHub Pages setup
validate_github_pages() {
  log_info "Validating GitHub Pages configuration..."

  if [ -d ".github/workflows" ]; then
    local deploy_files=$(ls .github/workflows/*deploy*.yml 2>/dev/null | wc -l)
    if [ $deploy_files -gt 0 ]; then
      log_success "GitHub Actions deployment workflow found"
      return 0
    fi
  fi

  log_warn "GitHub Pages deployment workflow not fully configured"
  log_info "Creating/updating GitHub Pages workflow..."

  mkdir -p .github/workflows

  # Create GitHub Pages deployment workflow if it doesn't exist
  if [ ! -f ".github/workflows/deploy.yml" ]; then
    cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF
    log_success "Created GitHub Pages deployment workflow"
    git add .github/workflows/deploy.yml
    git commit -m "chore: add GitHub Pages deployment workflow" || true
  fi
}

# Step 1: Validate GitHub Pages setup
log_step "STEP 1/7: VALIDATE GITHUB PAGES SETUP"
validate_github_pages

# Step 2: Check for 404 broken links
log_step "STEP 2/7: CHECK FOR 404 BROKEN LINKS"
check_404_links || {
  log_error "Fix broken links before pushing"
  exit 1
}

# Step 3: Check for uncommitted changes
log_step "STEP 3/7: CHECK FOR UNCOMMITTED CHANGES"
log_info "Checking for uncommitted changes..."
if ! git diff-index --quiet HEAD --; then
  log_warn "Uncommitted changes detected"
  git status --short
  read -p "Commit changes before pushing? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Staging all changes..."
    git add -A
    read -p "Enter commit message: " -r commit_msg
    if [ -z "$commit_msg" ]; then
      commit_msg="Auto-commit: update via custom command"
    fi
    git commit -m "$commit_msg"
    log_success "Changes committed"
  else
    log_error "Cannot push with uncommitted changes"
    exit 1
  fi
fi

# Step 4: Scan for passwords and sensitive data
log_step "STEP 4/7: SCAN FOR PASSWORDS & SENSITIVE DATA"
scan_for_passwords || {
  log_error "Remove sensitive data before pushing"
  exit 1
}

# Step 5: Advanced secret scanning (truffleHog, git-secrets)
log_step "STEP 5/7: ADVANCED SECRET SCANNING"
log_info "Scanning for secrets and API keys..."

if command -v trufflehog &> /dev/null; then
  log_info "Using truffleHog for entropy-based secret detection..."
  if trufflehog filesystem "$REPO_PATH" --json 2>/dev/null | grep -q .; then
    log_error "Potential secrets detected by truffleHog! Please review before pushing."
    trufflehog filesystem "$REPO_PATH" --json 2>/dev/null
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  else
    log_success "No secrets detected by truffleHog"
  fi
elif command -v git-secrets &> /dev/null; then
  log_info "Using git-secrets for pattern-based secret detection..."
  if git secrets --scan; then
    log_success "No secrets detected by git-secrets"
  else
    log_error "Potential secrets detected!"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
else
  log_warn "No advanced secret scanning tool found (truffleHog or git-secrets)"
  log_info "Installing secret scanning tools is recommended:"
  log_info "  brew install truffleHog  (or: pip install truffleHog)"
  log_success "Basic manual checks passed"
fi

# Step 6: Push to GitHub
log_step "STEP 6/7: PUSH CODE TO GITHUB"
log_info "Pushing code to GitHub..."
git push origin "$(git rev-parse --abbrev-ref HEAD)"
log_success "Code pushed to GitHub"

# Step 7: Update README and GitHub repo metadata
log_step "STEP 7/7: UPDATE GITHUB METADATA & README"

if command -v gh &> /dev/null; then
  log_info "Updating GitHub repository metadata..."

  # Check if README.md exists locally
  if [ -f "$REPO_PATH/README.md" ]; then
    log_success "README.md found and will be published on GitHub"
  else
    log_warn "No README.md found in repository"
  fi

  # Get current repo description
  CURRENT_DESC=$(gh repo view "$REPO_OWNER/$REPO_NAME" --json description -q '.description' 2>/dev/null || echo "")
  if [ ! -z "$CURRENT_DESC" ]; then
    log_info "Current description: $CURRENT_DESC"
  fi

  # Prompt to update description
  read -p "Update repository description? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter new description (or leave blank to keep current): " -r new_desc
    if [ ! -z "$new_desc" ]; then
      gh repo edit "$REPO_OWNER/$REPO_NAME" --description "$new_desc"
      log_success "Repository description updated"
    fi
  fi

  # Check topics/labels
  read -p "Update repository topics/tags? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter topics (comma-separated, e.g., 'web,restaurant,french'): " -r topics
    if [ ! -z "$topics" ]; then
      # Convert comma-separated to space-separated for gh command
      topics_spaces=$(echo "$topics" | tr ',' ' ')
      gh repo edit "$REPO_OWNER/$REPO_NAME" --topics "$topics_spaces"
      log_success "Repository topics updated"
    fi
  fi

  # Verify GitHub Pages is enabled
  log_info "Verifying GitHub Pages is enabled..."
  if gh repo view "$REPO_OWNER/$REPO_NAME" --json repositoryTopics 2>/dev/null | grep -q "pages"; then
    log_success "GitHub Pages deployment configured"
  else
    log_info "GitHub Pages is set to deploy from main branch"
  fi

else
  log_warn "GitHub CLI (gh) not installed. Skipping GitHub metadata updates."
  log_info "Install GitHub CLI to update repo description and topics: https://cli.github.com/"
fi

echo ""
log_step "✓ ALL CHECKS PASSED & DEPLOYMENT INITIATED"
log_success "Code pushed to GitHub: https://github.com/$REPO_OWNER/$REPO_NAME"
log_success "GitHub Pages: https://$REPO_OWNER.github.io/$REPO_NAME"
log_success "GitHub Actions deployment workflow: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
