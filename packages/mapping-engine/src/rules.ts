/**
 * Curated Mapping Rules Configuration
 * 
 * This file contains the explicit mapping rules from SAP Order to One Record Canonical Order.
 * Rules are organized by target structure section.
 */

import { MappingRule } from './types';

// ============================================================================
// Document-Level Rules
// ============================================================================

const documentLevelRules: MappingRule[] = [
  {
    sourcePath: 'OrderHeader.SalesDocument',
    targetPath: '@id',
    targetSemanticReference: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#ID',
    mappingType: 'transformed',
    confidence: 'HIGH',
    transformFunction: 'buildOrderURN',
    rationale: 'SAP Sales Document Number → RDF resource identifier as URN',
    required: true,
  },
  {
    sourcePath: '_static_context',
    targetPath: '@context',
    targetSemanticReference: 'http://www.w3.org/ns/json-ld#context',
    mappingType: 'rule',
    confidence: 'HIGH',
    transformFunction: 'buildJSONLDContext',
    rationale: 'Static reference to fcior JSON-LD context',
    required: true,
    defaultValue: 'https://iri.suomi.fi/model/fcior/context.jsonld',
  },
  {
    sourcePath: '_static_type',
    targetPath: '@type',
    targetSemanticReference: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    mappingType: 'rule',
    confidence: 'HIGH',
    transformFunction: 'buildJSONLDType',
    rationale: 'Static type declaration for Order',
    required: true,
    defaultValue: 'Order',
  },
  {
    sourcePath: 'OrderHeader.SalesDocument',
    targetPath: 'orderNumber',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#identificationID',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'SAP Sales Document Number → Order Number (direct copy)',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.DocumentDate',
    targetPath: 'issueDate',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#issueDate',
    mappingType: 'transformed',
    confidence: 'HIGH',
    transformFunction: 'toISODate',
    rationale: 'Document Date → Issue Date (ISO 8601 format)',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.CreatedAtTime',
    targetPath: 'issueTime',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#issueTime',
    mappingType: 'transformed',
    confidence: 'HIGH',
    transformFunction: 'toISOTime',
    rationale: 'Creation Time → Issue Time (ISO 8601 format)',
  },
  {
    sourcePath: 'OrderHeader.SalesDocumentType',
    targetPath: 'orderTypeCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#orderTypeCode',
    mappingType: 'transformed',
    confidence: 'MEDIUM',
    transformFunction: 'sapOrderTypeToUBL',
    rationale: 'SAP Document Type → UBL Order Type Code (OR→220)',
  },
  {
    sourcePath: 'OrderHeader.DocumentCurrency',
    targetPath: 'documentCurrencyCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#documentCurrencyCode',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Document Currency → Document Currency Code (ISO 4217)',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.PurchaseOrderByCustomer',
    targetPath: 'buyerReference',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#buyerReference',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Customer PO Number → Buyer Reference',
  },
];

// ============================================================================
// Buyer Party Rules
// ============================================================================

