# 📋 PR Template Quick Reference

## Template Selection

```bash
# Feature (new functionality)
gh pr create --template feature

# Bug Fix (fixing issues)
gh pr create --template bugfix

# Infrastructure (DevOps, config, deployment)
gh pr create --template infrastructure

# Documentation (README, guides, docs)
gh pr create --template documentation

# Default (everything else)
gh pr create
```

## Essential Sections to Complete

### All Templates ✅

- [ ] **Summary** - What does this PR do?
- [ ] **Testing** - How was it tested?
- [ ] **Security** - Any security implications?
- [ ] **Breaking Changes** - Requires migration?
- [ ] **Documentation** - Updated?

### Feature PRs ✨

- [ ] **Business Value** - Why is this needed?
- [ ] **Acceptance Criteria** - What defines "done"?
- [ ] **Rollout Plan** - Feature flags? Gradual rollout?
- [ ] **Performance Impact** - Measured?

### Bug Fix PRs 🐛

- [ ] **Root Cause** - What caused it?
- [ ] **Reproduction Steps** - Can others reproduce?
- [ ] **Severity** - Critical? High? Medium? Low?
- [ ] **Regression Tests** - Added to prevent recurrence?

### Infrastructure PRs ⚙️

- [ ] **Cost Impact** - $ changes?
- [ ] **Rollback Plan** - How to revert?
- [ ] **Deployment Steps** - Detailed procedure?
- [ ] **Monitoring** - Metrics/alerts configured?

### Documentation PRs 📝

- [ ] **Accuracy** - Verified all info?
- [ ] **Code Examples** - Tested?
- [ ] **Links** - All working?
- [ ] **Target Audience** - Clear who this is for?

## Common Mistakes to Avoid

❌ **Don't:**
- Skip the security checklist
- Ignore test requirements
- Leave template placeholders
- Forget to link issues
- Commit secrets/credentials
- Rush the checklist

✅ **Do:**
- Fill out all sections thoroughly
- Add screenshots for UI changes
- Link related issues/PRs
- Document breaking changes
- Update relevant documentation
- Test before requesting review

## Pre-merge Checklist (Universal)

Before requesting review, ensure:

```bash
# Run tests
npm test            # or your test command

# Run linter
npm run lint        # or your lint command

# Type check (TypeScript)
npm run type-check

# Build check
npm run build

# Health check (if service)
curl http://localhost:3000/api/health
```

## Quick Commands

```bash
# Create branch
git checkout -b feature/descriptive-name

# Commit with conventional commits
git commit -m "feat(scope): description"

# Push and create PR
git push -u origin feature/descriptive-name
gh pr create --template feature

# Add reviewers
gh pr edit --add-reviewer @username

# Auto-merge when checks pass
gh pr merge --auto --squash
```

## Review Process

1. **Self-review** - Read your own code first
2. **Fill template** - Complete all sections
3. **Link issues** - Use "Closes #123"
4. **Request review** - Tag appropriate reviewers
5. **Address feedback** - Respond to all comments
6. **Merge** - After approval + CI pass

## Template Emojis Legend

| Emoji | Meaning |
|-------|---------|
| 🚀 | Pull Request |
| ✨ | Feature |
| 🐛 | Bug Fix |
| ⚙️ | Infrastructure |
| 📝 | Documentation |
| 🔒 | Security |
| 🧪 | Testing |
| 📸 | Screenshots |
| 📊 | Metrics/Analytics |
| 🔗 | Links/References |
| ✅ | Checklist |
| 💡 | Motivation/Why |
| 🎯 | Goals/Objectives |
| 🏗️ | Architecture |
| 🔧 | Configuration |
| 🔐 | Security |
| 📚 | Documentation |
| 🚨 | Breaking Change |
| ⚡ | Performance |

## Getting Help

- **Template questions**: Check README.md in this directory
- **Git/GitHub help**: `gh help` or GitHub docs
- **Conventional commits**: conventionalcommits.org
- **Team support**: #engineering channel

---

**Quick Start**: `gh pr create --template <type>`  
**Full Docs**: See README.md in this directory
