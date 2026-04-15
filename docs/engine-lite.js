/**
 * One Record Mapping Engine - Browser Lite Version
 * Simplified transformation engine for browser-based demos
 */

class OneRecordEngine {
    transform(sapOrder) {
        try {
            const canonical = this.buildCanonicalOrder(sapOrder);
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

    buildCanonicalOrder(sap) {
        const header = sap.OrderHeader || {};
        const partners = sap.PartnerFunctions || {};
        const soldTo = partners.SoldToParty || {};
        const shipTo = partners.ShipToParty || {};
        const billTo = partners.BillToParty || {};
        const items = sap.OrderItems || [];

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

            "orderLine": items.map((item, index) => this.mapOrderLine(item, index, header))
        };
    }

    mapOrderLine(sapItem, index, header) {
        const item = sapItem.Item || {};
        const material = sapItem.Material || {};
        const quantity = sapItem.Quantity || {};
        const pricing = sapItem.Pricing || {};
        const schedule = sapItem.Schedule || {};
        const productIds = sapItem.ProductIdentifiers || [];
        const serialization = sapItem.Serialization || [];
        const sustainability = sapItem.SustainabilityDocuments || [];
        const hazmat = sapItem.HazardousMaterial || null;

        // Build item object with extended identifiers
        const itemObj = {
            "@type": "Item",
            "description": material.MaterialDescription,
            "name": material.MaterialDescription,
            "classifiedTaxCategory": {
                "id": pricing.TaxCode,
                "percent": pricing.TaxRate,
                "taxScheme": {
                    "id": "VAT"
                }
            }
        };

        // Add product identifiers from E1EDP19 segments
        productIds.forEach(pid => {
            if (pid.IdentifierType === "SellersItemIdentification") {
                itemObj.sellersItemIdentification = { "id": pid.ID };
            } else if (pid.IdentifierType === "BuyersItemIdentification") {
                itemObj.buyersItemIdentification = { "id": pid.ID };
            } else if (pid.IdentifierType === "StandardItemIdentification") {
                itemObj.standardItemIdentification = {
                    "id": pid.ID,
                    "schemeID": pid.SchemeID || "GTIN"
                };
            } else if (pid.IdentifierType === "ItemClassificationCode") {
                itemObj.commodityClassification = {
                    "itemClassificationCode": {
                        "value": pid.ID,
                        "listID": pid.SchemeID || "UNSPSC"
                    }
                };
            }
        });

        // Fallback to legacy fields if no ProductIdentifiers
        if (!itemObj.sellersItemIdentification && material.MaterialNumber) {
            itemObj.sellersItemIdentification = { "id": material.MaterialNumber };
        }
        if (!itemObj.buyersItemIdentification && sapItem.CustomerMaterialNumber) {
            itemObj.buyersItemIdentification = { "id": sapItem.CustomerMaterialNumber };
        }

        // Add serialization (E1EDP35)
        if (serialization.length > 0) {
            itemObj.itemInstance = serialization.map(s => ({
                "serialID": s.SerialNumber
            }));
        }

        // Add hazardous material info (E1EDP20)
        if (hazmat) {
            itemObj.hazardousItem = {
                "id": hazmat.HazardItemID,
                "hazardClassID": hazmat.HazardClassID,
                "undgCode": hazmat.UNCode
            };
        }

        const lineItem = {
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
                "item": itemObj,
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

        // Add sustainability documents (E1EDP20 - DPP, EPD)
        if (sustainability.length > 0) {
            lineItem.additionalDocumentReference = sustainability.map(doc => ({
                "id": doc.DocumentID,
                "documentType": doc.DocumentType,
                "documentDescription": doc.DocumentDescription
            }));
        }

        return lineItem;
    }

    mapPaymentTerms(code) {
        const terms = {
            'ZN30': 'Net 30 days',
            'ZN14': 'Net 14 days',
            'ZN60': 'Net 60 days',
            'Z001': 'Cash on delivery'
        };
        return terms[code] || code;
    }

    calculateStats(sapOrder, canonical) {
        const fieldCount = this.countFields(canonical);
        const lineItemCount = (sapOrder.OrderItems || []).length;
        
        // Simplified confidence calculation
        // In the full version, this comes from the mapping report
        const confidence = 95;

        return {
            fieldsMapped: fieldCount,
            avgConfidence: confidence,
            lineItems: lineItemCount
        };
    }

    countFields(obj, depth = 0) {
        if (depth > 10) return 0; // Prevent deep recursion
        
        let count = 0;
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && key !== '@context' && key !== '@type') {
                count++;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (Array.isArray(obj[key])) {
                        // Count array items
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
