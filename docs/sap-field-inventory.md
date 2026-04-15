# SAP Order Field Inventory

Complete inventory of all fields in the demo SAP Order instance model.

## Order Header Fields (37 fields)

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `OrderHeader.SalesDocument` | Sales Doc | VBAK-VBELN | string | Yes | Sales Document Number | "4500012345" |
| `OrderHeader.SalesDocumentType` | Doc Type | VBAK-AUART | string | Yes | Sales Document Type | "OR" |
| `OrderHeader.SalesOrganization` | Sales Org | VBAK-VKORG | string | Yes | Sales Organization | "1000" |
| `OrderHeader.DistributionChannel` | Distr Chan | VBAK-VTWEG | string | Yes | Distribution Channel | "10" |
| `OrderHeader.Division` | Division | VBAK-SPART | string | Yes | Division | "00" |
| `OrderHeader.SalesOffice` | Sales Office | VBAK-VKBUR | string | No | Sales Office | "FIN1" |
| `OrderHeader.SalesGroup` | Sales Group | VBAK-VKGRP | string | No | Sales Group | "001" |
| `OrderHeader.DocumentDate` | Doc Date | VBAK-AUDAT | string(date) | Yes | Document Date | "2026-04-15" |
| `OrderHeader.CreatedBy` | Created By | VBAK-ERNAM | string | Yes | Created By User | "SAPUSER01" |
| `OrderHeader.CreatedOn` | Created On | VBAK-ERDAT | string(date) | Yes | Created On Date | "2026-04-15" |
| `OrderHeader.CreatedAtTime` | Created Time | VBAK-ERZET | string(time) | Yes | Created At Time | "10:30:00" |
| `OrderHeader.LastChangedBy` | Changed By | VBAK-AENAM | string | No | Last Changed By | "SAPUSER01" |
| `OrderHeader.LastChangedOn` | Changed On | VBAK-AEDAT | string(date) | No | Last Changed On | "2026-04-15" |
| `OrderHeader.PurchaseOrderByCustomer` | Cust PO | VBAK-BSTKD | string | No | Customer PO Number | "PO-2026-0415-001" |
| `OrderHeader.CustomerPurchaseOrderDate` | PO Date | VBAK-BSTDK | string(date) | No | Customer PO Date | "2026-04-12" |
| `OrderHeader.RequestedDeliveryDate` | Req Del Date | VBKD-VDATU | string(date) | No | Requested Delivery Date | "2026-04-25" |
| `OrderHeader.PricingDate` | Pricing Date | VBAK-PRSDT | string(date) | No | Pricing Date | "2026-04-15" |
| `OrderHeader.DocumentCurrency` | Currency | VBAK-WAERK | string | Yes | Document Currency | "EUR" |
| `OrderHeader.ExchangeRate` | Exch Rate | VBAK-WKURS | string | No | Exchange Rate | "1.00000" |
| `OrderHeader.PaymentTerms` | Payment | VBAK-ZTERM | string | No | Payment Terms | "ZN30" |
| `OrderHeader.IncotermsClassification` | Inco1 | VBAK-INCO1 | string | No | Incoterms Code | "EXW" |
| `OrderHeader.IncotermsLocation` | Inco2 | VBAK-INCO2 | string | No | Incoterms Location | "Helsinki" |
| `OrderHeader.TotalNetAmount` | Net Total | Calculated | number | Yes | Total Net Amount | 12500.00 |
| `OrderHeader.TotalTaxAmount` | Tax Total | Calculated | number | Yes | Total Tax Amount | 3000.00 |
| `OrderHeader.TotalGrossAmount` | Gross Total | Calculated | number | Yes | Total Gross Amount | 15500.00 |
| `OrderHeader.OrderReason` | Order Reason | VBAK-AUGRU | string | No | Order Reason | "Standard Construction Order" |
| `OrderHeader.CustomerReference` | Cust Ref | Custom | string | No | Customer Reference | "Project Espoo Tower" |
| `OrderHeader.YourReference` | Your Ref | Custom | string | No | Your Reference | "Matti Virtanen" |
| `OrderHeader.SalesDistrict` | District | VBAK-BZIRK | string | No | Sales District | "FI-UUS" |
| `OrderHeader.PriceGroup` | Price Group | VBAK-KONDA | string | No | Price Group | "01" |
| `OrderHeader.PriceList` | Price List | VBAK-PLTYP | string | No | Price List | "STANDARD" |

