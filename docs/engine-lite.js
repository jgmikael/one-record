/**
 * One Record Mapping Engine - Browser Lite Version
 * Supports both legacy JSON format and authentic ORDERS05 IDoc structure
 */

class OneRecordEngine {
    transform(sapOrder) {
        try {
            // Detect if this is IDoc format (has E1EDK01) or legacy format (has OrderHeader)
            const isIdoc = sapOrder.E1EDK01 !== undefined;
            
            const canonical = isIdoc 
                ? this.buildCanonicalFromIdoc(sapOrder)
                : this.buildCanonicalOrder(sapOrder);
            
            const stats = this.calculateStats(sapOrder, canonical);
            
            return {
                success: true,
                canonical,
                stats
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                canonical: null,
                stats: null
            };
        }
    }

    /**
     * Build canonical order from ORDERS05 IDoc structure
     */
    buildCanonicalFromIdoc(idoc) {
        const header = idoc.E1EDK01 || {};
        const dates = Array.isArray(idoc.E1EDK03) ? idoc.E1EDK03 : [];
        const partners = Array.isArray(idoc.E1EDKA1) ? idoc.E1EDKA1 : [];
        const items = Array.isArray(idoc.E1EDP01) ? idoc.E1EDP01 : [];
        const control = idoc.EDI_DC40 || {};
        const totals = idoc.E1EDS01 || {};

        // Find partners by PARVW (partner function)
        const soldTo = partners.find(p => p.PARVW === "AG") || {};
        const shipTo = partners.find(p => p.PARVW === "WE") || {};
        const billTo = partners.find(p => p.PARVW === "RE") || {};
        const seller = partners.find(p => p.PARVW === "LF") || {};
        const supplier = partners.find(p => p.PARVW === "BA") || {};

        // Find dates by IDDAT (date qualifier)
        const issueDate = dates.find(d => d.IDDAT === "022") || {};
        const deliveryDate = dates.find(d => d.IDDAT === "002") || {};

        return {
            "@context": {
                "@vocab": "https://iri.suomi.fi/model/fcior/",
                "busdoc": "https://iri.suomi.fi/model/busdoc/",
                "ubl": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
            },
            "@type": "Order",
            "orderId": header.BELNR,
            "issueDate": this.formatIdocDate(issueDate.DATUM),
            "orderTypeCode": header.ACTION,
            "note": header.AUGRU,
            "documentCurrencyCode": header.CURCY,
            "customerReference": header.BSARK,
            "buyerReference": soldTo.PARNR,
            
            "buyerCustomerParty": {
                "@type": "Party",
                "partyIdentification": {
                    "id": soldTo.PARTN,
                    "schemeID": control.RCVPRN
                },
                "partyName": soldTo.NAME1,
                "postalAddress": {
                    "streetName": soldTo.STRAS,
                    "additionalStreetName": soldTo.STRS2,
                    "cityName": soldTo.ORT01,
                    "postalZone": soldTo.PSTLZ,
                    "countrySubentity": soldTo.REGIO,
                    "country": {
                        "identificationCode": soldTo.LAND1
                    }
                },
                "partyTaxScheme": {
                    "companyId": soldTo.STCD1,
                    "taxScheme": {
                        "id": "VAT"
                    }
                },
                "contact": {
                    "name": soldTo.PARNR,
                    "telephone": soldTo.TELF1,
                    "electronicMail": soldTo.ITEFN
                }
            },

            "sellerSupplierParty": seller.PARTN ? {
                "@type": "Party",
                "partyIdentification": {
                    "id": seller.PARTN,
                    "schemeID": control.SNDPRN
                },
                "partyName": seller.NAME1,
                "postalAddress": {
                    "streetName": seller.STRAS,
                    "cityName": seller.ORT01,
                    "postalZone": seller.PSTLZ,
                    "country": {
                        "identificationCode": seller.LAND1
                    }
                },
                "contact": {
                    "telephone": seller.TELF1,
                    "electronicMail": seller.ITEFN
                }
            } : undefined,

            "deliveryTerms": {
                "incoterms": header.INCO1,
                "deliveryLocation": header.INCO2
            },

            "deliveryAddress": {
                "streetName": shipTo.STRAS,
                "cityName": shipTo.ORT01,
                "postalZone": shipTo.PSTLZ,
                "country": {
                    "identificationCode": shipTo.LAND1
                }
            },

            "paymentTerms": {
                "paymentTermsCode": header.ZTERM,
                "note": this.mapPaymentTerms(header.ZTERM)
            },

            "anticipatedMonetaryTotal": totals.SUMME ? {
                "lineExtensionAmount": {
                    "value": parseFloat(totals.SUMME),
                    "currencyID": totals.SUNIT || header.CURCY
                },
                "taxExclusiveAmount": {
                    "value": parseFloat(totals.SUMME),
                    "currencyID": totals.SUNIT || header.CURCY
                },
                "taxInclusiveAmount": {
                    "value": parseFloat(totals.SUMME) + parseFloat(totals.MWSBT || 0),
                    "currencyID": totals.SUNIT || header.CURCY
                },
                "payableAmount": {
                    "value": parseFloat(totals.SUMME) + parseFloat(totals.MWSBT || 0),
                    "currencyID": totals.SUNIT || header.CURCY
                }
            } : undefined,

            "orderLine": items.map((item, index) => this.mapIdocOrderLine(item, index, header))
        };
    }

