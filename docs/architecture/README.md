# One Record Architecture

## System Overview

The One Record Order Demo implements a **semantic transformation pipeline** that converts SAP-native Order documents into a UBL-conformant canonical representation using JSON-LD and fcior semantics.

## Design Principles

### 1. Semantic Grounding

- **fcior-aligned**: All canonical structures follow the Finnish Construction Industry One Record (fcior) application profile
- **UBL 2.4 conformant**: Semantic mappings align with Universal Business Language 2.4 Order document structure  
- **busdoc vocabulary**: Properties mapped to https://iri.suomi.fi/model/busdoc/ vocabulary where applicable
- **Linked Data**: JSON-LD format with explicit `@context` for semantic interoperability

### 2. Dual Persistence

```
SAP Order (source)          One Record Order (canonical)
─────────────────          ──────────────────────────────
Native SAP structure   →    fcior/UBL-aligned structure
Preserved as-is             JSON-LD with semantics
```

Both versions stored in SQLite with complete mapping trace.

### 3. Declarative Mapping

Transformation rules are **data-driven** rather than hard-coded:

```typescript
{
  targetPath: 'buyerCustomerParty.partyName',
  sourcePath: 'OrderHeader.SoldToParty.Name',
  required: true,
  description: 'SAP Customer name → Party name'
}
```

Benefits:
- **Maintainable**: Rules separate from engine logic
- **Extensible**: Add new mappings without code changes  
- **Traceable**: Complete audit trail of transformations
- **Testable**: Rules can be validated independently

### 4. VC-Compatible Architecture

While not requiring full W3C Verifiable Credentials, the design enables easy upgradeability:

```json
{
  "@context": [ ... ],           // ✓ Semantic context
  "@id": "urn:order:sap:...",   // ✓ Stable identifier
  "@type": "OneRecordOrder",     // ✓ Type declaration
  "metadata": {                  // ✓ Separated metadata
    "sourceSystem": "SAP_ECC_6.0",
    "transformedAt": "..."
  }
}
```

Can be wrapped in VC envelope with `proof` when needed.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  - Web UI (React)                                           │
│  - CLI tools                                                │
│  - External systems                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                              │
│  - Express.js REST API                                      │
│  - Request validation                                       │
│  - Error handling                                           │
│  Endpoints:                                                 │
│    POST /api/transform        Transform SAP → One Record    │
│    GET  /api/orders           List all orders               │
│    GET  /api/orders/:id       Get specific order            │
│    GET  /api/orders/:id/trace Get mapping trace             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                       │
│                                                             │
│  ┌───────────────────────────────────────────────┐        │
│  │         Mapping Engine                        │        │
│  │  - Rule application                           │        │
│  │  - Value transformation                       │        │
│  │  - Trace generation                           │        │
│  │  - Validation                                 │        │
│  └───────────────────────────────────────────────┘        │
│                                                             │
│  ┌───────────────────────────────────────────────┐        │
│  │         Mapping Rules (Declarative)           │        │
│  │  - Document-level mappings                    │        │
│  │  - Line item mappings                         │        │
│  │  - Tax calculation rules                      │        │
│  └───────────────────────────────────────────────┘        │
│                                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                │
│  - SQLite database                                          │
│  - Order storage (SAP + One Record)                         │
│  - Mapping trace storage                                    │
│  - Query interface                                          │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Transformation Flow

```
1. SAP Order JSON received
   └─> Validation (structure check)

2. Mapping Engine processes rules
   ├─> Document-level transformations
   ├─> Line item transformations  
   ├─> Tax aggregation
   └─> Metadata addition

3. One Record Order generated
   └─> SHACL validation (optional)

4. Both versions persisted
   ├─> SAP source
   ├─> One Record canonical
   └─> Mapping trace

5. Response returned
   └─> Includes errors/warnings
```

### 2. Retrieval Flow

```
1. Request for order (by ID)
   └─> Storage query

2. Order fetched from SQLite
   ├─> SAP version
   ├─> One Record version
   └─> Mapping trace

3. Optional filtering/formatting
   └─> Response returned
```

## Mapping Strategy

### Field-Level Mapping

Each mapping rule defines:

1. **Target path**: Where in One Record structure (`buyerCustomerParty.partyName`)
2. **Source path**: Where in SAP structure (`OrderHeader.SoldToParty.Name`)
3. **Transform** (optional): Value transformation function
4. **Required**: Whether field is mandatory
5. **Description**: Human-readable explanation

### Value Transformations

Common transformations:

- **Currency codes**: Normalize to ISO 4217
- **Date formats**: SAP YYYY-MM-DD → xsd:date
- **IDs**: Add URN prefixes (`urn:order:sap:...`)
- **Tax aggregation**: Group by rate

### Semantic Mapping

SAP commercial names → busdoc semantic properties:

```
SAP                     →  busdoc (One Record)
─────────────────────  →  ──────────────────────
DocumentNumber          →  identificationID
DocumentDate            →  issueDate
SoldToParty             →  buyerCustomerParty
MaterialDescription     →  item/name
Quantity                →  quantity
UnitPrice               →  price/priceAmount
```

