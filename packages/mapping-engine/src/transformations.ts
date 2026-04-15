/**
 * Transformation Functions for SAP → One Record Mapping
 */

import { TransformFunction, TransformationContext } from './types';

// ============================================================================
// Helper Functions
// ============================================================================

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    // Handle array notation: OrderItems[0].Material
    const match = key.match(/^(.+)\[(\d+|\*)\]$/);
    if (match) {
      const [, arrayKey, index] = match;
      const array = current?.[arrayKey];
      if (!Array.isArray(array)) return undefined;
      return index === '*' ? array : array[parseInt(index, 10)];
    }
    return current?.[key];
  }, obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
}

// ============================================================================
// Date/Time Transformations
// ============================================================================

export const toISODate: TransformFunction = (ctx) => {
  const value = ctx.sourceValue;
  if (!value) return undefined;
  
  // If already ISO format (YYYY-MM-DD), return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  
  // If SAP format (YYYYMMDD), convert
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  
  return value;
};

export const toISOTime: TransformFunction = (ctx) => {
  const value = ctx.sourceValue;
  if (!value) return undefined;
  
  // If already ISO format (HH:MM:SS), return as-is
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  
  // If SAP format (HHMMSS), convert
  if (/^\d{6}$/.test(value)) {
    return `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4, 6)}`;
  }
  
  return value;
};

export const currentISOTimestamp: TransformFunction = () => {
  return new Date().toISOString();
};

// ============================================================================
// Code Transformations
// ============================================================================

export const sapOrderTypeToUBL: TransformFunction = (ctx) => {
  const sapType = ctx.sourceValue;
  const mapping = ctx.config?.lookupTables?.orderTypeCodes || {
    'OR': '220',  // Standard Order → Order
    'RO': '226',  // Rush Order → Blanket Order
    'KE': '227',  // Contract → Framework Agreement
  };
  
  return mapping[sapType] || sapType;
};

export const sapTaxCodeToUBL: TransformFunction = (ctx) => {
  const sapTax = ctx.sourceValue;
  const mapping = ctx.config?.lookupTables?.taxCodes || {
    'S1': 'S',   // Standard VAT → Standard rate
    'S0': 'Z',   // Zero VAT → Zero rated
    'E': 'E',    // Exempt → Exempt
    'AE': 'AE',  // Reverse Charge → VAT Reverse Charge
  };
  
  return mapping[sapTax] || 'S';  // Default to Standard
};

export const sapUoMToUNCEFACT: TransformFunction = (ctx) => {
  const sapUoM = ctx.sourceValue;
  const mapping = ctx.config?.lookupTables?.unitOfMeasure || {
    'M3': 'MTQ',   // Cubic meter
    'PC': 'PCE',   // Piece
    'KG': 'KGM',   // Kilogram
    'L': 'LTR',    // Liter
    'M': 'MTR',    // Meter
    'TO': 'TNE',   // Metric ton
    'M2': 'MTK',   // Square meter
    'EA': 'EA',    // Each
    'ST': 'PCE',   // Stück (German) → Piece
  };
  
  return mapping[sapUoM] || sapUoM;
};

export const sapUoMToReadable: TransformFunction = (ctx) => {
  const sapUoM = ctx.sourceValue;
  const mapping: Record<string, string> = {
    'M3': 'cubic meter',
    'PC': 'piece',
    'KG': 'kilogram',
    'L': 'liter',
    'M': 'meter',
    'TO': 'metric ton',
    'M2': 'square meter',
    'EA': 'each',
    'ST': 'piece',
    'MTQ': 'cubic meter',
    'PCE': 'piece',
    'KGM': 'kilogram',
    'LTR': 'liter',
    'MTR': 'meter',
    'TNE': 'metric ton',
    'MTK': 'square meter',
  };
  
  return mapping[sapUoM] || sapUoM.toLowerCase();
};

export const sapPaymentTermsToText: TransformFunction = (ctx) => {
  const sapCode = ctx.sourceValue;
  const mapping = ctx.config?.lookupTables?.paymentTerms || {
    'ZN30': 'Net 30 days',
    'ZN14': 'Net 14 days',
    'ZN07': 'Net 7 days',
    'Z001': 'Payable immediately',
    'ZCO1': 'Cash on delivery',
  };
  
  return mapping[sapCode] || `Payment terms: ${sapCode}`;
};

