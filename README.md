# One Record Order Demo

**Complete demonstration of SAP Order → One Record canonical Order transformation**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## Overview

This demonstration implements a complete **One Record** system for transforming SAP Order documents into a semantically grounded, UBL-conformant canonical Order representation using JSON-LD and SHACL validation.

### What is "One Record"?

For this demo, "One Record" means:
- **Semantic canonical layer**: Business documents aligned to [fcior](https://iri.suomi.fi/model/fcior/) (Finnish Construction Industry One Record) and UBL 2.4 semantics
- **JSON-LD serialization**: Linked Data format with explicit semantic references through `@context`
- **Dual persistence**: Both SAP source structure and canonical One Record structure preserved
- **Traceability**: Complete mapping trace showing transformation from source to target

### Key Features

✅ **Automatic transformation** from SAP Order JSON to One Record canonical Order  
✅ **Semantic alignment** with fcior/UBL 2.4 vocabularies (using busdoc)  
✅ **JSON-LD format** with Linked Data semantics  
✅ **SHACL validation** shapes for structural validation  
✅ **Dual persistence** of both SAP and One Record representations  
✅ **Mapping traceability** with complete field-level lineage  
✅ **RESTful API** for transformation and retrieval  
✅ **Web UI** for interactive exploration  
✅ **TypeScript throughout** for type safety  
✅ **Comprehensive tests** and CI/CD  

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   SAP Order (JSON)                          │
│  - Native SAP structure                                     │
│  - OrderHeader, OrderItems, Metadata                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 Mapping Engine                              │
│  - Declarative rules (mapping-rules.ts)                    │
│  - Field-level transformations                              │
│  - Value normalization                                      │
│  - Trace generation                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            One Record Order (JSON-LD)                       │
│  @context: fcior/busdoc semantics                          │
│  @type: OneRecordOrder                                      │
│  - UBL-conformant structure                                 │
│  - Semantic property mappings                               │
│  - Metadata for traceability                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Storage (SQLite)                          │
│  - SAP source document                                      │
│  - One Record canonical document                            │
│  - Mapping trace (field-level lineage)                     │
│  - Validation results                                       │
└─────────────────────────────────────────────────────────────┘
```

See [docs/architecture/README.md](docs/architecture/README.md) for detailed architecture documentation.

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/jgmikael/one-record.git
cd one-record

# Install dependencies
npm install

# Build packages
npm run build
```

### Running the Demo

```bash
# Start the backend server
npm run dev:backend

# In another terminal, test with sample data
curl -X POST http://localhost:3001/api/transform \
  -H "Content-Type: application/json" \
  -d @packages/shared/src/sample-sap-order.json

# Or use the sample endpoint
curl http://localhost:3001/api/sample | \
  curl -X POST http://localhost:3001/api/transform \
  -H "Content-Type: application/json" \
  -d @-
```

The backend server runs on `http://localhost:3001`.

## Project Structure

```
one-record/
├── packages/
│   ├── backend/          # Node.js/Express API server
│   │   └── src/
│   │       ├── index.ts          # Server entry point
│   │       ├── api.ts            # REST API endpoints
│   │       ├── mapping-engine.ts # Transformation logic
│   │       └── storage.ts        # SQLite persistence
│   ├── shared/           # Shared types and schemas
│   │   └── src/
│   │       ├── mapping-rules.ts        # Declarative mapping rules
│   │       └── sample-sap-order.json   # Sample SAP Order
│   └── frontend/         # React web UI (optional)
├── schemas/              # SHACL shapes and JSON-LD contexts
│   ├── fcior.ttl                       # fcior model metadata
│   ├── one-record-order-context.jsonld # JSON-LD @context
│   └── one-record-order-shapes.ttl     # SHACL validation shapes
├── docs/                 # Documentation
│   ├── architecture/     # Architecture diagrams and docs
│   └── api/              # API documentation
├── .github/
│   └── workflows/        # CI/CD pipelines
└── README.md
```

## API Reference

### Transform SAP Order

```http
POST /api/transform
Content-Type: application/json

{
  "OrderHeader": { ... },
  "OrderItems": [ ... ],
  "Metadata": { ... }
}
```

**Response:**

```json
{
  "id": "abc123",
  "sapOrder": { ... },
  "oneRecordOrder": {
    "@context": [ ... ],
    "@type": "OneRecordOrder",
    "@id": "urn:order:sap:4500012345",
    "orderNumber": "4500012345",
    ...
  },
  "mappingTrace": [ ... ],
  "errors": [],
  "warnings": []
}
```

### Get All Orders

```http
GET /api/orders?limit=100
```

### Get Specific Order

```http
GET /api/orders/:id
```

### Get Mapping Trace

```http
GET /api/orders/:id/trace
```

See [docs/api/README.md](docs/api/README.md) for complete API documentation.

## Semantic Model

### fcior (Finnish Construction Industry One Record)

The canonical One Record Order structure is based on the **fcior** application profile:

- **Namespace**: `https://iri.suomi.fi/model/fcior/`
- **Based on**: UBL 2.4 Order document semantics
- **Imports**: [busdoc](https://iri.suomi.fi/model/busdoc/) (Business Document vocabulary)
- **Format**: JSON-LD with Linked Data semantics

### Key Semantic Mappings

| SAP Field | One Record Property | Vocabulary |
|-----------|---------------------|------------|
| `OrderHeader.DocumentNumber` | `busdoc:identificationID` | busdoc |
| `OrderHeader.DocumentDate` | `busdoc:issueDate` | busdoc |
| `OrderHeader.SoldToParty` | `busdoc:buyerCustomerParty` | busdoc |
| `OrderItems[].MaterialDescription` | `busdoc:item/busdoc:name` | busdoc |
| `OrderItems[].Quantity` | `busdoc:quantity` | busdoc |

See [schemas/one-record-order-context.jsonld](schemas/one-record-order-context.jsonld) for complete semantic mappings.

## SHACL Validation

The demo includes SHACL shapes for validating One Record Order documents:

- **Order level**: Required fields, cardinality constraints
- **Party level**: Address structure, tax information
- **Line item level**: Quantity, pricing, tax categories
- **Monetary totals**: Tax calculations, amount consistency

Shapes are defined in [schemas/one-record-order-shapes.ttl](schemas/one-record-order-shapes.ttl).

## Data Lineage & Traceability

Every transformation generates a complete mapping trace:

```json
{
  "targetPath": "orderNumber",
  "sourcePath": "OrderHeader.DocumentNumber",
  "sourceValue": "4500012345",
  "targetValue": "4500012345",
  "description": "SAP Order document number → Order identifier"
}
```

This enables:
- **Field-level lineage**: Track every value from source to target
- **Audit trails**: Understand transformation decisions
- **Debugging**: Identify mapping issues
- **Compliance**: Demonstrate data provenance

## Example Transformation

### Input (SAP Order - excerpt)

```json
{
  "OrderHeader": {
    "DocumentNumber": "4500012345",
    "DocumentDate": "2026-04-15",
    "SoldToParty": {
      "CustomerNumber": "100234",
      "Name": "Rakennusyhtiö Suomi Oy"
    },
    "Currency": "EUR",
    "TotalGrossAmount": 15500.00
  },
  "OrderItems": [
    {
      "ItemNumber": "000010",
      "MaterialDescription": "C30/37 Betoniseos",
      "Quantity": 50,
      "UnitPrice": 120.00
    }
  ]
}
```

### Output (One Record Order - excerpt)

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
  "documentCurrency": "EUR",
  "buyerCustomerParty": {
    "@type": "Party",
    "partyIdentification": "100234",
    "partyName": "Rakennusyhtiö Suomi Oy"
  },
  "legalMonetaryTotal": {
    "@type": "MonetaryTotal",
    "payableAmount": 15500.00
  },
  "orderLine": [
    {
      "@type": "OrderLine",
      "lineID": "000010",
      "orderedQuantity": 50,
      "item": {
        "@type": "Item",
        "itemName": "C30/37 Betoniseos"
      },
      "price": {
        "@type": "Price",
        "priceAmount": 120.00
      }
    }
  ]
}
```

## Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm test -w @one-record/backend

# Run with coverage
npm test -- --coverage
```

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Start development mode (watch for changes)
npm run dev:backend

# Lint code
npm run lint
```

## Deployment

The demo can be deployed to any Node.js hosting environment:

```bash
# Build for production
npm run build

# Set environment variables
export NODE_ENV=production
export PORT=3001

# Start server
npm start
```

## Design Decisions

### Why JSON-LD instead of XML?

1. **Modern**: JSON is the lingua franca of modern APIs
2. **Lightweight**: Smaller payload size, easier parsing
3. **Semantic**: JSON-LD provides Linked Data semantics without XML overhead
4. **Developer-friendly**: Easier to work with in JavaScript/TypeScript

### Why not full W3C Verifiable Credentials?

The demo is architected to be **VC-compatible** but doesn't require full VC infrastructure:

- Uses JSON-LD with `@context` for semantic linking
- Includes stable identifiers (`@id`)
- Separates content from metadata
- Can easily be wrapped in a VC envelope with proofs when needed

### Why SQLite?

- **Simple**: No external database server required
- **Portable**: Single file database
- **Sufficient**: Handles demo-scale data easily
- **Upgradeable**: Can migrate to PostgreSQL/MySQL for production

## Future Enhancements

- [ ] Support for additional UBL document types (Invoice, Despatch Advice, Catalogue)
- [ ] Full SHACL validation engine integration
- [ ] RDF triple store option for advanced querying
- [ ] W3C Verifiable Credential signing
- [ ] GraphQL API
- [ ] Real-time transformation notifications
- [ ] Batch processing for multiple orders
- [ ] Integration with actual SAP systems (RFC/IDoc)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Mikael af Hällström** ([@jgmikael](https://github.com/jgmikael))

## Acknowledgments

- **fcior** model by Finnish Tax Administration (Verohallinto)
- **busdoc** vocabulary by Finnish Digital and Population Data Services Agency (DVV)
- **UBL 2.4** by OASIS
- **UN/CEFACT** Business Semantic Library

## Related Projects

- [vocabularies](https://github.com/jgmikael/vocabularies) - Combined WE BUILD, EU-Core, NCBV vocabularies
- [realdigitalization](https://github.com/jgmikael/realdigitalization) - W3C VC implementations for eInvoices and eCMR

---

**Questions?** Open an issue on [GitHub](https://github.com/jgmikael/one-record/issues).
