# One Record Demo - Implementation Status

Last Updated: 2026-04-16

## ✅ Completed

### 1. Repository Structure
- [x] Monorepo structure (`/packages`, `/apps`, `/samples`, `/docs`, `/schemas`)
- [x] Root configuration (`package.json`, `tsconfig.json`, `.gitignore`)
- [x] GitHub Actions CI/CD (`ci.yml`)
- [x] README and LICENSE

### 2. Canonical Model Package (`packages/canonical-model`)
- [x] **Complete TypeScript types** (`src/types.ts` - 14KB)
  - 50+ interfaces for full UBL Order structure
  - Cardinality notes and SAP mapping hints
  - fcior/UBL alignment documented inline
- [x] **Complete JSON-LD context** (`src/context.jsonld` - 13KB)
  - 150+ term mappings to fcior/busdoc vocabulary
  - Proper semantic bindings

### 3. SAP Model Package (`packages/sap-model`)
- [x] **Complete TypeScript types** (`src/types.ts` - 12KB)
  - SAPOrder, SAPOrderHeader, SAPPartner, SAPOrderItem
  - 180+ fields organized by section
  - SAP table references and field metadata

### 4. Sample Data
- [x] **SAP Order sample** (`samples/sap-order-001.json` - 9KB)
  - Realistic SAP ECC 6.0 structure
  - Finnish construction industry scenario
  - 2 line items with full detail
- [x] **One Record Order sample** (`samples/one-record-order-001.jsonld` - 8.5KB)
  - Complete canonical transformation
  - JSON-LD with fcior context

### 5. Documentation
- [x] **Mapping Matrix** (`docs/mapping-matrix.md` - 15KB)
  - 100+ field-level mappings
  - Transformation notes for each mapping
  - Code conversion tables (UBL types, UoM, tax codes)
- [x] **SAP Field Inventory** (`docs/sap-field-inventory.md` - 19.6KB)
  - Complete inventory of ~180 SAP fields
  - Grouped by section (Header, Partner, Line Item, etc.)
  - SAP table references and example values
- [x] **Correspondence Candidates** (`docs/correspondence-candidates.md` - 17KB)
  - Explicit mapping candidate table
  - Confidence levels for each mapping
  - Transformation notes
  - Unmapped fields analysis
  - Semantic assumptions documented
- [x] **SAP Source Model** (`docs/sap-source-model.md` - 12.6KB)
  - SAP model architecture
  - Business scenario description
  - Field naming conventions
  - Data types and cardinality
  - Mapping guidance
- [x] **Architecture Documentation** (`docs/architecture/README.md`)
- [x] **fcior Derivation** (`docs/FCIOR_DERIVATION.md`)

### 6. Mapping Engine Package (`packages/mapping-engine`) - **IN PROGRESS**
- [x] **Types** (`src/types.ts` - 5.8KB)
  - MappingRule, MappingReport, MappingResult
  - Suggestion engine types
  - Validation types
- [x] **Transformation Functions** (`src/transformations.ts` - 12.2KB)
  - Date/time transformations
  - Code mappings (UBL order type, tax codes, UoM)
  - Composite builders (address, party name)
  - Currency/amount transformations
  - Metadata builders
  - Seller master data lookups
- [x] package.json with dependencies
- [ ] **Core Mapping Engine** (`src/engine.ts`) - **TODO**
- [ ] **Suggestion Engine** (`src/suggester.ts`) - **TODO**
- [ ] **Mapping Rules Configuration** (`src/rules.ts`) - **TODO**
- [ ] **Unit Tests** - **TODO**

## 🔄 In Progress

### Mapping Engine Core
**Remaining components:**

1. **`src/engine.ts`** - Core mapping orchestration
   - Execute curated mapping rules
   - Apply transformations
   - Generate mapping report
   - Calculate confidence scores
   - Identify unmapped/missing fields
   - Support dry-run mode

2. **`src/suggester.ts`** - Automatic field suggestion
   - Name similarity analysis
   - Token normalization
   - Business-term similarity
   - Structural context analysis
   - Sample value pattern matching

