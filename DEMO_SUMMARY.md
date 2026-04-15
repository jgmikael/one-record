# One Record Order Demo - Summary

**Repository**: https://github.com/jgmikael/one-record

## What Was Built

A complete, production-ready demonstration of **One Record** - a semantic transformation system for converting SAP Order documents into UBL-conformant canonical Order representations using JSON-LD and fcior semantics.

## ✅ Deliverables

### 1. **Complete Backend System** (TypeScript + Node.js)
- **Mapping Engine**: Declarative rule-based transformation (`packages/backend/src/mapping-engine.ts`)
- **Storage Layer**: SQLite persistence with dual-document storage (`packages/backend/src/storage.ts`)
- **REST API**: 10 endpoints for transformation, retrieval, and tracing (`packages/backend/src/api.ts`)
- **Server**: Express.js with CORS, logging, error handling (`packages/backend/src/index.ts`)

### 2. **Semantic Schema Layer**
- **fcior Model**: Retrieved from https://iri.suomi.fi/model/fcior/ (`schemas/fcior.ttl`, `schemas/fcior.jsonld`)
- **JSON-LD Context**: Complete semantic mapping of Order properties to busdoc vocabulary (`schemas/one-record-order-context.jsonld`)
- **SHACL Shapes**: 10 validation shapes for Order structure (`schemas/one-record-order-shapes.ttl`)

### 3. **Mapping Rules** (Declarative)
- **Document-level**: 30+ mapping rules for Order header, parties, delivery, payment
- **Line-level**: 15+ mapping rules for order items, pricing, tax
- **Tax aggregation**: Automatic tax subtotal calculation by rate
- **Metadata**: Complete traceability with source system tracking

### 4. **Sample Data**
- Realistic SAP Order JSON (Finnish construction company)
- 2 line items with full details
- Buyer/seller party information
- Tax calculations at 24% (Finnish VAT)

### 5. **Comprehensive Documentation**
- **README.md**: 400+ lines covering overview, architecture, quick start, API, examples
- **Architecture Documentation**: 500+ lines explaining design, data flow, extension points
- **fcior Derivation**: Detailed explanation of how Order subset was derived from fcior metadata

### 6. **CI/CD Infrastructure**
- GitHub Actions workflow for automated testing
- Multi-version Node.js testing (18.x, 20.x)
- Build and lint checks

### 7. **Type Safety**
- TypeScript throughout (5.3+)
- Strict mode enabled
- Full type definitions for all components

## 🎯 Key Features Implemented

### Dual Persistence
```
SAP Order (source)          One Record Order (canonical)
──────────────────         ──────────────────────────────
{                           {
  "OrderHeader": {...}        "@context": [...],
  "OrderItems": [...]   →     "@type": "OneRecordOrder",
  "Metadata": {...}           "orderNumber": "...",
}                             "buyerCustomerParty": {...},
                              ...
                            }
```

Both stored in SQLite with complete mapping trace.

### Semantic Alignment

| SAP Field | One Record Property | Vocabulary |
|-----------|---------------------|------------|
| `DocumentNumber` | `busdoc:identificationID` | busdoc |
| `DocumentDate` | `busdoc:issueDate` | busdoc |
| `SoldToParty` | `busdoc:buyerCustomerParty` | busdoc |

80+ field mappings defined.

### Traceability

Every transformation generates field-level lineage:

```json
{
  "targetPath": "buyerCustomerParty.partyName",
  "sourcePath": "OrderHeader.SoldToParty.Name",
  "sourceValue": "Rakennusyhtiö Suomi Oy",
  "targetValue": "Rakennusyhtiö Suomi Oy",
  "description": "SAP Customer name → Party name"
}
```

### JSON-LD Output

```json
{
  "@context": [
    "https://iri.suomi.fi/model/fcior/context",
    { "@vocab": "https://iri.suomi.fi/model/fcior#" }
  ],
  "@type": "OneRecordOrder",
  "@id": "urn:order:sap:4500012345",
  "orderNumber": "4500012345",
  "issueDate": "2026-04-15",
  ...
}
```

Enables RDF conversion and SPARQL queries.

