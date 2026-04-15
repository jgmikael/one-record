/**
 * One Record Canonical Order Model
 * 
 * UBL-conformant business document model aligned with fcior
 * Implemented in TypeScript with JSON-LD semantics
 */

// ============================================================================
// Base Types
// ============================================================================

export interface Identifier {
  '@type'?: 'Identifier';
  /** Unique identifier value */
  value: string;
  /** Scheme name (e.g., "SAP Order Number", "GTIN", "GLN") */
  schemeName?: string;
  /** Scheme agency (e.g., "GS1", "SAP", "ISO") */
  schemeAgencyName?: string;
  /** Scheme URI for semantic reference */
  schemeURI?: string;
}

export interface Quantity {
  '@type'?: 'Quantity';
  /** Numeric quantity value */
  value: number;
  /** Unit code (e.g., "PCE", "KGM", "LTR", "MTR") */
  unitCode: string;
  /** Optional human-readable unit name */
  unitName?: string;
}

export interface MonetaryAmount {
  '@type'?: 'Amount';
  /** Numeric amount value */
  value: number;
  /** ISO 4217 currency code */
  currencyCode: string;
}

export interface Period {
  '@type'?: 'Period';
  /** Start date (ISO 8601) */
  startDate?: string;
  /** End date (ISO 8601) */
  endDate?: string;
  /** Duration in days */
  durationDays?: number;
  /** Description of the period */
  description?: string;
}

// ============================================================================
// Party & Address Structures
// ============================================================================

export interface PostalAddress {
  '@type'?: 'Address';
  /** Street name */
  streetName?: string;
  /** Additional street name / address line 2 */
  additionalStreetName?: string;
  /** Building number / locator designator */
  buildingNumber?: string;
  /** City name */
  cityName?: string;
  /** Postal zone / ZIP code */
  postalZone?: string;
  /** Country subdivision (state/region) */
  countrySubentity?: string;
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;
  /** Full address as single string */
  fullAddress?: string;
}

export interface Contact {
  '@type'?: 'Contact';
  /** Contact person name */
  name?: string;
  /** Telephone number */
  telephone?: string;
  /** Email address */
  electronicMail?: string;
  /** Department or role */
  department?: string;
}

export interface PartyIdentification {
  '@type'?: 'PartyIdentification';
  /** Party ID value */
  id: string;
  /** ID scheme (e.g., "GLN", "VAT", "DUNS") */
  schemeID?: string;
}

export interface PartyName {
  '@type'?: 'PartyName';
  /** Legal or trading name */
  name: string;
}

export interface PartyTaxScheme {
  '@type'?: 'PartyTaxScheme';
  /** Tax registration ID (e.g., VAT number) */
  companyID?: string;
  /** Tax scheme (usually "VAT") */
  taxScheme?: string;
}

export interface Party {
  '@type'?: 'Party';
  /** Party identifiers (e.g., GLN, customer number) */
  partyIdentification?: PartyIdentification[];
  /** Party name(s) */
  partyName?: PartyName[];
  /** Postal address */
  postalAddress?: PostalAddress;
  /** Tax registration information */
  partyTaxScheme?: PartyTaxScheme;
  /** Contact point */
  contact?: Contact;
}

// ============================================================================
// Order Line Item Structures
// ============================================================================

export interface ItemClassification {
  '@type'?: 'ItemClassification';
  /** Classification code value */
  itemClassificationCode?: string;
  /** Classification list ID (e.g., "UNSPSC", "eCl@ss") */
  listID?: string;
  /** Classification list version */
  listVersionID?: string;
}

export interface ItemIdentification {
  '@type'?: 'ItemIdentification';
  /** Item identifier value */
  id: string;
  /** Scheme ID (e.g., "GTIN", "Seller Item ID") */
  schemeID?: string;
}

export interface Item {
  '@type'?: 'Item';
  /** Item description/name */
  description?: string;
  /** Item name */
  name?: string;
  /** Seller's item identification */
  sellersItemIdentification?: ItemIdentification;
  /** Standard item identification (e.g., GTIN) */
  standardItemIdentification?: ItemIdentification;
  /** Buyer's item identification */
  buyersItemIdentification?: ItemIdentification;
  /** Manufacturer's item identification */
  manufacturersItemIdentification?: ItemIdentification;
  /** Item classification(s) */
  commodityClassification?: ItemClassification[];
  /** Additional item properties */
  additionalItemProperty?: Array<{
    name: string;
    value: string;
  }>;
}

export interface Price {
  '@type'?: 'Price';
  /** Price amount */
  priceAmount: MonetaryAmount;
  /** Base quantity for pricing (e.g., "per 100 units") */
  baseQuantity?: Quantity;
  /** Price type (e.g., "gross", "net") */
  priceType?: string;
}

