# SAP Order → One Record Canonical Mapping Matrix

## Document-Level Mappings

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `@context` | JSON-LD context | N/A (static) | fcior namespace + busdoc terms | Static reference to context.jsonld |
| `@type` | Type identifier | N/A (static) | `busdoc:Order` | Always "Order" for Order documents |
| `@id` | Unique IRI | `OrderHeader.SalesDocument` | RDF resource identifier | Construct `urn:order:sap:{SalesDocument}` |
| `orderNumber` | Primary order ID | `OrderHeader.SalesDocument` | `busdoc:identificationID` | Direct copy |
| `issueDate` | Document issue date | `OrderHeader.DocumentDate` | `busdoc:issueDate` | Format: YYYY-MM-DD (xsd:date) |
| `issueTime` | Document issue time | `OrderHeader.CreatedAtTime` | `busdoc:issueTime` | Format: HH:MM:SS (xsd:time) |
| `orderTypeCode` | UBL order type code | `OrderHeader.SalesDocumentType` | `busdoc:orderTypeCode` | Map SAP type to UBL code (e.g., "OR" → "220") |
| `documentCurrencyCode` | Currency of amounts | `OrderHeader.DocumentCurrency` | `busdoc:documentCurrencyCode` | ISO 4217 code (EUR, USD, etc.) |
| `buyerReference` | Customer PO number | `OrderHeader.PurchaseOrderByCustomer` | `busdoc:buyerReference` | Direct copy |
| `accountingCost` | Cost center reference | `OrderItems[*].AccountAssignment` | `busdoc:accountingCost` | Aggregate or use first item's value |

## Party Mappings

### Buyer Customer Party

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `buyerCustomerParty` | Buyer party root | `PartnerFunctions.SoldToParty` | `busdoc:buyerCustomerParty` | Map from partner function "AG" |
| `partyIdentification[].id` | Party identifier | `SoldToParty.CustomerNumber` | `busdoc:partyIdentification/id` | SAP customer number |
| `partyIdentification[].schemeID` | ID scheme name | N/A (static) | `busdoc:schemeID` | "SAP Customer Number" |
| `partyName[].name` | Legal/trading name | `SoldToParty.Name1` + `Name2` | `busdoc:partyName/name` | Concatenate Name1 and Name2 if both present |
| `postalAddress.streetName` | Street name | `SoldToParty.Street` | `busdoc:streetName` | Direct copy |
| `postalAddress.buildingNumber` | House/building number | `SoldToParty.HouseNumber` | `busdoc:buildingNumber` | Direct copy (if populated) |
| `postalAddress.cityName` | City | `SoldToParty.City` | `busdoc:cityName` | Direct copy |
| `postalAddress.postalZone` | Postal/ZIP code | `SoldToParty.PostalCode` | `busdoc:postalZone` | Direct copy |
| `postalAddress.countrySubentity` | Region/state | `SoldToParty.Region` | `busdoc:countrySubentity` | Direct copy |
| `postalAddress.countryCode` | ISO country code | `SoldToParty.Country` | `busdoc:countryIdentificationCode` | ISO 3166-1 alpha-2 |
| `postalAddress.fullAddress` | Full address string | Composite | `busdoc:fullAddress` | Construct from street, city, postal, country |
| `partyTaxScheme.companyID` | Tax registration | `SoldToParty.TaxNumber1` | `busdoc:companyID` | VAT number or tax ID |
| `partyTaxScheme.taxScheme` | Tax scheme name | N/A (static) | `busdoc:taxScheme` | Usually "VAT" for EU |
| `contact.name` | Contact person | `SoldToParty.ContactPerson` | `busdoc:name` | Direct copy |
| `contact.telephone` | Phone number | `SoldToParty.Telephone` | `busdoc:telephone` | Direct copy |
| `contact.electronicMail` | Email | `SoldToParty.EmailAddress` | `busdoc:electronicMail` | Direct copy |

### Seller Supplier Party

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `sellerSupplierParty` | Seller party root | `OrderHeader.SalesOrganization` + config | `busdoc:sellerSupplierParty` | Map from sales org master data |
| `partyIdentification[].id` | Seller ID | `OrderHeader.SalesOrganization` | `busdoc:partyIdentification/id` | SAP sales organization code |
| `partyName[].name` | Seller name | Config/master data | `busdoc:partyName/name` | Lookup from sales org config |
| `postalAddress.*` | Seller address | Config/master data | `busdoc:postalAddress` | Lookup from sales org config |

