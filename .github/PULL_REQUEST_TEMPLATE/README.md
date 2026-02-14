# 📝 BlackRoad OS PR Template System

## Overview

This directory contains **enhanced Pull Request templates** for all BlackRoad repositories. These templates help maintain consistency, quality, and thoroughness across all code contributions.

## Available Templates

### 🚀 Main Template (`PULL_REQUEST_TEMPLATE.md`)
**Default template** used when creating PRs without specifying a type.

**Sections:**
- Summary & Type of Change
- Motivation and Context
- What Changed
- Screenshots/Evidence
- Testing (local, coverage, manual)
- Security Checklist
- Impact Assessment (areas, risk level, breaking changes)
- Documentation
- Related Issues & PRs
- Deployment Notes
- Pre-merge Checklist
- Reviewer Focus Areas
- Merge Strategy & Post-Merge Actions

### ✨ Feature Template (`PULL_REQUEST_TEMPLATE/feature.md`)
For **new functionality** and feature additions.

**Use when:**
- Adding new user-facing features
- Implementing new capabilities
- Creating new components or services

**Additional sections:**
- Business Value & User Story
- Architecture Changes
- Database Changes
- Rollout Plan with Feature Flags
- Acceptance Criteria
- Performance Impact

**Example PR creation:**
```bash
gh pr create --template feature
```

### 🐛 Bug Fix Template (`PULL_REQUEST_TEMPLATE/bugfix.md`)
For **fixing bugs** and resolving issues.

**Use when:**
- Fixing reported bugs
- Resolving critical issues
- Patching security vulnerabilities

**Additional sections:**
- Root Cause Analysis
- Reproduction Steps (Before/After)
- Evidence (logs, screenshots)
- Severity & Scope Assessment
- Regression Testing
- Urgency Level (Hotfix/Urgent/Normal)
- Rollback Plan

**Example PR creation:**
```bash
gh pr create --template bugfix
```

### ⚙️ Infrastructure Template (`PULL_REQUEST_TEMPLATE/infrastructure.md`)
For **infrastructure and DevOps** changes.

**Use when:**
- Modifying Docker/Railway/Cloudflare configs
- Updating CI/CD workflows
- Changing DNS or environment variables
- Modifying deployment processes

**Additional sections:**
- Architecture Impact Diagram
- Components Affected (Cloudflare, Railway, Docker, etc.)
- Security Review & Compliance
- Cost Impact Analysis
- Resource Utilization Metrics
- Deployment Plan & Rollback Procedure
- Monitoring & Alerts Setup
- Risk Assessment Matrix
- Downtime Estimate

**Example PR creation:**
```bash
gh pr create --template infrastructure
```

### 📝 Documentation Template (`PULL_REQUEST_TEMPLATE/documentation.md`)
For **documentation** updates.

**Use when:**
- Updating READMEs
- Adding or modifying API docs
- Creating user guides or tutorials
- Updating architecture documentation

**Additional sections:**
- Documentation Type Classification
- Content Quality Checks (Accuracy, Completeness, Clarity)
- Formatting & Style Guide Compliance
- Validation Steps
- Target Audience & Skill Level
- Documentation Metrics
- Multi-platform Instructions
- Examples Quality Review

**Example PR creation:**
```bash
gh pr create --template documentation
```

## Usage

### Using GitHub CLI

```bash
# Create PR with main template
gh pr create

# Create PR with specific template
gh pr create --template feature
gh pr create --template bugfix
gh pr create --template infrastructure
gh pr create --template documentation
```

### Using GitHub Web UI

1. Create a new PR on GitHub
2. GitHub will automatically show the main template
3. To use a specialized template, replace the URL:
   - Feature: `?template=feature.md`
   - Bug Fix: `?template=bugfix.md`
   - Infrastructure: `?template=infrastructure.md`
   - Documentation: `?template=documentation.md`

### From Command Line

```bash
# Create branch and PR in one go
git checkout -b feature/my-new-feature
git commit -am "Add new feature"
git push -u origin feature/my-new-feature
gh pr create --template feature --title "Add awesome feature" --body-file .github/PULL_REQUEST_TEMPLATE/feature.md
```

