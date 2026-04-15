/**
 * REST API for One Record Order transformations
 */

import express, { Router, Request, Response } from 'express';
import { mappingEngine } from './mapping-engine';
import { getStorage } from './storage';

export function createApiRouter(): Router {
  const router = express.Router();
  const storage = getStorage();

  /**
   * POST /api/transform
   * Transform a SAP Order to One Record format
   */
  router.post('/transform', async (req: Request, res: Response) => {
    try {
      const sapOrder = req.body;

      // Validate input
      if (!sapOrder || typeof sapOrder !== 'object') {
        return res.status(400).json({
          error: 'Invalid SAP Order document'
        });
      }

      // Transform
      const result = mappingEngine.transform(sapOrder);

      // Validate result
      const validation = mappingEngine.validate(result.oneRecordOrder);
      
      if (!validation.isValid) {
        result.errors.push(...validation.errors.map(msg => ({
          rule: 'validation',
          message: msg,
          severity: 'error' as const
        })));
      }

      // Save to database
      const saved = storage.save({
        sapOrder,
        oneRecordOrder: result.oneRecordOrder,
        mappingTrace: result.mappingTrace,
        mappingErrors: result.errors,
        mappingWarnings: result.warnings
      });

      res.json({
        id: saved.id,
        sapOrder: saved.sapOrder,
        oneRecordOrder: saved.oneRecordOrder,
        mappingTrace: saved.mappingTrace,
        errors: saved.mappingErrors,
        warnings: saved.mappingWarnings,
        createdAt: saved.createdAt
      });
    } catch (error) {
      console.error('Transform error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  });

  /**
   * GET /api/orders
   * Get all transformed orders
   */
  router.get('/orders', (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const orders = storage.getAll(limit);

      res.json({
        orders: orders.map(order => ({
          id: order.id,
          orderNumber: order.sapOrder?.OrderHeader?.DocumentNumber,
          documentDate: order.sapOrder?.OrderHeader?.DocumentDate,
          customer: order.sapOrder?.OrderHeader?.SoldToParty?.Name,
          totalAmount: order.sapOrder?.OrderHeader?.TotalGrossAmount,
          currency: order.sapOrder?.OrderHeader?.Currency,
          errorCount: order.mappingErrors.length,
          warningCount: order.mappingWarnings.length,
          createdAt: order.createdAt
        })),
        count: orders.length
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  });

  /**
   * GET /api/orders/:id
   * Get a specific order by ID
   */
  router.get('/orders/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = storage.getById(id);

      if (!order) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      res.json(order);
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  });

  /**
   * GET /api/orders/:id/sap
   * Get the SAP source document
   */
  router.get('/orders/:id/sap', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = storage.getById(id);

      if (!order) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      res.json(order.sapOrder);
    } catch (error) {
      console.error('Get SAP order error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  });

  /**
   * GET /api/orders/:id/one-record
   * Get the One Record canonical document
   */
  router.get('/orders/:id/one-record', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = storage.getById(id);

      if (!order) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      res.json(order.oneRecordOrder);
    } catch (error) {
      console.error('Get One Record order error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  });

  /**
   * GET /api/orders/:id/trace
   * Get the mapping trace for an order
   */
  router.get('/orders/:id/trace', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = storage.getById(id);

      if (!order) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      res.json({
        trace: order.mappingTrace,
        errors: order.mappingErrors,
        warnings: order.mappingWarnings
      });
    } catch (error) {
      console.error('Get trace error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  });

  /**
   * DELETE /api/orders/:id
   * Delete an order
   */
  router.delete('/orders/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = storage.delete(id);

      if (!deleted) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  });

  /**
   * GET /api/stats
   * Get statistics
   */
  router.get('/stats', (req: Request, res: Response) => {
    try {
      const stats = storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  });

  /**
   * GET /api/sample
   * Get a sample SAP Order for testing
   */
  router.get('/sample', (req: Request, res: Response) => {
    try {
      // Return the sample SAP order
      const sampleOrder = require('@one-record/shared/sample-sap-order.json');
      res.json(sampleOrder);
    } catch (error) {
      console.error('Get sample error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  });

  return router;
}