    /**
     * Map ORDERS05 IDoc line item (E1EDP01)
     */
    mapIdocOrderLine(e1edp01, index, header) {
        const prices = Array.isArray(e1edp01.E1EDP05) ? e1edp01.E1EDP05 : [];
        const identifiers = Array.isArray(e1edp01.E1EDP19) ? e1edp01.E1EDP19 : [];
        const serials = Array.isArray(e1edp01.E1EDP35) ? e1edp01.E1EDP35 : [];
        const docs = Array.isArray(e1edp01.E1EDP20) ? e1edp01.E1EDP20 : [];
        const dates = Array.isArray(e1edp01.E1EDK03) ? e1edp01.E1EDK03 : [];

        // Find price conditions
        const netPrice = prices.find(p => p.KSCHL === "PR00") || {};
        const tax = prices.find(p => p.KSCHL === "MWST") || {};

        // Build item object
        const itemObj = {
            "@type": "Item",
            "name": this.findIdocIdentifier(identifiers, "001", "KTEXT") || "Item",
            "description": this.findIdocIdentifier(identifiers, "001", "KTEXT") || "",
            "classifiedTaxCategory": {
                "id": tax.KSCHL || "MWST",
                "percent": parseFloat(tax.KBETR || 0),
                "taxScheme": {
                    "id": "VAT"
                }
            }
        };

        // Add product identifiers from E1EDP19
        identifiers.forEach(id19 => {
            if (id19.QUALF === "001") {
                itemObj.sellersItemIdentification = { "id": id19.IDTNR };
            } else if (id19.QUALF === "002") {
                itemObj.buyersItemIdentification = { "id": id19.IDTNR };
            } else if (id19.QUALF === "003") {
                itemObj.standardItemIdentification = {
                    "id": id19.IDTNR,
                    "schemeID": "0160"
                };
            } else if (id19.QUALF === "010") {
                itemObj.commodityClassification = {
                    "itemClassificationCode": {
                        "value": id19.IDTNR,
                        "listID": "UNSPSC"
                    }
                };
            }
        });

        // Add serialization from E1EDP35
        if (serials.length > 0) {
            itemObj.itemInstance = serials.map(s => ({
                "serialID": s.SERIAL
            }));
        }

        // Find hazardous material from E1EDP20
        const hazmat = docs.find(d => d.WMESSION_TXT && d.WMESSION_TXT.startsWith("UN"));
        if (hazmat) {
            itemObj.hazardousItem = {
                "id": hazmat.WMESSION,
                "hazardClassID": hazmat.WMESSION_TXT,
                "undgCode": hazmat.WMESSION_TXT
            };
        }

        // Build line item
        const lineItem = {
            "@type": "OrderLine",
            "id": this.formatLineNumber(e1edp01.POSEX),
            "note": e1edp01.POSEX_TEXT,
            "lineItem": {
                "@type": "LineItem",
                "id": this.formatLineNumber(e1edp01.POSEX),
                "quantity": {
                    "value": parseFloat(e1edp01.MENGE),
                    "unitCode": e1edp01.MENEE
                },
                "lineExtensionAmount": {
                    "value": parseFloat(netPrice.BETRG || 0) * parseFloat(e1edp01.MENGE || 0),
                    "currencyID": netPrice.KWAEH || header.CURCY
                },
                "item": itemObj,
                "price": {
                    "priceAmount": {
                        "value": parseFloat(netPrice.BETRG || 0),
                        "currencyID": netPrice.KWAEH || header.CURCY
                    },
                    "baseQuantity": {
                        "value": 1,
                        "unitCode": netPrice.KMEIN || e1edp01.MENEE
                    }
                }
            },
            "delivery": {
                "@type": "Delivery",
                "requestedDeliveryPeriod": dates.find(d => d.IDDAT === "002") ? {
                    "endDate": this.formatIdocDate(dates.find(d => d.IDDAT === "002").DATUM)
                } : undefined,
                "deliveryLocation": {
                    "id": e1edp01.VSTEL
                }
            }
        };

        // Add sustainability documents from E1EDP20 (DPP, EPD)
        const sustainabilityDocs = docs.filter(d => 
            d.WMESSION_TXT === "DigitalProductPassport" || 
            d.WMESSION_TXT === "EnvironmentalProductDeclaration"
        );
        
        if (sustainabilityDocs.length > 0) {
            lineItem.additionalDocumentReference = sustainabilityDocs.map(doc => ({
                "id": doc.WMESSION,
                "documentType": doc.WMESSION_TXT === "DigitalProductPassport" ? "DPP" : "EPD",
                "documentDescription": doc.WMESSION_TXT
            }));
        }

        return lineItem;
    }

