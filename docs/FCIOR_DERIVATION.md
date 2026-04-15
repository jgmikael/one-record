# fcior Order Subset Derivation

## Background

The **fcior** (Finnish Construction Industry One Record) model at https://iri.suomi.fi/model/fcior/ is declared as an application profile covering multiple UBL 2.4 document types:

- Catalogue
- Catalogue Response
- **Order** ← *This demo's focus*
- Order Response
- Despatch Advice
- Invoice

## Source Material

### Retrieved fcior Metadata

The Turtle file retrieved from Tietomallit.suomi.fi contains:

```turtle
fcior:  rdf:type  suomi-meta:ApplicationProfile , owl:Ontology;
        rdfs:comment  "Compilation of the following UBL 2.4 documents:
                       Catalogue, Catalogue response, Order,
                       Order response, Despatch advice, Invoice"@en;
        dcterms:requires  busdoc:;
        owl:imports  <https://vocabulary.uncefact.org/>;
```

**Key findings:**

1. fcior is an **application profile** (not a full executable vocabulary with all shapes)
2. It **requires** the `busdoc` vocabulary (https://iri.suomi.fi/model/busdoc/)
3. It **imports** UN/CEFACT vocabularies
4. The retrieved file contains **metadata only** - no complete SHACL shapes for Order

### busdoc Vocabulary

From previous work (realdigitalization project), we know:

- busdoc is a Finnish business document vocabulary
- Version 1.0.2 at https://iri.suomi.fi/model/busdoc/
- Provides semantic properties for business documents
- Used as base for fcior Order semantics

## Derivation Method

Since the retrieved fcior Turtle contains only metadata without full SHACL node/property shapes, this demo derives a **pragmatic Order subset** as follows:

### 1. UBL 2.4 Order Structure (Base)

Reference: OASIS UBL 2.4 Order specification

Core elements:
- Order Identification (`ID`, `IssueDate`, `OrderTypeCode`)
- Buyer & Seller Parties
- Delivery information
- Payment terms
- Order Lines (with Items and Pricing)
- Monetary Totals
- Tax Totals

### 2. busdoc Semantic Mappings

UBL elements mapped to busdoc vocabulary properties:

| UBL 2.4 Element | busdoc Property |
|-----------------|-----------------|
| `cbc:ID` | `busdoc:identificationID` |
| `cbc:IssueDate` | `busdoc:issueDate` |
| `cbc:BuyerReference` | `busdoc:buyerReference` |
| `cbc:DocumentCurrencyCode` | `busdoc:documentCurrencyCode` |
| `cac:BuyerCustomerParty` | `busdoc:buyerCustomerParty` |
| `cac:SellerSupplierParty` | `busdoc:sellerSupplierParty` |
| `cac:Delivery/DeliveryLocation` | `busdoc:deliveryLocation` |
| `cac:OrderLine` | `busdoc:orderLine` |
| `cac:LegalMonetaryTotal` | `busdoc:legalMonetaryTotal` |
| `cac:TaxTotal` | `busdoc:taxTotal` |

*Full mappings: see `schemas/one-record-order-context.jsonld`*

### 3. SHACL Shapes (Pragmatic Subset)

Created SHACL shapes for Order validation based on:

1. **UBL 2.4 Order cardinalities** (required vs. optional)
2. **busdoc property definitions** (datatypes, ranges)
3. **Common construction industry needs** (Finnish context)

Example shape:

```turtle
fcior:OrderShape
    a sh:NodeShape ;
    sh:targetClass fcior:Order ;
    sh:property [
        sh:path busdoc:identificationID ;
        sh:datatype xsd:string ;
        sh:minCount 1 ;    # Required
        sh:maxCount 1 ;    # Single value
    ] .
```

*Complete shapes: see `schemas/one-record-order-shapes.ttl`*

### 4. JSON-LD Context

Created `@context` mapping JSON keys to semantic IRIs:

```json
{
  "@context": {
    "@vocab": "https://iri.suomi.fi/model/fcior#",
    "busdoc": "https://iri.suomi.fi/model/busdoc/",
    "orderNumber": {
      "@id": "busdoc:identificationID",
      "@type": "xsd:string"
    },
    ...
  }
}
```

This enables JSON-LD processing while maintaining JSON simplicity.

## Alignment with fcior

### What We Know from fcior

- fcior covers UBL 2.4 Order ✓
- fcior requires busdoc ✓  
- fcior is an application profile ✓
- fcior imports UN/CEFACT ✓

### What This Demo Implements

1. **Order document structure** aligned with UBL 2.4 Order
2. **Semantic properties** using busdoc vocabulary
3. **SHACL shapes** for Order validation (derived subset)
4. **JSON-LD serialization** with fcior namespace
5. **Metadata traceability** linking to source systems

### Extensibility

The implementation is **designed for easy extension** when complete fcior shapes become available:

- **Modular shapes**: Each entity (Party, Address, OrderLine) has its own shape
- **Pluggable validation**: SHACL engine can be swapped/updated
- **Namespace ready**: Uses `fcior:` prefix throughout
- **Import structure**: References busdoc and can import full fcior when available

## Assumptions & Limitations

### Assumptions

1. **UBL Order semantics** are representative of fcior Order intent
2. **busdoc properties** are the preferred vocabulary for business document elements
3. **Construction industry focus** informs which optional fields are included
4. **JSON-LD format** is acceptable (fcior doesn't mandate XML)

### Known Limitations

1. **Incomplete fcior coverage**: Only Order subset, not full multi-document profile
2. **Shapes not official**: Derived SHACL shapes may differ from future fcior releases
3. **No UN/CEFACT import**: Not directly importing UN/CEFACT BSP (simplification)
4. **Finnish-specific**: Some assumptions based on Finnish construction industry

### Migration Path

When complete fcior Order shapes are published:

1. **Fetch updated fcior Turtle** with full SHACL definitions
2. **Compare with current shapes** - identify differences
3. **Update SHACL shapes** to match fcior specification
4. **Re-validate existing documents** against new shapes
5. **Update documentation** with official references

The mapping engine and storage are **agnostic to specific shapes** - they work with any valid JSON-LD Order structure.

## Verification

To verify fcior alignment:

1. **Check fcior updates**: Monitor https://iri.suomi.fi/model/fcior/ for new versions
2. **Validate against busdoc**: All properties are valid busdoc references
3. **Compare with UBL 2.4**: Structure matches UBL Order model
4. **Test with real data**: SAP Orders → One Record transformations succeed
5. **Semantic query**: JSON-LD can be expanded to RDF triples

## References

- fcior model: https://iri.suomi.fi/model/fcior/
- busdoc vocabulary: https://iri.suomi.fi/model/busdoc/  
- UBL 2.4 Order: http://docs.oasis-open.org/ubl/os-UBL-2.4/xsd/maindoc/UBL-Order-2.4.xsd
- Tietomallit.suomi.fi: https://tietomallit.suomi.fi/model/fcior
- UN/CEFACT: https://vocabulary.uncefact.org/

## Contact

For questions about fcior model itself:
- **Maintainer**: Verohallinto (Finnish Tax Administration)
- **Contact**: yhteentoimivuus@dvv.fi

For questions about this derivation:
- **Author**: Mikael af Hällström
- **GitHub**: https://github.com/jgmikael/one-record
