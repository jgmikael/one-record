# Installation Verification Checklist

Run through this checklist to verify the One Record demo works correctly after installation.

## Pre-Installation

- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm 8+ installed (`npm -v`)
- [ ] Git installed (`git --version`)

## Installation Steps

```bash
cd /tmp
git clone https://github.com/jgmikael/one-record.git
cd one-record
```

### Test 1: Setup

```bash
npm run setup
```

**Expected**:
- [ ] No errors during `npm install`
- [ ] All packages build successfully
- [ ] `apps/api/data/` directory created
- [ ] `apps/api/public/` directory created
- [ ] Web files copied to API public directory

### Test 2: Start Server

```bash
npm start
```

**Expected**:
- [ ] Server starts on port 3001
- [ ] No errors in console
- [ ] Database initializes
- [ ] Startup banner shows URLs

### Test 3: Browser Access

Open `http://localhost:3001`

**Expected**:
- [ ] Page loads (HTML/CSS/JS)
- [ ] Header shows "🔧 One Record Demo"
- [ ] 5 tabs visible: Import, Orders, Viewer, Side-by-Side, About
- [ ] No JavaScript errors in browser console

### Test 4: Load Sample

Navigate to `http://localhost:3001/#import?sample=true`

**Expected**:
- [ ] Import tab is active
- [ ] Sample SAP order appears in text area
- [ ] JSON is valid (no syntax errors)
- [ ] "Import & Transform" button is enabled

### Test 5: Import Order

Click "Import & Transform" button

**Expected**:
- [ ] Success message appears
- [ ] Auto-redirect to viewer tab
- [ ] Order ID is 4500012345
- [ ] Canonical JSON-LD displays

### Test 6: View Canonical

Should be already viewing canonical after import

**Expected**:
- [ ] JSON-LD structure visible
- [ ] `@context`: https://iri.suomi.fi/model/fcior/context.jsonld
- [ ] `@type`: "Order"
- [ ] `@id`: "urn:order:sap:4500012345"
- [ ] `orderNumber`: "4500012345"
- [ ] Semantic info box shows vocabulary links
- [ ] Download button works
- [ ] Copy to clipboard works

### Test 7: View SAP Source

Click "View SAP Source" button

**Expected**:
- [ ] SAP JSON displays
- [ ] OrderHeader section visible
- [ ] PartnerFunctions section visible
- [ ] OrderItems array visible

### Test 8: View Mapping Report

Click "View Mapping Report" button

**Expected**:
- [ ] Statistics cards show:
  - Overall Confidence: ~95%
  - Mapped Fields: ~85
  - High Confidence: ~70
- [ ] Full report JSON below
- [ ] Download button works

### Test 9: Side-by-Side Comparison

Navigate to `http://localhost:3001/#comparison/4500012345` or use tab

**Expected**:
- [ ] Two panels visible
- [ ] Left panel: SAP source JSON
- [ ] Right panel: Canonical JSON-LD
- [ ] Statistics below panels
- [ ] Both panels scrollable

### Test 10: Orders List

Navigate to `http://localhost:3001/#orders`

**Expected**:
- [ ] One order card visible
- [ ] Order ID: 4500012345
- [ ] Import timestamp shown
- [ ] Status: completed
- [ ] Action links work

### Test 11: API Endpoints

```bash
# Test health
curl http://localhost:3001/api/health

# Test version
curl http://localhost:3001/api/version

# Test get canonical
curl http://localhost:3001/api/orders/4500012345/canonical

# Test get report
curl http://localhost:3001/api/orders/4500012345/mapping-report
```

**Expected**:
- [ ] /api/health returns 200 with {"status":"healthy"}
- [ ] /api/version returns semantic vocabulary info
- [ ] /canonical returns JSON-LD with @context
- [ ] /mapping-report returns report with statistics

### Test 12: Import via API

```bash
curl -X POST http://localhost:3001/api/orders/import/sap \
  -H "Content-Type: application/json" \
  -d @samples/sap-order-001.json
```

**Expected**:
- [ ] Returns 409 Conflict (order already exists)
- [ ] Or 201 Created if database was cleared

### Test 13: Static Files

```bash
# Test sample access
curl http://localhost:3001/samples/sap-order-001.json
```

**Expected**:
- [ ] Returns SAP order JSON
- [ ] 200 OK status

### Test 14: URL Routing

Test these URLs directly:

- [ ] `http://localhost:3001/#import` - Import tab
- [ ] `http://localhost:3001/#orders` - Orders tab
- [ ] `http://localhost:3001/#viewer/4500012345?view=canonical` - Viewer canonical
- [ ] `http://localhost:3001/#viewer/4500012345?view=source` - Viewer source
- [ ] `http://localhost:3001/#viewer/4500012345?view=report` - Viewer report
- [ ] `http://localhost:3001/#comparison/4500012345` - Comparison
- [ ] `http://localhost:3001/#about` - About

**Expected**: Each URL loads the correct tab and view

### Test 15: Browser Back/Forward

- [ ] Click through several tabs
- [ ] Press browser back button
- [ ] Previous tab loads
- [ ] Press browser forward button
- [ ] Next tab loads

### Test 16: Responsive Design

- [ ] Open browser dev tools
- [ ] Toggle device toolbar (mobile view)
- [ ] Layout adjusts properly
- [ ] No horizontal scroll
- [ ] Navigation usable on mobile

### Test 17: Error Handling

Try invalid operations:

```bash
# Import invalid JSON
curl -X POST http://localhost:3001/api/orders/import/sap \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```

**Expected**:
- [ ] Returns 400 Bad Request
- [ ] Error message explains the issue

### Test 18: Database Persistence

```bash
# Stop server (Ctrl+C)
# Restart server
npm start
```

**Expected**:
- [ ] Server restarts successfully
- [ ] Previous order still exists
- [ ] Navigate to orders list shows existing order

### Test 19: Tests (If Available)

```bash
npm test
```

**Expected**:
- [ ] Tests run (may skip if not all packages have tests)
- [ ] Mapping engine tests pass
- [ ] No errors

### Test 20: Clean Shutdown

Press Ctrl+C in server terminal

**Expected**:
- [ ] "SIGINT received, closing server..." message
- [ ] Database closes cleanly
- [ ] "Server closed" message
- [ ] Process exits

---

## Success Criteria

✅ **All 20 tests pass**: Installation is successful and demo is fully functional

⚠️ **Some tests fail**: Review the failed tests and troubleshoot:
- Check Node.js version
- Review console errors
- Check file permissions
- Verify network/firewall settings

❌ **Major failures**: See QUICKSTART.md troubleshooting section

---

## Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] Import transformation < 1 second
- [ ] API responses < 500ms
- [ ] No memory leaks (check with DevTools)

---

## Browser Compatibility

Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Final Verification

After completing all tests:

```bash
# From repository root
ls -la apps/api/data/
```

**Expected**: one-record.db file exists

```bash
sqlite3 apps/api/data/one-record.db "SELECT COUNT(*) FROM orders;"
```

**Expected**: Returns a number (1 or more)

---

## Sign-Off

Date: ________________  
Tester: ________________  
Result: ✅ Pass / ⚠️ Partial / ❌ Fail

---

## Notes

Record any issues or observations:

```
[Write notes here]
```
