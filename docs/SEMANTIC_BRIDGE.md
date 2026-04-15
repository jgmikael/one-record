# OneRecord Semantic Bridge Concept

## What is the Semantic Bridge?

The **OneRecord value** acts as a semantic bridge connecting three worlds:

1. **SAP IDoc** (source system)
2. **OneRecord model** (semantic layer)
3. **UBL/Peppol** (target standard)

The same unique identifier appears in all three, creating **automatic mapping** without manual intervention.

---

## Example: Product Identifiers

### SAP ORDERS05 IDoc (E1EDP19 Segments)

```xml
<!-- Seller article -->
<E1EDP19 SEGMENT="1">
  <QUALF>001</QUALF>
  <IDTNR>SELLER-ITEM-EBIKE-001</IDTNR>
</E1EDP19>

<!-- Buyer article -->
<E1EDP19 SEGMENT="1">
  <QUALF>002</QUALF>
  <IDTNR>ONE-ITEM-EXAMPLE-EBIKE-0001</IDTNR>
</E1EDP19>

<!-- GTIN -->
<E1EDP19 SEGMENT="1">
  <QUALF>003</QUALF>
  <IDTNR>GTIN-EXAMPLE-0001</IDTNR>
</E1EDP19>

<!-- UNSPSC Classification -->
<E1EDP19 SEGMENT="1">
  <QUALF>010</QUALF>
  <IDTNR>25102001</IDTNR>
</E1EDP19>
```

### OneRecord Canonical JSON-LD

```jsonld
{
  "item": {
    "sellersItemIdentification": {
      "id": "SELLER-ITEM-EBIKE-001"
    },
    "buyersItemIdentification": {
      "id": "ONE-ITEM-EXAMPLE-EBIKE-0001"
    },
    "standardItemIdentification": {
      "id": "GTIN-EXAMPLE-0001",
      "schemeID": "0160"
    },
    "commodityClassification": {
      "itemClassificationCode": {
        "value": "25102001",
        "listID": "UNSPSC"
      }
    }
  }
}
```

### UBL/Peppol Order

```xml
<cac:Item>
  <cac:SellersItemIdentification>
    <cbc:ID>SELLER-ITEM-EBIKE-001</cbc:ID>
  </cac:SellersItemIdentification>
  <cac:BuyersItemIdentification>
    <cbc:ID>ONE-ITEM-EXAMPLE-EBIKE-0001</cbc:ID>
  </cac:BuyersItemIdentification>
  <cac:StandardItemIdentification>
    <cbc:ID schemeID="0160">GTIN-EXAMPLE-0001</cbc:ID>
  </cac:StandardItemIdentification>
  <cac:CommodityClassification>
    <cbc:ItemClassificationCode listID="UNSPSC">25102001</cbc:ItemClassificationCode>
  </cac:CommodityClassification>
</cac:Item>
```

---

## Complete Mapping Table