export interface TaxCategory {
  '@type'?: 'TaxCategory';
  /** Tax category ID (e.g., "S" for standard, "Z" for zero) */
  id?: string;
  /** Tax percentage rate */
  percent?: number;
  /** Tax scheme (usually "VAT") */
  taxScheme?: string;
}

export interface LineItem {
  '@type'?: 'OrderLine';
  /** Line item identifier */
  id: string;
  /** Note/remarks for this line */
  note?: string;
  /** Ordered quantity */
  quantity: Quantity;
  /** Line extension amount (line total before tax) */
  lineExtensionAmount: MonetaryAmount;
  /** Total tax amount for this line */
  totalTaxAmount?: MonetaryAmount;
  /** Item being ordered */
  item: Item;
  /** Price details */
  price: Price;
  /** Requested delivery period for this line */
  requestedDeliveryPeriod?: Period;
  /** Tax category for this line */
  classifiedTaxCategory?: TaxCategory;
  /** Buyer's accounting cost reference */
  accountingCost?: string;
}

// ============================================================================
// Monetary Totals & Tax Structures
// ============================================================================

export interface TaxSubtotal {
  '@type'?: 'TaxSubtotal';
  /** Taxable amount */
  taxableAmount: MonetaryAmount;
  /** Tax amount */
  taxAmount: MonetaryAmount;
  /** Tax category */
  taxCategory: TaxCategory;
}

export interface TaxTotal {
  '@type'?: 'TaxTotal';
  /** Total tax amount */
  taxAmount: MonetaryAmount;
  /** Tax breakdown by category/rate */
  taxSubtotal?: TaxSubtotal[];
}

export interface MonetaryTotal {
  '@type'?: 'MonetaryTotal';
  /** Sum of all line extension amounts */
  lineExtensionAmount: MonetaryAmount;
  /** Total amount excluding tax */
  taxExclusiveAmount: MonetaryAmount;
  /** Total amount including tax */
  taxInclusiveAmount: MonetaryAmount;
  /** Allowance total amount */
  allowanceTotalAmount?: MonetaryAmount;
  /** Charge total amount */
  chargeTotalAmount?: MonetaryAmount;
  /** Prepaid amount */
  prepaidAmount?: MonetaryAmount;
  /** Payable rounding amount */
  payableRoundingAmount?: MonetaryAmount;
  /** Payable amount (final amount to pay) */
  payableAmount: MonetaryAmount;
}

// ============================================================================
// Payment & Delivery Terms
// ============================================================================

export interface PaymentTerms {
  '@type'?: 'PaymentTerms';
  /** Payment terms note (e.g., "NET30", "Due on receipt") */
  note?: string;
  /** Payment due date */
  paymentDueDate?: string;
  /** Settlement period in days */
  settlementPeriod?: number;
  /** Penalty surcharge percentage */
  penaltySurchargePercent?: number;
}

export interface DeliveryTerms {
  '@type'?: 'DeliveryTerms';
  /** Incoterms code (e.g., "EXW", "DAP", "DDP") */
  incoterms?: string;
  /** Special delivery terms text */
  specialTerms?: string;
}

export interface Delivery {
  '@type'?: 'Delivery';
  /** Requested delivery date */
  requestedDeliveryDate?: string;
  /** Promised delivery date */
  promisedDeliveryDate?: string;
  /** Delivery period */
  requestedDeliveryPeriod?: Period;
  /** Delivery location */
  deliveryLocation?: PostalAddress;
  /** Delivery party */
  deliveryParty?: Party;
}

// ============================================================================
// Document Metadata
// ============================================================================

export interface DocumentReference {
  '@type'?: 'DocumentReference';
  /** Document identifier */
  id: string;
  /** Document type (e.g., "PurchaseOrder", "Contract") */
  documentType?: string;
  /** Issue date */
  issueDate?: string;
}

/**
 * Metadata about the transformation and source
 * Kept separate from business payload for clean semantics
 */
export interface SourceMetadata {
  '@type'?: 'SourceMetadata';
  /** Source system identifier */
  sourceSystem: string;
  /** Source document type */
  sourceDocumentType: string;
  /** Original source document identifier */
  sourceDocumentID: string;
  /** Timestamp of transformation */
  transformedAt: string;
  /** Mapping engine version */
  mappingEngineVersion: string;
  /** Mapping rules version */
  mappingRulesVersion: string;
  /** Data origin description */
  dataOrigin?: string;
}

// ============================================================================
// Main Order Document
// ============================================================================

export interface OneRecordOrder {
  /** JSON-LD context */
  '@context': string | string[] | Record<string, any>;
  
  /** Type identifier */
  '@type': 'Order' | string;
  
  /** Unique IRI for this order */
  '@id': string;
  
  // ===== Core Identifiers =====
  
  /** Order number (primary identifier) */
  orderNumber: string;
  
  /** Additional identifiers */
  identifier?: Identifier[];
  
  // ===== Document Metadata =====
  
  /** Issue date (ISO 8601) */
  issueDate: string;
  
