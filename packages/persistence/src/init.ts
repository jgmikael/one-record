/**
 * Database Initialization
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Initialize database with schema
 */
export function initializeDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Load and execute schema
  const schemaPath = path.join(__dirname, '../../schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Execute schema (split by semicolon to handle multiple statements)
  const statements = schema.split(';').filter(s => s.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      db.exec(statement);
    }
  }

  return db;
}

/**
 * Create in-memory database (for testing)
 */
export function createInMemoryDatabase(): Database.Database {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');

  const schemaPath = path.join(__dirname, '../../schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  const statements = schema.split(';').filter(s => s.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      db.exec(statement);
    }
  }

  return db;
}

/**
 * Seed database with sample data
 */
export async function seedDatabase(db: Database.Database): Promise<void> {
  // Load sample SAP order
  const sampleSapPath = path.join(__dirname, '../../../samples/sap-order-001.json');
  const sampleCanonicalPath = path.join(__dirname, '../../../samples/one-record-order-001.jsonld');

  if (!fs.existsSync(sampleSapPath) || !fs.existsSync(sampleCanonicalPath)) {
    console.warn('Sample data files not found, skipping seeding');
    return;
  }

  const sapOrder = JSON.parse(fs.readFileSync(sampleSapPath, 'utf-8'));
  const canonicalOrder = JSON.parse(fs.readFileSync(sampleCanonicalPath, 'utf-8'));

  // Create a basic mapping report
  const mappingReport = {
    timestamp: new Date().toISOString(),
    sourceDocumentID: sapOrder.OrderHeader.SalesDocument,
    mappingEngineVersion: '1.0.0',
    mappingRulesVersion: '1.0.0',
    mappings: [],
    unmappedSourceFields: [],
    missingRequiredFields: [],
    semanticAssumptions: [],
    overallConfidence: 95,
    statistics: {
      totalSourceFields: 180,
      totalMappedFields: 85,
      totalUnmappedFields: 25,
      highConfidenceMappings: 70,
      mediumConfidenceMappings: 15,
      lowConfidenceMappings: 0,
    },
  };

  const stmt = db.prepare(`
    INSERT INTO orders (
      order_id,
      sap_payload,
      canonical_payload,
      mapping_report,
      processing_status
    ) VALUES (?, ?, ?, ?, ?)
  `);

  try {
    stmt.run(
      sapOrder.OrderHeader.SalesDocument,
      JSON.stringify(sapOrder),
      JSON.stringify(canonicalOrder),
      JSON.stringify(mappingReport),
      'completed'
    );
    console.log('Seeded database with sample order:', sapOrder.OrderHeader.SalesDocument);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('Sample order already exists in database');
    } else {
      throw error;
    }
  }
}

/**
 * Close database connection
 */
export function closeDatabase(db: Database.Database): void {
  db.close();
}
