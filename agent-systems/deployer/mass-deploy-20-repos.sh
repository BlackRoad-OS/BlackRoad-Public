#!/bin/bash
# 🚀 Mass Deployment Script - Deploy workflow system to 30+ repos

set -e

# Target repos for deployment (20 additional repos)
REPOS=(
    # BlackRoad-OS repos
    "BlackRoad-OS/blackroad-api"
    "BlackRoad-OS/blackroad-dashboard"
    "BlackRoad-OS/blackroad-docs"
    "BlackRoad-OS/blackroad-cli"
    "BlackRoad-OS/blackroad-sdk"
    "BlackRoad-OS/blackroad-mobile"
    "BlackRoad-OS/blackroad-desktop"
    "BlackRoad-OS/blackroad-web"
    "BlackRoad-OS/blackroad-backend"
    "BlackRoad-OS/blackroad-frontend"
    "BlackRoad-OS/blackroad-infra"
    "BlackRoad-OS/blackroad-security"
    "BlackRoad-OS/blackroad-monitoring"
    "BlackRoad-OS/blackroad-analytics"
    "BlackRoad-OS/blackroad-billing"
    "BlackRoad-OS/blackroad-auth"
    "BlackRoad-OS/blackroad-database"
    "BlackRoad-OS/blackroad-cache"
    "BlackRoad-OS/blackroad-queue"
    "BlackRoad-OS/blackroad-storage"
)

DEPLOYED=0
FAILED=0
DEPLOY_SCRIPT="$HOME/.blackroad/cross-repo-templates/deploy-cross-repo-index.sh"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 MASS DEPLOYMENT - 20 Repositories"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Target: ${#REPOS[@]} repos"
echo "Starting deployment..."
echo ""

for repo in "${REPOS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Deploying to: $repo"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    REPO_NAME=$(basename "$repo")
    CLONE_DIR="$HOME/blackroad-deploy-tmp/$REPO_NAME"
    
    # Check if repo exists
    if gh repo view "$repo" >/dev/null 2>&1; then
        echo "✓ Repo exists"
        
        # Clone if needed
        if [ ! -d "$CLONE_DIR" ]; then
            echo "  Cloning..."
            mkdir -p "$(dirname "$CLONE_DIR")"
            gh repo clone "$repo" "$CLONE_DIR" 2>/dev/null || {
                echo "  ⚠️  Could not clone (may need access)"
                FAILED=$((FAILED + 1))
                continue
            }
        else
            echo "  Using existing clone"
            cd "$CLONE_DIR"
            git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || true
        fi
        
        cd "$CLONE_DIR"
        
        # Deploy
        echo "  Running deployment script..."
        bash "$DEPLOY_SCRIPT" 2>&1 | grep -E "(✅|⚠️|❌)" || true
        
        # Commit and push
        if [ -n "$(git status --porcelain)" ]; then
            echo "  Committing changes..."
            git add .github/workflows/ .blackroad/ 2>/dev/null || true
            git commit -m "🌐 Add cross-repo workflow system (Tier 1)" 2>/dev/null || true
            
            echo "  Pushing to GitHub..."
            git push 2>/dev/null && {
                echo "  ✅ Deployed successfully"
                DEPLOYED=$((DEPLOYED + 1))
            } || {
                echo "  ⚠️  Push failed (may need permissions)"
                FAILED=$((FAILED + 1))
            }
        else
            echo "  ℹ️  No changes needed"
            DEPLOYED=$((DEPLOYED + 1))
        fi
        
    else
        echo "  ⚠️  Repo doesn't exist or no access"
        FAILED=$((FAILED + 1))
    fi
    
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 DEPLOYMENT SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Successfully deployed: $DEPLOYED repos"
echo "⚠️  Failed/Skipped: $FAILED repos"
echo "📦 Total attempted: ${#REPOS[@]} repos"
echo ""

if [ $DEPLOYED -gt 0 ]; then
    echo "🎉 Mass deployment complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Check GitHub for deployed workflows"
    echo "  2. Create test issues with workflow IDs"
    echo "  3. Monitor Tier 2 aggregation"
fi
