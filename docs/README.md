# One Record Demo - GitHub Pages

This folder contains a **static, browser-based demo** that can be hosted on GitHub Pages.

## 🌐 Live Demo

Once GitHub Pages is enabled, this demo will be available at:

```
https://jgmikael.github.io/one-record/
```

## What's Included

- **Static HTML/CSS/JS demo** - No build step required
- **Pre-loaded sample data** - Shows transformation results
- **Read-only viewer** - Displays SAP source, canonical output, and mapping report
- **No backend needed** - Runs entirely in the browser

## Features

✅ View SAP Order source  
✅ View Canonical JSON-LD output  
✅ View Mapping Report with confidence scores  
✅ Side-by-side comparison  
✅ Links to local setup for full interactive demo  
✅ Responsive design  

## Enabling GitHub Pages

### Method 1: Via GitHub Web Interface

1. Go to repository: https://github.com/jgmikael/one-record
2. Click **Settings** tab
3. Click **Pages** in sidebar
4. Under **Source**, select:
   - Branch: `master` (or `main`)
   - Folder: `/docs`
5. Click **Save**
6. Wait a few minutes for deployment
7. Visit: https://jgmikael.github.io/one-record/

### Method 2: Via gh CLI

```bash
# Enable GitHub Pages
gh repo edit --enable-pages --pages-branch master --pages-path /docs

# Check status
gh repo view --web
```

## File Structure

```
docs/
├── index.html              # Main demo page
├── README.md               # This file
├── architecture/           # Architecture diagrams
├── mapping-matrix.md       # Field-level mappings
├── sap-field-inventory.md  # SAP field catalog
├── correspondence-candidates.md # Mapping analysis
├── sap-source-model.md     # SAP architecture
├── RELEASE_CHECKLIST.md    # Pre-release verification
├── DOCKER_DEPLOYMENT.md    # Docker guide
└── SCREENSHOTS.md          # Screenshot placeholders
```

## Static vs. Interactive

| Feature | GitHub Pages (Static) | Local Demo (Interactive) |
|---------|----------------------|---------------------------|
| **View Sample Data** | ✅ Yes | ✅ Yes |
| **View Transformation** | ✅ Yes (pre-computed) | ✅ Yes (live) |
| **Import Custom Orders** | ❌ No | ✅ Yes |
| **Live API Access** | ❌ No | ✅ Yes |
| **Database Persistence** | ❌ No | ✅ Yes |
| **Setup Required** | ❌ No | ✅ Yes (Node.js) |

## Local Setup for Full Demo

For the complete interactive experience:

```bash
# Clone repository
git clone https://github.com/jgmikael/one-record.git
cd one-record

# Setup & Start
npm run demo

# Open browser
http://localhost:3001
```

See [QUICKSTART.md](../QUICKSTART.md) for details.

## Updating the Demo

After making changes to sample data:

```bash
# Sample data is in /samples
# The static demo loads from ../samples/ relative to /docs/index.html

# After updating samples, commit and push
git add samples/
git commit -m "Update sample data"
git push

# GitHub Pages will automatically rebuild
```

## Custom Domain (Optional)

To use a custom domain:

1. Add `CNAME` file to `/docs`:
   ```
   demo.yourdomain.com
   ```

2. Configure DNS:
   ```
   CNAME    demo    jgmikael.github.io
   ```

3. Enable HTTPS in GitHub Pages settings

## Troubleshooting

### Demo Not Loading

1. Check GitHub Pages is enabled in repository settings
2. Verify `/docs` folder is set as source
3. Wait 1-2 minutes for deployment
4. Check browser console for errors

### Sample Data Not Loading

The demo uses relative paths to load sample files:
- `../samples/sap-order-001.json`
- `../samples/one-record-order-001.jsonld`

Ensure these files exist in the repository.

### 404 Errors

GitHub Pages URL structure:
```
https://jgmikael.github.io/one-record/           ← Main demo
https://jgmikael.github.io/one-record/index.html ← Same as above
```

## Links

- **GitHub Repo**: https://github.com/jgmikael/one-record
- **Full README**: https://github.com/jgmikael/one-record/blob/master/README.md
- **Quick Start**: https://github.com/jgmikael/one-record/blob/master/QUICKSTART.md

---

**Note**: This static demo is a **read-only viewer**. For full transformation capabilities, database persistence, and API access, use the local setup with Node.js.
