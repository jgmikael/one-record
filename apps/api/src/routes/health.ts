/**
 * Health and Version API Routes
 */

import { Router, Request, Response } from 'express';
import { OrderRepository } from '@one-record/persistence';

export function createHealthRoutes(repository: OrderRepository): Router {
  const router = Router();

  /**
   * GET /api/health
   * Health check and API info
   */
  router.get('/health', (req: Request, res: Response) => {
    try {
      const totalOrders = repository.countOrders();
      const completedOrders = repository.countOrders('completed');

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        api: {
          name: 'One Record SAP Transformation API',
          description: 'Transform SAP Orders to fcior-aligned canonical JSON-LD',
          documentation: '/api/version',
        },
        database: {
          totalOrders,
          completedOrders,
        },
        endpoints: {
          'POST /api/orders/import/sap': 'Import and transform SAP order',
          'GET /api/orders': 'List all orders',
          'GET /api/orders/:id': 'Get order summary',
          'GET /api/orders/:id/source': 'Get SAP source payload',
          'GET /api/orders/:id/canonical': 'Get canonical JSON-LD',
          'GET /api/orders/:id/mapping-report': 'Get mapping report',
          'POST /api/mappings/suggest': 'Get mapping suggestions',
          'GET /api/version': 'Get version info',
        },
      });
    } catch (error: any) {
      res.status(503).json({
        status: 'unhealthy',
        error: error.message,
      });
    }
  });

  /**
   * GET /api/version
   * Version and configuration information
   */
  router.get('/version', (req: Request, res: Response) => {
    const schemaVersion = repository.getMetadata('schema_version');
    const canonicalProfileVersion = repository.getMetadata('canonical_profile_version');
    const mappingEngineVersion = repository.getMetadata('mapping_engine_version');

    res.json({
      api: {
        version: '1.0.0',
        name: 'One Record Demo API',
      },
      components: {
        database: {
          schemaVersion: schemaVersion || '1.0.0',
        },
        mappingEngine: {
          version: mappingEngineVersion || '1.0.0',
        },
        canonicalModel: {
          profile: canonicalProfileVersion || 'fcior-ubl-order-v1',
          context: 'https://iri.suomi.fi/model/fcior/context.jsonld',
          vocabulary: 'https://iri.suomi.fi/model/fcior/',
          baseVocabulary: 'https://iri.suomi.fi/model/busdoc/',
        },
      },
      semantics: {
        fcior: {
          name: 'Finnish Construction Industry One Record',
          url: 'https://iri.suomi.fi/model/fcior/',
          description: 'fcior-aligned subset of UBL Order for construction industry',
        },
        busdoc: {
          name: 'Finnish Business Document Vocabulary',
          url: 'https://iri.suomi.fi/model/busdoc/',
          description: 'Core business document terms (EN 16931-1 compliant)',
        },
      },
      documentation: {
        github: 'https://github.com/jgmikael/one-record',
        readme: 'https://github.com/jgmikael/one-record#readme',
      },
    });
  });

  return router;
}