## Storage Schema

### SQLite Schema

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,                 -- Generated UUID
  sap_order TEXT NOT NULL,             -- Original SAP JSON
  one_record_order TEXT NOT NULL,      -- Canonical JSON-LD
  mapping_trace TEXT NOT NULL,         -- Array of trace entries
  mapping_errors TEXT NOT NULL,        -- Array of errors
  mapping_warnings TEXT NOT NULL,      -- Array of warnings
  created_at TEXT NOT NULL,            -- ISO 8601 timestamp
  updated_at TEXT NOT NULL             -- ISO 8601 timestamp
);

CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

## SHACL Validation

SHACL shapes define structural constraints:

- **Order Shape**: Document-level requirements
- **Party Shape**: Party identification and address
- **OrderLine Shape**: Line item structure
- **MonetaryTotal Shape**: Monetary amount constraints
- **TaxCategory Shape**: Tax classification

Example constraint:

```turtle
fcior:OrderShape
    a sh:NodeShape ;
    sh:targetClass fcior:Order ;
    sh:property [
        sh:path busdoc:identificationID ;
        sh:datatype xsd:string ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
    ] .
```

## JSON-LD Context

The `@context` provides semantic linking:

```json
{
  "@context": {
    "@vocab": "https://iri.suomi.fi/model/fcior#",
    "busdoc": "https://iri.suomi.fi/model/busdoc/",
    "orderNumber": {
      "@id": "busdoc:identificationID",
      "@type": "xsd:string"
    }
  }
}
```

This enables:
- **RDF conversion**: JSON-LD → RDF triples
- **SPARQL queries**: Query across documents
- **Semantic validation**: Check against OWL ontologies
- **Linked Data**: Connect to other semantic resources

## Error Handling

### Transformation Errors

- **Missing required fields**: Captured in `errors` array
- **Invalid values**: Type coercion failures
- **Mapping failures**: Rule application errors

Errors don't halt transformation - partial results returned with error list.

### API Errors

- **400 Bad Request**: Invalid SAP Order structure
- **404 Not Found**: Order ID doesn't exist
- **500 Internal Server Error**: System failures

All errors include descriptive messages and trace information.

## Security Considerations

### Current Demo Scope

- No authentication (demo environment)
- No authorization (single-user assumption)
- No encryption at rest (SQLite unencrypted)
- CORS enabled for all origins

### Production Recommendations

1. **Authentication**: JWT tokens or OAuth 2.0
2. **Authorization**: Role-based access control (RBAC)
3. **Encryption**: TLS for transport, encrypted SQLite or PostgreSQL
4. **Input validation**: Strict schema validation for SAP orders
5. **Rate limiting**: Prevent abuse
6. **Audit logging**: Track all transformations

## Performance

### Current Characteristics

- **Transformation**: ~10-50ms per order (depends on line count)
- **Storage**: SQLite handles 1000s of orders easily
- **API response**: <100ms for typical requests
- **Memory**: ~50MB footprint for backend

### Scaling Considerations

For production:
- **Horizontal scaling**: Multiple API instances behind load balancer
- **Database**: Migrate to PostgreSQL for concurrent writes
- **Caching**: Redis for frequently accessed orders
- **Async processing**: Queue for batch transformations
- **CDN**: Static assets and cacheable responses

## Extension Points

### 1. Additional Document Types

Current: **Order** only

Can extend to:
- Invoice (using same fcior/busdoc semantics)
- Despatch Advice
- Catalogue
- Order Response

### 2. Additional Source Systems

Current: **SAP** structure

Can extend to:
- Dynamics 365
- NetSuite
- Odoo
- Custom ERPs

Add new mapping rule sets for each system.

### 3. Additional Validation

Current: Basic structure validation

Can add:
- Full SHACL validation engine
- Business rule validation (e.g., price consistency)
- Cross-document validation
- External reference validation

### 4. RDF Triple Store

Current: JSON storage in SQLite

Can extend to:
- Apache Jena/Fuseki
- GraphDB
- Blazegraph

Enables SPARQL queries and reasoning.

## Related Standards

- **UBL 2.4**: Universal Business Language
- **fcior**: Finnish Construction Industry One Record
- **busdoc**: Business Document vocabulary (Finland)
- **JSON-LD 1.1**: JSON-based Linked Data format
- **SHACL**: Shapes Constraint Language
- **W3C Verifiable Credentials**: For future credential wrapping
- **UN/CEFACT**: Business Semantic Library (imported by fcior)

## References

- fcior model: https://iri.suomi.fi/model/fcior/
- busdoc vocabulary: https://iri.suomi.fi/model/busdoc/
- UBL 2.4: http://docs.oasis-open.org/ubl/UBL-2.4.html
- JSON-LD spec: https://www.w3.org/TR/json-ld11/
- SHACL spec: https://www.w3.org/TR/shacl/
