# One Record Demo - URL-Based Navigation Guide

This demo supports complete URL-based navigation, allowing you to execute the entire demo through browser URLs without manual clicking.

## 🌐 Base URL

After starting the server:
```
http://localhost:3001
```

---

## 📱 Quick Demo URLs

Copy these URLs directly into your browser (after starting the server):

### 1. Load Sample Order (Auto-load)
```
http://localhost:3001/#import?sample=true
```
**What it does**: Opens import tab and automatically loads the sample SAP order into the editor.

### 2. View Canonical Order (If imported)
```
http://localhost:3001/#viewer/4500012345?view=canonical
```
**What it does**: Opens viewer tab, selects order 4500012345, and displays the canonical JSON-LD.

### 3. View SAP Source
```
http://localhost:3001/#viewer/4500012345?view=source
```
**What it does**: Displays the original SAP Order JSON.

### 4. View Mapping Report
```
http://localhost:3001/#viewer/4500012345?view=report
```
**What it does**: Shows the complete mapping report with statistics and field-level traceability.

### 5. Side-by-Side Comparison
```
http://localhost:3001/#comparison/4500012345
```
**What it does**: Loads side-by-side comparison of SAP source and canonical JSON-LD.

### 6. Orders List
```
http://localhost:3001/#orders
```
**What it does**: Lists all imported orders.

### 7. About/Documentation
```
http://localhost:3001/#about
```
**What it does**: Opens the about page with project documentation.

---

## 🎯 Complete Demo Flow (URL-Based)

Execute this sequence to run the complete demo using only URLs:

### Step 1: Start Server
```bash
npm start
```

### Step 2: Load Sample (Browser)
```
http://localhost:3001/#import?sample=true
```
1. Sample SAP order loads automatically
2. Click "Import & Transform" button
3. System automatically redirects to viewer

### Step 3: Explore via URLs

**View Canonical:**
```
http://localhost:3001/#viewer/4500012345?view=canonical
```

**View Source:**
```
http://localhost:3001/#viewer/4500012345?view=source
```

**View Report:**
```
http://localhost:3001/#viewer/4500012345?view=report
```

**Compare Side-by-Side:**
```
http://localhost:3001/#comparison/4500012345
```

---

## 🔗 API Direct Access URLs

Access raw data directly via API endpoints:

### Get Orders List (JSON)
```
http://localhost:3001/api/orders
```

### Get SAP Source (JSON)
```
http://localhost:3001/api/orders/4500012345/source
```

### Get Canonical JSON-LD
```
http://localhost:3001/api/orders/4500012345/canonical
```

### Get Mapping Report (JSON)
```
http://localhost:3001/api/orders/4500012345/mapping-report
```

### Health Check
```
http://localhost:3001/api/health
```

### Version Info
```
http://localhost:3001/api/version
```

---

## 📋 Sample Data Files (Direct Access)

Access sample files directly:

### Sample SAP Order
```
http://localhost:3001/samples/sap-order-001.json
```

### Sample Canonical Order
```
http://localhost:3001/samples/one-record-order-001.jsonld
```

---

## 🚀 Import via curl (Command Line)

### Import Sample Order
```bash
curl -X POST http://localhost:3001/api/orders/import/sap \
  -H "Content-Type: application/json" \
  -d @samples/sap-order-001.json
```

### Import Custom Order
```bash
curl -X POST http://localhost:3001/api/orders/import/sap \
  -H "Content-Type: application/json" \
  -d '{
    "OrderHeader": {
      "SalesDocument": "9999999999",
      "DocumentDate": "2026-05-01",
      "DocumentCurrency": "EUR",
      ...
    },
    ...
  }'
```

---

## 🎬 Automated Demo Script (bash)

Run this script to automatically execute the demo:

```bash
#!/bin/bash

BASE_URL="http://localhost:3001"

echo "🚀 One Record Demo - Automated Test"
echo ""

# 1. Check health
echo "✓ Checking API health..."
curl -s ${BASE_URL}/api/health | jq .

# 2. Import sample order
echo ""
echo "✓ Importing sample SAP order..."
RESULT=$(curl -s -X POST ${BASE_URL}/api/orders/import/sap \
  -H "Content-Type: application/json" \
  -d @samples/sap-order-001.json)

ORDER_ID=$(echo $RESULT | jq -r .order_id)
echo "   Order ID: $ORDER_ID"

# 3. Get canonical
echo ""
echo "✓ Retrieving canonical JSON-LD..."
curl -s ${BASE_URL}/api/orders/${ORDER_ID}/canonical | jq '.["@context"], .["@type"], .orderNumber'

# 4. Get mapping report
echo ""
echo "✓ Retrieving mapping report..."
curl -s ${BASE_URL}/api/orders/${ORDER_ID}/mapping-report | jq '.overallConfidence, .statistics'

# 5. Open in browser
echo ""
echo "✓ Opening browser views..."
open "${BASE_URL}/#viewer/${ORDER_ID}?view=canonical"
sleep 2
open "${BASE_URL}/#comparison/${ORDER_ID}"

echo ""
echo "✅ Demo complete!"
```

