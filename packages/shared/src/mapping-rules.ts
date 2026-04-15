/**
 * Mapping rules from SAP Order structure to One Record Order (fcior/UBL-aligned)
 * 
 * This file defines the declarative mapping rules used by the mapping engine.
 * Rules are organized hierarchically to match the target One Record structure.
 */

export interface MappingRule {
  targetPath: string;
  sourcePath?: string;
  sourceFunction?: (sapOrder: any) => any;
  transform?: (value: any, sapOrder?: any) => any;
  required?: boolean;
  description?: string;
}

export const ONE_RECORD_ORDER_MAPPING: MappingRule[] = [
  // Document-level fields
  {
    targetPath: '@context',
    sourceFunction: () => [
      'https://iri.suomi.fi/model/fcior/context',
      {
        '@vocab': 'https://iri.suomi.fi/model/fcior#',
        'busdoc': 'https://iri.suomi.fi/model/busdoc/'
      }
    ],
    description: 'JSON-LD context for semantic linking'
  },
  {
    targetPath: '@type',
    sourceFunction: () => 'OneRecordOrder',
    description: 'Type identifier for One Record Order'
  },
  {
    targetPath: '@id',
    sourcePath: 'OrderHeader.DocumentNumber',
    transform: (docNum: string) => `urn:order:sap:${docNum}`,
    required: true,
    description: 'Unique identifier for this order document'
  },
  {
    targetPath: 'orderNumber',
    sourcePath: 'OrderHeader.DocumentNumber',
    required: true,
    description: 'SAP Order document number → Order identifier'
  },
  {
    targetPath: 'issueDate',
    sourcePath: 'OrderHeader.DocumentDate',
    required: true,
    description: 'SAP Document date → Order issue date'
  },
  {
    targetPath: 'buyerReference',
    sourcePath: 'OrderHeader.PurchaseOrderNumber',
    description: 'Customer PO number → Buyer reference'
  },
  {
    targetPath: 'documentCurrency',
    sourcePath: 'OrderHeader.Currency',
    required: true,
    description: 'SAP Currency → Document currency code'
  },

  // Buyer Customer Party
  {
    targetPath: 'buyerCustomerParty.@type',
    sourceFunction: () => 'Party',
    description: 'Type for buyer party'
  },
  {
    targetPath: 'buyerCustomerParty.partyIdentification',
    sourcePath: 'OrderHeader.SoldToParty.CustomerNumber',
    required: true,
    description: 'SAP Customer number → Party ID'
  },
  {
    targetPath: 'buyerCustomerParty.partyName',
    sourcePath: 'OrderHeader.SoldToParty.Name',
    required: true,
    description: 'SAP Customer name → Party name'
  },
  {
    targetPath: 'buyerCustomerParty.postalAddress.@type',
    sourceFunction: () => 'Address',
    description: 'Type for address'
  },
  {
    targetPath: 'buyerCustomerParty.postalAddress.streetName',
    sourcePath: 'OrderHeader.SoldToParty.Street',
    description: 'SAP Street → Street name'
  },
  {
    targetPath: 'buyerCustomerParty.postalAddress.cityName',
    sourcePath: 'OrderHeader.SoldToParty.City',
    description: 'SAP City → City name'
  },
  {
    targetPath: 'buyerCustomerParty.postalAddress.postalZone',
    sourcePath: 'OrderHeader.SoldToParty.PostalCode',
    description: 'SAP Postal code → Postal zone'
  },
  {
    targetPath: 'buyerCustomerParty.postalAddress.countryCode',
    sourcePath: 'OrderHeader.SoldToParty.Country',
    description: 'SAP Country → Country code'
  },
  {
    targetPath: 'buyerCustomerParty.partyTaxScheme.companyID',
    sourcePath: 'OrderHeader.SoldToParty.VATNumber',
    description: 'SAP VAT number → Tax scheme company ID'
  },
  {
    targetPath: 'buyerCustomerParty.contact.name',
    sourcePath: 'OrderHeader.SoldToParty.ContactPerson',
    description: 'SAP Contact person → Contact name'
  },
  {
    targetPath: 'buyerCustomerParty.contact.telephone',
    sourcePath: 'OrderHeader.SoldToParty.Phone',
    description: 'SAP Phone → Contact telephone'
  },
  {
    targetPath: 'buyerCustomerParty.contact.electronicMail',
    sourcePath: 'OrderHeader.SoldToParty.Email',
    description: 'SAP Email → Contact email'
  },

  // Delivery Location (from ShipToParty)
  {
    targetPath: 'deliveryLocation.@type',
    sourceFunction: () => 'Address',
    description: 'Type for delivery location'
  },
  {
    targetPath: 'deliveryLocation.streetName',
    sourcePath: 'OrderHeader.ShipToParty.Street',
    description: 'SAP Ship-to street → Delivery street'
  },
  {
    targetPath: 'deliveryLocation.cityName',
    sourcePath: 'OrderHeader.ShipToParty.City',
    description: 'SAP Ship-to city → Delivery city'
  },
  {
    targetPath: 'deliveryLocation.postalZone',
    sourcePath: 'OrderHeader.ShipToParty.PostalCode',
    description: 'SAP Ship-to postal code → Delivery postal zone'
  },
  {
    targetPath: 'deliveryLocation.countryCode',
    sourcePath: 'OrderHeader.ShipToParty.Country',
    description: 'SAP Ship-to country → Delivery country'
  },

  // Delivery terms
  {
    targetPath: 'requestedDeliveryDate',
    sourcePath: 'OrderHeader.RequestedDeliveryDate',
    description: 'SAP Requested delivery date'
  },

  // Payment terms
  {
    targetPath: 'paymentTerms.note',
    sourcePath: 'OrderHeader.PaymentTerms',
    description: 'SAP Payment terms → Payment terms note'
  },

  // Legal Monetary Total
  {
    targetPath: 'legalMonetaryTotal.@type',
    sourceFunction: () => 'MonetaryTotal',
    description: 'Type for monetary total'
  },
  {
    targetPath: 'legalMonetaryTotal.lineExtensionTotalAmount',
    sourcePath: 'OrderHeader.TotalNetAmount',
    required: true,
    description: 'SAP Total net amount → Line extension total'
  },
  {
    targetPath: 'legalMonetaryTotal.taxExclusiveAmount',
    sourcePath: 'OrderHeader.TotalNetAmount',
    required: true,
    description: 'SAP Total net amount → Tax exclusive amount'
  },
  {
    targetPath: 'legalMonetaryTotal.taxInclusiveAmount',
    sourcePath: 'OrderHeader.TotalGrossAmount',
    required: true,
    description: 'SAP Total gross amount → Tax inclusive amount'
  },
  {
    targetPath: 'legalMonetaryTotal.payableAmount',
    sourcePath: 'OrderHeader.TotalGrossAmount',
    required: true,
    description: 'SAP Total gross amount → Payable amount'
  },

  // Tax Total
  {
    targetPath: 'taxTotal.@type',
    sourceFunction: () => 'TaxTotal',
    description: 'Type for tax total'
  },
  {
    targetPath: 'taxTotal.totalTaxAmount',
    sourcePath: 'OrderHeader.TotalTaxAmount',
    required: true,
    description: 'SAP Total tax amount → Tax total'
  },

  // Metadata for traceability
  {
    targetPath: 'metadata.sourceSystem',
    sourcePath: 'Metadata.SystemSource',
    description: 'Source system identifier'
  },
  {
    targetPath: 'metadata.sourceDocumentID',
    sourcePath: 'OrderHeader.DocumentNumber',
    description: 'Original SAP document number'
  },
  {
    targetPath: 'metadata.transformedAt',
    sourceFunction: () => new Date().toISOString(),
    description: 'Timestamp of transformation'
  },
  {
    targetPath: 'metadata.mappingVersion',
    sourceFunction: () => '1.0.0',
    description: 'Version of mapping rules applied'
  }
];

