# One Record Demo - Quick Start Guide

## Installation (5 minutes)

### Prerequisites

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** 8 or higher (comes with Node.js)
- **Git** (for cloning)

### Step 1: Clone Repository

```bash
git clone https://github.com/jgmikael/one-record.git
cd one-record
```

### Step 2: Install & Build

```bash
npm run setup
```

This will:
- Install all dependencies
- Build all TypeScript packages
- Create necessary directories
- Copy web files to API server

**Expected output:**
```
✓ Checking Node.js version...
✓ Installing dependencies...
✓ Building packages...
✓ Creating data directory...
✓ Setting up samples access...
✅ Setup complete!
```

### Step 3: Start Server

```bash
npm start
```

**Expected output:**
```
✅ One Record API server running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 URL:      http://localhost:3001
📊 API:      http://localhost:3001/api/health
📁 Database: /path/to/one-record.db
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 4: Open Browser

```
http://localhost:3001
```

---

## Quick Demo (2 minutes)

### Via Browser

1. **Open import page with sample auto-loaded:**
   ```
   http://localhost:3001/#import?sample=true
   ```

2. **Click "Import & Transform" button**
   - System processes the SAP order
   - Auto-redirects to canonical view

3. **Explore the result:**
   - View canonical JSON-LD
   - View mapping report (confidence scores)
   - Compare side-by-side

### Via Command Line (curl)

```bash
# Import the sample order
curl -X POST http://localhost:3001/api/orders/import/sap \
  -H "Content-Type: application/json" \
  -d @samples/sap-order-001.json

# Get the canonical JSON-LD
curl http://localhost:3001/api/orders/4500012345/canonical

# Get the mapping report
curl http://localhost:3001/api/orders/4500012345/mapping-report
```

---

## Troubleshooting

### Port Already in Use

```bash
# Use different port
PORT=3002 npm start
```

### Build Errors

```bash
# Clean and rebuild
npm run clean
npm run setup
```

### Database Issues

```bash
# Remove database and restart
rm -rf apps/api/data
npm start
```

### Missing Web UI

```bash
# Re-run setup to copy files
npm run setup
```

### Windows-Specific

On Windows, use PowerShell or Git Bash. If `npm run setup` fails:

```bash
# Manual setup
npm install
npm run build

# Create directories manually
mkdir -p apps/api/data
mkdir -p apps/api/public

# Copy web files manually
cp apps/web/public/* apps/api/public/
```

---

## What's Next?

- **Read the docs**: See [README.md](README.md) for complete documentation
- **Explore URLs**: See [URL_DEMO_GUIDE.md](URL_DEMO_GUIDE.md) for URL-based navigation
- **5-min walkthrough**: See [DEMO_WALKTHROUGH.md](DEMO_WALKTHROUGH.md)
- **Architecture**: See [FINAL_SUMMARY.md](FINAL_SUMMARY.md)

---

## Alternative: One-Command Demo

```bash
npm run demo
```

This runs `npm run setup && npm start` in one command.

---

## Verifying Installation

After starting the server, these URLs should work:

✓ **Home**: http://localhost:3001  
✓ **Import**: http://localhost:3001/#import  
✓ **API Health**: http://localhost:3001/api/health  
✓ **API Version**: http://localhost:3001/api/version  
✓ **Sample SAP**: http://localhost:3001/samples/sap-order-001.json

---

## Stopping the Server

Press **Ctrl+C** in the terminal where the server is running.

---

## Getting Help

- **Documentation**: See `README.md`
- **Issues**: Create a [GitHub issue](https://github.com/jgmikael/one-record/issues)
- **API Docs**: Visit http://localhost:3001/api/health (when running)

---

**Ready?** Start with:

```bash
npm run demo
```

Then open: http://localhost:3001/#import?sample=true 🚀