## Delivery Mappings

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `delivery` | Delivery info root | Multiple sources | `busdoc:delivery` | Composite structure |
| `delivery.requestedDeliveryDate` | Requested date | `OrderHeader.RequestedDeliveryDate` | `busdoc:requestedDeliveryDate` | Format: YYYY-MM-DD |
| `delivery.deliveryLocation` | Ship-to address | `PartnerFunctions.ShipToParty` | `busdoc:deliveryLocation` | Map from partner function "WE" |
| `deliveryLocation.streetName` | Street | `ShipToParty.Street` | `busdoc:streetName` | Direct copy |
| `deliveryLocation.buildingNumber` | Building number | `ShipToParty.HouseNumber` | `busdoc:buildingNumber` | Direct copy if present |
| `deliveryLocation.cityName` | City | `ShipToParty.City` | `busdoc:cityName` | Direct copy |
| `deliveryLocation.postalZone` | Postal code | `ShipToParty.PostalCode` | `busdoc:postalZone` | Direct copy |
| `deliveryLocation.countryCode` | Country | `ShipToParty.Country` | `busdoc:countryIdentificationCode` | ISO 3166-1 alpha-2 |
| `deliveryTerms.incoterms` | Incoterms code | `OrderHeader.IncotermsClassification` | `busdoc:incoterms` | Direct copy (EXW, DAP, DDP, etc.) |
| `deliveryTerms.specialTerms` | Incoterms location | `OrderHeader.IncotermsLocation` | `busdoc:specialTerms` | Direct copy or construct from location |

## Payment Mappings

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `paymentTerms.note` | Payment terms text | `OrderHeader.PaymentTerms` | `busdoc:note` | Map SAP code to text (e.g., "ZN30" → "Net 30 days") |
| `paymentTerms.settlementPeriod` | Days until payment | `OrderHeader.PaymentTerms` | `busdoc:settlementPeriod` | Extract numeric days from code |

## Order Line Mappings

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `orderLine[]` | Line items array | `OrderItems[]` | `busdoc:orderLine` | Map each SAP item to OrderLine |
| `orderLine[].id` | Line ID | `Item.ItemNumber` | `busdoc:identificationID` | Direct copy (e.g., "000010") |
| `orderLine[].note` | Line remarks | `OrderItems[].ItemText` | `busdoc:note` | Direct copy |
| `orderLine[].quantity.value` | Quantity value | `Quantity.OrderQuantity` | `busdoc:quantity/value` | Numeric value |
| `orderLine[].quantity.unitCode` | Unit of measure | `Quantity.SalesUnit` | `busdoc:quantity/unitCode` | Map SAP UoM to UN/CEFACT code (M3→MTQ, PC→PCE) |
| `orderLine[].lineExtensionAmount.value` | Line total | `Pricing.NetValue` | `busdoc:lineExtensionAmount/value` | Net value before tax |
| `orderLine[].lineExtensionAmount.currencyCode` | Currency | `Pricing.Currency` | `busdoc:lineExtensionAmount/currencyCode` | ISO 4217 code |
| `orderLine[].totalTaxAmount.value` | Line tax | `Pricing.TaxAmount` | `busdoc:taxAmount/value` | Tax amount for this line |

### Item Mappings (within OrderLine)

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `item.name` | Item short name | `Material.MaterialDescription` | `busdoc:name` | Short description |
| `item.description` | Item long description | `Material.MaterialDescriptionLong` | `busdoc:description` | Long description if available |
| `item.sellersItemIdentification.id` | Seller's item code | `Material.MaterialNumber` | `busdoc:sellersItemIdentification/id` | SAP material number |
| `item.sellersItemIdentification.schemeID` | Scheme name | N/A (static) | `busdoc:schemeID` | "SAP Material Number" |
| `item.buyersItemIdentification.id` | Buyer's item code | `OrderItems[].CustomerMaterialNumber` | `busdoc:buyersItemIdentification/id` | Customer material number if present |
| `item.manufacturersItemIdentification.id` | Manufacturer code | `OrderItems[].ManufacturerMaterialNumber` | `busdoc:manufacturersItemIdentification/id` | If populated |
| `item.commodityClassification[].itemClassificationCode` | Classification | `Material.ProductHierarchy` | `busdoc:commodityClassification/itemClassificationCode` | SAP product hierarchy |
| `item.commodityClassification[].listID` | Classification scheme | N/A (static) | `busdoc:listID` | "SAP Product Hierarchy" |
| `item.additionalItemProperty[]` | Extra properties | Various (Manufacturer, etc.) | `busdoc:additionalItemProperty` | Map additional fields as name/value pairs |

### Price Mappings (within OrderLine)

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `price.priceAmount.value` | Unit price | `Pricing.NetPrice` | `busdoc:priceAmount/value` | Per-unit price |
| `price.priceAmount.currencyCode` | Price currency | `Pricing.Currency` | `busdoc:priceAmount/currencyCode` | ISO 4217 code |
| `price.baseQuantity.value` | Price base quantity | `Pricing.PriceUnit` | `busdoc:baseQuantity/value` | Usually 1 |
| `price.baseQuantity.unitCode` | Price UoM | `Pricing.PricingUnit` | `busdoc:baseQuantity/unitCode` | Unit for pricing |

### Tax Category Mappings (within OrderLine)

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `classifiedTaxCategory.id` | Tax category code | `Pricing.TaxCode` | `busdoc:identificationID` | Map SAP code to UBL (S1→S for standard) |
| `classifiedTaxCategory.percent` | Tax rate % | `Pricing.TaxRate` | `busdoc:percent` | Direct copy |
| `classifiedTaxCategory.taxScheme` | Tax scheme | N/A (static) | `busdoc:taxScheme` | Usually "VAT" |

