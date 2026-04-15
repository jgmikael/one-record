# SAP Order Source Model Documentation

## Overview

This document describes the **SAP Order instance model** used in the One Record demo. This is **not** generic SAP documentation—it represents a specific SAP ECC 6.0 Sales Order structure tailored for the Finnish construction industry use case.

### Model Characteristics

- **SAP Version**: SAP ECC 6.0
- **Module**: SD (Sales & Distribution)
- **Document Type**: Sales Order (OR - Standard Order)
- **Industry**: Construction / Building Materials
- **Region**: Finland (Finnish language, EUR currency, FI country code)
- **Export Format**: JSON (derived from SAP tables/structures)

### Business Scenario

**Seller**: Rakennustarvike Oy (Building Materials Supplier)  
**Buyer**: Rakennusyhtiö Suomi Oy (Construction Company)  
**Project**: Espoo Tower Construction Site  
**Products**: Concrete (50 m³) + Steel Mesh (100 pieces)  
**Delivery**: Site delivery to Espoo construction site  
**Payment Terms**: Net 30 days  
**Total Value**: €15,500.00 (incl. 24% VAT)

## Document Structure

```
SAPOrder
├── OrderHeader                 (37 fields) - Core document data
├── PartnerFunctions            (4 partners, ~23 fields each)
│   ├── SoldToParty            (Customer - "AG")
│   ├── ShipToParty            (Delivery location - "WE")
│   ├── BillToParty            (Invoice recipient - "RE")
│   └── PayerParty             (Payer - "RG")
├── OrderItems[]                (2 items, ~60 fields each)
│   ├── Item                   (Item header)
│   ├── Material               (Material master data)
│   ├── Quantity               (Quantity and UoM data)
│   ├── Schedule               (Delivery schedule)
│   ├── Pricing                (Prices, taxes, values)
│   ├── Conditions[]           (Pricing conditions)
│   └── [Additional fields]    (Plant, WBS, etc.)
├── Totals                      (Header totals + tax breakdown)
├── Status                      (Processing status fields)
└── Metadata                    (System/audit information)
```

## SAP Table References

The model mirrors key SAP ECC tables:

| Section | SAP Tables | Description |
|---------|------------|-------------|
| OrderHeader | VBAK | Sales Document Header |
| PartnerFunctions | VBPA, KNA1, KNVV | Partner/Customer Master |
| OrderItems | VBAP | Sales Document Item |
| Material | MARA, MAKT | Material Master |
| Pricing | KONV | Condition Records |
| Schedule | VBEP | Sales Document Schedule |
| Status | VBUK | Sales Document Status |

**Note**: The JSON structure is a denormalized export; in SAP, this data lives across dozens of normalized tables.

## Field Naming Conventions

### SAP Field Names

SAP field names follow SAP conventions:

- **Technical Names**: UpperCamelCase matching SAP field names (e.g., `SalesDocument`, `MaterialNumber`)
- **SAP Codes**: Often 4-character codes (e.g., `VBELN`, `MATNR`, `WAERK`)
- **Suffixes**: `Date`, `Number`, `Type`, `Code` indicate data type/purpose

### Demo-Specific Fields

Some fields are **custom/derived** for the demo and don't exist as single SAP fields:

- `TotalNetAmount`, `TotalTaxAmount`, `TotalGrossAmount` - Calculated totals
- `CustomerReference`, `YourReference` - May map to text fields
- `MaterialDescriptionLong` - Extended text from material long text tables
- `Manufacturer` - Derived from material info records
- `ItemText` - Item-level text from text tables
- `Metadata.*` - System audit information (from various sources)

## Data Types

| SAP/Demo Type | Description | Example |
|---------------|-------------|---------|
| `string` | Character string | "4500012345" |
| `string(date)` | Date in YYYY-MM-DD | "2026-04-15" |
| `string(time)` | Time in HH:MM:SS | "10:30:00" |
| `string(datetime)` | ISO 8601 datetime | "2026-04-15T10:35:00Z" |
| `number` | Numeric (int or float) | 50, 120.00 |
| `array` | Array of objects | `OrderItems[]`, `Conditions[]` |
| `object` | Nested structure | `Quantity`, `Pricing` |

## Required vs. Optional Fields

### Always Required (Core Business Data)

