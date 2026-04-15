/**
 * Default Mapping Configuration
 */

import { MappingConfig } from './types';
import { transformFunctions } from './transformations';
import { allMappingRules, lineItemRules } from './rules';

/**
 * Default lookup tables for code transformations
 */
const defaultLookupTables = {
  orderTypeCodes: {
    'OR': '220',  // Standard Order
    'RO': '226',  // Rush Order / Blanket Order
    'KE': '227',  // Contract / Framework Agreement
  },
  
  taxCodes: {
    'S1': 'S',   // Standard VAT → Standard rate
    'S0': 'Z',   // Zero VAT → Zero rated
    'E': 'E',    // Exempt → Exempt
    'AE': 'AE',  // Reverse Charge → VAT Reverse Charge
  },
  
  unitOfMeasure: {
    'M3': 'MTQ',   // Cubic meter
    'PC': 'PCE',   // Piece
    'KG': 'KGM',   // Kilogram
    'L': 'LTR',    // Liter
    'M': 'MTR',    // Meter
    'TO': 'TNE',   // Metric ton
    'M2': 'MTK',   // Square meter
    'EA': 'EA',    // Each
    'ST': 'PCE',   // Stück → Piece
  },
  
  paymentTerms: {
    'ZN30': 'Net 30 days',
    'ZN14': 'Net 14 days',
    'ZN07': 'Net 7 days',
    'Z001': 'Payable immediately',
    'ZCO1': 'Cash on delivery',
  },
  
  sellerMasterData: {
    '1000': {
      name: 'Rakennustarvike Oy',
      address: {
        streetName: 'Teollisuuskatu 5',
        postalZone: '00510',
        cityName: 'Helsinki',
        countryCode: 'FI',
        fullAddress: 'Teollisuuskatu 5, 00510 Helsinki, Finland',
      },
      taxNumber: 'FI98765432',
    },
    // Add more sales organizations as needed
  },
};

/**
 * Create default mapping configuration
 */
export function createDefaultConfig(): MappingConfig {
  return {
    rules: [...allMappingRules, ...lineItemRules],
    transformFunctions,
    lookupTables: defaultLookupTables,
    options: {
      enableAutoSuggestion: true,
      minimumConfidence: 50,
      includeUnmappedFields: true,
      strictMode: false,
    },
    metadata: {
      version: '1.0.0',
      rulesVersion: '1.0.0',
      description: 'SAP Order to One Record Canonical Order mapping configuration',
    },
  };
}

/**
 * Merge custom configuration with defaults
 */
export function mergeConfig(customConfig: Partial<MappingConfig>): MappingConfig {
  const defaultConfig = createDefaultConfig();

  return {
    ...defaultConfig,
    ...customConfig,
    rules: customConfig.rules || defaultConfig.rules,
    transformFunctions: {
      ...defaultConfig.transformFunctions,
      ...customConfig.transformFunctions,
    },
    lookupTables: {
      ...defaultConfig.lookupTables,
      ...customConfig.lookupTables,
    },
    options: {
      ...defaultConfig.options,
      ...customConfig.options,
    },
    metadata: {
      ...defaultConfig.metadata,
      ...customConfig.metadata,
    },
  };
}
