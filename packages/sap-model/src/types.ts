/**
 * SAP Order Model - TypeScript Types
 * 
 * Represents a specific SAP ECC 6.0 Sales Order structure
 * This is a demo-specific instance model, not generic SAP documentation
 */

// ============================================================================
// Order Header
// ============================================================================

export interface SAPOrderHeader {
  /** Sales Document Number (VBELN) */
  SalesDocument: string;
  
  /** Sales Document Type (AUART) */
  SalesDocumentType: string;
  
  /** Sales Organization (VKORG) */
  SalesOrganization: string;
  
  /** Distribution Channel (VTWEG) */
  DistributionChannel: string;
  
  /** Division (SPART) */
  Division: string;
  
  /** Sales Office (VKBUR) */
  SalesOffice?: string;
  
  /** Sales Group (VKGRP) */
  SalesGroup?: string;
  
  /** Document Date (AUDAT) */
  DocumentDate: string;
  
  /** Created By User (ERNAM) */
  CreatedBy: string;
  
  /** Created On Date (ERDAT) */
  CreatedOn: string;
  
  /** Created At Time (ERZET) */
  CreatedAtTime: string;
  
  /** Last Changed By (AENAM) */
  LastChangedBy?: string;
  
  /** Last Changed On (AEDAT) */
  LastChangedOn?: string;
  
  /** Customer Purchase Order Number (BSTKD) */
  PurchaseOrderByCustomer?: string;
  
  /** Customer PO Date (BSTDK) */
  CustomerPurchaseOrderDate?: string;
  
  /** Requested Delivery Date (VDATU) */
  RequestedDeliveryDate?: string;
  
  /** Pricing Date (PRSDT) */
  PricingDate?: string;
  
  /** Document Currency (WAERK) */
  DocumentCurrency: string;
  
  /** Exchange Rate (WKURS) */
  ExchangeRate?: string;
  
  /** Payment Terms (ZTERM) */
  PaymentTerms?: string;
  
  /** Incoterms Classification (INCO1) */
  IncotermsClassification?: string;
  
  /** Incoterms Location (INCO2) */
  IncotermsLocation?: string;
  
  /** Total Net Amount */
  TotalNetAmount: number;
  
  /** Total Tax Amount */
  TotalTaxAmount: number;
  
  /** Total Gross Amount */
  TotalGrossAmount: number;
  
  /** Order Reason (AUGRU) */
  OrderReason?: string;
  
  /** Customer Reference */
  CustomerReference?: string;
  
  /** Your Reference */
  YourReference?: string;
  
  /** Sales District (BZIRK) */
  SalesDistrict?: string;
  
  /** Price Group (KONDA) */
  PriceGroup?: string;
  
  /** Price List (PLTYP) */
  PriceList?: string;
}

// ============================================================================
// Partner Functions
// ============================================================================

export interface SAPPartner {
  /** Partner Function (PARVW) - AG=SoldTo, WE=ShipTo, RE=BillTo, RG=Payer */
  PartnerFunction: string;
  
  /** Customer Number (KUNNR) */
  CustomerNumber: string;
  
  /** Name 1 */
  Name1: string;
  
  /** Name 2 */
  Name2?: string;
  
  /** Street */
  Street?: string;
  
  /** House Number */
  HouseNumber?: string;
  
  /** Postal Code */
  PostalCode?: string;
  
  /** City */
  City?: string;
  
  /** Region (REGIO) */
  Region?: string;
  
  /** Country (LAND1) */
  Country?: string;
  
  /** Tax Number 1 (STCD1) */
  TaxNumber1?: string;
  
  /** Tax Number 2 (STCD2) */
  TaxNumber2?: string;
  
  /** Tax Classification (TAXKD) */
  TaxClassification?: string;
  
  /** Contact Person */
  ContactPerson?: string;
  
  /** Telephone */
  Telephone?: string;
  
  /** Email Address */
  EmailAddress?: string;
  
  /** Customer Group (KDGRP) */
  CustomerGroup?: string;
  
  /** Price List Type */
  PriceListType?: string;
  
  /** Unloading Point (ABLAD) */
  UnloadingPoint?: string;
  
  /** Receiving Plant */
  ReceivingPlant?: string;
  
  /** Payment Terms (specific to payer) */
  PaymentTerms?: string;
  
  /** Account Group (KTOKD) */
  AccountGroup?: string;
}

export interface SAPPartnerFunctions {
  /** Sold-To Party (AG) */
  SoldToParty: SAPPartner;
  
  /** Ship-To Party (WE) */
  ShipToParty?: SAPPartner;
  
