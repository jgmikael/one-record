# GitHub Pages Setup Guide

## 🌐 Enable Public Demo URL

Follow these steps to enable the **zero-setup browser-based demo** at:

```
https://jgmikael.github.io/one-record/
```

---

## Method 1: GitHub Web Interface (Recommended)

### Step 1: Go to Repository Settings

1. Visit: https://github.com/jgmikael/one-record
2. Click the **"Settings"** tab (top right)

### Step 2: Navigate to Pages

1. In the left sidebar, scroll down to **"Pages"** (under "Code and automation")
2. Click **"Pages"**

### Step 3: Configure Source

1. Under **"Build and deployment"** → **"Source"**
2. Select **"Deploy from a branch"**
3. Under **"Branch"**:
   - Branch: `master` (or `main` if your default branch is named that)
   - Folder: `/docs`
4. Click **"Save"**

### Step 4: Wait for Deployment

1. GitHub will start building your site
2. After 1-2 minutes, refresh the Pages settings page
3. You'll see a message: **"Your site is live at https://jgmikael.github.io/one-record/"**
4. Click the link to visit your demo

---

## Method 2: GitHub CLI

If you have the GitHub CLI installed:

```bash
# Enable Pages from /docs folder
gh repo edit jgmikael/one-record --enable-pages --pages-branch master --pages-path /docs

# Check deployment status
gh api repos/jgmikael/one-record/pages

# View in browser
gh repo view --web
```

---

## Method 3: Repository Settings API

Using curl:

```bash
# Enable GitHub Pages
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/jgmikael/one-record/pages \
  -d '{
    "source": {
      "branch": "master",
      "path": "/docs"
    }
  }'
```

---

## Verification

After enabling GitHub Pages, verify it's working:

### 1. Check Deployment Status

1. Go to repository → **Actions** tab
2. Look for "pages build and deployment" workflow
3. Wait for green checkmark ✓

### 2. Visit the Demo

Open in browser:
```
https://jgmikael.github.io/one-record/
```

You should see:
- ✅ Main page with "One Record Demo" header
- ✅ 6 tabs: Overview, Demo, SAP Source, Canonical, Report, Comparison, Setup
- ✅ Pre-loaded sample data
- ✅ Stats showing 95% confidence, 85 mapped fields

### 3. Test Features

- Click **"SAP Source"** tab → Should show SAP Order JSON
- Click **"Canonical"** tab → Should show JSON-LD with @context
- Click **"Report"** tab → Should show mapping statistics
- Click **"Side-by-Side"** → Should show comparison

---

## Troubleshooting

### "404 - File not found"

**Cause**: GitHub Pages not enabled or wrong folder selected

**Fix**:
1. Check Settings → Pages
2. Verify Branch: `master` and Folder: `/docs`
3. Save and wait 1-2 minutes

### "Sample data not loading"

**Cause**: Sample files missing or wrong paths

**Fix**:
```bash
# Verify files exist
git ls-files samples/

# Should show:
# samples/sap-order-001.json
# samples/one-record-order-001.jsonld
```

If missing, commit and push:
```bash
git add samples/
git commit -m "Add sample data"
git push
```

### "Styles not loading"

**Cause**: CSS is inline in index.html, so this shouldn't happen

**Fix**: Check browser console (F12) for errors

### Page shows old content

**Cause**: Browser cache

**Fix**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## Custom Domain (Optional)

### Using Your Own Domain

1. Add `CNAME` file in `/docs` folder:

```bash
# Create CNAME file
echo "demo.yourdomain.com" > docs/CNAME

# Commit and push
git add docs/CNAME
git commit -m "Add custom domain"
git push
```

2. Configure DNS at your domain registrar:

**If using subdomain (demo.yourdomain.com):**
```
Type: CNAME
Name: demo
Value: jgmikael.github.io
TTL: 3600
```

**If using apex domain (yourdomain.com):**
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

3. GitHub Settings → Pages → Custom domain:
   - Enter: `demo.yourdomain.com`
   - Check **"Enforce HTTPS"** (after DNS propagates)

4. Wait for DNS propagation (5 minutes to 24 hours)

---

## Updating the Demo

### Update Sample Data

```bash
# Edit sample files
nano samples/sap-order-001.json
nano samples/one-record-order-001.jsonld

# Commit and push
git add samples/
git commit -m "Update sample data"
git push

# GitHub Pages rebuilds automatically
```

### Update Demo UI

```bash
# Edit the demo page
nano docs/index.html

# Commit and push
git add docs/
git commit -m "Update demo UI"
git push

# GitHub Pages rebuilds automatically
```

---

## What's Included in Static Demo

✅ **Pre-loaded Data**
- SAP Order sample (Finnish construction industry)
- Canonical JSON-LD output (fcior/busdoc)
- Mapping report with confidence scores

✅ **Views**
- Overview with stats and features
- SAP Source viewer
- Canonical JSON-LD viewer with semantic info
- Mapping Report with sample mappings table
- Side-by-side comparison
- Local setup instructions

✅ **Features**
- Responsive design (mobile-friendly)
- Tab navigation with URL hash support
- Professional styling
- Links to GitHub repo
- Links to full documentation

❌ **What's NOT Included** (Local Setup Only)
- Live transformation engine
- Custom SAP order import
- REST API access
- Database persistence
- Mapping suggestions

---

## Sharing the Demo

### Direct Link
```
https://jgmikael.github.io/one-record/
```

### Specific Tabs
```
https://jgmikael.github.io/one-record/#overview
https://jgmikael.github.io/one-record/#demo
https://jgmikael.github.io/one-record/#sap-source
https://jgmikael.github.io/one-record/#canonical
https://jgmikael.github.io/one-record/#report
https://jgmikael.github.io/one-record/#comparison
https://jgmikael.github.io/one-record/#setup
```

### QR Code

Generate a QR code for mobile access:

```
https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://jgmikael.github.io/one-record/
```

---

## Analytics (Optional)

### Add Google Analytics

1. Get GA tracking ID from https://analytics.google.com

2. Add to `docs/index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

3. Commit and push:

```bash
git add docs/index.html
git commit -m "Add Google Analytics"
git push
```

---

## Support

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Repository**: https://github.com/jgmikael/one-record
- **Issues**: https://github.com/jgmikael/one-record/issues

---

## Quick Checklist

Before enabling GitHub Pages, verify:

- [ ] Repository is public (or Pro/Team for private)
- [ ] `docs/` folder exists with `index.html`
- [ ] `samples/` folder has required JSON files
- [ ] Files are committed and pushed to `master`
- [ ] You have admin access to the repository

After enabling GitHub Pages:

- [ ] Settings → Pages shows "Your site is live"
- [ ] Visit URL: https://jgmikael.github.io/one-record/
- [ ] All tabs load correctly
- [ ] Sample data appears in viewers
- [ ] Responsive design works on mobile

---

**Ready?** Go to https://github.com/jgmikael/one-record/settings/pages and enable! 🚀