## Monetary Totals Mappings

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `anticipatedMonetaryTotal.lineExtensionAmount.value` | Sum of lines | `Totals.HeaderTotals.TotalNetValueItems` or calculated | `busdoc:lineExtensionAmount/value` | Sum all orderLine[].lineExtensionAmount or use header |
| `anticipatedMonetaryTotal.taxExclusiveAmount.value` | Total before tax | `Totals.HeaderTotals.TotalNetValueItems` | `busdoc:taxExclusiveAmount/value` | Same as line extension for orders |
| `anticipatedMonetaryTotal.taxInclusiveAmount.value` | Total with tax | `Totals.HeaderTotals.TotalGrossAmount` | `busdoc:taxInclusiveAmount/value` | Net + Tax |
| `anticipatedMonetaryTotal.payableAmount.value` | Final payable | `Totals.HeaderTotals.TotalGrossAmount` | `busdoc:payableAmount/value` | Usually same as tax inclusive |

## Tax Total Mappings

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `taxTotal[].taxAmount.value` | Total tax | `Totals.HeaderTotals.TotalTaxAmount` | `busdoc:taxAmount/value` | Total tax for all lines |
| `taxTotal[].taxSubtotal[]` | Tax by rate | `Totals.TaxBreakdown[]` | `busdoc:taxSubtotal` | Aggregate by tax rate/code |
| `taxSubtotal[].taxableAmount.value` | Taxable base | `TaxBreakdown[].TaxableAmount` | `busdoc:taxableAmount/value` | Amount subject to this tax |
| `taxSubtotal[].taxAmount.value` | Tax for category | `TaxBreakdown[].TaxAmount` | `busdoc:taxAmount/value` | Tax amount for this category |
| `taxSubtotal[].taxCategory.id` | Tax category | `TaxBreakdown[].TaxCode` | `busdoc:identificationID` | Map to UBL code |
| `taxSubtotal[].taxCategory.percent` | Tax rate | `TaxBreakdown[].TaxRate` | `busdoc:percent` | Percentage rate |

## Metadata Mappings

| Canonical Element | Meaning | SAP Source Area | fcior/UBL Semantic Note | Transformation Notes |
|-------------------|---------|-----------------|------------------------|---------------------|
| `_metadata.sourceSystem` | Source system ID | `Metadata.SourceSystem` | `fcior:sourceSystem` | E.g., "SAP_ECC_6.0" |
| `_metadata.sourceDocumentType` | Document type | `Metadata.DataOrigin` | `fcior:sourceDocumentType` | E.g., "SD Sales Order" |
| `_metadata.sourceDocumentID` | Original doc ID | `OrderHeader.SalesDocument` | `fcior:sourceDocumentIdentifier` | SAP order number |
| `_metadata.transformedAt` | Transform timestamp | Current timestamp | `fcior:transformationTimestamp` | ISO 8601 dateTime |
| `_metadata.mappingEngineVersion` | Engine version | Engine config | `fcior:mappingEngineVersion` | Semantic version |
| `_metadata.mappingRulesVersion` | Rules version | Rules config | `fcior:mappingRulesVersion` | Semantic version |
| `_metadata.dataOrigin` | Origin description | `Metadata.DataOrigin` | `fcior:dataOrigin` | Free text |

## Notes

### UBL Order Type Codes
SAP `SalesDocumentType` → UBL `OrderTypeCode` mapping:
- `OR` (Standard Order) → `220` (Order)
- `RO` (Rush Order) → `226` (Blanket Order)
- `Contract` → `227` (Framework Agreement)

### Unit of Measure Codes
SAP UoM → UN/CEFACT Recommendation 20 codes:
- `M3` → `MTQ` (cubic meter)
- `PC` → `PCE` (piece)
- `KG` → `KGM` (kilogram)
- `L` → `LTR` (liter)
- `M` → `MTR` (meter)

### Tax Category Codes
SAP Tax Code → UBL Tax Category:
- `S1` (Standard VAT 24%) → `S` (Standard rate)
- `S0` (Zero VAT) → `Z` (Zero rated)
- `E` (Exempt) → `E` (Exempt)
- `AE` (Reverse charge) → `AE` (VAT Reverse Charge)

### Address Construction
When constructing `fullAddress`:
```
{streetName} {buildingNumber}, {postalZone} {cityName}, {countryName}
```
Example: `"Mannerheimintie 1, 00100 Helsinki, Finland"`

### Currency Codes
Always use ISO 4217 3-letter codes (EUR, USD, GBP, etc.)

### Date/Time Formats
- Dates: ISO 8601 `YYYY-MM-DD` (xsd:date compatible)
- Times: ISO 8601 `HH:MM:SS` (xsd:time compatible)
- DateTimes: ISO 8601 `YYYY-MM-DDTHH:MM:SSZ` (xsd:dateTime compatible)

### Cardinality Notes
- `[*]` indicates array/repeating element in SAP
- `[]` indicates array in canonical model
- Optional SAP fields map to optional canonical fields
- Required canonical fields must be populated (use defaults if SAP field missing)
