# update-git Command — Complete Guide

## Overview

The `updategit` command is a comprehensive 7-step deployment and security workflow that automates the entire process of pushing code to GitHub while ensuring quality, security, and proper documentation.

![Maison Lumière Website - Live Deployment](../../screenshot.png)

## 7-Step Workflow

### Step 1: Validate GitHub Pages Setup ✓
- **Purpose:** Ensure GitHub Actions deployment workflow is configured
- **Action:** Checks for existing workflow files
- **Auto-fix:** Creates GitHub Pages deployment workflow if missing
- **Requirement:** `.github/workflows/deploy.yml` exists

### Step 2: Check for 404 Broken Links ✓
- **Purpose:** Detect broken file references before deployment
- **Scans:** All `.html` files for `href` and `src` attributes
- **Validation:** Checks that all referenced local files exist
- **Filters:** Automatically ignores:
  - External URLs (http/https)
  - Email links (mailto:)
  - Phone links (tel:)
  - Anchor links (#)
- **Blocks Deployment:** If broken links are found

### Step 3: Check for Uncommitted Changes
- **Purpose:** Ensure all changes are tracked in git
- **Action:** Shows git status of modified files
- **Prompt:** Asks to commit changes before proceeding
- **Auto-stage:** Can automatically stage and commit changes

### Step 4: Scan for Passwords & Sensitive Data
- **Purpose:** Prevent accidental credential exposure
- **Detects:** 
  - Hardcoded passwords
  - API keys and secrets
  - Database connection strings with credentials
  - Private cryptographic keys
- **Coverage:** Scans `.js`, `.html`, `.json`, `.env*`, `.config.*` files
- **Blocks Deployment:** If sensitive patterns found

**Patterns Detected:**
```
password = "xxx"        # Hardcoded password
pwd = "xxx"             # Alternate password syntax
secret = "xxx"          # Secret key/value
api_key = "xxx"         # API key
token = "xxx"           # Authentication token
AWS_SECRET_*            # AWS keys
AKIA[0-9A-Z]{16}        # AWS Access Key
sk_live_*               # Stripe API key
pk_live_*               # Stripe Public key
ghp_*                   # GitHub Personal Access Token
github_pat_*            # GitHub PAT
-----BEGIN PRIVATE KEY  # Cryptographic private keys
```

### Step 5: Advanced Secret Scanning
- **Purpose:** Entropy-based and pattern-based secret detection
- **Tool Options:**
  - **truffleHog** (recommended) — Entropy-based detection
  - **git-secrets** (alternative) — Pattern database matching
  - Falls back to basic regex if neither installed
- **Installation:**
  ```bash
  # truffleHog (preferred)
  brew install truffle-hog
  # or
  pip install truffleHog

  # git-secrets (alternative)
  brew install git-secrets
  ```

### Step 6: Push Code to GitHub
- **Purpose:** Deploy changes to remote repository
- **Action:** Executes `git push origin <current-branch>`
- **Requirement:** Must pass all previous security checks
- **Result:** Code becomes available at GitHub repository

### Step 7: Update GitHub Metadata & README
- **Purpose:** Keep repository documentation and metadata synchronized
- **Actions:**
  - Verifies README.md visibility
  - Updates repository description (interactive)
  - Updates repository topics/tags (interactive)
  - Confirms GitHub Pages deployment status
- **Tool:** Requires GitHub CLI (`gh`) for full functionality
- **Installation:**
  ```bash
  brew install gh
  ```

## Usage

### Basic Command
```bash
./.claude/commands/update-git.sh
```

### From Claude Code
```
/run-command update-git
```

### Interactive Prompts
The script will ask you to:
1. Commit changes (if uncommitted files exist)
2. Continue despite passwords (if found)
3. Update repository description
4. Update repository topics/tags

## Security Checks Explained

### Why Passwords Are Blocked
Committing passwords, API keys, or tokens to GitHub makes them permanently visible in git history, even if you delete them later. These are high-risk security issues:
- Anyone with repository access can steal credentials
- Credentials appear in git logs indefinitely
- Automated credential scanners can find them
- Organizations often have compliance requirements

### How the Scanner Works
1. **Pattern Detection** — Finds obvious patterns (password =, AKIA-, sk_live_)
2. **File Scanning** — Searches all code and config files
3. **Connection Strings** — Detects MongoDB, PostgreSQL, MySQL with embedded passwords
4. **Key Detection** — Finds private RSA/EC/DSA key blocks

### What to Do if Secrets Are Detected
1. **Remove** the hardcoded secret from your code
2. **Use environment variables** instead:
   ```javascript
   const apiKey = process.env.API_KEY;
   const password = process.env.DB_PASSWORD;
   ```
3. **Document** the required env vars in README or CONTRIBUTING
4. **Store** secrets securely in:
   - `.env` (local, excluded from git)
   - GitHub Secrets (for CI/CD)
   - Environment variables (production)

## 404 Link Checking Details

### What Gets Checked
- All `<a href="...">` attributes in HTML
- All `<img src="...">` attributes
- All `<link href="...">` attributes (CSS, etc.)
- Local file references only

### What Gets Ignored
- `href="#section"` — Internal page anchors
- `href="mailto:..."` — Email links
- `href="tel:..."` — Phone links
- `src="https://..."` — External URLs
- `src="http://..."` — External URLs

### Example: Local Files Must Exist
```html
<!-- ✓ Correct — files exist in repo -->
<link rel="stylesheet" href="styles.css">
<script src="script.js"></script>

<!-- ✗ Incorrect — files don't exist -->
<link rel="stylesheet" href="missing-styles.css">
<img src="images/photo.jpg">  <!-- if images/ doesn't exist -->
```

## GitHub Pages Deployment

### Automatic Setup
If GitHub Pages workflow doesn't exist, the command creates:
- File: `.github/workflows/deploy.yml`
- Action: Deploys on every push to main
- Result: Site available at `https://username.github.io/repo-name`

### Manual GitHub Pages Configuration (if needed)
1. Go to repository Settings → Pages
2. Set "Source" to `GitHub Actions`
3. The workflow will handle deployment automatically

## Example Output

```
ℹ Repository: openmind-walter/Training
ℹ Location: /Users/waltergunasekaran/Training

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1/7: VALIDATE GITHUB PAGES SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ GitHub Actions deployment workflow found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2/7: CHECK FOR 404 BROKEN LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ All local links resolve correctly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3/7: CHECK FOR UNCOMMITTED CHANGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(no changes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4/7: SCAN FOR PASSWORDS & SENSITIVE DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ No obvious passwords or sensitive patterns detected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5/7: ADVANCED SECRET SCANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Basic manual checks passed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6/7: PUSH CODE TO GITHUB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Code pushed to GitHub

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7/7: UPDATE GITHUB METADATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ All checks passed & deployment initiated
✓ Code pushed to GitHub: https://github.com/openmind-walter/Training
✓ GitHub Pages: https://openmind-walter.github.io/Training
✓ GitHub Actions: https://github.com/openmind-walter/Training/actions
```

## Troubleshooting

### Script blocked by uncommitted changes
```bash
# Commit your changes
git add .
git commit -m "Your message"
# Then run again
./.claude/commands/update-git.sh
```

### 404 error: Missing file detected
```bash
# Check which files are missing
git status

# Either add the file or remove the broken link from HTML
```

### Secrets detected - what to do
```bash
# 1. Remove the secret from your code
# 2. Replace with environment variable
# 3. Delete the commit from history (if sensitive)
git reset HEAD~1
# 4. Run again
```

### GitHub CLI not installed
```bash
# Install GitHub CLI for full functionality
brew install gh

# Authenticate with GitHub
gh auth login
```

## Environment Variables (Optional)

```bash
# Skip secret scanning (not recommended)
SKIP_SECRET_SCAN=1 ./.claude/commands/update-git.sh

# Skip GitHub metadata updates
SKIP_GITHUB_UPDATE=1 ./.claude/commands/update-git.sh
```

## Integration with CI/CD

You can also use this command in GitHub Actions:

```yaml
- name: Deploy with security checks
  run: |
    ./.claude/commands/update-git.sh
```

## Command Permissions

The following permissions are configured in `.claude/settings.local.json`:
- `git push` — Deploy code
- `git add/commit` — Stage and commit changes
- `git diff/status` — Check changes
- `gh repo view/edit` — Update metadata
- `./.claude/commands/update-git.sh` — Execute command