const buyerPartyRules: MappingRule[] = [
  {
    sourcePath: 'PartnerFunctions.SoldToParty.CustomerNumber',
    targetPath: 'buyerCustomerParty.partyIdentification[0].id',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#partyIdentification',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Customer Number → Party Identification ID',
    required: true,
  },
  {
    sourcePath: '_static_sap_customer_scheme',
    targetPath: 'buyerCustomerParty.partyIdentification[0].schemeID',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#schemeID',
    mappingType: 'rule',
    confidence: 'HIGH',
    transformFunction: 'buildPartyIdentificationScheme',
    rationale: 'Static scheme identifier for SAP customer numbers',
    defaultValue: 'SAP Customer Number',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.Name1',
    targetPath: 'buyerCustomerParty.partyName[0].name',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#partyName',
    mappingType: 'transformed',
    confidence: 'HIGH',
    transformFunction: 'buildPartyName',
    rationale: 'Party Name (concatenate Name1 + Name2 if present)',
    required: true,
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.Street',
    targetPath: 'buyerCustomerParty.postalAddress.streetName',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#streetName',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Street → Street Name',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.HouseNumber',
    targetPath: 'buyerCustomerParty.postalAddress.buildingNumber',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#buildingNumber',
    mappingType: 'rule',
    confidence: 'MEDIUM',
    rationale: 'House Number → Building Number (if present)',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.City',
    targetPath: 'buyerCustomerParty.postalAddress.cityName',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#cityName',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'City → City Name',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.PostalCode',
    targetPath: 'buyerCustomerParty.postalAddress.postalZone',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#postalZone',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Postal Code → Postal Zone',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.Region',
    targetPath: 'buyerCustomerParty.postalAddress.countrySubentity',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#countrySubentity',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Region → Country Subentity',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.Country',
    targetPath: 'buyerCustomerParty.postalAddress.countryCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#countryIdentificationCode',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Country → Country Code (ISO 3166-1 alpha-2)',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.Street',
    targetPath: 'buyerCustomerParty.postalAddress.fullAddress',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#fullAddress',
    mappingType: 'transformed',
    confidence: 'HIGH',
    transformFunction: 'buildFullAddress',
    rationale: 'Composite full address from street, city, postal, country',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.TaxNumber1',
    targetPath: 'buyerCustomerParty.partyTaxScheme.companyID',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#companyID',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Tax Number 1 → Company Tax ID (VAT number)',
  },
  {
    sourcePath: '_static_vat_scheme',
    targetPath: 'buyerCustomerParty.partyTaxScheme.taxScheme',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#taxScheme',
    mappingType: 'rule',
    confidence: 'HIGH',
    transformFunction: 'staticTaxScheme',
    rationale: 'Static VAT scheme for EU context',
    defaultValue: 'VAT',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.ContactPerson',
    targetPath: 'buyerCustomerParty.contact.name',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#name',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Contact Person → Contact Name',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.Telephone',
    targetPath: 'buyerCustomerParty.contact.telephone',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#telephone',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Telephone → Contact Telephone',
  },
  {
    sourcePath: 'PartnerFunctions.SoldToParty.EmailAddress',
    targetPath: 'buyerCustomerParty.contact.electronicMail',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#electronicMail',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Email Address → Electronic Mail',
  },
];

// ============================================================================
// Seller Party Rules
// ============================================================================

const sellerPartyRules: MappingRule[] = [
  {
    sourcePath: 'OrderHeader.SalesOrganization',
    targetPath: 'sellerSupplierParty.partyIdentification[0].id',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#partyIdentification',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Sales Organization → Seller Party Identification',
    required: true,
  },
  {
    sourcePath: '_static_sap_salesorg_scheme',
    targetPath: 'sellerSupplierParty.partyIdentification[0].schemeID',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#schemeID',
    mappingType: 'rule',
    confidence: 'HIGH',
    transformFunction: 'buildSellerIdentificationScheme',
    rationale: 'Static scheme for SAP Sales Organization',
    defaultValue: 'SAP Sales Organization',
  },
  {
    sourcePath: 'OrderHeader.SalesOrganization',
    targetPath: 'sellerSupplierParty.partyName[0].name',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#partyName',
    mappingType: 'transformed',
    confidence: 'MEDIUM',
    transformFunction: 'lookupSellerName',
    rationale: 'Lookup seller name from sales org config',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.SalesOrganization',
    targetPath: 'sellerSupplierParty.postalAddress',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#postalAddress',
    mappingType: 'transformed',
    confidence: 'MEDIUM',
    transformFunction: 'lookupSellerAddress',
    rationale: 'Lookup seller address from sales org config',
  },
];

// ============================================================================
// Delivery Rules
// ============================================================================