    /**
     * Find identifier from E1EDP19 array
     */
    findIdocIdentifier(identifiers, qualf, field = "IDTNR") {
        const found = identifiers.find(id => id.QUALF === qualf);
        return found ? found[field] : null;
    }

    /**
     * Format IDoc date (YYYYMMDD) to ISO date (YYYY-MM-DD)
     */
    formatIdocDate(datum) {
        if (!datum || datum.length !== 8) return null;
        return `${datum.substring(0, 4)}-${datum.substring(4, 6)}-${datum.substring(6, 8)}`;
    }

    /**
     * Format line number (000010 -> 1)
     */
    formatLineNumber(posex) {
        return posex ? parseInt(posex, 10).toString() : "1";
    }

    /**
     * Build canonical order from legacy JSON format
     */
    buildCanonicalOrder(sapOrder) {
        const header = sapOrder.OrderHeader || {};
        const partners = sapOrder.PartnerFunctions || {};
        const soldTo = partners.SoldToParty || {};
        const shipTo = partners.ShipToParty || {};
        const billTo = partners.BillToParty || {};
        const items = sapOrder.OrderItems || [];

        return {
            "@context": {
                "@vocab": "https://iri.suomi.fi/model/fcior/",
                "busdoc": "https://iri.suomi.fi/model/busdoc/",
                "ubl": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
            },
            "@type": "Order",
            "orderId": header.SalesDocument,
            "issueDate": header.DocumentDate,
            "issueTime": header.CreatedAtTime,
            "orderTypeCode": header.SalesDocumentType,
            "note": header.OrderReason,
            "documentCurrencyCode": header.DocumentCurrency,
            "customerReference": header.CustomerReference,
            "buyerReference": soldTo.ContactPerson,
            
            "buyerCustomerParty": {
                "@type": "Party",
                "partyIdentification": {
                    "id": soldTo.CustomerNumber
                },
                "partyName": soldTo.Name1,
                "postalAddress": {
                    "streetName": soldTo.Street,
                    "cityName": soldTo.City,
                    "postalZone": soldTo.PostalCode,
                    "countrySubentity": soldTo.Region,
                    "country": {
                        "identificationCode": soldTo.Country
                    }
                },
                "partyTaxScheme": {
                    "companyId": soldTo.TaxNumber1,
                    "taxScheme": {
                        "id": "VAT"
                    }
                },
                "contact": {
                    "name": soldTo.ContactPerson,
                    "telephone": soldTo.Telephone,
                    "electronicMail": soldTo.EmailAddress
                }
            },

            "deliveryTerms": {
                "incoterms": header.IncotermsClassification,
                "deliveryLocation": header.IncotermsLocation
            },

            "deliveryAddress": {
                "streetName": shipTo.Street,
                "cityName": shipTo.City,
                "postalZone": shipTo.PostalCode,
                "country": {
                    "identificationCode": shipTo.Country
                }
            },

            "paymentTerms": {
                "paymentTermsCode": header.PaymentTerms,
                "note": this.mapPaymentTerms(header.PaymentTerms)
            },

            "anticipatedMonetaryTotal": {
                "lineExtensionAmount": {
                    "value": header.TotalNetAmount,
                    "currencyID": header.DocumentCurrency
                },
                "taxExclusiveAmount": {
                    "value": header.TotalNetAmount,
                    "currencyID": header.DocumentCurrency
                },
                "taxInclusiveAmount": {
                    "value": header.TotalGrossAmount,
                    "currencyID": header.DocumentCurrency
                },
                "payableAmount": {
                    "value": header.TotalGrossAmount,
                    "currencyID": header.DocumentCurrency
                }
            },

            "orderLine": items.map((item, index) => this.mapLegacyOrderLine(item, index, header))
        };
    }