3. **`src/rules.ts`** - Curated mapping rules configuration
   - 100+ explicit mapping rules
   - Transformation function assignments
   - Semantic references to fcior/busdoc
   - Confidence levels

4. **`src/index.ts`** - Public API
   - `transformOrder(sapOrder, config)` - Main transform
   - `suggestMappings(sapOrder, schema)` - Suggestions
   - `validateMapping(result)` - Validation
   - `generateReport(result)` - Report generation

5. **Tests** (`__tests__/`)
   - Transformation function tests
   - Mapping rule tests
   - End-to-end transformation tests
   - Suggestion engine tests

## 📋 TODO (Priority Order)

### 1. Complete Mapping Engine (HIGH PRIORITY)
- [ ] Implement `src/engine.ts` - Core mapping orchestration
- [ ] Implement `src/suggester.ts` - Automatic suggestions
- [ ] Implement `src/rules.ts` - Mapping rules configuration
- [ ] Implement `src/index.ts` - Public API
- [ ] Write unit tests for transformations
- [ ] Write integration tests for full transformation
- [ ] Add lookup table configuration files (JSON)

### 2. Persistence Layer (HIGH PRIORITY)
**Location**: `packages/persistence/`

- [ ] **Database Schema** (`schema.sql`)
  ```sql
  CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL UNIQUE,
    import_timestamp TEXT NOT NULL,
    sap_payload TEXT NOT NULL,
    canonical_payload TEXT NOT NULL,
    canonical_context_version TEXT,
    canonical_profile TEXT,
    mapping_report TEXT,
    processing_status TEXT DEFAULT 'completed',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  ```

- [ ] **Repository Layer** (`src/repository.ts`)
  - `saveOrder(orderId, sapPayload, canonicalPayload, report)`
  - `getOrder(orderId)`
  - `listOrders(filter)`
  - `updateOrder(orderId, updates)`

- [ ] **Migration/Initialization** (`src/init.ts`)
  - Database initialization
  - Schema migration support
  - Seed data loader

- [ ] **Types** (`src/types.ts`)
  - Database record types
  - Query result types

### 3. API Application (MEDIUM PRIORITY)
**Location**: `apps/api/`

- [ ] **Express Server Setup** (`src/index.ts`)
  - Express app initialization
  - Middleware (CORS, JSON parsing, logging)
  - Error handling
  - Port configuration

- [ ] **API Routes** (`src/routes/`)
  - `POST /api/transform` - Transform SAP order
  - `POST /api/transform/dry-run` - Dry-run transformation with suggestions
  - `GET /api/orders` - List stored orders
  - `GET /api/orders/:id` - Get order by ID
  - `GET /api/orders/:id/sap` - Get SAP source
  - `GET /api/orders/:id/canonical` - Get canonical JSON-LD
  - `GET /api/orders/:id/report` - Get mapping report
  - `GET /api/health` - Health check
  - `GET /api/version` - Version info

- [ ] **Services** (`src/services/`)
  - `transformService.ts` - Wrapper for mapping engine
  - `storageService.ts` - Wrapper for persistence

- [ ] **OpenAPI Specification** (`docs/openapi.yaml`)

### 4. SHACL Validation Shapes (MEDIUM PRIORITY)
**Location**: `schemas/`

- [ ] **Complete SHACL Shapes** (`one-record-order-shapes.ttl`)
  - Executable SHACL constraints
  - Based on fcior profile
  - Cardinality constraints
  - Datatype constraints
  - Value constraints

- [ ] **Validation Engine Integration**
  - Optional SHACL validation in API
  - Validation report in mapping report

### 5. Frontend Application (LOW PRIORITY - Optional)
**Location**: `apps/web/`

- [ ] React/Vue/Svelte application
- [ ] Upload SAP Order JSON
- [ ] View transformation result
- [ ] Explore mapping report
- [ ] Side-by-side comparison
- [ ] Download canonical JSON-LD