const deliveryRules: MappingRule[] = [
  {
    sourcePath: 'OrderHeader.RequestedDeliveryDate',
    targetPath: 'delivery.requestedDeliveryDate',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#requestedDeliveryDate',
    mappingType: 'transformed',
    confidence: 'HIGH',
    transformFunction: 'toISODate',
    rationale: 'Requested Delivery Date → Delivery Requested Date',
  },
  {
    sourcePath: 'PartnerFunctions.ShipToParty.Street',
    targetPath: 'delivery.deliveryLocation.streetName',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#streetName',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Ship-to Street → Delivery Location Street',
  },
  {
    sourcePath: 'PartnerFunctions.ShipToParty.HouseNumber',
    targetPath: 'delivery.deliveryLocation.buildingNumber',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#buildingNumber',
    mappingType: 'rule',
    confidence: 'MEDIUM',
    rationale: 'Ship-to House Number → Delivery Location Building Number',
  },
  {
    sourcePath: 'PartnerFunctions.ShipToParty.City',
    targetPath: 'delivery.deliveryLocation.cityName',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#cityName',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Ship-to City → Delivery Location City',
  },
  {
    sourcePath: 'PartnerFunctions.ShipToParty.PostalCode',
    targetPath: 'delivery.deliveryLocation.postalZone',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#postalZone',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Ship-to Postal Code → Delivery Location Postal Zone',
  },
  {
    sourcePath: 'PartnerFunctions.ShipToParty.Country',
    targetPath: 'delivery.deliveryLocation.countryCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#countryIdentificationCode',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Ship-to Country → Delivery Location Country Code',
  },
  {
    sourcePath: 'OrderHeader.IncotermsClassification',
    targetPath: 'deliveryTerms.incoterms',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#incoterms',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Incoterms Classification → Delivery Terms Incoterms',
  },
  {
    sourcePath: 'OrderHeader.IncotermsLocation',
    targetPath: 'deliveryTerms.specialTerms',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#specialTerms',
    mappingType: 'transformed',
    confidence: 'MEDIUM',
    transformFunction: 'buildIncotermsSpecialTerms',
    rationale: 'Incoterms Location → Special Terms (composite)',
  },
];

// ============================================================================
// Payment Rules
// ============================================================================

const paymentRules: MappingRule[] = [
  {
    sourcePath: 'OrderHeader.PaymentTerms',
    targetPath: 'paymentTerms.note',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#note',
    mappingType: 'transformed',
    confidence: 'MEDIUM',
    transformFunction: 'sapPaymentTermsToText',
    rationale: 'SAP Payment Terms Code → Human-readable text',
  },
  {
    sourcePath: 'OrderHeader.PaymentTerms',
    targetPath: 'paymentTerms.settlementPeriod',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#settlementPeriod',
    mappingType: 'transformed',
    confidence: 'MEDIUM',
    transformFunction: 'extractPaymentDays',
    rationale: 'Extract payment days from SAP code (ZN30→30)',
  },
];

// ============================================================================
// Monetary Totals Rules
// ============================================================================

const monetaryTotalsRules: MappingRule[] = [
  {
    sourcePath: 'OrderHeader.TotalNetAmount',
    targetPath: 'anticipatedMonetaryTotal.lineExtensionAmount.value',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#lineExtensionAmount',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Total Net Amount → Line Extension Amount',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.DocumentCurrency',
    targetPath: 'anticipatedMonetaryTotal.lineExtensionAmount.currencyCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#currencyCode',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Document Currency → Amount Currency',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.TotalNetAmount',
    targetPath: 'anticipatedMonetaryTotal.taxExclusiveAmount.value',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#taxExclusiveAmount',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Total Net Amount → Tax Exclusive Amount',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.DocumentCurrency',
    targetPath: 'anticipatedMonetaryTotal.taxExclusiveAmount.currencyCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#currencyCode',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Document Currency → Amount Currency',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.TotalGrossAmount',
    targetPath: 'anticipatedMonetaryTotal.taxInclusiveAmount.value',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#taxInclusiveAmount',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Total Gross Amount → Tax Inclusive Amount',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.DocumentCurrency',
    targetPath: 'anticipatedMonetaryTotal.taxInclusiveAmount.currencyCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#currencyCode',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Document Currency → Amount Currency',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.TotalGrossAmount',
    targetPath: 'anticipatedMonetaryTotal.payableAmount.value',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#payableAmount',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Total Gross Amount → Payable Amount',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.DocumentCurrency',
    targetPath: 'anticipatedMonetaryTotal.payableAmount.currencyCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#currencyCode',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Document Currency → Amount Currency',
    required: true,
  },
];