Save as `demo.sh` and run:
```bash
chmod +x demo.sh
./demo.sh
```

---

## 📸 Screenshot URLs (For Documentation)

Generate screenshots from these URLs:

### 1. Import Screen
```
http://localhost:3001/#import?sample=true
```

### 2. Canonical Viewer
```
http://localhost:3001/#viewer/4500012345?view=canonical
```

### 3. Mapping Report
```
http://localhost:3001/#viewer/4500012345?view=report
```

### 4. Side-by-Side
```
http://localhost:3001/#comparison/4500012345
```

### 5. Orders List
```
http://localhost:3001/#orders
```

---

## 🔄 URL Routing Patterns

The application supports these URL patterns:

### Hash-Based Routing
- `#import` - Import tab
- `#import?sample=true` - Import with auto-loaded sample
- `#orders` - Orders list
- `#orders/{orderId}` - View specific order
- `#viewer/{orderId}?view={type}` - Viewer (type: source|canonical|report)
- `#comparison/{orderId}` - Side-by-side comparison
- `#about` - About page

### Query Parameters
- `?sample=true` - Auto-load sample data
- `?view=source` - View SAP source
- `?view=canonical` - View canonical JSON-LD
- `?view=report` - View mapping report

---

## 🎓 Educational Demo Flow

For presentations or demonstrations:

### Slide 1: Introduction
```
http://localhost:3001/#about
```
Explain what One Record means in this context.

### Slide 2: SAP Source
```
http://localhost:3001/#import?sample=true
```
Show the SAP Order structure.

### Slide 3: Import & Transform
Click "Import & Transform" → auto-redirects to canonical view

### Slide 4: Canonical JSON-LD
```
http://localhost:3001/#viewer/4500012345?view=canonical
```
Explain JSON-LD, @context, semantic URIs.

### Slide 5: Mapping Explainability
```
http://localhost:3001/#viewer/4500012345?view=report
```
Show confidence scores, field-level traceability.

### Slide 6: Side-by-Side
```
http://localhost:3001/#comparison/4500012345
```
Compare source vs. canonical.

### Slide 7: API Access
```
http://localhost:3001/api/version
```
Show semantic vocabulary references.

---

## 🧪 Testing URLs

### Test Health
```bash
curl http://localhost:3001/api/health
# Expected: 200 OK with status: healthy
```

### Test Import
```bash
curl -X POST http://localhost:3001/api/orders/import/sap \
  -H "Content-Type: application/json" \
  -d @samples/sap-order-001.json
# Expected: 201 Created with order details
```

### Test Retrieval
```bash
curl http://localhost:3001/api/orders/4500012345/canonical
# Expected: 200 OK with JSON-LD
```

### Test Content-Type
```bash
curl -I http://localhost:3001/api/orders/4500012345/canonical
# Expected: Content-Type: application/ld+json
```

---

## 🎯 Demo Checklist

Use this checklist to verify the demo works:

- [ ] Server starts without errors
- [ ] `http://localhost:3001/` loads
- [ ] `http://localhost:3001/#import?sample=true` loads sample
- [ ] Import button creates order successfully
- [ ] Auto-redirect to viewer works
- [ ] `#viewer/{orderId}?view=canonical` shows JSON-LD
- [ ] `#viewer/{orderId}?view=source` shows SAP JSON
- [ ] `#viewer/{orderId}?view=report` shows mapping stats
- [ ] `#comparison/{orderId}` loads side-by-side
- [ ] API endpoints return correct JSON
- [ ] Download buttons work
- [ ] Copy to clipboard works
- [ ] URL navigation preserves state
- [ ] Browser back/forward buttons work

---

## 📱 Mobile/Tablet Access

The UI is responsive. Access from mobile:

```
http://YOUR_COMPUTER_IP:3001/
```

Replace `YOUR_COMPUTER_IP` with your machine's local IP (e.g., `192.168.1.100`).

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Change port
PORT=3002 npm start

# Then access at http://localhost:3002
```

### Database Locked
```bash
# Remove database and restart
rm apps/api/data/one-record.db
npm start
```

### CORS Issues
The API has CORS enabled. Access from any origin during development.

---

**Ready to navigate?** Start at: http://localhost:3001/#import?sample=true 🚀
