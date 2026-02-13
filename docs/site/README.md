# BlackRoad OS Documentation Site

Complete documentation portal for BlackRoad OS products and services.

## Structure

- `index.html` - Main landing page
- `public/` - Static assets
- `src/` - Documentation source files
- `build/` - Production build

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Build

```bash
npm run build
```

Output in `build/` directory

## Deploy

### Cloudflare Pages

```bash
wrangler pages deploy build --project-name docs
```

### Railway

```bash
railway up
```

## Documentation Structure

- `/docs/` - User guides
- `/api/` - API reference
- `/tutorials/` - Step-by-step tutorials
- `/products/` - Product documentation
- `/support/` - Support resources

---

🖤 BlackRoad OS, Inc.