/**
 * Mapping rules for Order Line items
 * These are applied to each item in the OrderItems array
 */
export const ORDER_LINE_MAPPING: MappingRule[] = [
  {
    targetPath: '@type',
    sourceFunction: () => 'OrderLine',
    description: 'Type for order line'
  },
  {
    targetPath: 'lineID',
    sourcePath: 'ItemNumber',
    required: true,
    description: 'SAP Item number → Line ID'
  },
  {
    targetPath: 'orderedQuantity',
    sourcePath: 'Quantity',
    required: true,
    description: 'SAP Quantity → Ordered quantity'
  },
  {
    targetPath: 'orderedQuantity@unitCode',
    sourcePath: 'UnitOfMeasure',
    description: 'SAP Unit of measure → Unit code'
  },
  {
    targetPath: 'lineExtensionAmount',
    sourcePath: 'NetValue',
    required: true,
    description: 'SAP Net value → Line extension amount'
  },
  {
    targetPath: 'lineExtensionAmount@currencyID',
    sourceFunction: (item: any, sapOrder: any) => sapOrder?.OrderHeader?.Currency || 'EUR',
    description: 'Currency from header'
  },

  // Item details
  {
    targetPath: 'item.@type',
    sourceFunction: () => 'Item',
    description: 'Type for item'
  },
  {
    targetPath: 'item.itemName',
    sourcePath: 'MaterialDescription',
    required: true,
    description: 'SAP Material description → Item name'
  },
  {
    targetPath: 'item.sellersItemIdentification',
    sourcePath: 'MaterialNumber',
    description: 'SAP Material number → Seller item ID'
  },
  {
    targetPath: 'item.classifiedTaxCategory.@type',
    sourceFunction: () => 'TaxCategory',
    description: 'Type for tax category'
  },
  {
    targetPath: 'item.classifiedTaxCategory.taxCategoryID',
    sourceFunction: () => 'S',  // Standard rate
    description: 'Tax category ID (S = standard rate)'
  },
  {
    targetPath: 'item.classifiedTaxCategory.percent',
    sourcePath: 'TaxRate',
    description: 'SAP Tax rate → Tax percent'
  },

  // Price
  {
    targetPath: 'price.@type',
    sourceFunction: () => 'Price',
    description: 'Type for price'
  },
  {
    targetPath: 'price.priceAmount',
    sourcePath: 'UnitPrice',
    required: true,
    description: 'SAP Unit price → Price amount'
  },
  {
    targetPath: 'price.priceAmount@currencyID',
    sourceFunction: (item: any, sapOrder: any) => sapOrder?.OrderHeader?.Currency || 'EUR',
    description: 'Currency from header'
  },
  {
    targetPath: 'price.baseQuantity',
    sourceFunction: () => 1,
    description: 'Base quantity for pricing (typically 1)'
  }
];

/**
 * Builds tax subtotal mapping from SAP order items
 * This aggregates tax by rate
 */
export function buildTaxSubtotals(sapOrder: any): any[] {
  const items = sapOrder.OrderItems || [];
  const taxByRate = new Map<number, { taxableAmount: number; taxAmount: number }>();

  items.forEach((item: any) => {
    const rate = item.TaxRate || 0;
    const existing = taxByRate.get(rate) || { taxableAmount: 0, taxAmount: 0 };
    
    existing.taxableAmount += item.NetValue || 0;
    existing.taxAmount += item.TaxAmount || 0;
    
    taxByRate.set(rate, existing);
  });

  const subtotals: any[] = [];
  taxByRate.forEach((amounts, rate) => {
    subtotals.push({
      '@type': 'TaxSubtotal',
      taxableAmount: amounts.taxableAmount,
      taxAmount: amounts.taxAmount,
      taxCategory: {
        '@type': 'TaxCategory',
        taxCategoryID: 'S',  // Standard rate
        percent: rate,
        taxScheme: 'VAT'
      }
    });
  });

  return subtotals;
}
