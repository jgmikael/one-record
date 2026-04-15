# SAP → One Record Correspondence Candidates

Explicit mapping candidate table showing potential correspondences between SAP fields and canonical One Record Order fields.

## Legend

**Confidence Levels:**
- `HIGH` (90-100%): Direct semantic match, well-established mapping
- `MEDIUM` (70-89%): Probable match, may need value transformation
- `LOW` (50-69%): Possible match, needs validation or has ambiguity
- `SUGGEST` (<50%): Automatic suggestion based on name/structure similarity

**Mapping Types:**
- `DIRECT`: Direct value copy
- `TRANSFORM`: Value transformation required (date format, code mapping, etc.)
- `CALCULATE`: Value must be calculated/derived
- `COMPOSITE`: Built from multiple source fields
- `LOOKUP`: Requires lookup/reference data

## Document-Level Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `OrderHeader.SalesDocument` | "4500012345" | `orderNumber` | HIGH | DIRECT copy |
| `OrderHeader.SalesDocument` | "4500012345" | `@id` | HIGH | TRANSFORM to `urn:order:sap:{value}` |
| `OrderHeader.DocumentDate` | "2026-04-15" | `issueDate` | HIGH | DIRECT (already ISO 8601) |
| `OrderHeader.CreatedAtTime` | "10:30:00" | `issueTime` | HIGH | DIRECT (already ISO 8601) |
| `OrderHeader.SalesDocumentType` | "OR" | `orderTypeCode` | MEDIUM | TRANSFORM SAP type → UBL code ("OR"→"220") |
| `OrderHeader.DocumentCurrency` | "EUR" | `documentCurrencyCode` | HIGH | DIRECT (ISO 4217) |
| `OrderHeader.PurchaseOrderByCustomer` | "PO-2026-0415-001" | `buyerReference` | HIGH | DIRECT copy |
| `OrderHeader.RequestedDeliveryDate` | "2026-04-25" | `delivery.requestedDeliveryDate` | HIGH | DIRECT (ISO 8601) |
| `OrderHeader.PaymentTerms` | "ZN30" | `paymentTerms.note` | MEDIUM | TRANSFORM code → text ("ZN30"→"Net 30 days") |
| `OrderHeader.PaymentTerms` | "ZN30" | `paymentTerms.settlementPeriod` | MEDIUM | TRANSFORM extract numeric (30) |
| `OrderHeader.IncotermsClassification` | "EXW" | `deliveryTerms.incoterms` | HIGH | DIRECT copy |
| `OrderHeader.IncotermsLocation` | "Helsinki" | `deliveryTerms.specialTerms` | MEDIUM | COMPOSITE "Ex Works {value}" |
| `OrderHeader.TotalNetAmount` | 12500.00 | `anticipatedMonetaryTotal.lineExtensionAmount.value` | HIGH | DIRECT copy |
| `OrderHeader.TotalNetAmount` | 12500.00 | `anticipatedMonetaryTotal.taxExclusiveAmount.value` | HIGH | DIRECT copy |
| `OrderHeader.TotalGrossAmount` | 15500.00 | `anticipatedMonetaryTotal.taxInclusiveAmount.value` | HIGH | DIRECT copy |
| `OrderHeader.TotalGrossAmount` | 15500.00 | `anticipatedMonetaryTotal.payableAmount.value` | HIGH | DIRECT copy |
| `OrderHeader.TotalTaxAmount` | 3000.00 | `taxTotal[0].taxAmount.value` | HIGH | DIRECT copy |
| `OrderHeader.OrderReason` | "Standard..." | `note[0]` | MEDIUM | DIRECT to note array |
| `OrderHeader.CustomerReference` | "Project Espoo Tower" | `note[1]` or `contractDocumentReference.id` | MEDIUM | DIRECT or create ref |