### 6. Additional Documentation
- [ ] **`docs/mapping-strategy.md`** - Detailed mapping approach
- [ ] **`docs/demo-script.md`** - Step-by-step demo walkthrough
- [ ] **`docs/api-guide.md`** - API usage guide
- [ ] **`docs/deployment.md`** - Deployment instructions

### 7. Testing & Quality
- [ ] Unit tests for mapping engine (Jest)
- [ ] Integration tests for API (Supertest)
- [ ] SHACL validation tests
- [ ] End-to-end transformation tests
- [ ] Test coverage reports

### 8. CI/CD Enhancements
- [ ] Automated tests in GitHub Actions
- [ ] Build and publish Docker image
- [ ] Automated deployment (optional)

## File Structure

```
one-record/
├── packages/
│   ├── canonical-model/       ✅ COMPLETE
│   │   └── src/
│   │       ├── types.ts       (14KB - Full UBL Order types)
│   │       └── context.jsonld (13KB - fcior semantic bindings)
│   ├── sap-model/             ✅ COMPLETE
│   │   └── src/
│   │       └── types.ts       (12KB - SAP Order types)
│   ├── mapping-engine/        🔄 IN PROGRESS
│   │   ├── package.json       ✅
│   │   └── src/
│   │       ├── types.ts       ✅ (5.8KB)
│   │       ├── transformations.ts ✅ (12.2KB)
│   │       ├── engine.ts      ⏳ TODO
│   │       ├── suggester.ts   ⏳ TODO
│   │       ├── rules.ts       ⏳ TODO
│   │       └── index.ts       ⏳ TODO
│   └── persistence/           ⏳ TODO
│       ├── schema.sql
│       └── src/
│           ├── types.ts
│           ├── repository.ts
│           └── init.ts
├── apps/
│   └── api/                   ⏳ TODO
│       └── src/
│           ├── index.ts
│           ├── routes/
│           └── services/
├── samples/
│   ├── sap-order-001.json     ✅ (9KB)
│   └── one-record-order-001.jsonld ✅ (8.5KB)
├── docs/
│   ├── mapping-matrix.md          ✅ (15KB)
│   ├── sap-field-inventory.md     ✅ (19.6KB)
│   ├── correspondence-candidates.md ✅ (17KB)
│   ├── sap-source-model.md        ✅ (12.6KB)
│   ├── architecture/
│   │   └── README.md              ✅
│   └── FCIOR_DERIVATION.md        ✅
├── schemas/
│   ├── one-record-order-context.jsonld ✅
│   ├── one-record-order-shapes.ttl    🔄 Partial
│   └── fcior.ttl                      ✅
├── README.md                      ✅
├── DEMO_SUMMARY.md                ✅
├── LICENSE                        ✅
└── STATUS.md                      ✅ (This file)
```

## Statistics

- **Lines of Code**: ~3,300+ (and growing)
- **Documentation**: ~100KB of markdown docs
- **TypeScript Types**: ~32KB of type definitions
- **JSON-LD Context**: 13KB semantic bindings
- **Sample Data**: 17.5KB (SAP + Canonical)
- **Mapping Documentation**: 63.6KB (matrix + inventory + candidates + model)

## Next Session Goals

1. **Complete mapping engine core** (`engine.ts`, `suggester.ts`, `rules.ts`)
2. **Implement persistence layer** (SQLite schema + repository)
3. **Build API server** (Express + routes)
4. **Add unit tests**
5. **Test end-to-end transformation**

## Key Design Decisions

1. **Hybrid Mapping Strategy**: Curated rules + automatic suggestions
2. **Semantic Awareness**: Preserve fcior/busdoc URIs throughout mapping
3. **Explainability**: Every mapping includes rationale and confidence
4. **Dual Persistence**: Store both SAP source and canonical output
5. **Profile Versioning**: Track canonical profile version for evolution
6. **JSON-LD First**: Target is semantically grounded JSON-LD, not XML
7. **Transformation Traceability**: Field-level source→target linkage
8. **Dry-Run Mode**: Support mapping exploration without commitment

## Questions/Decisions Needed

None currently - design is clear and implementation is progressing.

---

**Ready for**: Mapping engine core implementation, persistence layer, and API server.
