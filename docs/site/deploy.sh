#!/bin/bash

# Build and deploy documentation site

set -e

echo "📚 Building documentation site..."
npm run build

echo "🚀 Deploying to Cloudflare Pages..."
wrangler pages deploy build --project-name blackroad-docs

echo "✅ Deployment complete!"
echo "🌐 Visit: https://docs.blackroad.io"