## Partner Function Fields (23 fields per partner × 4 partners)

### Sold-To Party Fields

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `PartnerFunctions.SoldToParty.PartnerFunction` | Parvw | VBPA-PARVW | string | Yes | Partner Function | "AG" |
| `PartnerFunctions.SoldToParty.CustomerNumber` | Customer | VBPA-KUNNR | string | Yes | Customer Number | "100234" |
| `PartnerFunctions.SoldToParty.Name1` | Name 1 | KNA1-NAME1 | string | Yes | Name 1 | "Rakennusyhtiö Suomi Oy" |
| `PartnerFunctions.SoldToParty.Name2` | Name 2 | KNA1-NAME2 | string | No | Name 2 | "" |
| `PartnerFunctions.SoldToParty.Street` | Street | KNA1-STRAS | string | No | Street | "Mannerheimintie 1" |
| `PartnerFunctions.SoldToParty.HouseNumber` | House No | KNA1-HOUSE_NUM1 | string | No | House Number | "" |
| `PartnerFunctions.SoldToParty.PostalCode` | Post Code | KNA1-PSTLZ | string | No | Postal Code | "00100" |
| `PartnerFunctions.SoldToParty.City` | City | KNA1-ORT01 | string | No | City | "Helsinki" |
| `PartnerFunctions.SoldToParty.Region` | Region | KNA1-REGIO | string | No | Region | "FI-18" |
| `PartnerFunctions.SoldToParty.Country` | Country | KNA1-LAND1 | string | No | Country | "FI" |
| `PartnerFunctions.SoldToParty.TaxNumber1` | Tax No 1 | KNA1-STCD1 | string | No | Tax Number 1 | "FI12345678" |
| `PartnerFunctions.SoldToParty.TaxNumber2` | Tax No 2 | KNA1-STCD2 | string | No | Tax Number 2 | "" |
| `PartnerFunctions.SoldToParty.TaxClassification` | Tax Class | KNA1-TAXKD | string | No | Tax Classification | "1" |
| `PartnerFunctions.SoldToParty.ContactPerson` | Contact | Custom | string | No | Contact Person | "Matti Virtanen" |
| `PartnerFunctions.SoldToParty.Telephone` | Phone | KNA1-TELF1 | string | No | Telephone | "+358 9 1234567" |
| `PartnerFunctions.SoldToParty.EmailAddress` | Email | ADR6-SMTP_ADDR | string | No | Email Address | "matti.virtanen@rakennusyhtio.fi" |
| `PartnerFunctions.SoldToParty.CustomerGroup` | Cust Group | KNA1-KDGRP | string | No | Customer Group | "CONSTR" |
| `PartnerFunctions.SoldToParty.PriceListType` | Price List | KNA1-PLTYP | string | No | Price List Type | "01" |

### Ship-To Party Fields

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `PartnerFunctions.ShipToParty.PartnerFunction` | Parvw | VBPA-PARVW | string | Yes | Partner Function | "WE" |
| `PartnerFunctions.ShipToParty.CustomerNumber` | Customer | VBPA-KUNNR | string | Yes | Customer Number | "100234-01" |
| `PartnerFunctions.ShipToParty.Name1` | Name 1 | KNA1-NAME1 | string | Yes | Name 1 | "Rakennusyhtiö Suomi Oy" |
| `PartnerFunctions.ShipToParty.Name2` | Name 2 | KNA1-NAME2 | string | No | Name 2 | "Työmaa Espoo Tower" |
| `PartnerFunctions.ShipToParty.Street` | Street | KNA1-STRAS | string | No | Street | "Otaniementie 15" |
| `PartnerFunctions.ShipToParty.PostalCode` | Post Code | KNA1-PSTLZ | string | No | Postal Code | "02150" |
| `PartnerFunctions.ShipToParty.City` | City | KNA1-ORT01 | string | No | City | "Espoo" |
| `PartnerFunctions.ShipToParty.Region` | Region | KNA1-REGIO | string | No | Region | "FI-18" |
| `PartnerFunctions.ShipToParty.Country` | Country | KNA1-LAND1 | string | No | Country | "FI" |
| `PartnerFunctions.ShipToParty.UnloadingPoint` | Unlload Pt | VBPA-ABLAD | string | No | Unloading Point | "SITE-ESP-01" |
| `PartnerFunctions.ShipToParty.ReceivingPlant` | Plant | Custom | string | No | Receiving Plant | "1000" |