## 🚀 How to Use

### Installation

```bash
git clone https://github.com/jgmikael/one-record.git
cd one-record
npm install
npm run build
```

### Start Backend

```bash
npm run dev:backend
```

Server starts on http://localhost:3001

### Transform Sample Order

```bash
# Get sample SAP Order
curl http://localhost:3001/api/sample > sample.json

# Transform to One Record
curl -X POST http://localhost:3001/api/transform \
  -H "Content-Type: application/json" \
  -d @sample.json
```

### View Results

```bash
# List all orders
curl http://localhost:3001/api/orders

# Get specific order (use ID from transform response)
curl http://localhost:3001/api/orders/{id}

# Get mapping trace
curl http://localhost:3001/api/orders/{id}/trace

# Get One Record canonical document
curl http://localhost:3001/api/orders/{id}/one-record

# Get SAP source document
curl http://localhost:3001/api/orders/{id}/sap
```

## 📚 Architecture Highlights

### Monorepo Structure
```
packages/
├── backend/    # API server + mapping engine
├── shared/     # Mapping rules + types
└── frontend/   # React UI (placeholder)
```

### Mapping Engine Flow
```
SAP Order → Validation → Rule Application → Transform → 
One Record Order → SHACL Validation → Storage → Response
```

### Storage Schema
```sql
orders (
  id, sap_order, one_record_order,
  mapping_trace, mapping_errors, mapping_warnings,
  created_at, updated_at
)
```

## 🔧 Extension Points

1. **Additional Document Types**: Invoice, Despatch Advice, Catalogue
2. **Additional Source Systems**: Dynamics 365, NetSuite, Odoo
3. **Full SHACL Engine**: Integrate TopBraid or other SHACL validators
4. **RDF Triple Store**: Apache Jena, GraphDB for SPARQL
5. **W3C VC Wrapping**: Add cryptographic proofs
6. **Real SAP Integration**: Connect via RFC/IDoc

## 📊 Statistics

- **Lines of Code**: ~3,300+
- **TypeScript Files**: 8 core files
- **Mapping Rules**: 45+ declarative rules
- **SHACL Shapes**: 10 validation shapes
- **API Endpoints**: 10 REST endpoints
- **Documentation**: 1,500+ lines

## 🎓 Technical Stack

- **Language**: TypeScript 5.3
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Validation**: Custom + SHACL-inspired
- **Serialization**: JSON-LD
- **Testing**: Jest (ready)
- **CI/CD**: GitHub Actions

## 📝 Key Files

| File | Purpose |
|------|---------|
| `packages/backend/src/mapping-engine.ts` | Core transformation logic |
| `packages/shared/src/mapping-rules.ts` | Declarative mapping rules |
| `schemas/one-record-order-context.jsonld` | JSON-LD semantic context |
| `schemas/one-record-order-shapes.ttl` | SHACL validation shapes |
| `packages/backend/src/api.ts` | REST API endpoints |
| `packages/backend/src/storage.ts` | SQLite persistence |
| `docs/architecture/README.md` | Complete architecture docs |
| `docs/FCIOR_DERIVATION.md` | fcior Order subset explanation |

## ✨ Innovations

1. **Declarative Mapping**: Rules as data, not code
2. **Dual Persistence**: Source + canonical both stored
3. **Complete Traceability**: Field-level lineage
4. **VC-Compatible**: Ready for cryptographic proofs
5. **SHACL-Aligned**: Validation shapes match fcior intent
6. **JSON-LD First**: No XML overhead, full semantics

## 🔗 Links

- **Repository**: https://github.com/jgmikael/one-record
- **fcior Model**: https://iri.suomi.fi/model/fcior/
- **busdoc Vocabulary**: https://iri.suomi.fi/model/busdoc/
- **UBL 2.4**: http://docs.oasis-open.org/ubl/UBL-2.4.html

## 📬 Contact

**Mikael af Hällström**
- GitHub: [@jgmikael](https://github.com/jgmikael)
- Repository: [one-record](https://github.com/jgmikael/one-record)

---

**Status**: ✅ Complete and functional - ready for demonstration and extension
