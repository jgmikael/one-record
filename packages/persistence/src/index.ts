/**
 * Persistence Layer - Public API
 */

export * from './types';
export * from './repository';
export * from './init';

import Database from 'better-sqlite3';
import { OrderRepository } from './repository';
import { initializeDatabase, seedDatabase, createInMemoryDatabase } from './init';

/**
 * Create persistence layer with database initialization
 */
export function createPersistence(dbPath: string, seed: boolean = false): {
  db: Database.Database;
  repository: OrderRepository;
} {
  const db = initializeDatabase(dbPath);
  const repository = new OrderRepository(db);

  if (seed) {
    seedDatabase(db).catch(err => {
      console.error('Failed to seed database:', err);
    });
  }

  return { db, repository };
}

/**
 * Create in-memory persistence (for testing)
 */
export function createInMemoryPersistence(): {
  db: Database.Database;
  repository: OrderRepository;
} {
  const db = createInMemoryDatabase();
  const repository = new OrderRepository(db);
  return { db, repository };
}

export default {
  createPersistence,
  createInMemoryPersistence,
  OrderRepository,
  initializeDatabase,
  seedDatabase,
};
