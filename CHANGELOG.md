# Changelog

All notable changes to the One Record demo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-16

### Added

#### Core Functionality
- Complete SAP Order to fcior-aligned Canonical Order transformation engine
- 60+ curated mapping rules with semantic references
- 25+ transformation functions (dates, codes, UoM, composite)
- Automatic field suggestion engine (name similarity, business terms)
- Dual persistence layer (SAP source + canonical JSON-LD)
- Explainable mappings with confidence scores and rationale
- W3C Verifiable Credentials compatible structure

#### API
- Express REST API with 10 endpoints
- POST /api/orders/import/sap - Import and transform
- GET /api/orders - List orders
- GET /api/orders/:id - Get order summary
- GET /api/orders/:id/source - Get SAP source
- GET /api/orders/:id/canonical - Get canonical JSON-LD
- GET /api/orders/:id/mapping-report - Get mapping report
- POST /api/mappings/suggest - Get mapping suggestions
- GET /api/health - Health check
- GET /api/version - Version and semantic info
- DELETE /api/orders/:id - Delete order
- JSON-LD content negotiation
- HATEOAS links
- Validation and error handling

#### UI
- Complete URL-routed single-page application
- Hash-based navigation (#import, #viewer/{id}, #comparison/{id})
- Query parameters (?sample=true, ?view=canonical)
- Browser back/forward support
- Auto-redirect after import
- Import tab with sample auto-load
- Orders list view
- Viewer for source/canonical/report
- Side-by-side comparison
- Download JSON buttons
- Copy to clipboard
- Toast notifications
- Responsive design

#### Packages
- @one-record/canonical-model - fcior-aligned Order types + JSON-LD context
- @one-record/sap-model - SAP ECC 6.0 Order types (180+ fields)
- @one-record/mapping-engine - Transformation engine with tests
- @one-record/persistence - SQLite dual storage

#### Documentation
- README.md (21KB) - Complete guide
- QUICKSTART.md (3.7KB) - 5-minute setup
- DEMO_WALKTHROUGH.md (6KB) - Step-by-step demo
- URL_DEMO_GUIDE.md (8.5KB) - URL-based navigation reference
- FINAL_SUMMARY.md (17.3KB) - Architecture overview
- DELIVERABLE.md (16.3KB) - Project summary
- INSTALLATION_VERIFICATION.md (6.9KB) - Testing checklist
- CONTRIBUTING.md (7.6KB) - Contribution guidelines
- docs/mapping-matrix.md (15KB) - 100+ field mappings
- docs/sap-field-inventory.md (19.6KB) - Complete SAP field catalog
- docs/correspondence-candidates.md (17KB) - Mapping analysis
- docs/sap-source-model.md (12.6KB) - SAP architecture documentation
- docs/RELEASE_CHECKLIST.md (7.7KB) - Pre-release verification
- Mermaid architecture diagrams

#### Sample Data
- Realistic SAP Order (Finnish construction industry, 9KB)
- Canonical JSON-LD output (8.5KB)
- Complete fcior/busdoc semantic grounding

#### Infrastructure
- npm workspaces monorepo structure
- TypeScript compilation
- Automated setup scripts (setup.sh, postinstall.js)
- Jest testing framework
- Docker support (Dockerfile, docker-compose.yml)
- Environment configuration (.env.example)
- Git configuration (.gitignore, .dockerignore)
- GitHub Actions CI/CD template
- 10 test cases for mapping engine

#### Semantic Vocabularies
- fcior (Finnish Construction Industry One Record) integration
- busdoc (Finnish Business Document Vocabulary) integration
- JSON-LD context with vocabulary URIs
- SHACL shapes defined (execution not implemented)

### Technical Details

#### Mapping Statistics
- 60+ curated mapping rules
- 95% average confidence on realistic data
- 70 HIGH confidence mappings
- 15 MEDIUM confidence mappings
- 0 LOW confidence mappings
- Field-level traceability for all mappings

#### Code Statistics
- ~30,000 lines of TypeScript code
- ~140KB documentation
- 75 files
- 4 packages
- 2 applications
- 18 git commits

### Known Limitations

#### Intentionally Out of Scope (v1.0)
- Cryptographic signatures (structure is VC-ready)
- SHACL validation execution (shapes defined)
- Authentication/authorization
- Real SAP OData/RFC integration
- Seller master data lookups (hardcoded config)
- Multi-tenancy
- Comprehensive test coverage
- Production database (PostgreSQL)

#### Technical Constraints
- SQLite only (not suitable for high-volume production)
- Single document type (Order only)
- Finnish/EU context (VAT assumptions)
- SAP ECC 6.0 structure (not S/4HANA)
- No multi-currency support
- No complex item hierarchies

### Dependencies

#### Runtime
- Node.js 18+
- Express 4.18+
- better-sqlite3 9.2+
- lodash 4.17+
- string-similarity 4.0+

#### Development
- TypeScript 5.0+
- Jest 29.5+
- ts-jest 29.1+
- ts-node 10.9+

## [Unreleased]

### Planned Features

#### v1.1.0 (Next Minor)
- Invoice document type transformation (EN 16931-1 compliant)
- SHACL validation execution
- Improved test coverage (>80%)
- PostgreSQL backend option
- JSON Schema validation for SAP input

#### v1.2.0
- Despatch Advice document type
- Order Response document type
- W3C VC signature generation (Ed25519)
- DID management

#### v2.0.0 (Future Major)
- Real SAP OData integration
- Authentication/authorization (JWT)
- Multi-tenancy support
- Event-driven architecture
- GraphQL API
- React frontend rewrite
- Horizontal scaling support

### Under Consideration
- Additional vocabularies (beyond fcior/busdoc)
- Machine learning for mapping suggestions
- Visual mapping editor
- Batch transformation processing
- Webhook support
- API versioning
- Rate limiting
- Monitoring/metrics (Prometheus)

---

## Version Numbering

- **MAJOR**: Breaking changes, incompatible API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

## Release Notes Format

Each release includes:
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features marked for removal
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

---

**Current Version**: 1.0.0  
**Release Date**: 2026-04-16  
**Status**: Production-ready proof-of-concept
