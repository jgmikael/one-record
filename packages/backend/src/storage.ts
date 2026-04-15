/**
 * Storage layer using SQLite
 * Persists SAP orders, One Record orders, and mapping traces
 */

import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';

export interface StoredOrder {
  id: string;
  sapOrder: any;
  oneRecordOrder: any;
  mappingTrace: any[];
  mappingErrors: any[];
  mappingWarnings: string[];
  createdAt: string;
  updatedAt: string;
}

export class OrderStorage {
  private db: Database.Database;

  constructor(dbPath?: string) {
    const finalPath = dbPath || path.join(process.cwd(), 'data', 'orders.db');
    
    // Ensure data directory exists
    const dir = path.dirname(finalPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(finalPath);
    this.initialize();
  }

  private initialize(): void {
    // Create orders table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        sap_order TEXT NOT NULL,
        one_record_order TEXT NOT NULL,
        mapping_trace TEXT NOT NULL,
        mapping_errors TEXT NOT NULL,
        mapping_warnings TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Create index on created_at for sorting
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_orders_created_at 
      ON orders(created_at DESC)
    `);
  }

  /**
   * Save a new order transformation
   */
  save(data: {
    sapOrder: any;
    oneRecordOrder: any;
    mappingTrace: any[];
    mappingErrors?: any[];
    mappingWarnings?: string[];
  }): StoredOrder {
    const id = nanoid();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO orders (
        id, sap_order, one_record_order, mapping_trace,
        mapping_errors, mapping_warnings, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      JSON.stringify(data.sapOrder),
      JSON.stringify(data.oneRecordOrder),
      JSON.stringify(data.mappingTrace),
      JSON.stringify(data.mappingErrors || []),
      JSON.stringify(data.mappingWarnings || []),
      now,
      now
    );

    return this.getById(id)!;
  }

  /**
   * Get an order by ID
   */
  getById(id: string): StoredOrder | null {
    const stmt = this.db.prepare(`
      SELECT * FROM orders WHERE id = ?
    `);

    const row = stmt.get(id) as any;
    if (!row) return null;

    return this.rowToOrder(row);
  }

  /**
   * Get all orders (most recent first)
   */
  getAll(limit: number = 100): StoredOrder[] {
    const stmt = this.db.prepare(`
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT ?
    `);

    const rows = stmt.all(limit) as any[];
    return rows.map(row => this.rowToOrder(row));
  }

  /**
   * Delete an order
   */
  delete(id: string): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM orders WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalOrders: number;
    ordersWithErrors: number;
    ordersWithWarnings: number;
  } {
    const total = this.db.prepare(`
      SELECT COUNT(*) as count FROM orders
    `).get() as { count: number };

    const withErrors = this.db.prepare(`
      SELECT COUNT(*) as count FROM orders 
      WHERE json_array_length(mapping_errors) > 0
    `).get() as { count: number };

    const withWarnings = this.db.prepare(`
      SELECT COUNT(*) as count FROM orders 
      WHERE json_array_length(mapping_warnings) > 0
    `).get() as { count: number };

    return {
      totalOrders: total.count,
      ordersWithErrors: withErrors.count,
      ordersWithWarnings: withWarnings.count
    };
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
  }

  /**
   * Convert database row to StoredOrder
   */
  private rowToOrder(row: any): StoredOrder {
    return {
      id: row.id,
      sapOrder: JSON.parse(row.sap_order),
      oneRecordOrder: JSON.parse(row.one_record_order),
      mappingTrace: JSON.parse(row.mapping_trace),
      mappingErrors: JSON.parse(row.mapping_errors),
      mappingWarnings: JSON.parse(row.mapping_warnings),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

// Singleton instance
let storage: OrderStorage | null = null;

export function getStorage(): OrderStorage {
  if (!storage) {
    storage = new OrderStorage();
  }
  return storage;
}
