/**
 * Mappings API Routes (Suggestion Engine)
 */

import { Router, Request, Response } from 'express';
import { suggestFieldMappings, suggestDocumentMappings } from '@one-record/mapping-engine';

export function createMappingRoutes(): Router {
  const router = Router();

  /**
   * POST /api/mappings/suggest
   * Suggest mappings for SAP fields
   */
  router.post('/suggest', async (req: Request, res: Response) => {
    try {
      const { sourceDoc, sourcePath, targetSchema } = req.body;

      if (!sourceDoc && !sourcePath) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'Either sourceDoc or sourcePath must be provided',
        });
      }

      // Single field suggestion
      if (sourcePath) {
        const sourceValue = getValueAtPath(sourceDoc, sourcePath);
        const suggestions = suggestFieldMappings({
          sourcePath,
          sourceValue,
          targetSchema: targetSchema || getDefaultSchema(),
        });

        return res.json({
          sourcePath,
          suggestions,
        });
      }

      // Document-level suggestions
      if (sourceDoc) {
        const existingMappings = new Set<string>();
        const suggestions = suggestDocumentMappings(
          sourceDoc,
          targetSchema || getDefaultSchema(),
          existingMappings
        );

        // Convert Map to object
        const suggestionsObj: Record<string, any[]> = {};
        suggestions.forEach((value, key) => {
          suggestionsObj[key] = value;
        });

        return res.json({
          suggestions: suggestionsObj,
          totalUnmapped: suggestions.size,
        });
      }

      res.status(400).json({
        error: 'Invalid request',
        message: 'Unable to process suggestion request',
      });
    } catch (error: any) {
      console.error('Suggest error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });

  return router;
}

/**
 * Get value at path in object
 */
function getValueAtPath(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Get default target schema (simplified One Record Order structure)
 */
function getDefaultSchema(): any {
  return {
    '@context': 'string',
    '@type': 'string',
    '@id': 'string',
    orderNumber: 'string',
    issueDate: 'string',
    issueTime: 'string',
    orderTypeCode: 'string',
    documentCurrencyCode: 'string',
    buyerReference: 'string',
    buyerCustomerParty: {
      partyIdentification: [{ id: 'string', schemeID: 'string' }],
      partyName: [{ name: 'string' }],
      postalAddress: {
        streetName: 'string',
        buildingNumber: 'string',
        cityName: 'string',
        postalZone: 'string',
        countryCode: 'string',
        fullAddress: 'string',
      },
      contact: {
        name: 'string',
        telephone: 'string',
        electronicMail: 'string',
      },
    },
    sellerSupplierParty: {
      partyIdentification: [{ id: 'string', schemeID: 'string' }],
      partyName: [{ name: 'string' }],
    },
    delivery: {
      requestedDeliveryDate: 'string',
      deliveryLocation: {
        streetName: 'string',
        cityName: 'string',
        postalZone: 'string',
        countryCode: 'string',
      },
    },
    paymentTerms: {
      note: 'string',
    },
    orderLine: [
      {
        id: 'string',
        quantity: {
          value: 'number',
          unitCode: 'string',
        },
        lineExtensionAmount: {
          value: 'number',
          currencyCode: 'string',
        },
        item: {
          name: 'string',
          description: 'string',
          sellersItemIdentification: {
            id: 'string',
          },
        },
        price: {
          priceAmount: {
            value: 'number',
            currencyCode: 'string',
          },
        },
      },
    ],
  };
}