- `OrderHeader.SalesDocument` - Primary key
- `OrderHeader.SalesDocumentType` - Document classification
- `OrderHeader.DocumentDate` - Business date
- `OrderHeader.DocumentCurrency` - Currency for all amounts
- `OrderHeader.SalesOrganization` - Organizational unit
- `PartnerFunctions.SoldToParty.*` - At minimum: CustomerNumber, Name1
- `OrderItems[].Item.ItemNumber` - Line identifier
- `OrderItems[].Material.MaterialNumber` - Product identifier
- `OrderItems[].Quantity.OrderQuantity` - Ordered quantity
- `OrderItems[].Quantity.SalesUnit` - Unit of measure
- `OrderItems[].Pricing.NetValue` - Line amount

### Commonly Populated (Typical Sales Order)

- Customer PO number
- Requested delivery date
- Payment terms
- Incoterms
- Ship-to party
- Bill-to party
- Material descriptions
- Prices and tax
- Item text/notes

### Optional/Conditional

- Sales office, sales group (organizational fields)
- Exchange rate (only for multi-currency)
- WBS element (only for project-related orders)
- Batch number (only for batch-managed materials)
- Serial numbers (only for serialized materials)
- Manufacturer fields (not all materials)
- Status fields (may be empty for new orders)

## Partner Function Codes

SAP uses **partner function codes** to identify party roles:

| Code | Function | Description | Required |
|------|----------|-------------|----------|
| `AG` | Sold-To Party | Customer/Buyer | Yes |
| `WE` | Ship-To Party | Delivery recipient | Typical |
| `RE` | Bill-To Party | Invoice recipient | Typical |
| `RG` | Payer | Payment responsible | Typical |

**Note**: Ship-to, Bill-to, and Payer often default to Sold-to if not explicitly set.

## Quantity and Unit of Measure

### SAP UoM Structure

SAP maintains complex unit-of-measure data:

- **SalesUnit** (`VRKME`): Unit used in sales (M3, PC, etc.)
- **BaseUnit** (`MEINS`): Base unit from material master
- **Conversion Factors**: Numerator/Denominator for conversion
- **ISO Codes**: SAP internal codes, may differ from UN/CEFACT

### Common SAP UoM Codes

| SAP Code | Meaning | UN/CEFACT Rec. 20 | Notes |
|----------|---------|-------------------|-------|
| `M3` | Cubic meter | `MTQ` | Volume |
| `PC` | Piece | `PCE` | Count |
| `KG` | Kilogram | `KGM` | Weight |
| `L` | Liter | `LTR` | Volume (liquid) |
| `M` | Meter | `MTR` | Length |
| `TO` | Metric ton | `TNE` | Weight (1000 kg) |

**Transformation Note**: Mapping to canonical Order requires converting SAP UoM codes to UN/CEFACT Recommendation 20 codes.

## Pricing and Tax Structure

### Condition Technique

SAP uses **condition technique** for flexible pricing:

- **Condition Types** (KSCHL): PR00 (Price), MWST (Tax), etc.
- **Condition Records**: Store pricing rules
- **Pricing Procedure**: Determines which conditions apply and in what order

### Tax Codes

SAP tax codes vary by country configuration. For Finland (demo):

| SAP Tax Code | Description | Rate | UBL Equivalent |
|--------------|-------------|------|----------------|
| `S1` | Standard VAT | 24% | `S` (Standard rate) |
| `S0` | Zero VAT | 0% | `Z` (Zero rated) |
| `E` | VAT Exempt | 0% | `E` (Exempt) |
| `AE` | Reverse Charge | 0% | `AE` (VAT Reverse Charge) |

### Amount Fields

Multiple amount fields exist at different levels:

**Header Level:**
- `TotalNetAmount` - Sum of all line net values
- `TotalTaxAmount` - Sum of all line taxes
- `TotalGrossAmount` - Net + Tax

**Line Level:**
- `NetPrice` - Price per unit (before tax)
- `NetValue` - Quantity × NetPrice (before tax)
- `TaxAmount` - Tax for this line
- `GrossValue` - NetValue + TaxAmount

## Material Classification

SAP uses multiple classification dimensions:

### Material Group (MATKL)

Single-level grouping:
- `CONCRETE` - Concrete products
- `STEEL` - Steel products
- `WOOD` - Wood products

### Product Hierarchy (PRODH)

Multi-level hierarchy (e.g., `001001001`):
- Level 1: `001` - Building Materials
- Level 2: `001001` - Concrete
- Level 3: `001001001` - Ready-Mix Concrete

### Material Groups 1/2/3 (MVGR1/2/3)

Additional flexible grouping dimensions:
- `MaterialGroup1`: `BUILDING` (Building construction)
- `MaterialGroup2`: `CONCRETE` (Product type)
- `MaterialGroup3`: `READYMIX` (Product sub-type)

**Note**: These are SAP-internal; mapping to canonical Order may use UBL `ItemClassification` or `CommodityClassification`.