// ============================================================================
// Tax Total Rules
// ============================================================================

const taxTotalRules: MappingRule[] = [
  {
    sourcePath: 'OrderHeader.TotalTaxAmount',
    targetPath: 'taxTotal[0].taxAmount.value',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#taxAmount',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Total Tax Amount → Tax Total Amount',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.DocumentCurrency',
    targetPath: 'taxTotal[0].taxAmount.currencyCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#currencyCode',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Document Currency → Tax Amount Currency',
    required: true,
  },
];

// ============================================================================
// Metadata Rules
// ============================================================================

const metadataRules: MappingRule[] = [
  {
    sourcePath: '_metadata_builder',
    targetPath: '_metadata',
    targetSemanticReference: 'https://iri.suomi.fi/model/fcior#metadata',
    mappingType: 'calculated',
    confidence: 'HIGH',
    transformFunction: 'buildMetadata',
    rationale: 'Build complete metadata object for traceability',
    required: true,
  },
];

// ============================================================================
// Export All Rules
// ============================================================================

export const allMappingRules: MappingRule[] = [
  ...documentLevelRules,
  ...buyerPartyRules,
  ...sellerPartyRules,
  ...deliveryRules,
  ...paymentRules,
  ...monetaryTotalsRules,
  ...taxTotalRules,
  ...metadataRules,
];

// Export by category for easier maintenance
export const mappingRulesByCategory = {
  document: documentLevelRules,
  buyerParty: buyerPartyRules,
  sellerParty: sellerPartyRules,
  delivery: deliveryRules,
  payment: paymentRules,
  monetaryTotals: monetaryTotalsRules,
  taxTotal: taxTotalRules,
  metadata: metadataRules,
};

