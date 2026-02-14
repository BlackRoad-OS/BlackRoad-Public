# 🚀 Pull Request

## 📋 Summary
<!-- Brief 1-2 sentence description of what this PR does -->


## 🎯 Type of Change
<!-- Check all that apply -->
- [ ] ✨ **Feature** - New functionality
- [ ] 🐛 **Bug Fix** - Fixes an issue
- [ ] 🔧 **Chore** - Maintenance, dependencies, tooling
- [ ] 📝 **Documentation** - Docs, README, comments
- [ ] ♻️ **Refactor** - Code restructuring without behavior change
- [ ] 🎨 **Style** - Formatting, whitespace, styling
- [ ] ⚡ **Performance** - Speed/efficiency improvements
- [ ] 🔒 **Security** - Security-related changes
- [ ] 🚨 **Breaking Change** - Requires version bump or migration

## 💡 Motivation and Context
<!-- Why is this change needed? What problem does it solve? -->
<!-- Link to issue: Closes #123 -->


## 🔍 What Changed
<!-- List the main changes -->
- 
- 
- 

## 📸 Screenshots / Evidence
<!-- If UI changes, add before/after screenshots -->
<!-- If performance changes, add benchmarks -->
<!-- If API changes, add curl examples -->


## 🧪 Testing
<!-- Describe how this was tested -->

### Local Testing
- [ ] Tested locally with `npm run dev` / service startup
- [ ] All tests pass: `npm test` or `npm run lint`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Health check passes: `/api/health` returns 200

### Test Coverage
- [ ] Added new tests for new functionality
- [ ] Updated existing tests
- [ ] No tests needed (explain why):

### Manual Testing Steps
```bash
# Commands to reproduce/test
cd services/your-service
npm install
npm run dev
# Visit http://localhost:3000
```

## 🔐 Security Checklist
<!-- Critical: Review before merge -->
- [ ] No secrets, API keys, or credentials committed
- [ ] Environment variables added to `.env.example` with safe defaults
- [ ] No sensitive data in logs or error messages
- [ ] Input validation added for user-provided data
- [ ] SQL/XSS vulnerabilities considered and addressed

## 📊 Impact Assessment

### Areas Affected
<!-- Check all that apply -->
- [ ] **Frontend** (React/Next.js components)
- [ ] **Backend** (API routes, serverless functions)
- [ ] **Database** (Schema, migrations, queries)
- [ ] **Infrastructure** (Docker, Railway, Cloudflare)
- [ ] **CI/CD** (GitHub Actions, workflows)
- [ ] **Dependencies** (package.json, lockfile changes)
- [ ] **Environment** (New env vars, config changes)

### Risk Level
- [ ] 🟢 **Low** - Minor change, well-tested, easy rollback
- [ ] 🟡 **Medium** - Moderate impact, may affect multiple areas
- [ ] 🔴 **High** - Critical system, breaking change, requires coordination

### Breaking Changes
- [ ] **Yes** - Requires migration or version bump
- [ ] **No** - Fully backward compatible

<!-- If breaking, describe migration path -->


## 📚 Documentation
- [ ] README updated
- [ ] API documentation updated
- [ ] Inline code comments added where needed
- [ ] `CHANGELOG.md` updated (if user-facing)
- [ ] Deployment guide updated (if infrastructure change)

## 🔗 Related Issues & PRs
<!-- Link related work -->
- Closes #
- Related to #
- Depends on #
- Blocks #

## 🚢 Deployment Notes
<!-- Special deployment considerations -->

### Environment Variables
<!-- List any new or changed env vars -->
```bash
# Add to .env
NEW_VAR=default_value  # Description
```

### Pre-deployment Steps
- [ ] Database migration needed: <!-- describe -->
- [ ] Config changes needed: <!-- describe -->
- [ ] Service restart required: <!-- yes/no -->

### Post-deployment Verification
```bash
# Commands to verify deployment
curl https://your-service.blackroad.io/api/health
# Expected: {"status": "healthy"}
```

## ✅ Pre-merge Checklist
<!-- All must be checked before merge -->
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code changes
- [ ] Commented complex or non-obvious code
- [ ] No console.log or debug statements left in code
- [ ] PR title follows conventional commits format
- [ ] All CI checks pass (linting, tests, build)
- [ ] Reviewed by at least one other developer
- [ ] Tested in environment similar to production
- [ ] No merge conflicts with target branch

## 🎯 Reviewer Focus Areas
<!-- Help reviewers know where to focus -->
- 
- 

## 📝 Additional Notes
<!-- Any other context, concerns, or considerations -->


---

<!-- 
BlackRoad OS PR Template v2.0
For template issues: github.com/BlackRoad-OS/BlackRoad-Private/issues
-->

**Merge Strategy**: 
- [ ] Squash and merge (default)
- [ ] Rebase and merge
- [ ] Create merge commit

**Post-Merge Actions**:
- [ ] Delete branch after merge
- [ ] Tag release (if applicable): v
- [ ] Announce in #engineering channel
- [ ] Update related documentation