## Date and Time Fields

### Date Formats

All dates in the demo use **ISO 8601 format** (`YYYY-MM-DD`):

- `DocumentDate`: "2026-04-15"
- `RequestedDeliveryDate`: "2026-04-25"

**Note**: Internally, SAP stores dates as `YYYYMMDD` (no hyphens); the demo JSON uses ISO 8601 for interoperability.

### Time Formats

Times use **ISO 8601 time** format (`HH:MM:SS`):

- `CreatedAtTime`: "10:30:00"

### Timestamps

Full timestamps use **ISO 8601 datetime** (`YYYY-MM-DDTHH:MM:SSZ`):

- `ExportTimestamp`: "2026-04-15T10:35:00Z"

## Status Fields

SAP maintains comprehensive document status across multiple dimensions:

| Status Field | Values | Meaning |
|--------------|--------|---------|
| `OverallStatus` | A, B, C | Overall processing (A=Not yet processed, B=Partially, C=Completely) |
| `DeliveryStatus` | Text | Delivery processing state |
| `BillingStatus` | Text | Billing/invoicing state |
| `CreditStatus` | Text | Credit check result |
| `BlockStatus` | Text | Delivery/billing blocks |

**Note**: Status fields represent **runtime processing state**, not part of the business order document itself. They are typically **not mapped** to canonical UBL Order.

## Metadata and Audit Fields

### System Information

- `SourceSystem`: SAP system identifier (e.g., "SAP_ECC_6.0")
- `SystemClient`: SAP client/tenant (e.g., "100")
- `LogicalSystem`: SAP logical system name

### Audit Trail

- `CreatedBy`: User who created the order
- `CreatedOn`: Creation date
- `CreatedAtTime`: Creation time
- `LastChangedBy`: User who last modified
- `LastChangedOn`: Last change date

### Export Context

- `DataOrigin`: Description of how data was extracted (e.g., "SD Sales Order Entry")
- `ExportTimestamp`: When this JSON was exported
- `TransactionCode`: SAP transaction used (e.g., "VA01" for create order)

## Differences from Generic SAP Documentation

This demo model **differs** from generic SAP structure:

1. **Denormalized**: Single JSON document vs. normalized SAP tables
2. **Simplified Partner Structure**: 4 partners vs. unlimited in SAP
3. **Calculated Totals**: Explicit header totals vs. on-the-fly calculation
4. **Readable Field Names**: UpperCamelCase vs. SAP technical names
5. **No Variant Configurations**: Fixed structure vs. configurable SAP
6. **Finnish Context**: Specific to Finland (language, tax, UoM)
7. **Construction Industry**: Material types, WBS elements specific to construction
8. **No Hierarchies**: Flat items vs. SAP item hierarchies (BOM, configs)

## Usage in Mapping

When mapping to One Record canonical Order:

### Direct Mappings

Fields that map 1:1 to canonical:
- Document numbers, dates, currency
- Party identifiers and names
- Material identifiers and descriptions
- Quantities and prices
- Tax rates and amounts

### Transformations Required

Fields needing transformation:
- **SAP UoM → UN/CEFACT codes**: M3 → MTQ, PC → PCE
- **SAP tax codes → UBL codes**: S1 → S
- **SAP doc type → UBL order type**: OR → 220
- **SAP payment terms → text**: ZN30 → "Net 30 days"
- **Address construction**: Composite fullAddress from parts

### Lookups/Config Required

Fields needing external data:
- **Seller party information**: Sales org → company name/address (from config)
- **UBL order type codes**: SAP type → UBL mapping table
- **Payment terms text**: SAP code → description lookup
- **Tax scheme names**: Usually "VAT" for EU, but configurable

### Not Mapped

SAP-internal fields excluded from canonical:
- Sales office, sales group, division (org structure)
- Plant, storage location (logistics)
- Profit center, cost center (controlling)
- Processing status fields (runtime state)
- Most material group dimensions (internal classification)

## Sample Values

See `samples/sap-order-001.json` for a complete example with realistic values.

## References

- SAP SD (Sales & Distribution) module documentation
- SAP Table: VBAK, VBAP, VBPA, KONV, KNA1, MARA
- Finnish construction industry business practices
- Finnish Tax Administration (Verohallinto) guidelines for invoicing/ordering

---

**For mapping details**, see:
- [SAP Field Inventory](./sap-field-inventory.md) - Complete field list
- [Correspondence Candidates](./correspondence-candidates.md) - SAP → Canonical mappings
- [Mapping Matrix](./mapping-matrix.md) - Transformation rules
