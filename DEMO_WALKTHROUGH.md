# One Record Demo - 5-Minute Walkthrough

## Prerequisites

- Node.js 18+ installed
- Terminal access
- Web browser

## Step 1: Setup (30 seconds)

```bash
# Clone and enter directory
git clone https://github.com/jgmikael/one-record.git
cd one-record

# Install and build
npm run setup

# Start the server
npm start
```

**Expected output:**
```
✅ One Record API server running on http://localhost:3001
📊 Database: /path/to/one-record.db
```

## Step 2: Open UI (10 seconds)

Open your browser to: **http://localhost:3001**

You should see:
- Header: "🔧 One Record Demo"
- Tabs: Import | Orders | Viewer | Side-by-Side | About

## Step 3: Import SAP Order (1 minute)

1. Click **"Import"** tab (already selected by default)
2. Click **"Load Sample SAP Order"** button
   - A JSON document appears in the text area
   - This is a realistic SAP ECC 6.0 Sales Order
3. Review the SAP structure (optional):
   - OrderHeader with document info
   - PartnerFunctions (buyer, seller, ship-to)
   - OrderItems array (2 items: concrete + steel mesh)
4. Click **"Import & Transform"** button
5. See the result:
   - Order ID: `4500012345`
   - Status: `completed`
   - Overall confidence: `95%`
   - 85 fields mapped

**What happened?**
- SAP Order was sent to POST /api/orders/import/sap
- Mapping engine applied 60+ transformation rules
- Canonical JSON-LD Order was generated
- Both SAP source and canonical were stored in SQLite

## Step 4: View Orders List (30 seconds)

1. Click **"Orders"** tab
2. You should see one order card:
   - Order 4500012345
   - Import timestamp
   - Status: completed
3. Click on the order card
4. You're taken to the Viewer tab with this order selected

## Step 5: View Canonical JSON-LD (1 minute)

1. In the Viewer tab, click **"View Canonical"** button
2. JSON-LD document appears:

```json
{
  "@context": "https://iri.suomi.fi/model/fcior/context.jsonld",
  "@type": "Order",
  "@id": "urn:order:sap:4500012345",
  "orderNumber": "4500012345",
  "issueDate": "2026-04-15",
  "buyerCustomerParty": {
    "partyIdentification": [{
      "id": "100234",
      "schemeID": "SAP Customer Number"
    }],
    "partyName": [{ "name": "Rakennusyhtiö Suomi Oy" }],
    ...
  },
  "orderLine": [
    {
      "id": "000010",
      "quantity": { "value": 50, "unitCode": "MTQ" },
      "item": { "name": "C30/37 Betoniseos" },
      ...
    }
  ]
}
```

3. Key observations:
   - **@context**: Links to fcior vocabulary
   - **@type**: RDF type declaration
   - **@id**: Unique resource identifier
   - **Semantic properties**: `orderNumber`, `issueDate`, `buyerCustomerParty`
   - **UoM conversion**: SAP `M3` → UN/CEFACT `MTQ`

## Step 6: View Mapping Report (1 minute)

1. Click **"View Mapping Report"** button
2. See statistics cards:
   - Overall Confidence: 95%
   - Mapped Fields: 85
   - High Confidence: 70
   - Unmapped Fields: 25
3. Scroll down to see full report
4. Review a sample mapping entry:

```json
{
  "sourcePath": "OrderHeader.SalesDocument",
  "targetPath": "orderNumber",
  "targetSemanticReference": "https://iri.suomi.fi/model/busdoc#identificationID",
  "mappingType": "rule",
  "confidence": "HIGH",
  "rationale": "SAP Sales Document Number → Order Number (direct copy)",
  "sourceValue": "4500012345",
  "targetValue": "4500012345"
}
```

**Key insights:**
- Every field mapping is traced
- Confidence level provided
- Semantic reference to vocabulary
- Transformation rationale explained

## Step 7: Side-by-Side Comparison (1 minute)

1. Click **"Side-by-Side"** tab
2. Select order `4500012345` from dropdown
3. Click **"Load Comparison"** button
4. See two panels:
   - **Left**: SAP Source JSON
   - **Right**: Canonical JSON-LD
5. Compare structures:
   - `OrderHeader.SalesDocument` (left) → `orderNumber` (right)
   - `PartnerFunctions.SoldToParty` → `buyerCustomerParty`
   - `OrderItems[0].Material.MaterialNumber` → `orderLine[0].item.sellersItemIdentification.id`
6. See mapping statistics below:
   - Overall confidence
   - Mapped fields count
   - High/medium confidence breakdown

## Step 8: Explore API (Optional - 30 seconds)

Open a new browser tab and visit:

**Health Check:**
```
http://localhost:3001/api/health
```

**Version Info:**
```
http://localhost:3001/api/version
```

**Get Canonical Order (JSON-LD):**
```
http://localhost:3001/api/orders/4500012345/canonical
```

**Get Mapping Report:**
```
http://localhost:3001/api/orders/4500012345/mapping-report
```

## Step 9: Review Documentation (Optional)

1. Click **"About"** tab in the UI
2. Read about:
   - What is One Record (in this context)?
   - Key technologies (fcior, busdoc, JSON-LD)
   - How it works
   - Features

## API Test with curl (Optional)

```bash
# List orders
curl http://localhost:3001/api/orders

# Get SAP source
curl http://localhost:3001/api/orders/4500012345/source

# Get canonical JSON-LD
curl -H "Accept: application/ld+json" \
     http://localhost:3001/api/orders/4500012345/canonical

# Import a new order
curl -X POST http://localhost:3001/api/orders/import/sap \
     -H "Content-Type: application/json" \
     -d @samples/sap-order-001.json
```

## Cleanup (Optional)

```bash
# Stop the server
Ctrl+C

# Remove database
rm apps/api/data/one-record.db
```

---

## What You Just Saw

✅ **SAP Order Import**: Realistic ERP data from construction industry  
✅ **Semantic Transformation**: 60+ curated mapping rules applied  
✅ **fcior-aligned JSON-LD**: Canonical output with vocabulary grounding  
✅ **Dual Persistence**: Both SAP source and canonical stored  
✅ **Explainability**: Complete traceability with confidence scores  
✅ **W3C VC-Compatible**: Ready for cryptographic signatures  

## Next Steps

1. **Review Documentation**: See `README.md` for full details
2. **Explore Mapping Logic**: Check `docs/mapping-matrix.md`
3. **Extend**: Add Invoice, DespatchAdvice, or other document types
4. **Integrate**: Connect to real SAP system
5. **Secure**: Add W3C VC signatures and DID management

---

**Questions?** Check the README or create an issue on GitHub.
