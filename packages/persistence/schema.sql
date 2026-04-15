-- One Record Demo - SQLite Database Schema

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL UNIQUE,
    import_timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sap_payload TEXT NOT NULL,
    canonical_payload TEXT NOT NULL,
    canonical_context_version TEXT DEFAULT 'https://iri.suomi.fi/model/fcior/context.jsonld',
    canonical_profile TEXT DEFAULT 'fcior-ubl-order-v1',
    mapping_report TEXT NOT NULL,
    processing_status TEXT DEFAULT 'completed' CHECK(processing_status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(processing_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Metadata table for versioning and audit
CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial metadata
INSERT OR REPLACE INTO metadata (key, value) VALUES
    ('schema_version', '1.0.0'),
    ('canonical_profile_version', 'fcior-ubl-order-v1'),
    ('mapping_engine_version', '1.0.0'),
    ('last_migration', datetime('now'));