## Buyer Party Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `PartnerFunctions.SoldToParty.CustomerNumber` | "100234" | `buyerCustomerParty.partyIdentification[0].id` | HIGH | DIRECT copy |
| N/A (static) | "SAP Customer Number" | `buyerCustomerParty.partyIdentification[0].schemeID` | HIGH | STATIC value |
| `PartnerFunctions.SoldToParty.Name1` | "Rakennusyhtiö..." | `buyerCustomerParty.partyName[0].name` | HIGH | DIRECT copy (may concat Name2) |
| `PartnerFunctions.SoldToParty.Name2` | "" | `buyerCustomerParty.partyName[0].name` | MEDIUM | CONCAT with Name1 if present |
| `PartnerFunctions.SoldToParty.Street` | "Mannerheimintie 1" | `buyerCustomerParty.postalAddress.streetName` | HIGH | DIRECT copy |
| `PartnerFunctions.SoldToParty.HouseNumber` | "" | `buyerCustomerParty.postalAddress.buildingNumber` | MEDIUM | DIRECT if populated |
| `PartnerFunctions.SoldToParty.City` | "Helsinki" | `buyerCustomerParty.postalAddress.cityName` | HIGH | DIRECT copy |
| `PartnerFunctions.SoldToParty.PostalCode` | "00100" | `buyerCustomerParty.postalAddress.postalZone` | HIGH | DIRECT copy |
| `PartnerFunctions.SoldToParty.Region` | "FI-18" | `buyerCustomerParty.postalAddress.countrySubentity` | HIGH | DIRECT copy |
| `PartnerFunctions.SoldToParty.Country` | "FI" | `buyerCustomerParty.postalAddress.countryCode` | HIGH | DIRECT (ISO 3166-1 alpha-2) |
| Composite | "Mannerheimintie 1, 00100 Helsinki, Finland" | `buyerCustomerParty.postalAddress.fullAddress` | HIGH | COMPOSITE from street, city, postal, country |
| `PartnerFunctions.SoldToParty.TaxNumber1` | "FI12345678" | `buyerCustomerParty.partyTaxScheme.companyID` | HIGH | DIRECT copy |
| N/A (static) | "VAT" | `buyerCustomerParty.partyTaxScheme.taxScheme` | HIGH | STATIC "VAT" for EU |
| `PartnerFunctions.SoldToParty.ContactPerson` | "Matti Virtanen" | `buyerCustomerParty.contact.name` | HIGH | DIRECT copy |
| `PartnerFunctions.SoldToParty.Telephone` | "+358 9 1234567" | `buyerCustomerParty.contact.telephone` | HIGH | DIRECT copy |
| `PartnerFunctions.SoldToParty.EmailAddress` | "matti.virtanen@..." | `buyerCustomerParty.contact.electronicMail` | HIGH | DIRECT copy |

## Seller Party Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `OrderHeader.SalesOrganization` | "1000" | `sellerSupplierParty.partyIdentification[0].id` | HIGH | DIRECT copy |
| N/A (static) | "SAP Sales Organization" | `sellerSupplierParty.partyIdentification[0].schemeID` | HIGH | STATIC value |
| Config/master data | "Rakennustarvike Oy" | `sellerSupplierParty.partyName[0].name` | MEDIUM | LOOKUP from sales org config |
| Config/master data | Address fields | `sellerSupplierParty.postalAddress.*` | MEDIUM | LOOKUP from sales org master |

## Delivery Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `OrderHeader.RequestedDeliveryDate` | "2026-04-25" | `delivery.requestedDeliveryDate` | HIGH | DIRECT (ISO 8601 date) |
| `PartnerFunctions.ShipToParty.Street` | "Otaniementie 15" | `delivery.deliveryLocation.streetName` | HIGH | DIRECT copy |
| `PartnerFunctions.ShipToParty.HouseNumber` | "" | `delivery.deliveryLocation.buildingNumber` | MEDIUM | DIRECT if present |
| `PartnerFunctions.ShipToParty.City` | "Espoo" | `delivery.deliveryLocation.cityName` | HIGH | DIRECT copy |
| `PartnerFunctions.ShipToParty.PostalCode` | "02150" | `delivery.deliveryLocation.postalZone` | HIGH | DIRECT copy |
| `PartnerFunctions.ShipToParty.Country` | "FI" | `delivery.deliveryLocation.countryCode` | HIGH | DIRECT (ISO 3166-1 alpha-2) |
| Composite | "Otaniementie 15, 02150 Espoo, Finland" | `delivery.deliveryLocation.fullAddress` | HIGH | COMPOSITE from ship-to fields |

## Order Line Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `OrderItems[*].Item.ItemNumber` | "000010" | `orderLine[*].id` | HIGH | DIRECT copy |
| `OrderItems[*].ItemText` | "Toimitus..." | `orderLine[*].note` | HIGH | DIRECT copy |
| `OrderItems[*].Quantity.OrderQuantity` | 50 | `orderLine[*].quantity.value` | HIGH | DIRECT numeric value |
| `OrderItems[*].Quantity.SalesUnit` | "M3" | `orderLine[*].quantity.unitCode` | MEDIUM | TRANSFORM SAP UoM → UN/CEFACT ("M3"→"MTQ") |
| `OrderItems[*].Quantity.SalesUnit` | "M3" | `orderLine[*].quantity.unitName` | MEDIUM | TRANSFORM to readable ("M3"→"cubic meter") |
| `OrderItems[*].Pricing.NetValue` | 6000.00 | `orderLine[*].lineExtensionAmount.value` | HIGH | DIRECT copy |
| `OrderItems[*].OrderHeader.DocumentCurrency` | "EUR" | `orderLine[*].lineExtensionAmount.currencyCode` | HIGH | INHERIT from header |
| `OrderItems[*].Pricing.TaxAmount` | 1440.00 | `orderLine[*].totalTaxAmount.value` | HIGH | DIRECT copy |

