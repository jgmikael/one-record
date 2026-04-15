/**
 * Mapping Engine - Smoke Tests
 */

import { transformOrder } from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

describe('Mapping Engine', () => {
    let sampleSAPOrder: any;

    beforeAll(() => {
        // Load sample SAP order
        const samplePath = path.join(__dirname, '../../../samples/sap-order-001.json');
        const sampleData = fs.readFileSync(samplePath, 'utf-8');
        sampleSAPOrder = JSON.parse(sampleData);
    });

    test('should transform SAP order to canonical', async () => {
        const result = await transformOrder(sampleSAPOrder);

        expect(result.success).toBe(true);
        expect(result.canonicalOrder).toBeDefined();
        expect(result.report).toBeDefined();
    });

    test('should produce valid JSON-LD structure', async () => {
        const result = await transformOrder(sampleSAPOrder);

        expect(result.canonicalOrder['@context']).toBeDefined();
        expect(result.canonicalOrder['@type']).toBe('Order');
        expect(result.canonicalOrder['@id']).toContain('urn:order:sap:');
    });

    test('should map order number correctly', async () => {
        const result = await transformOrder(sampleSAPOrder);

        expect(result.canonicalOrder.orderNumber).toBe(sampleSAPOrder.OrderHeader.SalesDocument);
    });

    test('should map buyer party', async () => {
        const result = await transformOrder(sampleSAPOrder);

        expect(result.canonicalOrder.buyerCustomerParty).toBeDefined();
        expect(result.canonicalOrder.buyerCustomerParty.partyIdentification).toBeDefined();
        expect(result.canonicalOrder.buyerCustomerParty.partyIdentification[0].id).toBe(
            sampleSAPOrder.PartnerFunctions.SoldToParty.CustomerNumber
        );
    });

    test('should map order lines', async () => {
        const result = await transformOrder(sampleSAPOrder);

        expect(result.canonicalOrder.orderLine).toBeDefined();
        expect(Array.isArray(result.canonicalOrder.orderLine)).toBe(true);
        expect(result.canonicalOrder.orderLine.length).toBe(sampleSAPOrder.OrderItems.length);
    });

    test('should transform UoM codes', async () => {
        const result = await transformOrder(sampleSAPOrder);

        // First item should have M3 → MTQ conversion
        const firstLine = result.canonicalOrder.orderLine[0];
        expect(firstLine.quantity.unitCode).toBe('MTQ'); // M3 converted to MTQ
    });

    test('should generate mapping report', async () => {
        const result = await transformOrder(sampleSAPOrder);

        expect(result.report.timestamp).toBeDefined();
        expect(result.report.sourceDocumentID).toBe(sampleSAPOrder.OrderHeader.SalesDocument);
        expect(result.report.mappings).toBeDefined();
        expect(result.report.mappings.length).toBeGreaterThan(0);
        expect(result.report.overallConfidence).toBeGreaterThan(0);
    });

    test('should have high confidence mappings', async () => {
        const result = await transformOrder(sampleSAPOrder);

        expect(result.report.statistics.highConfidenceMappings).toBeGreaterThan(50);
    });

    test('should map monetary totals', async () => {
        const result = await transformOrder(sampleSAPOrder);

        expect(result.canonicalOrder.anticipatedMonetaryTotal).toBeDefined();
        expect(result.canonicalOrder.anticipatedMonetaryTotal.lineExtensionAmount.value).toBe(
            sampleSAPOrder.OrderHeader.TotalNetAmount
        );
    });

    test('should handle missing optional fields gracefully', async () => {
        const minimalOrder = {
            OrderHeader: {
                SalesDocument: '9999999999',
                DocumentDate: '2026-05-01',
                DocumentCurrency: 'EUR',
                SalesOrganization: '1000',
                DistributionChannel: '10',
                Division: '00',
                CreatedBy: 'TEST',
                CreatedOn: '2026-05-01',
                CreatedAtTime: '12:00:00',
                TotalNetAmount: 1000,
                TotalTaxAmount: 240,
                TotalGrossAmount: 1240,
                SalesDocumentType: 'OR',
            },
            PartnerFunctions: {
                SoldToParty: {
                    PartnerFunction: 'AG',
                    CustomerNumber: '999999',
                    Name1: 'Test Customer',
                },
            },
            OrderItems: [
                {
                    Item: {
                        ItemNumber: '000010',
                        ItemCategory: 'TAN',
                        ItemType: 'Material',
                    },
                    Material: {
                        MaterialNumber: 'TEST-001',
                        MaterialGroup: 'TEST',
                        MaterialDescription: 'Test Item',
                    },
                    Quantity: {
                        OrderQuantity: 1,
                        SalesUnit: 'PC',
                        BaseUnit: 'PC',
                    },
                    Pricing: {
                        NetPrice: 1000,
                        Currency: 'EUR',
                        NetValue: 1000,
                        TaxAmount: 240,
                        TaxRate: 24,
                        TaxCode: 'S1',
                        GrossValue: 1240,
                    },
                },
            ],
        };

        const result = await transformOrder(minimalOrder);

        expect(result.success).toBe(true);
        expect(result.canonicalOrder.orderNumber).toBe('9999999999');
    });
});
