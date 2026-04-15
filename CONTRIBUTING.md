# Contributing to One Record Demo

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Git
- Basic understanding of TypeScript
- Familiarity with semantic web concepts (JSON-LD, RDF) is helpful

### Setup Development Environment

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/one-record.git
cd one-record

# Add upstream remote
git remote add upstream https://github.com/jgmikael/one-record.git

# Install dependencies and build
npm run setup

# Start development server
npm run dev
```

## Development Workflow

### 1. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout master
git merge upstream/master

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

#### Code Style

- Use TypeScript for all new code
- Follow existing code style and conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

#### Code Organization

```
packages/
  - Pure TypeScript packages with no side effects
  - Each package should be independently usable
  - Export clear public APIs via index.ts

apps/
  - Application entry points
  - Can depend on packages
  - Minimal business logic (use services)
```

#### Mapping Rules

When adding new mapping rules to `packages/mapping-engine/src/rules.ts`:

```typescript
{
  sourcePath: 'SAP.field.path',
  targetPath: 'canonical.field.path',
  targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#property',
  mappingType: 'rule', // or 'transformed', 'calculated'
  confidence: 'HIGH',  // or 'MEDIUM', 'LOW'
  transformFunction: 'functionName', // if needed
  rationale: 'Clear explanation of why this mapping exists',
  required: true, // if target field is mandatory
}
```

#### Transformation Functions

When adding transforms to `packages/mapping-engine/src/transformations.ts`:

```typescript
export const yourTransform: TransformFunction = (ctx) => {
  const value = ctx.sourceValue;
  // Transformation logic
  return transformedValue;
};

// Add to export object
export const transformFunctions = {
  // ...
  yourTransform,
};
```

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=@one-record/mapping-engine

# Run tests in watch mode
npm test -- --watch

# Manual testing
npm start
# Test in browser: http://localhost:3001
```

### 4. Update Documentation

If your changes affect:

- **API**: Update README.md § API Documentation
- **Mapping rules**: Update docs/mapping-matrix.md
- **New features**: Update README.md § Features
- **Configuration**: Update .env.example
- **Breaking changes**: Document in commit message

### 5. Commit Changes

Use clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "Add Invoice document type transformation"
git commit -m "Fix UoM conversion for metric tons (TO → TNE)"
git commit -m "Update mapping confidence calculation algorithm"

# Include details in body
git commit -m "Add SHACL validation execution

- Implement shacl-js integration
- Add validation report generation
- Update API endpoint to include validation results
- Add tests for validation engine"
```

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create PR on GitHub
# - Clear title describing the change
# - Reference any related issues
# - Describe what was changed and why
# - Include testing instructions
```

## Areas for Contribution

### High Priority

1. **Additional Document Types**
   - Invoice (EN 16931-1 compliant)
   - Despatch Advice
   - Order Response
   - Receipt Advice

2. **W3C Verifiable Credentials**
   - DID management
   - Ed25519 signature generation
   - Proof verification

3. **SHACL Validation**
   - Execute SHACL shapes
   - Generate validation reports
   - Integrate into API

4. **Test Coverage**
   - Unit tests for transformations
   - Integration tests for API
   - E2E tests with Playwright

### Medium Priority

5. **Real SAP Integration**
   - SAP OData connector
   - SAP RFC adapter
   - IDoc parser

6. **PostgreSQL Backend**
   - Replace SQLite
   - Migration scripts
   - Connection pooling

7. **Authentication**
   - JWT-based auth
   - API key management
   - Role-based access control

8. **Performance**
   - Batch transformation
   - Async processing queue
   - Caching layer

### Low Priority

9. **UI Enhancements**
   - React/Vue rewrite
   - Visual mapping editor
   - Interactive configuration

10. **Additional Vocabularies**
    - Support for other ontologies
    - Custom vocabulary management
    - Vocabulary version management

## Code Review Process

### What Reviewers Look For

- **Correctness**: Does it solve the stated problem?
- **Tests**: Are there tests covering the changes?
- **Documentation**: Is it documented appropriately?
- **Code Quality**: Is it readable and maintainable?
- **Semantic Correctness**: Do mappings preserve business meaning?
- **Performance**: Any performance implications?

### Review Timeline

- Initial review: Within 3-5 days
- Follow-up: Within 1-2 days after updates
- Merge: After approval from at least one maintainer

## Testing Guidelines

### Unit Tests

```typescript
describe('YourFeature', () => {
  test('should handle normal case', () => {
    const result = yourFunction(input);
    expect(result).toEqual(expected);
  });

  test('should handle edge case', () => {
    const result = yourFunction(edgeCase);
    expect(result).toBeDefined();
  });

  test('should handle errors gracefully', () => {
    expect(() => yourFunction(invalid)).toThrow();
  });
});
```

### Integration Tests

```typescript
describe('API Integration', () => {
  test('POST /api/orders/import/sap', async () => {
    const response = await request(app)
      .post('/api/orders/import/sap')
      .send(sapOrder);

    expect(response.status).toBe(201);
    expect(response.body.order_id).toBeDefined();
  });
});
```

## Documentation Guidelines

### Code Comments

```typescript
/**
 * Transform SAP unit of measure codes to UN/CEFACT Rec. 20 codes
 * 
 * @param ctx - Transformation context containing source value
 * @returns UN/CEFACT unit code (e.g., M3 → MTQ)
 * 
 * @example
 * sapUoMToUNCEFACT({ sourceValue: 'M3', ... }) // returns 'MTQ'
 */
export const sapUoMToUNCEFACT: TransformFunction = (ctx) => {
  // Implementation
};
```

### README Updates

- Keep examples up to date
- Update version numbers
- Add new features to feature list
- Update screenshots if UI changes

## Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Run full test suite
4. Create git tag
5. Push to GitHub
6. Create GitHub release with notes

## Getting Help

- **Documentation**: See README.md and /docs
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Questions**: Tag with `question` label

## Code of Conduct

Be respectful and constructive:

- Be welcoming to newcomers
- Provide constructive feedback
- Focus on the code, not the person
- Assume good intentions
- Help others learn

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:
- Listed in the contributors section
- Mentioned in release notes
- Credited in relevant documentation

---

**Thank you for contributing to One Record!** 🎉