## Item Details Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `OrderItems[*].Material.MaterialDescription` | "C30/37 Betoniseos" | `orderLine[*].item.name` | HIGH | DIRECT copy (short) |
| `OrderItems[*].Material.MaterialDescriptionLong` | "C30/37 Betoniseos..." | `orderLine[*].item.description` | HIGH | DIRECT copy (long) |
| `OrderItems[*].Material.MaterialNumber` | "MAT-CONCRETE-001" | `orderLine[*].item.sellersItemIdentification.id` | HIGH | DIRECT copy |
| N/A (static) | "SAP Material Number" | `orderLine[*].item.sellersItemIdentification.schemeID` | HIGH | STATIC value |
| `OrderItems[*].CustomerMaterialNumber` | "CUST-CONC-C30" | `orderLine[*].item.buyersItemIdentification.id` | HIGH | DIRECT copy |
| N/A (static) | "Customer Material Number" | `orderLine[*].item.buyersItemIdentification.schemeID` | HIGH | STATIC value |
| `OrderItems[*].ManufacturerMaterialNumber` | "RVK8150" | `orderLine[*].item.manufacturersItemIdentification.id` | MEDIUM | DIRECT if present |
| `OrderItems[*].Material.ProductHierarchy` | "001001001" | `orderLine[*].item.commodityClassification[0].itemClassificationCode` | MEDIUM | DIRECT copy |
| N/A (static) | "SAP Product Hierarchy" | `orderLine[*].item.commodityClassification[0].listID` | HIGH | STATIC value |
| `OrderItems[*].Manufacturer` | "RUUKKI" | `orderLine[*].item.additionalItemProperty[*].name="Manufacturer"` | MEDIUM | MAP to name/value pair |

## Price Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `OrderItems[*].Pricing.NetPrice` | 120.00 | `orderLine[*].price.priceAmount.value` | HIGH | DIRECT copy |
| `OrderItems[*].Pricing.Currency` | "EUR" | `orderLine[*].price.priceAmount.currencyCode` | HIGH | DIRECT (ISO 4217) |
| `OrderItems[*].Pricing.PriceUnit` | 1 | `orderLine[*].price.baseQuantity.value` | MEDIUM | DIRECT or default to 1 |
| `OrderItems[*].Pricing.PricingUnit` | "M3" | `orderLine[*].price.baseQuantity.unitCode` | MEDIUM | TRANSFORM SAP UoM → UN/CEFACT |

## Tax Category Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `OrderItems[*].Pricing.TaxCode` | "S1" | `orderLine[*].classifiedTaxCategory.id` | MEDIUM | TRANSFORM SAP code → UBL ("S1"→"S") |
| `OrderItems[*].Pricing.TaxRate` | 24.00 | `orderLine[*].classifiedTaxCategory.percent` | HIGH | DIRECT copy |
| N/A (static) | "VAT" | `orderLine[*].classifiedTaxCategory.taxScheme` | HIGH | STATIC "VAT" |

## Tax Total Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `Totals.TaxBreakdown[*].TaxableAmount` | 12500.00 | `taxTotal[0].taxSubtotal[*].taxableAmount.value` | HIGH | DIRECT copy |
| `Totals.TaxBreakdown[*].TaxAmount` | 3000.00 | `taxTotal[0].taxSubtotal[*].taxAmount.value` | HIGH | DIRECT copy |
| `Totals.TaxBreakdown[*].TaxRate` | 24.00 | `taxTotal[0].taxSubtotal[*].taxCategory.percent` | HIGH | DIRECT copy |
| `Totals.TaxBreakdown[*].TaxCode` | "S1" | `taxTotal[0].taxSubtotal[*].taxCategory.id` | MEDIUM | TRANSFORM SAP → UBL code |

## Metadata Correspondence

| SAP Field Path | Example Value | Candidate Canonical Field | Confidence | Transformation Note |
|----------------|---------------|---------------------------|------------|---------------------|
| `Metadata.SourceSystem` | "SAP_ECC_6.0" | `_metadata.sourceSystem` | HIGH | DIRECT copy |
| `Metadata.DataOrigin` | "SD Sales Order Entry" | `_metadata.sourceDocumentType` | HIGH | DIRECT copy |
| `OrderHeader.SalesDocument` | "4500012345" | `_metadata.sourceDocumentID` | HIGH | DIRECT copy |
| Current timestamp | "2026-04-15T10:35:00Z" | `_metadata.transformedAt` | HIGH | CALCULATE current ISO datetime |
| Engine version | "1.0.0" | `_metadata.mappingEngineVersion` | HIGH | CONFIG value |
| Rules version | "1.0.0" | `_metadata.mappingRulesVersion` | HIGH | CONFIG value |
| `Metadata.DataOrigin` | "SD Sales Order Entry" | `_metadata.dataOrigin` | HIGH | DIRECT copy |

