/**
 * Sample SAP ECC 6.0 Order #2 - Electronics/Equipment Industry
 * Based on ORDERS05 IDoc structure with UK buyer scenario
 */
const SAMPLE_SAP_ORDER_002 = {
  "_comment": "SAP Sales Order - Electronics Industry Example",
  "_description": "UK buyer ordering electric bikes from European supplier - based on ORDERS05 IDoc structure",
  "OrderHeader": {
    "SalesDocument": "ONE-ORD-0001",
    "SalesDocumentType": "OR",
    "SalesOrganization": "2000",
    "DistributionChannel": "10",
    "Division": "20",
    "SalesOffice": "GB01",
    "SalesGroup": "002",
    "DocumentDate": "2026-01-01",
    "CreatedBy": "SAPUSER02",
    "CreatedOn": "2026-01-01",
    "CreatedAtTime": "14:15:00",
    "LastChangedBy": "SAPUSER02",
    "LastChangedOn": "2026-01-01",
    "PurchaseOrderByCustomer": "PO-GB-2026-0001",
    "CustomerPurchaseOrderDate": "2025-12-28",
    "RequestedDeliveryDate": "2026-02-01",
    "PricingDate": "2026-01-01",
    "DocumentCurrency": "EUR",
    "ExchangeRate": "0.85000",
    "PaymentTerms": "Z030",
    "IncotermsClassification": "DDP",
    "IncotermsLocation": "Buyertown",
    "TotalNetAmount": 25000.00,
    "TotalTaxAmount": 5000.00,
    "TotalGrossAmount": 30000.00,
    "OrderReason": "Standard Equipment Order",
    "CustomerReference": "Fleet Upgrade 2026",
    "YourReference": "John Smith",
    "SalesDistrict": "GB-LONDON",
    "PriceGroup": "02",
    "PriceList": "EXPORT"
  },
  "PartnerFunctions": {
    "SoldToParty": {
      "PartnerFunction": "AG",
      "CustomerNumber": "EX-BUY-0001",
      "Name1": "ExampleBuyer Ltd",
      "Name2": "Procurement Department",
      "Street": "Buyer Street",
      "HouseNumber": "Building One",
      "PostalCode": "10001",
      "City": "Buyertown",
      "Region": "GB-LND",
      "Country": "GB",
      "TaxNumber1": "GB123456789",
      "TaxNumber2": "",
      "TaxClassification": "1",
      "ContactPerson": "John Smith",
      "Telephone": "+44 7000 000001",
      "EmailAddress": "purchasing@examplebuyer.com",
      "CustomerGroup": "ELEC",
      "PriceListType": "02"
    },
    "ShipToParty": {
      "PartnerFunction": "WE",
      "CustomerNumber": "DELIVERY-LOC-0001",
      "Name1": "Example Logistics Hub London",
      "Name2": "Warehouse 3",
      "Street": "Buyer Street",
      "HouseNumber": "",
      "PostalCode": "10001",
      "City": "Buyertown",
      "Region": "GB-LND",
      "Country": "GB",
      "UnloadingPoint": "DOCK-A",
      "ReceivingPlant": "2000"
    },
    "BillToParty": {
      "PartnerFunction": "RE",
      "CustomerNumber": "EX-BUY-0001",
      "Name1": "ExampleBuyer Ltd",
      "Name2": "Finance Department",
      "Street": "Buyer Street",
      "HouseNumber": "Building One",
      "PostalCode": "10001",
      "City": "Buyertown",
      "Region": "GB-LND",
      "Country": "GB"
    },
    "PayerParty": {
      "PartnerFunction": "RG",
      "CustomerNumber": "EX-BUY-0001",
      "Name1": "ExampleBuyer Ltd",
      "PaymentTerms": "Z030",
      "AccountGroup": "KUNA"
    },
    "SellerParty": {
      "PartnerFunction": "LF",
      "CustomerNumber": "EX-SEL-0001",
      "Name1": "ExampleSeller Plc",
      "Name2": "Sales Division",
      "Street": "Seller Avenue",
      "HouseNumber": "",
      "PostalCode": "20002",
      "City": "Sellerville",
      "Region": "GB-LND",
      "Country": "GB",
      "Telephone": "+44 7000 000002",
      "EmailAddress": "sales@example-seller.com"
    },
    "SupplierParty": {
      "PartnerFunction": "BA",
      "CustomerNumber": "EX-SUP-0001",
      "Name1": "ExampleSupplier GmbH",
      "Name2": "Distribution Center",
      "Street": "Supplier Road",
      "HouseNumber": "",
      "PostalCode": "30003",
      "City": "Supply City",
      "Region": "DE-BE",
      "Country": "DE",
      "Telephone": "+49 7000 000003",
      "EmailAddress": "dispatch@example-supplier.com"
    }
  },
  "OrderItems": [
    {
      "Item": {
        "ItemNumber": "000010",
        "HigherLevelItem": "",
        "ItemCategory": "TAN",
        "ItemType": "Material"
      },
      "Material": {
        "MaterialNumber": "SELLER-ITEM-EBIKE-001",
        "MaterialGroup": "EBIKES",
        "MaterialDescription": "Example Electric Bike",
        "MaterialDescriptionLong": "Electric Bike Model X1, 250W motor, 50km range, aluminum frame",
        "ProductHierarchy": "002001001",
        "Division": "20"
      },
      "Quantity": {
        "OrderQuantity": 10,
        "SalesUnit": "EA",
        "BaseUnit": "EA",
        "AlternativeUnit": "",
        "NumeratorConversion": "1",
        "DenominatorConversion": "1",
        "QuantityInBaseUnit": 10,
        "NetWeight": 28.500,
        "WeightUnit": "KGM",
        "GrossWeight": 30.000,
        "Volume": 0.850,
        "VolumeUnit": "MTQ"
      },
      "Schedule": {
        "RequestedDeliveryDate": "2026-02-01",
        "ConfirmedDeliveryDate": "2026-02-01",
        "ShippingPoint": "2000",
        "LoadingGroup": "0001",
        "TransportationGroup": "0001",
        "Route": "GB001"
      },
      "Pricing": {
        "NetPrice": 2500.00,
        "PriceUnit": 1,
        "PricingUnit": "EA",
        "Currency": "EUR",
        "GrossPrice": 2500.00,
        "NetValue": 25000.00,
        "TaxAmount": 5000.00,
        "TaxRate": 20.00,
        "TaxCode": "V1",
        "TaxClassification": "1",
        "SubtotalValue": 25000.00,
        "GrossValue": 30000.00
      },
      "Conditions": [
        {
          "ConditionType": "PR00",
          "ConditionDescription": "Unit Price",
          "ConditionValue": 2500.00,
          "ConditionCurrency": "EUR",
          "ConditionUnit": "EA"
        },
        {
          "ConditionType": "MWST",
          "ConditionDescription": "VAT",
          "ConditionRate": 20.00,
          "ConditionValue": 5000.00,
          "ConditionCurrency": "EUR"
        }
      ],
      "Plant": "2000",
      "StorageLocation": "0001",
      "ShippingPoint": "2000",
      "DeliveryPriority": "02",
      "ItemText": "Delivery to Example Logistics Hub London, Warehouse 3",
      "CustomerMaterialNumber": "BUYER-EBIKE-X1",
      "MaterialGroup1": "TRANSPORT",
      "MaterialGroup2": "ELECTRIC",
      "MaterialGroup3": "BIKES",
      "ProfitCenter": "2000",
      "WBSElement": "P-2000-FL-01",
      "AccountAssignment": "Fleet Upgrade 2026 - Electric Mobility"
    }
  ],
  "Totals": {
    "HeaderTotals": {
      "TotalNetValueItems": 25000.00,
      "TotalTaxAmount": 5000.00,
      "TotalGrossAmount": 30000.00,
      "Currency": "EUR"
    },
    "TaxBreakdown": [
      {
        "TaxCode": "V1",
        "TaxDescription": "Standard VAT 20%",
        "TaxRate": 20.00,
        "TaxableAmount": 25000.00,
        "TaxAmount": 5000.00,
        "TaxJurisdiction": "GB",
        "Currency": "EUR"
      }
    ]
  },
  "Status": {
    "OverallStatus": "A",
    "ProcessingStatus": "Open",
    "DeliveryStatus": "Not yet processed",
    "BillingStatus": "Not yet processed",
    "RejectionStatus": "",
    "CreditStatus": "Released",
    "BlockStatus": ""
  },
  "Metadata": {
    "SourceSystem": "SAP_ECC_6.0",
    "SystemClient": "200",
    "LogicalSystem": "SAPGB",
    "DataOrigin": "SD Sales Order Entry",
    "ExportTimestamp": "2026-01-01T14:20:00Z",
    "DataVersion": "1.0",
    "TransactionCode": "VA01",
    "UserRole": "Sales Processor",
    "OrganizationUnit": "Sales UK",
    "IdocType": "ORDERS05",
    "MessageType": "ORDERS",
    "SenderPort": "SAPEXP",
    "SenderPartnerType": "LS",
    "SenderPartnerNumber": "SAPCLNT200",
    "ReceiverPartnerNumber": "ONE-PARTY-SEL-0001"
  }
};
