/**
 * Sample SAP ORDERS05 IDoc #2 - Electronics/Equipment Industry
 * Using authentic IDoc XML element names (CURCY, ZTERM, PARVW, etc.)
 */
const SAMPLE_SAP_ORDER_002 = {
  "_comment": "SAP ORDERS05 IDoc - Electronics Industry Example",
  "_description": "UK buyer ordering electric bikes from European supplier - authentic ORDERS05 IDoc structure",
  
  "EDI_DC40": {
    "TABNAM": "EDI_DC40",
    "DIRECT": "1",
    "IDOCTYP": "ORDERS05",
    "MESTYP": "ORDERS",
    "SNDPOR": "SAPEXP",
    "SNDPRT": "LS",
    "SNDPRN": "SAPCLNT200",
    "RCVPRN": "ONE-PARTY-SEL-0001"
  },

  "E1EDK01": {
    "ACTION": "000",
    "CURCY": "EUR",
    "ZTERM": "Z030",
    "BELNR": "ONE-ORD-0001",
    "NTGEW": "28.5",
    "GEPTS": "KGM",
    "WKURS": "0.85000",
    "INCO1": "DDP",
    "INCO2": "Buyertown",
    "AUGRU": "Standard Equipment Order",
    "BSARK": "Fleet Upgrade 2026",
    "IHREZ": "John Smith"
  },

  "E1EDK03": [
    {
      "IDDAT": "022",
      "DATUM": "20260101"
    },
    {
      "IDDAT": "002",
      "DATUM": "20260201"
    }
  ],

  "E1EDKA1": [
    {
      "PARVW": "AG",
      "PARTN": "EX-BUY-0001",
      "NAME1": "ExampleBuyer Ltd",
      "NAME2": "Procurement Department",
      "STRAS": "Buyer Street",
      "STRS2": "Building One",
      "ORT01": "Buyertown",
      "PSTLZ": "10001",
      "LAND1": "GB",
      "REGIO": "GB-LND",
      "STCD1": "GB123456789",
      "STCD2": "",
      "STCEG": "1",
      "PARNR": "John Smith",
      "TELF1": "+44 7000 000001",
      "ITEFN": "purchasing@examplebuyer.com"
    },
    {
      "PARVW": "WE",
      "PARTN": "DELIVERY-LOC-0001",
      "NAME1": "Example Logistics Hub London",
      "NAME2": "Warehouse 3",
      "STRAS": "Buyer Street",
      "ORT01": "Buyertown",
      "PSTLZ": "10001",
      "LAND1": "GB",
      "REGIO": "GB-LND",
      "ABLAD": "DOCK-A"
    },
    {
      "PARVW": "RE",
      "PARTN": "EX-BUY-0001",
      "NAME1": "ExampleBuyer Ltd",
      "NAME2": "Finance Department",
      "STRAS": "Buyer Street",
      "STRS2": "Building One",
      "ORT01": "Buyertown",
      "PSTLZ": "10001",
      "LAND1": "GB",
      "REGIO": "GB-LND"
    },
    {
      "PARVW": "RG",
      "PARTN": "EX-BUY-0001",
      "NAME1": "ExampleBuyer Ltd",
      "ZTERM": "Z030"
    },
    {
      "PARVW": "LF",
      "PARTN": "EX-SEL-0001",
      "NAME1": "ExampleSeller Plc",
      "NAME2": "Sales Division",
      "STRAS": "Seller Avenue",
      "ORT01": "Sellerville",
      "PSTLZ": "20002",
      "LAND1": "GB",
      "REGIO": "GB-LND",
      "TELF1": "+44 7000 000002",
      "ITEFN": "sales@example-seller.com"
    },
    {
      "PARVW": "BA",
      "PARTN": "EX-SUP-0001",
      "NAME1": "ExampleSupplier GmbH",
      "NAME2": "Distribution Center",
      "STRAS": "Supplier Road",
      "ORT01": "Supply City",
      "PSTLZ": "30003",
      "LAND1": "DE",
      "REGIO": "DE-BE",
      "TELF1": "+49 7000 000003",
      "ITEFN": "dispatch@example-supplier.com"
    }
  ],

  "E1EDP01": [
    {
      "POSEX": "000010",
      "ACTION": "000",
      "MENGE": "10.000",
      "MENEE": "EA",
      "NTGEW": "28.500",
      "GEWEI": "KGM",
      "BRGEW": "30.000",
      "VOLUM": "0.850",
      "VOLEH": "MTQ",
      "WERKS": "2000",
      "LGORT": "0001",
      "VSTEL": "2000",
      "LPRIO": "02",
      "POSEX_TEXT": "Delivery to Example Logistics Hub London, Warehouse 3",

      "E1EDP05": [
        {
          "KSCHL": "PR00",
          "BETRG": "2500.00",
          "KWAEH": "EUR",
          "KMEIN": "EA"
        },
        {
          "KSCHL": "MWST",
          "KBETR": "20.00",
          "KWERT": "5000.00",
          "KWAEH": "EUR"
        }
      ],

      "E1EDP19": [
        {
          "QUALF": "001",
          "IDTNR": "SELLER-ITEM-EBIKE-001",
          "KTEXT": "Example Electric Bike"
        },
        {
          "QUALF": "002",
          "IDTNR": "ONE-ITEM-EXAMPLE-EBIKE-0001"
        },
        {
          "QUALF": "003",
          "IDTNR": "GTIN-EXAMPLE-0001"
        },
        {
          "QUALF": "010",
          "IDTNR": "25102001"
        }
      ],

      "E1EDP35": [
        {
          "SERIAL": "EBIKE-SN-EXAMPLE-0001"
        }
      ],

      "E1EDP20": [
        {
          "WMESSION": "DPP-EXAMPLE-EBIKE-0001",
          "WMESSION_TXT": "DigitalProductPassport"
        },
        {
          "WMESSION": "EPD-EXAMPLE-EBIKE-0001",
          "WMESSION_TXT": "EnvironmentalProductDeclaration"
        },
        {
          "WMESSION": "HAZ-EBIKE-LIION-001",
          "WMESSION_TXT": "UN3481"
        }
      ],

      "E1EDK03": [
        {
          "IDDAT": "002",
          "DATUM": "20260201"
        }
      ]
    }
  ],

  "E1EDS01": {
    "SUMID": "001",
    "SUMME": "25000.00",
    "SUNIT": "EUR",
    "MWSKZ": "V1",
    "MSATZ": "20.00",
    "MWSBT": "5000.00",
    "TXJCD": "GB"
  },

  "STATUS": {
    "GBSTK": "A",
    "UVALL": "Open",
    "LFSTK": "Not yet processed",
    "FKSTK": "Not yet processed",
    "ABSTK": "",
    "CMGST": "Released"
  },

  "METADATA": {
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
    "MessageType": "ORDERS"
  }
};
