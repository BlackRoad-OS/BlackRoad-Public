# Public Contract Boundary

> Everything below the line is a **promise**. Everything above is **implementation**.

## The Line

```
BlackRoad-Public/
├── sdk/                    ◀── PROMISE (public API)
├── specs/                  ◀── PROMISE (contracts)
├── docs/api/               ◀── PROMISE (documented behavior)
│
├── docs/guides/            ◀── IMPLEMENTATION (can change)
├── flagship/               ◀── IMPLEMENTATION (showcases, not contracts)
├── branding/               ◀── IMPLEMENTATION (assets)
├── clients/                ◀── IMPLEMENTATION (reference implementations)
├── examples/               ◀── IMPLEMENTATION (illustrative, not guaranteed)
└── diagrams/               ◀── IMPLEMENTATION (visual aids)
```

## What "Promise" Means

Directories marked as **PROMISE**:

1. **Versioned** - Changes require version bumps
2. **Documented** - Breaking changes have migration guides
3. **Stable** - Won't disappear without deprecation period
4. **Tested** - Covered by CI/CD validation

## What "Implementation" Means

Directories marked as **IMPLEMENTATION**:

1. **May change** - Without version bumps
2. **Best effort** - No guarantees of accuracy
3. **Illustrative** - Shows how, not guarantees what
4. **Removable** - Can be reorganized or removed

## Breaking Change Rules

### For PROMISE directories:

```
1. Deprecate in current version
2. Document migration path
3. Maintain for 2 minor versions minimum
4. Remove in next major version
```

### For IMPLEMENTATION directories:

```
1. Update INDEX if structure changes
2. No other obligations
```

## How to Know Which Side You're On

**If you're building against it → check if it's a PROMISE**

| You're doing... | Look at... | It's a... |
|-----------------|------------|-----------|
| Importing SDK | `sdk/` | PROMISE |
| Reading API spec | `specs/api/` | PROMISE |
| Copying example code | `examples/` | IMPLEMENTATION |
| Using brand colors | `branding/` | IMPLEMENTATION |

## Enforcement

PRs that modify PROMISE directories require:
- [ ] Version bump
- [ ] CHANGELOG entry
- [ ] Review from SDK maintainer

PRs that modify IMPLEMENTATION directories require:
- [ ] INDEX update if structure changes

---
© 2026 BlackRoad OS, Inc.