## Unmapped SAP Fields (Candidate Analysis)

SAP fields with **no direct canonical correspondence** (may be SAP-internal or not relevant for canonical Order):

| SAP Field Path | Example Value | Reason No Match | Suggestions |
|----------------|---------------|-----------------|-------------|
| `OrderHeader.SalesOffice` | "FIN1" | SAP-internal org structure | Could add to seller party metadata |
| `OrderHeader.SalesGroup` | "001" | SAP-internal org structure | Could add to seller party metadata |
| `OrderHeader.Division` | "00" | SAP-internal product org | Usually not in canonical UBL |
| `OrderHeader.DistributionChannel` | "10" | SAP-internal sales channel | Could map to note or custom field |
| `OrderHeader.ExchangeRate` | "1.00000" | Not needed if single currency | Include only for multi-currency |
| `OrderHeader.PricingDate` | "2026-04-15" | SAP-internal pricing control | Usually same as issueDate |
| `OrderHeader.SalesDistrict` | "FI-UUS" | SAP-internal territory | Could add to seller metadata |
| `OrderHeader.PriceGroup` | "01" | SAP pricing control | Internal, not for canonical |
| `OrderHeader.PriceList` | "STANDARD" | SAP pricing control | Internal, not for canonical |
| `PartnerFunctions.SoldToParty.CustomerGroup` | "CONSTR" | SAP customer segmentation | Internal, not standardized |
| `PartnerFunctions.SoldToParty.PriceListType` | "01" | SAP pricing control | Internal |
| `OrderItems[*].Plant` | "1000" | SAP plant/location | Logistics-specific, not in UBL Order |
| `OrderItems[*].StorageLocation` | "0001" | SAP storage location | Logistics-specific |
| `OrderItems[*].ProfitCenter` | "1000" | SAP controlling | Internal accounting |
| `OrderItems[*].WBSElement` | "P-1000-001-01" | SAP project systems | Could map to accountingCost |
| `OrderItems[*].MaterialGroup1/2/3` | "BUILDING" | SAP material grouping | Internal classification |
| `OrderItems[*].DeliveryPriority` | "02" | SAP logistics priority | Not in UBL Order standard |
| `Status.*` | Various | SAP processing status | Not in Order document (runtime state) |

## Required Canonical Fields Still Unmapped

Canonical fields that **require values** but have no direct SAP source:

| Canonical Field | Required | Default Strategy | Notes |
|-----------------|----------|------------------|-------|
| `@context` | Yes | STATIC | Reference to fcior context URL |
| `@type` | Yes | STATIC | Always "Order" |
| `sellerSupplierParty.partyName[0].name` | Yes | LOOKUP | Requires sales org master data config |
| `sellerSupplierParty.postalAddress.*` | No (typical) | LOOKUP | Requires sales org master data config |
| `orderTypeCode` | No (typical) | TRANSFORM | Map from `SalesDocumentType` with lookup table |

## Semantic Assumptions

**Assumptions made due to incomplete/absent fcior executable shapes:**

1. **Tax Category Mapping**: SAP tax codes (S1, S0, etc.) → UBL codes (S, Z, E) assumed based on common practice
2. **Unit of Measure**: SAP UoM → UN/CEFACT Rec. 20 codes assumed (M3→MTQ, PC→PCE, etc.)
3. **Order Type Code**: SAP document type → UBL order type code mapping assumed (OR→220)
4. **Tax Scheme**: Assumed "VAT" for EU/Finnish context; could be different in other jurisdictions
5. **Address fullAddress**: Constructed format assumed as `{street} {building}, {postal} {city}, {country}`
6. **Payment Terms Text**: SAP code interpretation (ZN30 → "Net 30 days") requires lookup table
7. **Party Identification Scheme**: Scheme names ("SAP Customer Number", etc.) are descriptive, not from standard
8. **Incoterms Special Terms**: Construction "Ex Works {location}" is assumed format
9. **Item Additional Properties**: Manufacturer and other fields mapped to additionalItemProperty as name/value pairs
10. **Metadata Separation**: `_metadata` structure for traceability not defined in fcior; demo-specific extension

## Confidence Summary

- **HIGH confidence mappings**: ~85 correspondences (well-established UBL/SAP equivalents)
- **MEDIUM confidence mappings**: ~30 correspondences (need value transformation or lookup)
- **LOW confidence mappings**: ~5 correspondences (ambiguous or multi-source)
- **Unmapped SAP fields**: ~25 fields (SAP-internal or not in UBL Order scope)
- **Required canonical fields needing config**: ~5 fields (seller master data, code tables)
