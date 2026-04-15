/**
 * Repository Layer - Database Operations
 */

import Database from 'better-sqlite3';
import { OrderRecord, OrderInsert, OrderQuery, OrderSummary } from './types';

export class OrderRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  /**
   * Save a new order
   */
  saveOrder(order: OrderInsert): OrderRecord {
    const stmt = this.db.prepare(`
      INSERT INTO orders (
        order_id,
        sap_payload,
        canonical_payload,
        mapping_report,
        canonical_context_version,
        canonical_profile,
        processing_status,
        error_message
      ) VALUES (
        @order_id,
        @sap_payload,
        @canonical_payload,
        @mapping_report,
        @canonical_context_version,
        @canonical_profile,
        @processing_status,
        @error_message
      )
    `);

    const result = stmt.run({
      order_id: order.order_id,
      sap_payload: JSON.stringify(order.sap_payload),
      canonical_payload: JSON.stringify(order.canonical_payload),
      mapping_report: JSON.stringify(order.mapping_report),
      canonical_context_version: order.canonical_context_version || 'https://iri.suomi.fi/model/fcior/context.jsonld',
      canonical_profile: order.canonical_profile || 'fcior-ubl-order-v1',
      processing_status: order.processing_status || 'completed',
      error_message: order.error_message || null,
    });

    return this.getOrderById(result.lastInsertRowid as number)!;
  }

  /**
   * Get order by ID
   */
  getOrderById(id: number): OrderRecord | null {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE id = ?');
    return stmt.get(id) as OrderRecord | null;
  }

  /**
   * Get order by order_id (business key)
   */
  getOrderByOrderId(orderId: string): OrderRecord | null {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE order_id = ?');
    return stmt.get(orderId) as OrderRecord | null;
  }

  /**
   * List orders with optional filters
   */
  listOrders(query: OrderQuery = {}): OrderSummary[] {
    let sql = 'SELECT id, order_id, import_timestamp, processing_status, created_at FROM orders WHERE 1=1';
    const params: any = {};

    if (query.order_id) {
      sql += ' AND order_id = @order_id';
      params.order_id = query.order_id;
    }

    if (query.status) {
      sql += ' AND processing_status = @status';
      params.status = query.status;
    }

    sql += ' ORDER BY created_at DESC';

    if (query.limit) {
      sql += ' LIMIT @limit';
      params.limit = query.limit;
    }

    if (query.offset) {
      sql += ' OFFSET @offset';
      params.offset = query.offset;
    }

    const stmt = this.db.prepare(sql);
    return stmt.all(params) as OrderSummary[];
  }

  /**
   * Get SAP source payload
   */
  getSapPayload(orderId: string): any | null {
    const stmt = this.db.prepare('SELECT sap_payload FROM orders WHERE order_id = ?');
    const row = stmt.get(orderId) as { sap_payload: string } | undefined;
    return row ? JSON.parse(row.sap_payload) : null;
  }

  /**
   * Get canonical payload
   */
  getCanonicalPayload(orderId: string): any | null {
    const stmt = this.db.prepare('SELECT canonical_payload FROM orders WHERE order_id = ?');
    const row = stmt.get(orderId) as { canonical_payload: string } | undefined;
    return row ? JSON.parse(row.canonical_payload) : null;
  }

  /**
   * Get mapping report
   */
  getMappingReport(orderId: string): any | null {
    const stmt = this.db.prepare('SELECT mapping_report FROM orders WHERE order_id = ?');
    const row = stmt.get(orderId) as { mapping_report: string } | undefined;
    return row ? JSON.parse(row.mapping_report) : null;
  }

  /**
   * Update order status
   */
  updateStatus(orderId: string, status: string, errorMessage?: string): void {
    const stmt = this.db.prepare(`
      UPDATE orders 
      SET processing_status = @status, 
          error_message = @error_message,
          updated_at = CURRENT_TIMESTAMP
      WHERE order_id = @order_id
    `);

    stmt.run({
      order_id: orderId,
      status,
      error_message: errorMessage || null,
    });
  }

  /**
   * Delete order
   */
  deleteOrder(orderId: string): boolean {
    const stmt = this.db.prepare('DELETE FROM orders WHERE order_id = ?');
    const result = stmt.run(orderId);
    return result.changes > 0;
  }

  /**
   * Count total orders
   */
  countOrders(status?: string): number {
    let sql = 'SELECT COUNT(*) as count FROM orders';
    const params: any = {};

    if (status) {
      sql += ' WHERE processing_status = @status';
      params.status = status;
    }

    const stmt = this.db.prepare(sql);
    const row = stmt.get(params) as { count: number };
    return row.count;
  }

  /**
   * Get metadata value
   */
  getMetadata(key: string): string | null {
    const stmt = this.db.prepare('SELECT value FROM metadata WHERE key = ?');
    const row = stmt.get(key) as { value: string } | undefined;
    return row?.value || null;
  }

  /**
   * Set metadata value
   */
  setMetadata(key: string, value: string): void {
    const stmt = this.db.prepare(`
      INSERT INTO metadata (key, value, updated_at)
      VALUES (@key, @value, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = @value,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run({ key, value });
  }
}