  /** Bill-To Party (RE) */
  BillToParty?: SAPPartner;
  
  /** Payer Party (RG) */
  PayerParty?: SAPPartner;
}

// ============================================================================
// Order Line Items
// ============================================================================

export interface SAPOrderItemHeader {
  /** Item Number (POSNR) */
  ItemNumber: string;
  
  /** Higher-Level Item (UEPOS) */
  HigherLevelItem?: string;
  
  /** Item Category (PSTYV) */
  ItemCategory: string;
  
  /** Item Type */
  ItemType: string;
}

export interface SAPMaterial {
  /** Material Number (MATNR) */
  MaterialNumber: string;
  
  /** Material Group (MATKL) */
  MaterialGroup: string;
  
  /** Material Description (short) */
  MaterialDescription: string;
  
  /** Material Description (long) */
  MaterialDescriptionLong?: string;
  
  /** Product Hierarchy (PRODH) */
  ProductHierarchy?: string;
  
  /** Division (SPART) */
  Division?: string;
}

export interface SAPQuantity {
  /** Order Quantity (KWMENG) */
  OrderQuantity: number;
  
  /** Sales Unit (VRKME) */
  SalesUnit: string;
  
  /** Base Unit (MEINS) */
  BaseUnit: string;
  
  /** Alternative Unit */
  AlternativeUnit?: string;
  
  /** Numerator for Conversion (UMZIN) */
  NumeratorConversion?: string;
  
  /** Denominator for Conversion (UMZAN) */
  DenominatorConversion?: string;
  
  /** Quantity in Base Unit */
  QuantityInBaseUnit?: number;
  
  /** Net Weight (NTGEW) */
  NetWeight?: number;
  
  /** Weight Unit (GEWEI) */
  WeightUnit?: string;
  
  /** Gross Weight (BRGEW) */
  GrossWeight?: number;
  
  /** Volume (VOLUM) */
  Volume?: number;
  
  /** Volume Unit (VOLEH) */
  VolumeUnit?: string;
}

export interface SAPSchedule {
  /** Requested Delivery Date */
  RequestedDeliveryDate?: string;
  
  /** Confirmed Delivery Date */
  ConfirmedDeliveryDate?: string;
  
  /** Shipping Point (VSTEL) */
  ShippingPoint?: string;
  
  /** Loading Group (LADGR) */
  LoadingGroup?: string;
  
  /** Transportation Group (TRAGR) */
  TransportationGroup?: string;
  
  /** Route (ROUTE) */
  Route?: string;
}

export interface SAPPricing {
  /** Net Price (NETPR) */
  NetPrice: number;
  
  /** Price Unit (PEINH) */
  PriceUnit?: number;
  
  /** Pricing Unit (KMEIN) */
  PricingUnit?: string;
  
  /** Currency (WAERS) */
  Currency: string;
  
  /** Gross Price */
  GrossPrice?: number;
  
  /** Net Value (NETWR) */
  NetValue: number;
  
  /** Tax Amount (MWSBP) */
  TaxAmount: number;
  
  /** Tax Rate */
  TaxRate: number;
  
  /** Tax Code (MWSKZ) */
  TaxCode: string;
  
  /** Tax Classification (TAXM1) */
  TaxClassification?: string;
  
  /** Subtotal Value */
  SubtotalValue?: number;
  
  /** Gross Value */
  GrossValue: number;
}

export interface SAPCondition {
  /** Condition Type (KSCHL) */
  ConditionType: string;
  
  /** Condition Description */
  ConditionDescription?: string;
  
  /** Condition Value (KWERT) */
  ConditionValue?: number;
  
  /** Condition Currency */
  ConditionCurrency?: string;
  
  /** Condition Unit */
  ConditionUnit?: string;
  
  /** Condition Rate */
  ConditionRate?: number;
}

export interface SAPOrderItem {
  /** Item Header */
  Item: SAPOrderItemHeader;
  
  /** Material Information */
  Material: SAPMaterial;
  
  /** Quantity Information */
  Quantity: SAPQuantity;
  
  /** Schedule Information */
  Schedule?: SAPSchedule;
  
  /** Pricing Information */
  Pricing: SAPPricing;
  
  /** Conditions/Pricing Elements */
  Conditions?: SAPCondition[];
  
  /** Plant (WERKS) */
  Plant?: string;
  
  /** Storage Location (LGORT) */
  StorageLocation?: string;
  
  /** Shipping Point (VSTEL) */
  ShippingPoint?: string;
  
  /** Delivery Priority (LPRIO) */
  DeliveryPriority?: string;
  
