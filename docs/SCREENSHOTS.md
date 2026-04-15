# Screenshots

Visual guide to the One Record demo interface.

---

## 1. Import Tab - Load Sample Order

**URL**: `http://localhost:3001/#import?sample=true`

![Import Tab](screenshots/01-import.png)

**Features Shown**:
- Sample SAP order auto-loaded
- JSON editor with syntax highlighting
- Import & Transform button
- Sample data loader

---

## 2. Import Result

![Import Success](screenshots/02-import-success.png)

**Features Shown**:
- Success notification
- Order ID: 4500012345
- Overall confidence: 95%
- Mapping statistics
- Auto-redirect to viewer

---

## 3. Canonical JSON-LD Viewer

**URL**: `http://localhost:3001/#viewer/4500012345?view=canonical`

![Canonical Viewer](screenshots/03-canonical-view.png)

**Features Shown**:
- JSON-LD structure with @context
- Semantic information box
- fcior vocabulary links
- Download JSON button
- Copy to clipboard

**Key Elements Highlighted**:
```json
{
  "@context": "https://iri.suomi.fi/model/fcior/context.jsonld",
  "@type": "Order",
  "@id": "urn:order:sap:4500012345",
  "orderNumber": "4500012345",
  "buyerCustomerParty": {
    "partyIdentification": [...],
    "partyName": [...],
    "postalAddress": {...}
  }
}
```

---

## 4. Mapping Report

**URL**: `http://localhost:3001/#viewer/4500012345?view=report`

![Mapping Report](screenshots/04-mapping-report.png)

**Features Shown**:
- Overall confidence score (95%)
- Statistics cards:
  - 85 Mapped Fields
  - 70 High Confidence
  - 15 Medium Confidence
  - 25 Unmapped Fields
- Sample mappings table
- Download full report

---

## 5. Mapping Details Table

![Mapping Details](screenshots/05-mapping-details.png)

**Columns Shown**:
- Source Path (SAP)
- Target Path (Canonical)
- Confidence Badge (HIGH/MEDIUM/LOW)
- Transformation Applied
- Rationale

**Example Mapping**:
```
OrderHeader.SalesDocument → orderNumber [HIGH]
  Transform: (none)
  Rationale: SAP Sales Document Number → Order Number (direct copy)
```

---

## 6. Side-by-Side Comparison

**URL**: `http://localhost:3001/#comparison/4500012345`

![Side by Side](screenshots/06-side-by-side.png)

**Features Shown**:
- SAP source on left
- Canonical JSON-LD on right
- Mapping statistics below
- Synchronized scrolling
- Visual comparison

---

## 7. Orders List

**URL**: `http://localhost:3001/#orders`

![Orders List](screenshots/07-orders-list.png)

**Features Shown**:
- Order cards with metadata
- Import timestamp
- Processing status
- Action links (View Source, View Canonical, View Report, Compare)
- Refresh button

---

## 8. SAP Source Viewer

**URL**: `http://localhost:3001/#viewer/4500012345?view=source`

![SAP Source](screenshots/08-sap-source.png)

**Features Shown**:
- Complete SAP Order JSON
- OrderHeader section
- PartnerFunctions (Sold-To, Ship-To, Bill-To, Payer)
- OrderItems array
- Download and copy buttons

---

## 9. About Tab

**URL**: `http://localhost:3001/#about`

![About](screenshots/09-about.png)

**Content**:
- What is One Record?
- Key technologies
- Semantic vocabularies
- How it works
- Features list
- GitHub repository link

---

## 10. Mobile Responsive View

![Mobile View](screenshots/10-mobile.png)

**Features**:
- Responsive navigation
- Touch-friendly buttons
- Readable on small screens
- Collapsible sections

---

## How to Capture Screenshots

### For Documentation

```bash
# Start the server
npm start

# Open browser to specific URLs
open "http://localhost:3001/#import?sample=true"
open "http://localhost:3001/#viewer/4500012345?view=canonical"
open "http://localhost:3001/#viewer/4500012345?view=report"
open "http://localhost:3001/#comparison/4500012345"

# Take screenshots using:
# - macOS: Cmd+Shift+4 then select area
# - Windows: Snipping Tool or Win+Shift+S
# - Linux: Screenshot tool or flameshot

# Save to docs/screenshots/
```

### Automated Screenshot Generation (Optional)

Using Playwright:

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/#import?sample=true');
  await page.screenshot({ path: 'docs/screenshots/01-import.png' });
  
  // Click import button
  await page.click('button#import-btn');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'docs/screenshots/02-import-success.png' });
  
  await page.goto('http://localhost:3001/#viewer/4500012345?view=canonical');
  await page.screenshot({ path: 'docs/screenshots/03-canonical-view.png' });
  
  await browser.close();
})();
```

---

## Screenshot Guidelines

### Capture Settings

- **Resolution**: 1920x1080 (Full HD)
- **Format**: PNG (lossless)
- **Browser**: Chrome/Chromium (for consistency)
- **Zoom**: 100%
- **Window**: Maximized
- **Dev Tools**: Closed

### Content to Highlight

- ✅ Key UI elements
- ✅ Data samples
- ✅ Success messages
- ✅ Semantic information (JSON-LD structure)
- ✅ Mapping statistics
- ✅ URL in address bar (for navigation reference)

### Privacy

- ✅ Use sample data only
- ✅ No real customer information
- ✅ No sensitive data
- ✅ No API keys or tokens

---

## Creating a GIF Demo (Optional)

For animated demonstrations:

```bash
# Use tools like:
# - LICEcap (Windows/macOS)
# - Peek (Linux)
# - ScreenToGif (Windows)

# Record:
# 1. Load sample order
# 2. Click import
# 3. View canonical
# 4. Show report
# 5. Navigate to comparison

# Save as: docs/screenshots/demo.gif
```

---

## Screenshot Placeholders

Until actual screenshots are added, the structure is ready:

```
docs/screenshots/
├── 01-import.png
├── 02-import-success.png
├── 03-canonical-view.png
├── 04-mapping-report.png
├── 05-mapping-details.png
├── 06-side-by-side.png
├── 07-orders-list.png
├── 08-sap-source.png
├── 09-about.png
├── 10-mobile.png
└── demo.gif (optional)
```

To generate these:
1. Start the server: `npm start`
2. Follow the URLs listed above
3. Capture screenshots
4. Save to `docs/screenshots/`
5. Update this document with actual images

---

**Note**: Screenshots should be updated when the UI changes significantly.
