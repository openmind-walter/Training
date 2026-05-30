# Custom Commands

This directory contains custom commands for the Claude Code project.

## Available Commands

### `update-git` — Comprehensive deployment workflow

**What it does (7-step automated workflow):**
1. ✓ **Validate GitHub Pages setup** — Ensures deployment workflow exists
2. ✓ **Check for 404 broken links** — Scans HTML for references to missing files
3. ✓ **Check for uncommitted changes** — Prompts to commit if needed
4. ✓ **Scan for passwords & secrets** — Detects passwords, API keys, tokens, private keys
5. ✓ **Advanced secret scanning** — Uses truffleHog or git-secrets (if available)
6. ✓ **Push code to GitHub** — Deploys to main branch
7. ✓ **Update GitHub metadata** — Updates README, description, topics, and enables Pages

**How to run:**

From the terminal in this project:
```bash
./.claude/commands/update-git.sh
```

Or invoke via Claude Code prompt:
```
/run-command update-git
```

**Requirements:**
- Git repository with remote (origin)
- GitHub CLI (`gh`) — optional but recommended for full features
- Secret scanning tools (optional):
  - `truffleHog` (preferred) — scans for secrets in git history
  - `git-secrets` (alternative) — checks for known patterns
  - Falls back to basic pattern matching if neither is available

**Installation of optional tools:**

```bash
# Install GitHub CLI (macOS with Homebrew)
brew install gh

# Install truffleHog (preferred for comprehensive secret scanning)
pip install truffleHog
# or
brew install truffle-hog

# Install git-secrets (alternative)
brew install git-secrets
```

**Key Features:**

1. **GitHub Pages Deployment (Auto-Setup)**
   - Automatically creates/verifies GitHub Actions workflow
   - Deploys from main branch on every push
   - Provides deployment URLs for quick access

2. **404 Link Validation**
   - Scans all HTML files for broken local file references
   - Checks `href` and `src` attributes
   - Prevents publishing broken links
   - Blocks deployment if issues found

3. **Password & API Key Detection**
   - Scans for hardcoded passwords (password =, pwd =, secret =)
   - Detects API key patterns (AWS AKIA, Stripe sk_, GitHub PAT)
   - Finds connection strings with embedded credentials
   - Detects private keys (RSA, EC, etc.)
   - Prevents accidental credential exposure

4. **Multi-Layer Secret Scanning**
   - Pattern-based detection (passwords, tokens, keys)
   - Optional entropy-based scanning via truffleHog
   - Optional pattern database via git-secrets
   - Manual fallback for common secret types

5. **GitHub Metadata Management**
   - Update repository description/about
   - Add/update topics and tags
   - Sync README.md with GitHub
   - Verify Pages deployment status

**Example workflow:**

```bash
$ ./.claude/commands/update-git.sh
ℹ Repository: openmind-walter/Training
ℹ Location: /Users/waltergunasekaran/Training
ℹ Step 1/5: Checking for uncommitted changes...
ℹ Step 2/5: Scanning for secrets and API keys...
✓ No secrets detected by truffleHog
ℹ Step 3/5: Pushing code to GitHub...
✓ Code pushed to GitHub
ℹ Step 4/5: Updating GitHub repository metadata...
ℹ Step 5/5: Updating repository settings...
✓ All steps completed!
ℹ Repository: https://github.com/openmind-walter/Training
```

**Environment variables (optional):**

- `SKIP_SECRET_SCAN=1` — Skip secret scanning (not recommended)
- `SKIP_GITHUB_UPDATE=1` — Skip GitHub metadata updates

## Security Patterns Detected

The `update-git` command scans for these sensitive patterns:

### Passwords
- `password = "xxx"`
- `pwd = "xxx"` 
- `secret = "xxx"`

### API Keys & Tokens
- AWS Access Keys: `AKIA[0-9A-Z]{16}`
- AWS Secret Keys: `AWS_SECRET_*`
- Stripe Live Keys: `sk_live_[A-Za-z0-9]{24}`
- Stripe Public Keys: `pk_live_[A-Za-z0-9]{24}`
- GitHub PATs: `ghp_[A-Za-z0-9]{36}` or `github_pat_*`

### Connection Strings
- MongoDB: `mongodb+://user:password@host`
- PostgreSQL: `postgresql+://user:password@host`
- MySQL: `mysql+://user:password@host`

### Cryptographic Keys
- Private RSA, EC, DSA keys
- Begin/End Private Key markers

## Full Documentation

See [UPDATE-GIT-GUIDE.md](UPDATE-GIT-GUIDE.md) for comprehensive documentation including:
- 7-step workflow details
- Security pattern detection
- 404 link validation
- GitHub Pages setup
- Troubleshooting guide
- Integration examples

## Quick Reference

| Step | Purpose | Status |
|------|---------|--------|
| 1 | Validate GitHub Pages | Auto-creates workflow if missing |
| 2 | Check 404 Links | Scans HTML for broken references |
| 3 | Uncommitted Changes | Prompts to commit before push |
| 4 | Password Scanning | Detects hardcoded secrets |
| 5 | Advanced Secrets | Uses truffleHog or git-secrets |
| 6 | Push to GitHub | Deploys to main branch |
| 7 | Update Metadata | Updates description, topics, README |

## Adding New Commands

1. Create a new `.sh` file in this directory
2. Make it executable: `chmod +x script-name.sh`
3. Add a README section documenting the command above
4. The command will be auto-discovered by Claude Code
