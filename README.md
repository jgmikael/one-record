# One Record Demo

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**SAP Order → fcior-aligned Canonical JSON-LD Transformation**

A production-ready demonstration of semantic business document transformation using Finnish Construction Industry One Record (fcior) vocabulary and W3C Verifiable Credentials-compatible structure.

> 🎯 **Quick Demo**: `npm run demo` → http://localhost:3001/#import?sample=true

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [What is One Record?](#-what-is-one-record)
- [Why This Demo?](#-why-this-demo)
- [Architecture](#-architecture)
- [Features](#-features)
- [Demo Walkthrough](#-demo-walkthrough)
- [API Documentation](#-api-documentation)
- [Mapping Logic](#-mapping-logic)
- [Semantic Vocabularies](#-semantic-vocabularies)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Future Extensions](#-future-extensions)
- [Limitations](#-limitations)
- [License](#-license)

---

## 🚀 Quick Start

### 🌐 Option 1: GitHub Pages Demo (No Installation!)

**Try it live in your browser right now:**

👉 **[https://jgmikael.github.io/one-record/](https://jgmikael.github.io/one-record/)**

✅ No installation required  
✅ Works entirely in your browser  
✅ Transform SAP orders to fcior/UBL format  
✅ Load sample data or paste your own  
✅ View transformation statistics  
✅ Zero backend dependency  

> **Browser-Based Demo**: Runs 100% client-side using JavaScript. Perfect for quick demos and experimentation!

### 💻 Option 2: Local Full-Featured Demo

Complete features including persistent storage, REST API, and advanced mapping reports.

**Prerequisites**: Node.js 18+ and npm

```bash
# Clone the repository
git clone https://github.com/jgmikael/one-record.git
cd one-record

# Install dependencies and build
npm run setup

# Start the server
npm start
```

The application will be available at **http://localhost:3001**

### Quick Demo Walkthrough

1. Open http://localhost:3001 in your browser
2. Click **"Import"** tab
3. Click **"Load Sample SAP Order"** button
4. Click **"Import & Transform"** button
5. Go to **"Orders"** tab to see the imported order
6. Click on the order to view the canonical JSON-LD
7. Use **"Side-by-Side"** tab to compare SAP source with canonical output

### 🐳 Option 3: Docker

```bash
docker-compose up -d
# Access at http://localhost:3001
```

---

## 🎯 What is One Record?

In this demo, **One Record** refers to a **fcior-aligned canonical business document layer** that:

1. **Transforms SAP ERP data** into semantically grounded JSON-LD documents
2. **Uses fcior vocabulary** (Finnish Construction Industry One Record) - a UBL Order subset
3. **Preserves business semantics** through fcior and busdoc ontologies
4. **Enables W3C Verifiable Credentials** wrapping (cryptographic signatures)
5. **Provides explainable mappings** with field-level traceability

### Key Distinction

This is **NOT** the IATA ONE Record standard for air cargo. This is a **canonical business document transformation** using:

- **fcior** (Finnish Construction Industry One Record) - https://iri.suomi.fi/model/fcior/
- **busdoc** (Finnish Business Document vocabulary) - https://iri.suomi.fi/model/busdoc/
- **UBL 2.4** alignment for Order documents
- **JSON-LD** format (not XML)

---

## 🤔 Why This Demo?

### Business Problem

Organizations need to:
- Exchange business documents (orders, invoices, etc.) across systems
- Maintain semantic meaning during transformation
- Support legal compliance (e.g., EN 16931-1 for invoices)
- Enable digital signatures and verification
- Preserve audit trails

### Technical Solution

This demo shows how to:

1. **Extract** SAP Order data (source system)
2. **Transform** to fcior-aligned canonical JSON-LD (semantic layer)
3. **Store** both source and canonical forms (dual persistence)
4. **Explain** every mapping with confidence scores (explainability)
5. **Prepare** for W3C VC signatures (trust layer)

### Why JSON-LD instead of XML?

- **Modern APIs** prefer JSON over XML
- **Semantic grounding** through @context and URIs
- **Lightweight** for web and mobile
- **W3C VC-compatible** out of the box
- **RDF-convertible** for linked data applications

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Source System"
        SAP[SAP ECC 6.0<br/>Sales Order]
    end
    
    subgraph "Transformation Layer"
        ME[Mapping Engine<br/>60+ Rules]
        TF[Transformation<br/>Functions]
        SG[Suggestion<br/>Engine]
    end
    
    subgraph "Canonical Layer"
        CAN[fcior-aligned<br/>Canonical Order<br/>JSON-LD]
        CTX[@context<br/>fcior vocabulary]
    end
    
    subgraph "Persistence"
        DB[(SQLite<br/>Dual Storage)]
    end
    
    subgraph "API & UI"
        API[REST API<br/>Express]
        UI[Web UI<br/>HTML/CSS/JS]
    end
    
    SAP --> ME
    ME --> TF
    TF --> CAN
    CAN --> CTX
    CAN --> DB
    SAP --> DB
    ME -.-> SG
    DB --> API
    API --> UI
    
    style CAN fill:#d4f1f4
    style CTX fill:#75e6da
    style DB fill:#189ab4
    style SAP fill:#ffd89b
```

### Components

1. **SAP Model** (`packages/sap-model`)
   - TypeScript types for SAP ECC 6.0 Order structure
   - 180+ fields from VBAK, VBAP, KNA1, etc.

2. **Canonical Model** (`packages/canonical-model`)
   - fcior-aligned UBL Order subset
   - JSON-LD context with semantic URIs
   - W3C VC-compatible structure

3. **Mapping Engine** (`packages/mapping-engine`)
   - 60+ curated transformation rules
   - Automatic field suggestion (name similarity, business terms)
   - Confidence scoring and explainability

4. **Persistence** (`packages/persistence`)
   - SQLite dual storage (SAP source + canonical)
   - Mapping report persistence
   - Profile versioning

5. **REST API** (`apps/api`)
   - Import SAP orders
   - Retrieve source/canonical/report
   - Mapping suggestions

6. **Web UI** (`apps/web`)
   - Import interface
   - Viewer for source/canonical/report
   - Side-by-side comparison

---

## ✨ Features

### Transformation

- ✅ **60+ curated mapping rules** from SAP to fcior/busdoc vocabulary
- ✅ **Automatic type conversions** (dates, codes, amounts, units)
- ✅ **Code lookups** (order types, tax codes, UoM, payment terms)
- ✅ **Composite field builders** (full address, party name, incoterms)
- ✅ **Array handling** (order line items with nested structures)

### Explainability

- ✅ **Field-level traceability** (every mapping has source→target path)
- ✅ **Confidence scores** (HIGH/MEDIUM/LOW per field)
- ✅ **Semantic references** (fcior/busdoc URI for each canonical field)
- ✅ **Transformation rationale** (human-readable explanation)
- ✅ **Unmapped field detection** (with reasons)
- ✅ **Missing required field detection**

### Persistence

- ✅ **Dual storage** (SAP source + canonical JSON-LD)
- ✅ **Mapping report storage** (full explainability preserved)
- ✅ **Profile versioning** (track fcior/busdoc version)
- ✅ **Status tracking** (pending/processing/completed/failed)

### API

- ✅ **Complete REST endpoints** (import, list, retrieve, suggest)
- ✅ **JSON-LD content type** for canonical documents
- ✅ **Validation and error handling**
- ✅ **HATEOAS links** (self, source, canonical, report)

### UI

- ✅ **Import SAP orders** (paste JSON or load sample)
- ✅ **View transformations** (source, canonical, report)
- ✅ **Side-by-side comparison**
- ✅ **Mapping statistics** (confidence, coverage)
- ✅ **Responsive design** (mobile-friendly)

---

## 🎬 Demo Walkthrough

### 5-Minute Demo Script

#### 1. **Import SAP Order** (1 minute)

```bash
# Start the server
npm start

# Open browser
open http://localhost:3001
```

- Go to **Import** tab
- Click **"Load Sample SAP Order"**
- Review the SAP JSON structure
- Click **"Import & Transform"**
- See the transformation result with confidence score

#### 2. **View Canonical Output** (1 minute)

- Go to **Orders** tab
- Click on the imported order
- Viewer shows the canonical JSON-LD
- Note the `@context`, `@type`, `@id` JSON-LD headers
- Scroll through buyerCustomerParty, sellerSupplierParty, orderLine

#### 3. **Explore Mapping Report** (2 minutes)

- In the Viewer, click **"View Mapping Report"**
- See statistics:
  - Overall confidence: 95%
  - 85 mapped fields
  - 70 high-confidence mappings
- Scroll through the full report:
  - Each mapping shows source→target path
  - Transformation applied
  - Semantic reference (fcior/busdoc URI)
  - Rationale

#### 4. **Side-by-Side Comparison** (1 minute)

- Go to **Side-by-Side** tab
- Select the order
- Click **"Load Comparison"**
- See SAP source on left, canonical JSON-LD on right
- Compare structures:
  - `OrderHeader.SalesDocument` → `orderNumber`
  - `PartnerFunctions.SoldToParty` → `buyerCustomerParty`
  - `OrderItems[]` → `orderLine[]`

---

## 📚 API Documentation

### Base URL

```
http://localhost:3001/api
```

### Endpoints

#### Import SAP Order

```http
POST /api/orders/import/sap
Content-Type: application/json

{
  "OrderHeader": {
    "SalesDocument": "4500012345",
    "DocumentDate": "2026-04-15",
    ...
  },
  ...
}
```

**Response:**

```json
{
  "id": 1,
  "order_id": "4500012345",
  "import_timestamp": "2026-04-16T10:30:00Z",
  "processing_status": "completed",
  "overall_confidence": 95,
  "statistics": {
    "totalMappedFields": 85,
    "highConfidenceMappings": 70
  },
  "_links": {
    "self": "/api/orders/4500012345",
    "source": "/api/orders/4500012345/source",
    "canonical": "/api/orders/4500012345/canonical",
    "report": "/api/orders/4500012345/mapping-report"
  }
}
```

#### List Orders

```http
GET /api/orders
```

#### Get SAP Source

```http
GET /api/orders/:order_id/source
```

#### Get Canonical JSON-LD

```http
GET /api/orders/:order_id/canonical
Content-Type: application/ld+json
```

#### Get Mapping Report

```http
GET /api/orders/:order_id/mapping-report
```

#### Get Mapping Suggestions

```http
POST /api/mappings/suggest
Content-Type: application/json

{
  "sourceDoc": { ... },
  "targetSchema": { ... }
}
```

### Health & Version

```http
GET /api/health
GET /api/version
```

---

## 🧮 Mapping Logic

### Mapping Strategy

The mapping engine uses a **hybrid approach**:

1. **Curated Rules** (60+ rules)
   - Explicit source→target mappings
   - Transformation functions
   - Confidence levels
   - Semantic references

2. **Automatic Suggestions**
   - Name similarity (Levenshtein distance)
   - Token matching (common words)
   - Business term recognition
   - Value pattern matching

### Transformation Functions

#### Date/Time
- `toISODate` - SAP YYYYMMDD → ISO 8601 YYYY-MM-DD
- `toISOTime` - SAP HHMMSS → ISO 8601 HH:MM:SS

#### Code Mappings
- `sapOrderTypeToUBL` - SAP doc type → UBL order type (OR→220)
- `sapTaxCodeToUBL` - SAP tax code → UBL tax category (S1→S)
- `sapUoMToUNCEFACT` - SAP UoM → UN/CEFACT Rec. 20 (M3→MTQ)

#### Composite Builders
- `buildFullAddress` - Construct from street, city, postal, country
- `buildPartyName` - Concatenate Name1 + Name2
- `buildIncotermsSpecialTerms` - "Ex Works {location}"

#### Lookups
- `lookupSellerName` - Sales org → company name (from config)
- `sapPaymentTermsToText` - ZN30 → "Net 30 days"

### Confidence Levels

- **HIGH (90-100%)**: Direct semantic match, well-established
- **MEDIUM (70-89%)**: Probable match, needs value transformation
- **LOW (50-69%)**: Possible match, validation needed
- **SUGGEST (<50%)**: Automatic suggestion, review required

### Unmapped Fields

SAP fields not mapped to canonical (by design):

- **SAP-internal**: SalesOffice, SalesGroup, Division, Plant, ProfitCenter
- **Runtime state**: Status fields (not part of Order document)
- **Internal codes**: PriceGroup, MaterialGroup1/2/3 (SAP-specific)

### Required Canonical Fields Needing Config

- Seller party name/address (requires sales org master data lookup)
- Order type codes (SAP→UBL mapping table)
- Payment terms text (SAP code→description)

---

## 📖 Semantic Vocabularies

### fcior (Finnish Construction Industry One Record)

**URL**: https://iri.suomi.fi/model/fcior/

**Purpose**: fcior-aligned subset of UBL 2.4 Order for construction industry

**Key Classes**:
- `fcior:Order`
- `fcior:Party`
- `fcior:OrderLine`
- `fcior:Item`

**Derivation**: Based on UBL 2.4 Order specification, aligned with Finnish construction business practices.

### busdoc (Finnish Business Document Vocabulary)

**URL**: https://iri.suomi.fi/model/busdoc/

**Purpose**: Core business document terms (EN 16931-1 compliant for invoices)

**Key Properties**:
- `busdoc:orderNumber`
- `busdoc:issueDate`
- `busdoc:partyIdentification`
- `busdoc:postalAddress`
- `busdoc:lineExtensionAmount`
- `busdoc:taxAmount`

**Standards Compliance**: EN 16931-1:2017 (European standard for electronic invoicing)

### W3C Verifiable Credentials Compatibility

The canonical Order structure is **VC-compatible**:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://iri.suomi.fi/model/fcior/context.jsonld"
  ],
  "type": ["VerifiableCredential", "Order"],
  "credentialSubject": {
    "@id": "urn:order:sap:4500012345",
    "orderNumber": "4500012345",
    ...
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2026-04-16T10:30:00Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:example:seller#key-1",
    "proofValue": "..."
  }
}
```

---

## 📁 Project Structure

```
one-record/
├── packages/
│   ├── canonical-model/       # fcior-aligned Order types + JSON-LD context
│   │   └── src/
│   │       ├── types.ts       # TypeScript types (50+ interfaces)
│   │       └── context.jsonld # fcior semantic bindings
│   ├── sap-model/             # SAP ECC 6.0 Order types
│   │   └── src/
│   │       └── types.ts       # SAP structure (180+ fields)
│   ├── mapping-engine/        # Transformation engine
│   │   └── src/
│   │       ├── engine.ts      # Core orchestration
│   │       ├── transformations.ts # 25+ transform functions
│   │       ├── rules.ts       # 60+ curated rules
│   │       ├── suggester.ts   # Auto-suggestion engine
│   │       └── config.ts      # Default config + lookups
│   └── persistence/           # SQLite storage
│       ├── schema.sql         # Database schema
│       └── src/
│           ├── repository.ts  # Data access layer
│           └── init.ts        # DB initialization
├── apps/
│   ├── api/                   # REST API server
│   │   └── src/
│   │       ├── index.ts       # Express server
│   │       └── routes/        # API endpoints
│   └── web/                   # Frontend UI
│       └── public/
│           ├── index.html     # Single-page app
│           ├── styles.css     # Styling
│           └── app.js         # Application logic
├── samples/
│   ├── sap-order-001.json           # Sample SAP Order
│   └── one-record-order-001.jsonld  # Sample canonical output
├── docs/
│   ├── mapping-matrix.md            # Field-level mappings (100+)
│   ├── sap-field-inventory.md      # SAP field catalog
│   ├── correspondence-candidates.md # Mapping analysis
│   ├── sap-source-model.md          # SAP architecture
│   ├── architecture/                # Architecture docs
│   └── FCIOR_DERIVATION.md          # fcior derivation notes
├── schemas/
│   ├── fcior.ttl                    # fcior OWL vocabulary (Turtle)
│   ├── one-record-order-context.jsonld # JSON-LD context
│   └── one-record-order-shapes.ttl  # SHACL validation shapes
├── package.json              # Root package config
├── tsconfig.json             # TypeScript config
├── README.md                 # This file
├── LICENSE                   # MIT License
└── STATUS.md                 # Implementation status
```

**Total Files**: ~60  
**Total Code**: ~25,000 lines (TypeScript + docs)  
**Documentation**: ~100KB markdown

---

## 💻 Development

### Build from Source

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run in development mode (with auto-reload)
npm run dev
```

### Project Commands

```bash
npm run setup      # Install + build everything
npm start          # Start production server
npm run dev        # Start development server
npm run build      # Build all packages
npm run test       # Run tests (if available)
npm run clean      # Clean all build artifacts
```

### Database Location

By default, the SQLite database is stored at:

```
apps/api/data/one-record.db
```

To use a different location:

```bash
DB_PATH=/path/to/database.db npm start
```

### Seed Database

To pre-load the sample order on startup:

```bash
SEED_DB=true npm start
```

### Environment Variables

- `PORT` - API server port (default: 3001)
- `DB_PATH` - SQLite database path
- `SEED_DB` - Seed sample data (true/false)
- `NODE_ENV` - Environment (development/production)

---

## 🔮 Future Extensions

### Additional Document Types

The architecture supports extending to:

1. **Invoice** (EN 16931-1 compliant)
   - SAP billing document → fcior Invoice
   - busdoc vocabulary already supports invoices

2. **Despatch Advice**
   - SAP delivery document → fcior DespatchAdvice
   - Track shipments with semantic grounding

3. **Order Response**
   - Seller confirmation → fcior OrderResponse
   - Bidirectional order confirmation flow

4. **Catalogue**
   - SAP material master → fcior Catalogue
   - Product information exchange

### W3C Verifiable Credentials Integration

Next steps for VC support:

1. **DID Management**
   - Seller/buyer DID creation
   - Key management

2. **Signature Generation**
   - Ed25519Signature2020
   - Proof creation and verification

3. **EU Business Wallet Integration**
   - VC issuance to wallet
   - Presentation request/response

### Advanced Mapping Features

1. **Machine Learning Suggestions**
   - Train on historical mappings
   - Improve suggestion accuracy

2. **Interactive Mapping Editor**
   - Visual mapping designer
   - Test transformations live

3. **SHACL Validation**
   - Execute SHACL shapes
   - Validation reports in UI

### Scalability

1. **PostgreSQL Backend**
   - Replace SQLite for production
   - Multi-tenant support

2. **Event-Driven Architecture**
   - Async transformation queue
   - Event sourcing

3. **GraphQL API**
   - Flexible querying
   - Subscription for real-time updates

---

## ⚠️ Limitations

### Current Scope

This is a **proof-of-concept demo** with intentional limitations:

1. **Single Document Type**
   - Only Order documents currently supported
   - Invoice, DespatchAdvice, etc. are future extensions

2. **No Cryptographic Signatures**
   - Structure is VC-compatible
   - Actual signature generation not implemented
   - DID management not included

3. **No SHACL Validation Execution**
   - SHACL shapes are defined
   - Validation engine not implemented
   - JSON Schema validation only

4. **Simplified Authentication**
   - No API authentication
   - Not production-security ready

5. **SQLite Database**
   - Suitable for demo/development
   - Not for high-volume production

6. **Finnish/EU Context**
   - Tax assumptions (VAT)
   - Finnish construction industry scenario
   - May need adaptation for other regions

7. **SAP Instance-Specific**
   - Based on SAP ECC 6.0 structure
   - May need adjustments for SAP S/4HANA or custom SAP

### Assumptions About SAP Source

1. **Data Availability**
   - Assumes all required SAP fields are populated
   - Missing data may cause incomplete canonical documents

2. **SAP Configuration**
   - Tax codes, UoM codes, payment terms assumed standard
   - Custom SAP configurations may need mapping table updates

3. **Data Quality**
   - Assumes valid SAP data (no validation on import)
   - Garbage in, garbage out

4. **Seller Master Data**
   - Requires external configuration for seller details
   - Sales org → company name/address lookup

### What's Mocked vs. Real

**Real (Production-Ready)**:
- ✅ Mapping engine with 60+ rules
- ✅ Transformation functions
- ✅ SQLite persistence
- ✅ REST API
- ✅ Web UI
- ✅ Sample data

**Mocked/Simplified**:
- ⚠️ Seller master data (static config, not SAP lookup)
- ⚠️ No authentication/authorization
- ⚠️ No SHACL validation execution
- ⚠️ No W3C VC signature generation

---

## 📄 License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 Acknowledgments

- **fcior vocabulary**: https://iri.suomi.fi/model/fcior/
- **busdoc vocabulary**: https://iri.suomi.fi/model/busdoc/
- **UBL 2.4**: OASIS Universal Business Language
- **W3C Verifiable Credentials**: https://www.w3.org/TR/vc-data-model/
- **Finnish Digital and Population Data Services Agency** for vocabulary development

---

## 📧 Contact & Support

- **GitHub Issues**: https://github.com/jgmikael/one-record/issues
- **Documentation**: This README + `/docs` folder
- **Live Demo**: http://localhost:3001 (after setup)

---

**Ready to transform SAP orders into semantic business documents?** 🚀

```bash
npm run demo
```