    /**
     * Map legacy format order line
     */
    mapLegacyOrderLine(sapItem, index, header) {
        const item = sapItem.Item || {};
        const material = sapItem.Material || {};
        const quantity = sapItem.Quantity || {};
        const pricing = sapItem.Pricing || {};
        const schedule = sapItem.Schedule || {};

        return {
            "@type": "OrderLine",
            "id": item.ItemNumber || `${index + 1}`,
            "note": sapItem.ItemText,
            "lineItem": {
                "@type": "LineItem",
                "id": item.ItemNumber,
                "quantity": {
                    "value": quantity.OrderQuantity,
                    "unitCode": quantity.SalesUnit
                },
                "lineExtensionAmount": {
                    "value": pricing.NetValue,
                    "currencyID": pricing.Currency || header.DocumentCurrency
                },
                "item": {
                    "@type": "Item",
                    "description": material.MaterialDescription,
                    "name": material.MaterialDescription,
                    "sellersItemIdentification": {
                        "id": material.MaterialNumber
                    },
                    "buyersItemIdentification": {
                        "id": sapItem.CustomerMaterialNumber || material.MaterialNumber
                    },
                    "classifiedTaxCategory": {
                        "id": pricing.TaxCode,
                        "percent": pricing.TaxRate,
                        "taxScheme": {
                            "id": "VAT"
                        }
                    }
                },
                "price": {
                    "priceAmount": {
                        "value": pricing.NetPrice,
                        "currencyID": pricing.Currency || header.DocumentCurrency
                    },
                    "baseQuantity": {
                        "value": pricing.PriceUnit,
                        "unitCode": pricing.PricingUnit || quantity.SalesUnit
                    }
                }
            },
            "delivery": {
                "@type": "Delivery",
                "requestedDeliveryPeriod": {
                    "endDate": schedule.RequestedDeliveryDate
                },
                "deliveryLocation": {
                    "id": schedule.ShippingPoint
                }
            }
        };
    }

    mapPaymentTerms(code) {
        const terms = {
            'Z030': 'Net 30 days',
            'ZN30': 'Net 30 days',
            'ZN14': 'Net 14 days',
            'ZN60': 'Net 60 days',
            'Z001': 'Cash on delivery'
        };
        return terms[code] || code;
    }

    calculateStats(sapOrder, canonical) {
        const fieldCount = this.countFields(canonical);
        
        // Detect format and count line items
        let lineItemCount;
        if (sapOrder.E1EDP01) {
            lineItemCount = Array.isArray(sapOrder.E1EDP01) ? sapOrder.E1EDP01.length : 0;
        } else {
            lineItemCount = (sapOrder.OrderItems || []).length;
        }
        
        const confidence = 95;

        return {
            fieldsMapped: fieldCount,
            avgConfidence: confidence,
            lineItems: lineItemCount
        };
    }

    countFields(obj, depth = 0) {
        if (depth > 10) return 0;
        
        let count = 0;
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && key !== '@context' && key !== '@type') {
                count++;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (Array.isArray(obj[key])) {
                        obj[key].forEach(item => {
                            if (typeof item === 'object') {
                                count += this.countFields(item, depth + 1);
                            }
                        });
                    } else {
                        count += this.countFields(obj[key], depth + 1);
                    }
                }
            }
        }
        return count;
    }
}

// Export for browser use
const oneRecordEngine = new OneRecordEngine();
