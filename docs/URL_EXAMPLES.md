# GitHub Pages Demo - URL Examples

Access the One Record transformation demo with different samples using URL parameters.

## Base URL

```
https://jgmikael.github.io/one-record/
```

## URL Parameters

### Load Sample #1 (Construction Industry - Finnish)

**Auto-load Finnish construction order (concrete & rebar):**

```
https://jgmikael.github.io/one-record/?sample=1
```

**Details:**
- **Industry:** Construction materials
- **Buyer:** Rakennusyhtiö Suomi Oy (Finland)
- **Products:** C30/37 Concrete (50 m³), Steel Mesh K8-150 (100 pcs)
- **Currency:** EUR
- **Total:** €15,500 (incl. 24% VAT)
- **Incoterms:** EXW Helsinki

---

### Load Sample #2 (Electronics Industry - UK/EU)

**Auto-load UK buyer ordering electric bikes:**

```
https://jgmikael.github.io/one-record/?sample=2
```

**Details:**
- **Industry:** Electric mobility equipment
- **Buyer:** ExampleBuyer Ltd (UK)
- **Seller:** ExampleSeller Plc (UK)
- **Supplier:** ExampleSupplier GmbH (Germany)
- **Product:** Electric Bike Model X1 (10 units)
- **Currency:** EUR
- **Total:** €30,000 (incl. 20% VAT)
- **Incoterms:** DDP Buyertown
- **Based on:** SAP ORDERS05 IDoc structure

---

## Direct Sample Loading

### Sample #1 - Construction
```html
<!-- Direct link in documentation -->
<a href="https://jgmikael.github.io/one-record/?sample=1">Try Sample #1</a>
```

### Sample #2 - Electronics
```html
<!-- Direct link in documentation -->
<a href="https://jgmikael.github.io/one-record/?sample=2">Try Sample #2</a>
```

---

## Embedding in Documentation

### Markdown

```markdown
[Try the Construction Example](https://jgmikael.github.io/one-record/?sample=1)

[Try the Electronics Example](https://jgmikael.github.io/one-record/?sample=2)
```

### HTML iframe

```html
<!-- Embed the demo in your documentation -->
<iframe 
  src="https://jgmikael.github.io/one-record/?sample=1" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```

---

## Sample Comparison

| Feature | Sample #1: Construction | Sample #2: Electronics |
|---------|------------------------|------------------------|
| **Document ID** | 4500012345 | ONE-ORD-0001 |
| **Industry** | Building materials | Electric mobility |
| **Buyer Country** | Finland (FI) | United Kingdom (GB) |
| **Supplier Country** | Finland (FI) | Germany (DE) |
| **Line Items** | 2 | 1 |
| **Total Amount** | €15,500 | €30,000 |
| **VAT Rate** | 24% | 20% |
| **Payment Terms** | Net 30 (ZN30) | Net 30 (Z030) |
| **Incoterms** | EXW Helsinki | DDP Buyertown |
| **Weight** | 126,250 kg | 30 kg |
| **Based On** | SAP ECC 6.0 JSON | ORDERS05 IDoc |

---

## Integration Examples

### PowerPoint/Presentations

1. Add a clickable link to your slide
2. Use: `https://jgmikael.github.io/one-record/?sample=1`
3. Audience can try the demo live during presentation

### Training Materials

1. Include both sample links in course materials
2. Students can explore different industry scenarios
3. Compare SAP source vs canonical UBL output

### API Documentation

```bash
# Show users what the transformation produces
curl -s "https://jgmikael.github.io/one-record/data/sample-sap-order.js" \
  | grep -A 9999 "const SAMPLE_SAP_ORDER"
```

---

## Browser Compatibility

✅ Chrome/Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Mobile browsers (iOS Safari, Chrome Mobile)  

---

## No Installation Required

All processing happens in your browser:
- No npm install
- No Docker containers
- No backend servers
- Works offline after first load
- Pure JavaScript transformation

Perfect for demos, training, and quick validation!