## Template Structure

Each template follows a consistent structure:

```
# Emoji Title

## Summary/Overview
## Type/Classification
## Detailed Sections (varies by template)
## Testing
## Security
## Documentation
## Pre-merge Checklist
## Related Issues
## Additional Notes
```

## Customization

### For Specific Repositories

To customize templates for a specific repository:

1. Copy the template you want to customize
2. Edit the sections relevant to your repo
3. Keep the core structure intact
4. Document any repo-specific requirements

### Adding New Templates

To add a new specialized template:

1. Create `PULL_REQUEST_TEMPLATE/your-template.md`
2. Follow the structure of existing templates
3. Use emojis for visual scanning
4. Include comprehensive checklists
5. Add testing and security sections
6. Update this README

## Best Practices

### When Creating PRs

✅ **DO:**
- Fill out all relevant sections
- Check all applicable checkboxes
- Add screenshots for UI changes
- Include reproduction steps
- Link to related issues
- Add code examples in testing section
- Document breaking changes clearly
- Update documentation in the same PR

❌ **DON'T:**
- Skip security checklist items
- Ignore testing requirements
- Leave placeholder text
- Forget to update docs
- Commit secrets or credentials
- Rush through the checklist

### Template Selection Guide

| Change Type | Template | Example |
|------------|----------|---------|
| New feature, capability | `feature.md` | Adding user authentication |
| Bug fix, issue resolution | `bugfix.md` | Fixing broken login |
| Infrastructure, DevOps | `infrastructure.md` | Adding Docker config |
| Documentation only | `documentation.md` | Updating README |
| Mixed/Unclear | Main template | Refactoring + docs |

### Review Checklist for Maintainers

When reviewing PRs, ensure:

- [ ] Template sections are filled out completely
- [ ] Security checklist is checked and valid
- [ ] Tests are described and passing
- [ ] Documentation is updated
- [ ] Breaking changes are clearly marked
- [ ] Deployment plan is documented (if applicable)
- [ ] Rollback procedure exists (for high-risk changes)

## Deployment

### Deploy to All Repos

```bash
./deploy-enhanced-pr-templates.sh
```

This script will:
1. Copy templates to all services
2. Update major repositories
3. Deploy to template directories
4. Provide deployment summary
5. Optionally commit changes

### Manual Deployment

```bash
# Copy to specific repository
cp -r .github/PULL_REQUEST_TEMPLATE* /path/to/repo/.github/

# Commit
cd /path/to/repo
git add .github/PULL_REQUEST_TEMPLATE*
git commit -m "feat(.github): add enhanced PR templates"
git push
```

## Template Maintenance

### Updating Templates

1. Edit templates in this directory (`.github/PULL_REQUEST_TEMPLATE/`)
2. Test with a sample PR
3. Run deployment script to propagate changes
4. Document changes in this README

### Version History

- **v2.0** (2026-02-14): Complete overhaul with specialized templates
  - Added feature, bugfix, infrastructure, documentation templates
  - Enhanced security and testing sections
  - Added deployment automation
  - Improved visual structure with emojis
  - Comprehensive checklists for all change types

- **v1.0** (Previous): Basic template with minimal structure

## Examples

### Good PR Title Examples

```
feat(auth): add OAuth2 provider integration
fix(api): resolve race condition in user sessions
docs(readme): update deployment instructions
infra(docker): optimize multi-stage build process
chore(deps): bump next from 14.0.0 to 14.1.0
```

### Commit Message Format

Follow conventional commits:
```
<type>(<scope>): <description>

[optional body]

[optional footer]

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## Support

### Questions or Issues?

- **Template Issues**: Create issue in `BlackRoad-Private` repo
- **Template Suggestions**: PR to this directory
- **Usage Help**: See examples above or ask in #engineering

### Feedback

We're continuously improving these templates. Your feedback helps!

- What sections are most useful?
- What's missing?
- What could be clearer?

Open an issue or PR with your suggestions!

---

**Maintained by**: BlackRoad OS Infrastructure Team  
**Last Updated**: 2026-02-14  
**Version**: 2.0