## Order Line Item Fields (60+ fields per item)

### Item Header

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `OrderItems[].Item.ItemNumber` | Item | VBAP-POSNR | string | Yes | Item Number | "000010" |
| `OrderItems[].Item.HigherLevelItem` | Higher Item | VBAP-UEPOS | string | No | Higher-Level Item | "" |
| `OrderItems[].Item.ItemCategory` | Cat | VBAP-PSTYV | string | Yes | Item Category | "TAN" |
| `OrderItems[].Item.ItemType` | Type | Custom | string | Yes | Item Type | "Material" |

### Material

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `OrderItems[].Material.MaterialNumber` | Material | VBAP-MATNR | string | Yes | Material Number | "MAT-CONCRETE-001" |
| `OrderItems[].Material.MaterialGroup` | Mat Group | VBAP-MATKL | string | Yes | Material Group | "CONCRETE" |
| `OrderItems[].Material.MaterialDescription` | Short Text | MAKT-MAKTX | string | Yes | Material Description | "C30/37 Betoniseos" |
| `OrderItems[].Material.MaterialDescriptionLong` | Long Text | Custom | string | No | Long Description | "C30/37 Betoniseos, paksuus 200mm, notkeus S3" |
| `OrderItems[].Material.ProductHierarchy` | Prod Hier | VBAP-PRODH | string | No | Product Hierarchy | "001001001" |
| `OrderItems[].Material.Division` | Division | VBAP-SPART | string | No | Division | "00" |

### Quantity

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `OrderItems[].Quantity.OrderQuantity` | Quantity | VBAP-KWMENG | number | Yes | Order Quantity | 50 |
| `OrderItems[].Quantity.SalesUnit` | Unit | VBAP-VRKME | string | Yes | Sales Unit | "M3" |
| `OrderItems[].Quantity.BaseUnit` | Base Unit | VBAP-MEINS | string | Yes | Base Unit | "M3" |
| `OrderItems[].Quantity.NumeratorConversion` | Num Conv | VBAP-UMZIN | string | No | Numerator Conversion | "1" |
| `OrderItems[].Quantity.DenominatorConversion` | Den Conv | VBAP-UMZAN | string | No | Denominator Conversion | "1" |
| `OrderItems[].Quantity.QuantityInBaseUnit` | Base Qty | Calculated | number | No | Quantity in Base Unit | 50 |
| `OrderItems[].Quantity.NetWeight` | Weight | VBAP-NTGEW | number | No | Net Weight | 120000.000 |
| `OrderItems[].Quantity.WeightUnit` | Weight Unit | VBAP-GEWEI | string | No | Weight Unit | "KG" |
| `OrderItems[].Quantity.GrossWeight` | Gross Wt | VBAP-BRGEW | number | No | Gross Weight | 120000.000 |
| `OrderItems[].Quantity.Volume` | Volume | VBAP-VOLUM | number | No | Volume | 50.000 |
| `OrderItems[].Quantity.VolumeUnit` | Vol Unit | VBAP-VOLEH | string | No | Volume Unit | "M3" |

### Schedule

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `OrderItems[].Schedule.RequestedDeliveryDate` | Req Date | VBEP-EDATU | string(date) | No | Requested Delivery Date | "2026-04-25" |
| `OrderItems[].Schedule.ConfirmedDeliveryDate` | Conf Date | VBEP-EDATU_VBAK | string(date) | No | Confirmed Delivery Date | "2026-04-25" |
| `OrderItems[].Schedule.ShippingPoint` | Ship Pt | VBAP-VSTEL | string | No | Shipping Point | "1000" |
| `OrderItems[].Schedule.LoadingGroup` | Load Grp | VBAP-LADGR | string | No | Loading Group | "0001" |
| `OrderItems[].Schedule.TransportationGroup` | Trans Grp | VBAP-TRAGR | string | No | Transportation Group | "0001" |
| `OrderItems[].Schedule.Route` | Route | VBAP-ROUTE | string | No | Route | "FIN001" |