| SAP IDOC FIELD | ONERECORD VALUE | UBL / PEPPOL PATH |
|----------------|-----------------|-------------------|
| **CONTROL RECORD** | | |
| EDI_DC40/IDOCTYP | ORDERS05 | (metadata) |
| EDI_DC40/MESTYP | ORDERS | (metadata) |
| EDI_DC40/SNDPRN | SAPCLNT200 | (sender identifier) |
| EDI_DC40/RCVPRN | ONE-PARTY-SEL-0001 | SellerSupplierParty/EndpointID |
| **DOCUMENT HEADER** | | |
| E1EDK01/BELNR | ONE-ORD-0001 | cbc:ID |
| E1EDK01/CURCY | EUR | cbc:DocumentCurrencyCode |
| E1EDK01/ZTERM | Z030 | PaymentMeans/PaymentTerms |
| E1EDK01/NTGEW | 28.5 | cbc:GrossWeightMeasure |
| E1EDK01/GEPTS | KGM | @unitCode |
| E1EDK01/INCO1 | DDP | DeliveryTerms/IncotermsCode |
| E1EDK01/INCO2 | Buyertown | DeliveryTerms/Location |
| E1EDK01/AUGRU | Standard Equipment Order | cbc:Note |
| E1EDK01/BSARK | Fleet Upgrade 2026 | cbc:CustomerReference |
| **DATES** | | |
| E1EDK03/IDDAT (022) | 20260101 | cbc:IssueDate |
| E1EDK03/DATUM (022) | 2026-01-01 | cbc:IssueDate |
| E1EDK03/IDDAT (002) | 20260201 | Delivery/cbc:StartDate |
| E1EDK03/DATUM (002) | 2026-02-01 | Delivery/cbc:StartDate |
| **BUYER PARTNER (PARVW=AG)** | | |
| E1EDKA1/PARVW | AG | (partner function) |
| E1EDKA1/PARTN | EX-BUY-0001 | BuyerCustomerParty/EndpointID |
| E1EDKA1/NAME1 | ExampleBuyer Ltd | cbc:RegistrationName |
| E1EDKA1/NAME2 | Procurement Department | (additional name) |
| E1EDKA1/STRAS | Buyer Street | cbc:StreetName |
| E1EDKA1/STRS2 | Building One | cbc:AdditionalStreetName |
| E1EDKA1/ORT01 | Buyertown | cbc:CityName |
| E1EDKA1/PSTLZ | 10001 | cbc:PostalZone |
| E1EDKA1/LAND1 | GB | cbc:IdentificationCode |
| E1EDKA1/REGIO | GB-LND | cbc:CountrySubentity |
| E1EDKA1/STCD1 | GB123456789 | cbc:CompanyID |
| E1EDKA1/PARNR | John Smith | Contact/cbc:Name |
| E1EDKA1/TELF1 | +44 7000 000001 | cbc:Telephone |
| E1EDKA1/ITEFN | purchasing@examplebuyer.com | cbc:ElectronicMail |
| **SELLER PARTNER (PARVW=LF)** | | |
| E1EDKA1/PARVW | LF | (partner function) |
| E1EDKA1/PARTN | EX-SEL-0001 | SellerSupplierParty/EndpointID |
| E1EDKA1/NAME1 | ExampleSeller Plc | cbc:RegistrationName |
| **SHIP-TO PARTNER (PARVW=WE)** | | |
| E1EDKA1/PARVW | WE | (partner function) |
| E1EDKA1/PARTN | DELIVERY-LOC-0001 | DeliveryLocation/cbc:ID |
| E1EDKA1/NAME1 | Example Logistics Hub London | cbc:Name |
| E1EDKA1/ABLAD | DOCK-A | (unloading point) |
| **SUPPLIER/DESPATCH (PARVW=BA)** | | |
| E1EDKA1/PARVW | BA | (partner function) |
| E1EDKA1/PARTN | EX-SUP-0001 | OriginatorCustomerParty/EndpointID |
| E1EDKA1/NAME1 | ExampleSupplier GmbH | cbc:RegistrationName |
| **LINE ITEM** | | |
| E1EDP01/POSEX | 000010 | OrderLine/cbc:ID (→ 10) |
| E1EDP01/ACTION | 000 | (item action code) |
| E1EDP01/MENGE | 10.000 | cbc:Quantity |
| E1EDP01/MENEE | EA | @unitCode |
| E1EDP01/NTGEW | 28.500 | cbc:GrossWeightMeasure |
| E1EDP01/GEWEI | KGM | @unitCode |
| E1EDP01/VOLUM | 0.850 | cbc:GrossVolumeMeasure |
| E1EDP01/VOLEH | MTQ | @unitCode |
| E1EDP01/WERKS | 2000 | (plant) |
| E1EDP01/VSTEL | 2000 | DeliveryLocation/cbc:ID |
| **ITEM PRICE (E1EDP05)** | | |
| E1EDP05/KSCHL | PR00 | (condition type) |
| E1EDP05/BETRG | 2500.00 | Price/cbc:PriceAmount |
| E1EDP05/KWAEH | EUR | @currencyID |
| E1EDP05/KMEIN | EA | BaseQuantity/@unitCode |
| E1EDP05/KSCHL (MWST) | MWST | (tax condition) |
| E1EDP05/KBETR | 20.00 | TaxCategory/cbc:Percent |
| E1EDP05/KWERT | 5000.00 | TaxSubtotal/cbc:TaxAmount |
| **ITEM IDENTIFICATION (E1EDP19)** | | |
| E1EDP19/QUALF (001) | 001 | (seller's article) |
| E1EDP19/IDTNR (001) | SELLER-ITEM-EBIKE-001 | SellersItemIdentification/cbc:ID |
| E1EDP19/KTEXT (001) | Example Electric Bike | Item/cbc:Name |
| E1EDP19/QUALF (002) | 002 | (buyer's article) |
| E1EDP19/IDTNR (002) | ONE-ITEM-EXAMPLE-EBIKE-0001 | BuyersItemIdentification/cbc:ID |
| E1EDP19/QUALF (003) | 003 | (GTIN/EAN) |
| E1EDP19/IDTNR (003) | GTIN-EXAMPLE-0001 | StandardItemIdentification/cbc:ID (0160) |
| E1EDP19/QUALF (010) | 010 | (UNSPSC) |
| E1EDP19/IDTNR (010) | 25102001 | ItemClassificationCode (UNSPSC) |
| **SERIALIZATION (E1EDP35)** | | |
| E1EDP35/SERIAL | EBIKE-SN-EXAMPLE-0001 | ItemInstance/cbc:SerialID |
| **SUSTAINABILITY & HAZMAT (E1EDP20)** | | |
| E1EDP20/WMESSION (DPP) | DPP-EXAMPLE-EBIKE-0001 | AdditionalDocumentReference/cbc:ID |
| E1EDP20/WMESSION_TXT (DPP) | DigitalProductPassport | AdditionalDocumentReference/cbc:DocumentType |
| E1EDP20/WMESSION (EPD) | EPD-EXAMPLE-EBIKE-0001 | AdditionalDocumentReference/cbc:ID |
| E1EDP20/WMESSION_TXT (EPD) | EnvironmentalProductDeclaration | AdditionalDocumentReference/cbc:DocumentType |
| E1EDP20/WMESSION (HAZ) | HAZ-EBIKE-LIION-001 | HazardousItem/cbc:ID |
| E1EDP20/WMESSION_TXT (HAZ) | UN3481 | HazardousItem/cbc:HazardClassID |
| **TOTALS (E1EDS01)** | | |
| E1EDS01/SUMME | 25000.00 | LegalMonetaryTotal/cbc:LineExtensionAmount |
| E1EDS01/SUNIT | EUR | @currencyID |
| E1EDS01/MWSKZ | V1 | TaxCategory/cbc:ID |
| E1EDS01/MSATZ | 20.00 | TaxCategory/cbc:Percent |
| E1EDS01/MWSBT | 5000.00 | TaxSubtotal/cbc:TaxAmount |

---

## The Bridge in Action

### Step 1: SAP Exports ORDERS05 IDoc
```xml
<E1EDKA1 SEGMENT="1">
  <PARVW>AG</PARVW>
  <PARTN>EX-BUY-0001</PARTN>
  <NAME1>ExampleBuyer Ltd</NAME1>
  <STRAS>Buyer Street</STRAS>
  <ORT01>Buyertown</ORT01>
  <PSTLZ>10001</PSTLZ>
  <LAND1>GB</LAND1>
</E1EDKA1>
```

### Step 2: OneRecord Transforms to Canonical JSON-LD
```jsonld
{
  "buyerCustomerParty": {
    "@type": "Party",
    "partyIdentification": {
      "id": "EX-BUY-0001"
    },
    "partyName": "ExampleBuyer Ltd",
    "postalAddress": {
      "streetName": "Buyer Street",
      "cityName": "Buyertown",
      "postalZone": "10001",
      "country": {
        "identificationCode": "GB"
      }
    }
  }
}
```

### Step 3: UBL/Peppol Order
```xml
<cac:BuyerCustomerParty>
  <cac:Party>
    <cbc:EndpointID>EX-BUY-0001</cbc:EndpointID>
    <cac:PartyName>
      <cbc:Name>ExampleBuyer Ltd</cbc:Name>
    </cac:PartyName>
    <cac:PostalAddress>
      <cbc:StreetName>Buyer Street</cbc:StreetName>
      <cbc:CityName>Buyertown</cbc:CityName>
      <cbc:PostalZone>10001</cbc:PostalZone>
      <cac:Country>
        <cbc:IdentificationCode>GB</cbc:IdentificationCode>
      </cac:Country>
    </cac:PostalAddress>
  </cac:Party>
</cac:BuyerCustomerParty>
```

**Result:** `EX-BUY-0001` flows through all three systems **automatically**, maintaining semantic consistency.

---

## Why This Matters

### Traditional Approach (Manual Mapping)
```
SAP Field → Custom Code → Target Field
```
- Brittle
- Requires maintenance
- Error-prone
- No semantic meaning

### OneRecord Approach (Semantic Bridge)
```
SAP Value → OneRecord Value → UBL Value
```
- **Same identifier** in all systems
- **Self-documenting**
- **Automatic validation** (semantic consistency)
- **Machine-readable** mappings

---

## QUALF Codes Reference

E1EDP19 segment uses QUALF to distinguish identifier types:

| QUALF | Type | UBL Path |
|-------|------|----------|
| 001 | Seller's article | SellersItemIdentification |
| 002 | Buyer's article | BuyersItemIdentification |
| 003 | GTIN (EAN) | StandardItemIdentification (0160) |
| 010 | UNSPSC | ItemClassificationCode |
| 015 | HS Code | ItemClassificationCode |
| 020 | TARIC | ItemClassificationCode |

---

## Advanced: Digital Product Passport (DPP)

### ORDERS05 IDoc - E1EDP20 Segment (Sustainability)
```xml
<E1EDP01 SEGMENT="1">
  <POSEX>000010</POSEX>
  <!-- ... other line item fields ... -->
  
  <!-- Digital Product Passport -->
  <E1EDP20 SEGMENT="1">
    <WMESSION>DPP-EXAMPLE-EBIKE-0001</WMESSION>
    <WMESSION_TXT>DigitalProductPassport</WMESSION_TXT>
  </E1EDP20>
  
  <!-- Environmental Product Declaration -->
  <E1EDP20 SEGMENT="1">
    <WMESSION>EPD-EXAMPLE-EBIKE-0001</WMESSION>
    <WMESSION_TXT>EnvironmentalProductDeclaration</WMESSION_TXT>
  </E1EDP20>
</E1EDP01>
```

### OneRecord Canonical JSON-LD
```jsonld
{
  "orderLine": {
    "id": "10",
    "additionalDocumentReference": [
      {
        "id": "DPP-EXAMPLE-EBIKE-0001",
        "documentType": "DPP",
        "documentDescription": "DigitalProductPassport"
      },
      {
        "id": "EPD-EXAMPLE-EBIKE-0001",
        "documentType": "EPD",
        "documentDescription": "EnvironmentalProductDeclaration"
      }
    ]
  }
}
```

### UBL Order
```xml
<cac:OrderLine>
  <cbc:ID>10</cbc:ID>
  <cac:LineItem>
    <!-- ... -->
  </cac:LineItem>
  <cac:AdditionalDocumentReference>
    <cbc:ID>DPP-EXAMPLE-EBIKE-0001</cbc:ID>
    <cbc:DocumentType>DigitalProductPassport</cbc:DocumentType>
  </cac:AdditionalDocumentReference>
  <cac:AdditionalDocumentReference>
    <cbc:ID>EPD-EXAMPLE-EBIKE-0001</cbc:ID>
    <cbc:DocumentType>EnvironmentalProductDeclaration</cbc:DocumentType>
  </cac:AdditionalDocumentReference>
</cac:OrderLine>
```

**OneRecord Values:**  
- `DPP-EXAMPLE-EBIKE-0001` → resolvable URL to actual Digital Product Passport  
- `EPD-EXAMPLE-EBIKE-0001` → resolvable URL to Environmental Product Declaration  

**Use Case:** EU's upcoming Digital Product Passport regulation requires product-level sustainability data. These IDoc fields enable automatic DPP linking.

---

## Hazardous Materials (UN3481 - Lithium-Ion Batteries)

### ORDERS05 IDoc - E1EDP20 Segment (Hazmat)
```xml
<E1EDP01 SEGMENT="1">
  <POSEX>000010</POSEX>
  <MENGE>10.000</MENGE>
  <MENEE>EA</MENEE>
  
  <!-- Hazardous Material Classification -->
  <E1EDP20 SEGMENT="1">
    <WMESSION>HAZ-EBIKE-LIION-001</WMESSION>
    <WMESSION_TXT>UN3481</WMESSION_TXT>
  </E1EDP20>
  
  <E1EDP19 SEGMENT="1">
    <QUALF>001</QUALF>
    <IDTNR>SELLER-ITEM-EBIKE-001</IDTNR>
    <KTEXT>Example Electric Bike</KTEXT>
  </E1EDP19>
</E1EDP01>
```

### OneRecord Canonical JSON-LD
```jsonld
{
  "orderLine": {
    "id": "10",
    "lineItem": {
      "quantity": {
        "value": 10,
        "unitCode": "EA"
      },
      "item": {
        "name": "Example Electric Bike",
        "sellersItemIdentification": {
          "id": "SELLER-ITEM-EBIKE-001"
        },
        "hazardousItem": {
          "id": "HAZ-EBIKE-LIION-001",
          "hazardClassID": "UN3481",
          "undgCode": "UN3481"
        }
      }
    }
  }
}
```

### UBL Order
```xml
<cac:OrderLine>
  <cbc:ID>10</cbc:ID>
  <cac:LineItem>
    <cbc:Quantity unitCode="EA">10</cbc:Quantity>
    <cac:Item>
      <cbc:Name>Example Electric Bike</cbc:Name>
      <cac:SellersItemIdentification>
        <cbc:ID>SELLER-ITEM-EBIKE-001</cbc:ID>
      </cac:SellersItemIdentification>
      <cac:HazardousItem>
        <cbc:ID>HAZ-EBIKE-LIION-001</cbc:ID>
        <cbc:HazardClassID>UN3481</cbc:HazardClassID>
        <cbc:UNDGCode>UN3481</cbc:UNDGCode>
      </cac:HazardousItem>
    </cac:Item>
  </cac:LineItem>
</cac:OrderLine>
```

**Semantic Consistency:**  
- `UN3481` = Lithium-ion batteries contained in equipment  
- Customs/transport authorities recognize this code across all formats  
- Automatic compliance with ADR/IATA dangerous goods regulations  

**OneRecord Value:** `HAZ-EBIKE-LIION-001` uniquely identifies this hazmat classification for the specific product.

---

## Contributors

OneRecord v0.9 — BETK Working Group

**Lead:** Kari Korpela

**Contributors:**
- Hannu Kivinen
- Henrik Vinell
- Juuso Autiosalo
- Jyrki Oraskari
- Mikael af Hällström
- Peter L. Borresen
- Rikard Larsson
- Teemu Alaluusua
- Tom Partanen
- Antti Taskinen

---

## Learn More

- **Repository:** https://github.com/jgmikael/one-record
- **Live Demo:** https://jgmikael.github.io/one-record/?sample=2
- **Vocabularies:** https://jgmikael.github.io/vocabularies/