// Line item rules are handled separately due to array iteration
export const lineItemRules: MappingRule[] = [
  {
    sourcePath: 'OrderItems[*].Item.ItemNumber',
    targetPath: 'orderLine[*].id',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#identificationID',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Item Number → Order Line ID',
    required: true,
  },
  {
    sourcePath: 'OrderItems[*].ItemText',
    targetPath: 'orderLine[*].note',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#note',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Item Text → Order Line Note',
  },
  {
    sourcePath: 'OrderItems[*].Quantity.OrderQuantity',
    targetPath: 'orderLine[*].quantity.value',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#quantity',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Order Quantity → Quantity Value',
    required: true,
  },
  {
    sourcePath: 'OrderItems[*].Quantity.SalesUnit',
    targetPath: 'orderLine[*].quantity.unitCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#unitCode',
    mappingType: 'transformed',
    confidence: 'MEDIUM',
    transformFunction: 'sapUoMToUNCEFACT',
    rationale: 'SAP UoM → UN/CEFACT Rec. 20 unit code',
    required: true,
  },
  {
    sourcePath: 'OrderItems[*].Quantity.SalesUnit',
    targetPath: 'orderLine[*].quantity.unitName',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#unitName',
    mappingType: 'transformed',
    confidence: 'MEDIUM',
    transformFunction: 'sapUoMToReadable',
    rationale: 'SAP UoM → Readable unit name',
  },
  {
    sourcePath: 'OrderItems[*].Pricing.NetValue',
    targetPath: 'orderLine[*].lineExtensionAmount.value',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#lineExtensionAmount',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Net Value → Line Extension Amount',
    required: true,
  },
  {
    sourcePath: 'OrderHeader.DocumentCurrency',
    targetPath: 'orderLine[*].lineExtensionAmount.currencyCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#currencyCode',
    mappingType: 'transformed',
    confidence: 'HIGH',
    transformFunction: 'toCurrencyCode',
    rationale: 'Document Currency → Line Amount Currency',
    required: true,
  },
  {
    sourcePath: 'OrderItems[*].Pricing.TaxAmount',
    targetPath: 'orderLine[*].totalTaxAmount.value',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#taxAmount',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Tax Amount → Total Tax Amount',
  },
  {
    sourcePath: 'OrderHeader.DocumentCurrency',
    targetPath: 'orderLine[*].totalTaxAmount.currencyCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#currencyCode',
    mappingType: 'transformed',
    confidence: 'HIGH',
    transformFunction: 'toCurrencyCode',
    rationale: 'Document Currency → Tax Amount Currency',
  },
  // Item details
  {
    sourcePath: 'OrderItems[*].Material.MaterialDescription',
    targetPath: 'orderLine[*].item.name',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#name',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Material Description → Item Name',
    required: true,
  },
  {
    sourcePath: 'OrderItems[*].Material.MaterialDescriptionLong',
    targetPath: 'orderLine[*].item.description',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#description',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Long Description → Item Description',
  },
  {
    sourcePath: 'OrderItems[*].Material.MaterialNumber',
    targetPath: 'orderLine[*].item.sellersItemIdentification.id',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#sellersItemIdentification',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Material Number → Sellers Item ID',
    required: true,
  },
  {
    sourcePath: '_static_sap_material_scheme',
    targetPath: 'orderLine[*].item.sellersItemIdentification.schemeID',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#schemeID',
    mappingType: 'rule',
    confidence: 'HIGH',
    transformFunction: 'buildItemIdentificationScheme',
    rationale: 'Static scheme for SAP material numbers',
    defaultValue: 'SAP Material Number',
  },
  {
    sourcePath: 'OrderItems[*].CustomerMaterialNumber',
    targetPath: 'orderLine[*].item.buyersItemIdentification.id',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#buyersItemIdentification',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Customer Material Number → Buyers Item ID',
  },
  {
    sourcePath: 'OrderItems[*].Material.ProductHierarchy',
    targetPath: 'orderLine[*].item.commodityClassification[0].itemClassificationCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#commodityClassification',
    mappingType: 'rule',
    confidence: 'MEDIUM',
    rationale: 'Product Hierarchy → Commodity Classification Code',
  },
  // Price
  {
    sourcePath: 'OrderItems[*].Pricing.NetPrice',
    targetPath: 'orderLine[*].price.priceAmount.value',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#priceAmount',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Net Price → Price Amount Value',
    required: true,
  },
  {
    sourcePath: 'OrderItems[*].Pricing.Currency',
    targetPath: 'orderLine[*].price.priceAmount.currencyCode',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#currencyCode',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Pricing Currency → Price Amount Currency',
    required: true,
  },
  // Tax category
  {
    sourcePath: 'OrderItems[*].Pricing.TaxCode',
    targetPath: 'orderLine[*].classifiedTaxCategory.id',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#identificationID',
    mappingType: 'transformed',
    confidence: 'MEDIUM',
    transformFunction: 'sapTaxCodeToUBL',
    rationale: 'SAP Tax Code → UBL Tax Category',
  },
  {
    sourcePath: 'OrderItems[*].Pricing.TaxRate',
    targetPath: 'orderLine[*].classifiedTaxCategory.percent',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#percent',
    mappingType: 'rule',
    confidence: 'HIGH',
    rationale: 'Tax Rate → Tax Category Percent',
  },
  {
    sourcePath: '_static_vat_scheme',
    targetPath: 'orderLine[*].classifiedTaxCategory.taxScheme',
    targetSemanticReference: 'https://iri.suomi.fi/model/busdoc#taxScheme',
    mappingType: 'rule',
    confidence: 'HIGH',
    transformFunction: 'staticTaxScheme',
    rationale: 'Static VAT scheme',
    defaultValue: 'VAT',
  },
];