### Pricing

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `OrderItems[].Pricing.NetPrice` | Net Price | KONV-KBETR | number | Yes | Net Price | 120.00 |
| `OrderItems[].Pricing.PriceUnit` | Price Unit | KONV-KPEIN | number | No | Price Unit | 1 |
| `OrderItems[].Pricing.PricingUnit` | Pric Unit | KONV-KMEIN | string | No | Pricing Unit | "M3" |
| `OrderItems[].Pricing.Currency` | Currency | KONV-WAERS | string | Yes | Currency | "EUR" |
| `OrderItems[].Pricing.GrossPrice` | Gross Price | Calculated | number | No | Gross Price | 120.00 |
| `OrderItems[].Pricing.NetValue` | Net Value | VBAP-NETWR | number | Yes | Net Value | 6000.00 |
| `OrderItems[].Pricing.TaxAmount` | Tax Amt | VBAP-MWSBP | number | Yes | Tax Amount | 1440.00 |
| `OrderItems[].Pricing.TaxRate` | Tax Rate | Custom | number | Yes | Tax Rate | 24.00 |
| `OrderItems[].Pricing.TaxCode` | Tax Code | VBAP-MWSKZ | string | Yes | Tax Code | "S1" |
| `OrderItems[].Pricing.TaxClassification` | Tax Class | VBAP-TAXM1 | string | No | Tax Classification | "1" |
| `OrderItems[].Pricing.SubtotalValue` | Subtotal | Calculated | number | No | Subtotal Value | 6000.00 |
| `OrderItems[].Pricing.GrossValue` | Gross Val | Calculated | number | Yes | Gross Value | 7440.00 |

### Conditions

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `OrderItems[].Conditions[].ConditionType` | Type | KONV-KSCHL | string | Yes | Condition Type | "PR00" |
| `OrderItems[].Conditions[].ConditionDescription` | Desc | Custom | string | No | Description | "Price" |
| `OrderItems[].Conditions[].ConditionValue` | Value | KONV-KWERT | number | No | Condition Value | 120.00 |
| `OrderItems[].Conditions[].ConditionCurrency` | Currency | KONV-WAERS | string | No | Currency | "EUR" |
| `OrderItems[].Conditions[].ConditionUnit` | Unit | KONV-KMEIN | string | No | Unit | "M3" |
| `OrderItems[].Conditions[].ConditionRate` | Rate | KONV-KBETR | number | No | Condition Rate | 24.00 |

### Additional Item Fields

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `OrderItems[].Plant` | Plant | VBAP-WERKS | string | No | Plant | "1000" |
| `OrderItems[].StorageLocation` | Stor Loc | VBAP-LGORT | string | No | Storage Location | "0001" |
| `OrderItems[].ShippingPoint` | Ship Pt | VBAP-VSTEL | string | No | Shipping Point | "1000" |
| `OrderItems[].DeliveryPriority` | Del Prior | VBAP-LPRIO | string | No | Delivery Priority | "02" |
| `OrderItems[].ItemText` | Text | Custom | string | No | Item Text | "Toimitus työmaa Espoo Tower..." |
| `OrderItems[].CustomerMaterialNumber` | Cust Mat | Custom | string | No | Customer Material | "CUST-CONC-C30" |
| `OrderItems[].ManufacturerMaterialNumber` | Mfr Mat | Custom | string | No | Manufacturer Material | "RVK8150" |
| `OrderItems[].Manufacturer` | Mfr | Custom | string | No | Manufacturer | "RUUKKI" |
| `OrderItems[].MaterialGroup1` | MG1 | VBAP-MVGR1 | string | No | Material Group 1 | "BUILDING" |
| `OrderItems[].MaterialGroup2` | MG2 | VBAP-MVGR2 | string | No | Material Group 2 | "CONCRETE" |
| `OrderItems[].MaterialGroup3` | MG3 | VBAP-MVGR3 | string | No | Material Group 3 | "READYMIX" |
| `OrderItems[].ProfitCenter` | Profit Ctr | VBAP-PRCTR | string | No | Profit Center | "1000" |
| `OrderItems[].WBSElement` | WBS | VBAP-PS_PSP_PNR | string | No | WBS Element | "P-1000-001-01" |
| `OrderItems[].AccountAssignment` | Acct Assgn | Custom | string | No | Account Assignment | "Project Espoo Tower - Foundation" |
| `OrderItems[].BatchNumber` | Batch | VBAP-CHARG | string | No | Batch Number | "" |
| `OrderItems[].SerialNumbers` | Serials | Custom | array | No | Serial Numbers | [] |

