/**
 * Orders API Routes
 */

import { Router, Request, Response } from 'express';
import { OrderRepository } from '@one-record/persistence';
import { transformOrder } from '@one-record/mapping-engine';

export function createOrderRoutes(repository: OrderRepository): Router {
  const router = Router();

  /**
   * POST /api/orders/import/sap
   * Import and transform a SAP order
   */
  router.post('/import/sap', async (req: Request, res: Response) => {
    try {
      const sapOrder = req.body;

      // Validate input
      if (!sapOrder || !sapOrder.OrderHeader) {
        return res.status(400).json({
          error: 'Invalid SAP order structure',
          message: 'Request body must contain an OrderHeader',
        });
      }

      const orderId = sapOrder.OrderHeader.SalesDocument;
      if (!orderId) {
        return res.status(400).json({
          error: 'Missing order ID',
          message: 'OrderHeader.SalesDocument is required',
        });
      }

      // Check if order already exists
      const existing = repository.getOrderByOrderId(orderId);
      if (existing) {
        return res.status(409).json({
          error: 'Order already exists',
          message: `Order ${orderId} has already been imported`,
          order_id: orderId,
          id: existing.id,
        });
      }

      // Transform SAP order to canonical
      console.log(`Transforming SAP order: ${orderId}`);
      const result = await transformOrder(sapOrder);

      if (!result.success) {
        return res.status(500).json({
          error: 'Transformation failed',
          message: 'Failed to transform SAP order to canonical format',
          errors: result.errors,
        });
      }

      // Store in database
      const record = repository.saveOrder({
        order_id: orderId,
        sap_payload: sapOrder,
        canonical_payload: result.canonicalOrder,
        mapping_report: result.report,
        processing_status: 'completed',
      });

      // Return summary
      res.status(201).json({
        id: record.id,
        order_id: record.order_id,
        import_timestamp: record.import_timestamp,
        processing_status: record.processing_status,
        canonical_context: record.canonical_context_version,
        canonical_profile: record.canonical_profile,
        overall_confidence: result.report.overallConfidence,
        statistics: result.report.statistics,
        _links: {
          self: `/api/orders/${record.order_id}`,
          source: `/api/orders/${record.order_id}/source`,
          canonical: `/api/orders/${record.order_id}/canonical`,
          report: `/api/orders/${record.order_id}/mapping-report`,
        },
      });
    } catch (error: any) {
      console.error('Import error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });

  /**
   * GET /api/orders
   * List all orders
   */
  router.get('/', (req: Request, res: Response) => {
    try {
      const { status, limit, offset } = req.query;

      const orders = repository.listOrders({
        status: status as any,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });

      res.json({
        orders: orders.map(o => ({
          ...o,
          _links: {
            self: `/api/orders/${o.order_id}`,
            source: `/api/orders/${o.order_id}/source`,
            canonical: `/api/orders/${o.order_id}/canonical`,
            report: `/api/orders/${o.order_id}/mapping-report`,
          },
        })),
        total: repository.countOrders(status as string),
      });
    } catch (error: any) {
      console.error('List error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });

  /**
   * GET /api/orders/:order_id
   * Get order summary
   */
  router.get('/:order_id', (req: Request, res: Response) => {
    try {
      const { order_id } = req.params;
      const order = repository.getOrderByOrderId(order_id);

      if (!order) {
        return res.status(404).json({
          error: 'Order not found',
          message: `Order ${order_id} does not exist`,
        });
      }

      res.json({
        id: order.id,
        order_id: order.order_id,
        import_timestamp: order.import_timestamp,
        processing_status: order.processing_status,
        canonical_context: order.canonical_context_version,
        canonical_profile: order.canonical_profile,
        created_at: order.created_at,
        updated_at: order.updated_at,
        _links: {
          source: `/api/orders/${order.order_id}/source`,
          canonical: `/api/orders/${order.order_id}/canonical`,
          report: `/api/orders/${order.order_id}/mapping-report`,
        },
      });
    } catch (error: any) {
      console.error('Get error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });

  /**
   * GET /api/orders/:order_id/source
   * Get SAP source payload
   */
  router.get('/:order_id/source', (req: Request, res: Response) => {
    try {
      const { order_id } = req.params;
      const payload = repository.getSapPayload(order_id);

      if (!payload) {
        return res.status(404).json({
          error: 'Order not found',
          message: `Order ${order_id} does not exist`,
        });
      }

      res.json(payload);
    } catch (error: any) {
      console.error('Get source error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });

  /**
   * GET /api/orders/:order_id/canonical
   * Get canonical One Record Order (JSON-LD)
   */
  router.get('/:order_id/canonical', (req: Request, res: Response) => {
    try {
      const { order_id } = req.params;
      const payload = repository.getCanonicalPayload(order_id);

      if (!payload) {
        return res.status(404).json({
          error: 'Order not found',
          message: `Order ${order_id} does not exist`,
        });
      }

      // Return as JSON-LD
      res.setHeader('Content-Type', 'application/ld+json');
      res.json(payload);
    } catch (error: any) {
      console.error('Get canonical error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });

  /**
   * GET /api/orders/:order_id/mapping-report
   * Get mapping report
   */
  router.get('/:order_id/mapping-report', (req: Request, res: Response) => {
    try {
      const { order_id } = req.params;
      const report = repository.getMappingReport(order_id);

      if (!report) {
        return res.status(404).json({
          error: 'Order not found',
          message: `Order ${order_id} does not exist`,
        });
      }

      res.json(report);
    } catch (error: any) {
      console.error('Get report error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });

  /**
   * DELETE /api/orders/:order_id
   * Delete an order
   */
  router.delete('/:order_id', (req: Request, res: Response) => {
    try {
      const { order_id } = req.params;
      const deleted = repository.deleteOrder(order_id);

      if (!deleted) {
        return res.status(404).json({
          error: 'Order not found',
          message: `Order ${order_id} does not exist`,
        });
      }

      res.status(204).send();
    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  });

  return router;
}
