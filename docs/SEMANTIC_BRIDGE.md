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
| **HEADER** | | |
| E1EDK01/BELNR | ONE-ORD-0001 | cbc:ID |
| E1EDK01/CURCY | EUR | cbc:DocumentCurrencyCode |
| E1EDK03/DATUM (022) | 2026-01-01 | cbc:IssueDate |
| E1EDK03/DATUM (002) | 2026-02-01 | Delivery/cbc:StartDate |
| E1EDK01/NTGEW | 28.5 | cbc:GrossWeightMeasure |
| E1EDK01/GEPTS | KGM | @unitCode |
| **BUYER PARTNER (AG)** | | |
| E1EDKA1 (AG)/PARTN | EX-BUY-0001 | BuyerCustomerParty/EndpointID |
| E1EDKA1 (AG)/NAME1 | ExampleBuyer Ltd | cbc:RegistrationName |
| E1EDKA1 (AG)/STRAS | Buyer Street | cbc:StreetName |
| E1EDKA1 (AG)/STRS2 | Building One | cbc:AdditionalStreetName |
| E1EDKA1 (AG)/ORT01 | Buyertown | cbc:CityName |
| E1EDKA1 (AG)/PSTLZ | 10001 | cbc:PostalZone |
| E1EDKA1 (AG)/LAND1 | GB | cbc:IdentificationCode |
| E1EDKA1 (AG)/TELF1 | +44 7000 000001 | cbc:Telephone |
| E1EDKA1 (AG)/ITEFN | purchasing@examplebuyer.com | cbc:ElectronicMail |
| **SELLER PARTNER (LF)** | | |
| E1EDKA1 (LF)/PARTN | EX-SEL-0001 | SellerSupplierParty/EndpointID |
| E1EDKA1 (LF)/NAME1 | ExampleSeller Plc | cbc:RegistrationName |
| **SHIP-TO PARTNER (WE)** | | |
| E1EDKA1 (WE)/PARTN | DELIVERY-LOC-0001 | DeliveryLocation/cbc:ID |
| E1EDKA1 (WE)/NAME1 | Example Logistics Hub London | cbc:Name |
| **SUPPLIER/DESPATCH (BA)** | | |
| E1EDKA1 (BA)/PARTN | EX-SUP-0001 | OriginatorCustomerParty/EndpointID |
| E1EDKA1 (BA)/NAME1 | ExampleSupplier GmbH | cbc:RegistrationName |
| **LINE ITEM** | | |
| E1EDP01/POSEX | 000010 (→ 1) | OrderLine/cbc:ID |
| E1EDP01/MENGE | 10.000 | cbc:Quantity |
| E1EDP01/MENEE | EA | @unitCode |
| E1EDP01/NTGEW | 28.500 | cbc:GrossWeightMeasure |
| E1EDP01/VOLUM | 0.850 | cbc:GrossVolumeMeasure |
| **ITEM PRICE** | | |
| E1EDP05/KSCHL (PR00) | 2500.00 | Price/cbc:PriceAmount |
| E1EDP05/KOEIN | EUR | @currencyID |
| **ITEM IDENTIFICATION** | | |
| E1EDP19 (001)/IDTNR | SELLER-ITEM-EBIKE-001 | SellersItemIdentification/cbc:ID |
| E1EDP19 (002)/IDTNR | ONE-ITEM-EXAMPLE-EBIKE-0001 | Item/cbc:ID |
| E1EDP19 (003)/IDTNR | GTIN-EXAMPLE-0001 | StandardItemIdentification/cbc:ID |
| E1EDP19 (010)/IDTNR | 25102001 | ItemClassificationCode (UNSPSC) |
| **SERIALIZATION** | | |
| E1EDP35/SERIAL | EBIKE-SN-EXAMPLE-0001 | ItemInstance/cbc:SerialID |
| **SUSTAINABILITY DOCS** | | |
| E1EDP20 (DPP) | DPP-EXAMPLE-EBIKE-0001 | AdditionalDocumentReference/cbc:ID |
| E1EDP20 (EPD) | EPD-EXAMPLE-EBIKE-0001 | AdditionalDocumentReference/cbc:ID |
| **HAZARDOUS MATERIAL** | | |
| E1EDP20 (HAZ) ID | HAZ-EBIKE-LIION-001 | HazardousItem/cbc:ID |
| E1EDP20 (HAZ) TXT | UN3481 | HazardousItem/cbc:HazardClassID |

---

## The Bridge in Action

### Step 1: SAP Exports Order
```
E1EDKA1 (AG)/PARTN = "EX-BUY-0001"
```

### Step 2: OneRecord Transforms
```jsonld
{
  "buyerCustomerParty": {
    "partyIdentification": {
      "id": "EX-BUY-0001"
    }
  }
}
```

### Step 3: UBL Receives
```xml
<cac:BuyerCustomerParty>
  <cac:Party>
    <cbc:EndpointID>EX-BUY-0001</cbc:EndpointID>
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

### E1EDP20 Segment
```xml
<E1EDP20 SEGMENT="1">
  <WMESSION>DPP-EXAMPLE-EBIKE-0001</WMESSION>
  <WMESSION_TXT>DigitalProductPassport</WMESSION_TXT>
</E1EDP20>
```

### OneRecord JSON-LD
```jsonld
{
  "additionalDocumentReference": [
    {
      "id": "DPP-EXAMPLE-EBIKE-0001",
      "documentType": "DPP",
      "documentDescription": "DigitalProductPassport"
    }
  ]
}
```

### UBL Order
```xml
<cac:AdditionalDocumentReference>
  <cbc:ID>DPP-EXAMPLE-EBIKE-0001</cbc:ID>
  <cbc:DocumentType>DigitalProductPassport</cbc:DocumentType>
</cac:AdditionalDocumentReference>
```

**OneRecord Value:** `DPP-EXAMPLE-EBIKE-0001` becomes a **resolvable identifier** linking to the actual Digital Product Passport URL.

---

## Hazardous Materials (UN3481 - Lithium-Ion Batteries)

### SAP IDoc
```xml
<E1EDP20 SEGMENT="1">
  <WMESSION>HAZ-EBIKE-LIION-001</WMESSION>
  <WMESSION_TXT>UN3481</WMESSION_TXT>
</E1EDP20>
```

### OneRecord
```jsonld
{
  "hazardousItem": {
    "id": "HAZ-EBIKE-LIION-001",
    "hazardClassID": "UN3481",
    "undgCode": "UN3481"
  }
}
```

### UBL
```xml
<cac:HazardousItem>
  <cbc:ID>HAZ-EBIKE-LIION-001</cbc:ID>
  <cbc:HazardClassID>UN3481</cbc:HazardClassID>
  <cbc:UNDGCode>UN3481</cbc:UNDGCode>
</cac:HazardousItem>
```

**Semantic Consistency:** Transport/customs authorities can identify lithium-ion battery requirements across all document formats.

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