## Totals Fields (8 fields)

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `Totals.HeaderTotals.TotalNetValueItems` | Net Total | Calculated | number | Yes | Total Net Value | 12500.00 |
| `Totals.HeaderTotals.TotalTaxAmount` | Tax Total | Calculated | number | Yes | Total Tax Amount | 3000.00 |
| `Totals.HeaderTotals.TotalGrossAmount` | Gross Total | Calculated | number | Yes | Total Gross Amount | 15500.00 |
| `Totals.HeaderTotals.Currency` | Currency | VBAK-WAERK | string | Yes | Currency | "EUR" |

### Tax Breakdown

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `Totals.TaxBreakdown[].TaxCode` | Tax Code | Custom | string | Yes | Tax Code | "S1" |
| `Totals.TaxBreakdown[].TaxDescription` | Description | Custom | string | No | Tax Description | "Standard VAT 24%" |
| `Totals.TaxBreakdown[].TaxRate` | Rate | Custom | number | Yes | Tax Rate | 24.00 |
| `Totals.TaxBreakdown[].TaxableAmount` | Taxable | Calculated | number | Yes | Taxable Amount | 12500.00 |
| `Totals.TaxBreakdown[].TaxAmount` | Tax Amt | Calculated | number | Yes | Tax Amount | 3000.00 |
| `Totals.TaxBreakdown[].TaxJurisdiction` | Jurisdiction | Custom | string | No | Tax Jurisdiction | "FI" |
| `Totals.TaxBreakdown[].Currency` | Currency | VBAK-WAERK | string | Yes | Currency | "EUR" |

## Status Fields (7 fields)

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `Status.OverallStatus` | Overall | VBUK-ABSTK | string | No | Overall Status | "A" |
| `Status.ProcessingStatus` | Processing | Custom | string | No | Processing Status | "Open" |
| `Status.DeliveryStatus` | Delivery | VBUK-LFSTK | string | No | Delivery Status | "Not yet processed" |
| `Status.BillingStatus` | Billing | VBUK-FKSTK | string | No | Billing Status | "Not yet processed" |
| `Status.RejectionStatus` | Rejection | Custom | string | No | Rejection Status | "" |
| `Status.CreditStatus` | Credit | Custom | string | No | Credit Status | "Released" |
| `Status.BlockStatus` | Block | Custom | string | No | Block Status | "" |

## Metadata Fields (9 fields)

| Field Path | SAP Field | SAP Table/Field | Data Type | Required | Description | Example Value |
|------------|-----------|-----------------|-----------|----------|-------------|---------------|
| `Metadata.SourceSystem` | System | Custom | string | Yes | Source System | "SAP_ECC_6.0" |
| `Metadata.SystemClient` | Client | Custom | string | No | System Client | "100" |
| `Metadata.LogicalSystem` | Log System | Custom | string | No | Logical System | "SAPFIN" |
| `Metadata.DataOrigin` | Origin | Custom | string | No | Data Origin | "SD Sales Order Entry" |
| `Metadata.ExportTimestamp` | Export TS | Custom | string(datetime) | No | Export Timestamp | "2026-04-15T10:35:00Z" |
| `Metadata.DataVersion` | Version | Custom | string | No | Data Version | "1.0" |
| `Metadata.TransactionCode` | TCode | Custom | string | No | Transaction Code | "VA01" |
| `Metadata.UserRole` | Role | Custom | string | No | User Role | "Sales Processor" |
| `Metadata.OrganizationUnit` | Org Unit | Custom | string | No | Organization Unit | "Sales Finland" |

## Summary Statistics

- **Total Unique Fields**: ~180 fields
- **Header Section**: 37 fields
- **Partner Sections**: 92 fields (23 × 4 partners)
- **Line Item Section**: ~60 fields per item (×2 items = 120 field instances)
- **Totals Section**: 11 fields
- **Status Section**: 7 fields
- **Metadata Section**: 9 fields

## Field Groups

- **OrderHeader**: Core document identifiers and header-level attributes
- **Partner**: Customer/party identification and address information
- **LineItem**: Order line item header and identifiers
- **Material**: Material/product information
- **Quantity**: Quantity and unit of measure data
- **Schedule**: Delivery scheduling and logistics
- **Pricing**: Prices, values, taxes, conditions
- **Totals**: Aggregated monetary totals and tax breakdown
- **Status**: Document processing status
- **Metadata**: System and audit information