  /** Item Text */
  ItemText?: string;
  
  /** Customer Material Number */
  CustomerMaterialNumber?: string;
  
  /** Manufacturer Material Number */
  ManufacturerMaterialNumber?: string;
  
  /** Manufacturer */
  Manufacturer?: string;
  
  /** Material Group 1 (MVGR1) */
  MaterialGroup1?: string;
  
  /** Material Group 2 (MVGR2) */
  MaterialGroup2?: string;
  
  /** Material Group 3 (MVGR3) */
  MaterialGroup3?: string;
  
  /** Profit Center (PRCTR) */
  ProfitCenter?: string;
  
  /** WBS Element (PS_PSP_PNR) */
  WBSElement?: string;
  
  /** Account Assignment */
  AccountAssignment?: string;
  
  /** Batch Number (CHARG) */
  BatchNumber?: string;
  
  /** Serial Numbers */
  SerialNumbers?: string[];
}

// ============================================================================
// Totals & Tax Breakdown
// ============================================================================

export interface SAPHeaderTotals {
  /** Total Net Value of Items */
  TotalNetValueItems: number;
  
  /** Total Tax Amount */
  TotalTaxAmount: number;
  
  /** Total Gross Amount */
  TotalGrossAmount: number;
  
  /** Currency */
  Currency: string;
}

export interface SAPTaxBreakdown {
  /** Tax Code */
  TaxCode: string;
  
  /** Tax Description */
  TaxDescription?: string;
  
  /** Tax Rate */
  TaxRate: number;
  
  /** Taxable Amount */
  TaxableAmount: number;
  
  /** Tax Amount */
  TaxAmount: number;
  
  /** Tax Jurisdiction */
  TaxJurisdiction?: string;
  
  /** Currency */
  Currency: string;
}

export interface SAPTotals {
  /** Header-Level Totals */
  HeaderTotals: SAPHeaderTotals;
  
  /** Tax Breakdown by Code/Rate */
  TaxBreakdown?: SAPTaxBreakdown[];
}

// ============================================================================
// Status Information
// ============================================================================

export interface SAPStatus {
  /** Overall Status (ABSTK) */
  OverallStatus?: string;
  
  /** Processing Status */
  ProcessingStatus?: string;
  
  /** Delivery Status (LFSTK) */
  DeliveryStatus?: string;
  
  /** Billing Status (FKSTK) */
  BillingStatus?: string;
  
  /** Rejection Status */
  RejectionStatus?: string;
  
  /** Credit Status */
  CreditStatus?: string;
  
  /** Block Status */
  BlockStatus?: string;
}

// ============================================================================
// Metadata
// ============================================================================

export interface SAPMetadata {
  /** Source System Identifier */
  SourceSystem: string;
  
  /** System Client (MANDT) */
  SystemClient?: string;
  
  /** Logical System (LOGSYS) */
  LogicalSystem?: string;
  
  /** Data Origin Description */
  DataOrigin?: string;
  
  /** Export Timestamp */
  ExportTimestamp?: string;
  
  /** Data Version */
  DataVersion?: string;
  
  /** Transaction Code Used */
  TransactionCode?: string;
  
  /** User Role */
  UserRole?: string;
  
  /** Organization Unit */
  OrganizationUnit?: string;
}

// ============================================================================
// Complete SAP Order Document
// ============================================================================

export interface SAPOrder {
  /** Comment/Description (not part of business data) */
  _comment?: string;
  
  /** Description (not part of business data) */
  _description?: string;
  
  /** Order Header Data */
  OrderHeader: SAPOrderHeader;
  
  /** Partner Functions */
  PartnerFunctions: SAPPartnerFunctions;
  
  /** Order Line Items */
  OrderItems: SAPOrderItem[];
  
  /** Totals and Tax Summary */
  Totals?: SAPTotals;
  
  /** Status Information */
  Status?: SAPStatus;
  
  /** Metadata */
  Metadata?: SAPMetadata;
}

// ============================================================================
// Field Groups for Inventory
// ============================================================================

export type SAPFieldGroup = 
  | 'OrderHeader'
  | 'Partner'
  | 'LineItem'
  | 'Material'
  | 'Quantity'
  | 'Schedule'
  | 'Pricing'
  | 'Totals'
  | 'Status'
  | 'Metadata';

export interface SAPFieldInfo {
  path: string;
  sapFieldName?: string;
  sapTableField?: string;
  group: SAPFieldGroup;
  dataType: string;
  required: boolean;
  description: string;
  exampleValue?: any;
}