export const extractPaymentDays: TransformFunction = (ctx) => {
  const sapCode = ctx.sourceValue;
  const match = sapCode?.match(/ZN(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
};

// ============================================================================
// Identifier Transformations
// ============================================================================

export const buildOrderURN: TransformFunction = (ctx) => {
  const orderNumber = ctx.sourceValue;
  return `urn:order:sap:${orderNumber}`;
};

export const buildPartyIdentificationScheme: TransformFunction = () => {
  return 'SAP Customer Number';
};

export const buildSellerIdentificationScheme: TransformFunction = () => {
  return 'SAP Sales Organization';
};

export const buildItemIdentificationScheme: TransformFunction = () => {
  return 'SAP Material Number';
};

// ============================================================================
// Composite Transformations
// ============================================================================

export const buildFullAddress: TransformFunction = (ctx) => {
  const source = ctx.source;
  
  // Extract partner path (e.g., "PartnerFunctions.SoldToParty")
  const basePath = ctx.sourcePath.split('.').slice(0, -1).join('.');
  
  const street = getNestedValue(source, `${basePath}.Street`) || '';
  const houseNumber = getNestedValue(source, `${basePath}.HouseNumber`) || '';
  const postalCode = getNestedValue(source, `${basePath}.PostalCode`) || '';
  const city = getNestedValue(source, `${basePath}.City`) || '';
  const country = getNestedValue(source, `${basePath}.Country`) || '';
  
  const streetPart = [street, houseNumber].filter(Boolean).join(' ');
  const cityPart = [postalCode, city].filter(Boolean).join(' ');
  const countryName = getCountryName(country);
  
  return [streetPart, cityPart, countryName].filter(Boolean).join(', ');
};

export const buildPartyName: TransformFunction = (ctx) => {
  const source = ctx.source;
  const basePath = ctx.sourcePath.split('.').slice(0, -1).join('.');
  
  const name1 = getNestedValue(source, `${basePath}.Name1`) || '';
  const name2 = getNestedValue(source, `${basePath}.Name2`) || '';
  
  return [name1, name2].filter(Boolean).join(' ');
};

export const buildIncotermsSpecialTerms: TransformFunction = (ctx) => {
  const inco1 = getNestedValue(ctx.source, 'OrderHeader.IncotermsClassification');
  const inco2 = ctx.sourceValue;
  
  if (!inco1) return undefined;
  if (!inco2) return undefined;
  
  const incoDescriptions: Record<string, string> = {
    'EXW': 'Ex Works',
    'FCA': 'Free Carrier',
    'CPT': 'Carriage Paid To',
    'CIP': 'Carriage and Insurance Paid To',
    'DAP': 'Delivered at Place',
    'DPU': 'Delivered at Place Unloaded',
    'DDP': 'Delivered Duty Paid',
  };
  
  const description = incoDescriptions[inco1] || inco1;
  return `${description} ${inco2}`;
};

// ============================================================================
// Currency/Amount Transformations
// ============================================================================

export const buildCurrencyAmount: TransformFunction = (ctx) => {
  const value = ctx.sourceValue;
  if (value === null || value === undefined) return undefined;
  
  const currency = getNestedValue(ctx.source, 'OrderHeader.DocumentCurrency') || 'EUR';
  
  return {
    value: Number(value),
    currencyCode: currency,
  };
};

export const toCurrencyCode: TransformFunction = (ctx) => {
  // Use header currency
  return getNestedValue(ctx.source, 'OrderHeader.DocumentCurrency') || 'EUR';
};

// ============================================================================
// Static Value Transformations
// ============================================================================

export const staticValue = (value: any): TransformFunction => {
  return () => value;
};

export const buildJSONLDContext: TransformFunction = () => {
  return 'https://iri.suomi.fi/model/fcior/context.jsonld';
};

export const buildJSONLDType: TransformFunction = () => {
  return 'Order';
};

export const staticTaxScheme: TransformFunction = () => {
  return 'VAT';
};

// ============================================================================
// Seller Master Data Lookup
// ============================================================================

export const lookupSellerName: TransformFunction = (ctx) => {
  const salesOrg = ctx.sourceValue;
  const sellerData = ctx.config?.lookupTables?.sellerMasterData?.[salesOrg];
  return sellerData?.name || `Sales Organization ${salesOrg}`;
};

export const lookupSellerAddress: TransformFunction = (ctx) => {
  const salesOrg = getNestedValue(ctx.source, 'OrderHeader.SalesOrganization');
  const sellerData = ctx.config?.lookupTables?.sellerMasterData?.[salesOrg];
  return sellerData?.address || {};
};

// ============================================================================
// Array/Line Item Transformations
// ============================================================================

export const mapLineItems: TransformFunction = (ctx) => {
  const orderItems = ctx.sourceValue;
  if (!Array.isArray(orderItems)) return [];
  
  // This would be called recursively by the engine for each item
  return orderItems;
};

// ============================================================================
// Metadata Transformations
// ============================================================================

export const buildMetadata: TransformFunction = (ctx) => {
  const source = ctx.source;
  
  return {
    sourceSystem: getNestedValue(source, 'Metadata.SourceSystem') || 'SAP_ECC',
    sourceDocumentType: getNestedValue(source, 'Metadata.DataOrigin') || 'SD Sales Order',
    sourceDocumentID: getNestedValue(source, 'OrderHeader.SalesDocument'),
    transformedAt: new Date().toISOString(),
    mappingEngineVersion: ctx.config?.metadata?.version || '1.0.0',
    mappingRulesVersion: ctx.config?.metadata?.rulesVersion || '1.0.0',
    dataOrigin: getNestedValue(source, 'Metadata.DataOrigin'),
  };
};

// ============================================================================
// Utility Functions
// ============================================================================

function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    'FI': 'Finland',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'DE': 'Germany',
    'UK': 'United Kingdom',
    'US': 'United States',
    'FR': 'France',
    // Add more as needed
  };
  return countries[code] || code;
}

// ============================================================================
// Export All Transformation Functions
// ============================================================================

export const transformFunctions: Record<string, TransformFunction> = {
  // Date/Time
  toISODate,
  toISOTime,
  currentISOTimestamp,
  
  // Codes
  sapOrderTypeToUBL,
  sapTaxCodeToUBL,
  sapUoMToUNCEFACT,
  sapUoMToReadable,
  sapPaymentTermsToText,
  extractPaymentDays,
  
  // Identifiers
  buildOrderURN,
  buildPartyIdentificationScheme,
  buildSellerIdentificationScheme,
  buildItemIdentificationScheme,
  
  // Composite
  buildFullAddress,
  buildPartyName,
  buildIncotermsSpecialTerms,
  buildCurrencyAmount,
  toCurrencyCode,
  
  // Static
  buildJSONLDContext,
  buildJSONLDType,
  staticTaxScheme,
  
  // Lookups
  lookupSellerName,
  lookupSellerAddress,
  
  // Arrays
  mapLineItems,
  
  // Metadata
  buildMetadata,
};