  /** Issue time (ISO 8601) */
  issueTime?: string;
  
  /** Order type code (e.g., "220" for standard order) */
  orderTypeCode?: string;
  
  /** Document currency code (ISO 4217) */
  documentCurrencyCode: string;
  
  /** Customer reference / PO number */
  buyerReference?: string;
  
  /** Accounting cost center */
  accountingCost?: string;
  
  // ===== Parties =====
  
  /** Buyer (customer) party */
  buyerCustomerParty: Party;
  
  /** Seller (supplier) party */
  sellerSupplierParty: Party;
  
  /** Originator party (if different from buyer) */
  originatorCustomerParty?: Party;
  
  /** Accounting customer party */
  accountingCustomerParty?: Party;
  
  // ===== Delivery =====
  
  /** Delivery information */
  delivery?: Delivery;
  
  /** Delivery terms */
  deliveryTerms?: DeliveryTerms;
  
  // ===== Payment =====
  
  /** Payment terms */
  paymentTerms?: PaymentTerms;
  
  // ===== References =====
  
  /** Contract reference */
  contractDocumentReference?: DocumentReference;
  
  /** Quotation reference */
  quotationDocumentReference?: DocumentReference;
  
  /** Additional document references */
  additionalDocumentReference?: DocumentReference[];
  
  // ===== Order Lines =====
  
  /** Order line items */
  orderLine: LineItem[];
  
  // ===== Totals =====
  
  /** Tax total(s) */
  taxTotal?: TaxTotal[];
  
  /** Anticipated monetary total */
  anticipatedMonetaryTotal?: MonetaryTotal;
  
  // ===== Notes =====
  
  /** General notes/remarks */
  note?: string[];
  
  // ===== Source Traceability =====
  
  /** Metadata about source and transformation (separate from business payload) */
  _metadata?: SourceMetadata;
}

// ============================================================================
// Cardinality Notes for Demo
// ============================================================================

/**
 * CARDINALITY ASSUMPTIONS FOR DEMO:
 * 
 * Required (1):
 * - orderNumber
 * - issueDate
 * - documentCurrencyCode
 * - buyerCustomerParty
 * - sellerSupplierParty
 * - orderLine (at least 1)
 * - anticipatedMonetaryTotal
 * 
 * Optional but commonly used (0..1):
 * - buyerReference
 * - delivery
 * - paymentTerms
 * - taxTotal
 * 
 * Optional arrays (0..*):
 * - note
 * - identifier
 * - additionalDocumentReference
 * 
 * Line item required:
 * - id
 * - quantity
 * - lineExtensionAmount
 * - item (with at least description or name)
 * - price
 */

// ============================================================================
// Relation to UBL & fcior
// ============================================================================

/**
 * UBL 2.4 ORDER ALIGNMENT:
 * 
 * This model follows UBL 2.4 Order structure and semantics:
 * - Core elements: ID, IssueDate, BuyerCustomerParty, SellerSupplierParty
 * - Delivery: Delivery, DeliveryTerms
 * - Payment: PaymentTerms
 * - Lines: OrderLine with Item, Quantity, Price
 * - Totals: AnticipatedMonetaryTotal, TaxTotal
 * 
 * fcior ALIGNMENT:
 * 
 * fcior is an application profile based on UBL 2.4 documents.
 * This Order model is designed to be compatible with fcior Order requirements:
 * - Uses busdoc vocabulary terms where applicable
 * - JSON-LD context maps to fcior namespace
 * - SHACL shapes derive from fcior intent
 * - Reusable structures (Party, Address, Item) work across fcior documents
 * 
 * The model can be extended to support other fcior documents:
 * - Invoice: Reuse Party, Address, Item, MonetaryTotal
 * - Despatch Advice: Reuse Party, Item, Delivery
 * - Catalogue: Reuse Item, Price
 */

// ============================================================================
// SAP Mapping Hints
// ============================================================================

/**
 * TYPICAL SAP ORDER SOURCE AREAS:
 * 
 * Order Header (VBAK table equivalent):
 * - orderNumber → VBELN (Sales Document Number)
 * - issueDate → ERDAT (Document Date)
 * - documentCurrencyCode → WAERK (Currency)
 * - buyerReference → BSTKD (Customer PO Number)
 * 
 * Partner Data:
 * - buyerCustomerParty → Sold-to Party (PARVW = 'AG')
 * - sellerSupplierParty → Usually the selling organization
 * - delivery.deliveryLocation → Ship-to Party (PARVW = 'WE')
 * 
 * Order Line Items (VBAP table equivalent):
 * - orderLine[].id → POSNR (Item Number)
 * - orderLine[].quantity → KWMENG (Order Quantity)
 * - orderLine[].item → MATNR (Material Number) + description
 * - orderLine[].price → Price from condition records
 * 
 * Totals:
 * - Calculated from line items or header totals
 * - Tax from MWSBP (Tax Amount)
 */
