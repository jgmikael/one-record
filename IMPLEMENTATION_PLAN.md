# One Record Demo - Implementation Plan

## Current Status: Foundation Complete ✅

**Completed:**
- Canonical model types + JSON-LD context
- SAP model types
- Sample data (SAP + canonical)
- Comprehensive documentation (63KB+)
- Transformation functions (25+)
- Mapping rules configuration (60+ rules)

## Remaining Work (Estimated: 8-12 hours)

### Phase 1: Mapping Engine Core (2-3 hours)
- [ ] `packages/mapping-engine/src/engine.ts` - Core orchestration
- [ ] `packages/mapping-engine/src/suggester.ts` - Auto-suggestion engine
- [ ] `packages/mapping-engine/src/index.ts` - Public API
- [ ] `packages/mapping-engine/src/config.ts` - Default config
- [ ] Tests for mapping engine

### Phase 2: Persistence Layer (1-2 hours)
- [ ] `packages/persistence/schema.sql` - SQLite schema
- [ ] `packages/persistence/src/types.ts` - DB types
- [ ] `packages/persistence/src/repository.ts` - Repository layer
- [ ] `packages/persistence/src/init.ts` - DB initialization
- [ ] `packages/persistence/src/index.ts` - Public API
- [ ] Tests for persistence

### Phase 3: Backend API (2-3 hours)
- [ ] `apps/api/src/index.ts` - Express server
- [ ] `apps/api/src/routes/` - All REST endpoints
- [ ] `apps/api/src/services/` - Business logic
- [ ] `apps/api/src/middleware/` - Validation, error handling
- [ ] `apps/api/src/config.ts` - Configuration
- [ ] OpenAPI spec
- [ ] Tests for API

### Phase 4: Frontend UI (2-3 hours)
- [ ] `apps/web/` - React + TypeScript setup
- [ ] Orders list view
- [ ] SAP source viewer
- [ ] Canonical JSON-LD viewer
- [ ] Mapping report viewer
- [ ] Side-by-side comparison
- [ ] Import/navigation features

### Phase 5: Documentation & Polish (1-2 hours)
- [ ] Complete README with architecture diagram
- [ ] Demo script (5-minute walkthrough)
- [ ] Screenshots and visual assets
- [ ] Contribution guide
- [ ] Release checklist
- [ ] GitHub issue templates

### Phase 6: Quality Audit & Fixes (1-2 hours)
- [ ] Fix broken imports
- [ ] Complete code stubs
- [ ] Consistent naming
- [ ] Missing tests
- [ ] API/UI alignment
- [ ] Sample data validation
- [ ] Startup friction fixes
- [ ] End-to-end testing

## Simplified Approach (Pragmatic for Demo)

Given time constraints, I'll implement a **production-quality foundation** with **demo-suitable simplifications**:

### Simplifications:
1. **Frontend**: Simple HTML/CSS/JS instead of full React app (faster, no build step)
2. **Tests**: Focus on critical path tests, defer comprehensive coverage
3. **Suggestion Engine**: Basic name similarity instead of full NLP
4. **Validation**: Input validation only, defer SHACL for later
5. **Line Items**: Handle array mapping with simplified iteration

### Must-Haves (Non-Negotiable):
1. ✅ Complete mapping engine with explainability
2. ✅ Dual persistence (SAP + canonical)
3. ✅ Full REST API with all endpoints
4. ✅ Working UI for visualization
5. ✅ Comprehensive documentation
6. ✅ End-to-end demo flow works

## Implementation Order

**NOW** (Next 4 hours):
1. Complete mapping engine (engine.ts, suggester.ts, index.ts)
2. Implement persistence layer
3. Build backend API
4. Create minimal working UI

**THEN** (Next 2 hours):
5. Polish documentation
6. Add screenshots
7. Demo script
8. Quality audit

**DEFER** (Post-demo, documented as "Next Steps"):
- Full test coverage (keep critical tests only)
- Advanced suggestion algorithms
- SHACL validation
- React frontend (use simple HTML/JS for demo)
- Additional document types (Invoice, etc.)

## Success Criteria

A developer should be able to:
1. Clone the repo
2. Run `npm install`
3. Run `npm start` (starts API)
4. Open `http://localhost:3000`
5. Import the sample SAP order
6. See transformation result
7. Explore mapping report
8. Understand what happened and why

## File Count Estimate

**Total New Files**: ~35-40 files
- Mapping engine: 5 files
- Persistence: 5 files
- Backend API: 12 files
- Frontend: 8 files
- Documentation: 6 files
- Tests: 6 files

## Let's Build! 🚀

Starting with mapping engine core...
