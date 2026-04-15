/**
 * Persistence Layer Types
 */

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface OrderRecord {
  id: number;
  order_id: string;
  import_timestamp: string;
  sap_payload: string;
  canonical_payload: string;
  canonical_context_version: string;
  canonical_profile: string;
  mapping_report: string;
  processing_status: ProcessingStatus;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderInsert {
  order_id: string;
  sap_payload: any;
  canonical_payload: any;
  mapping_report: any;
  canonical_context_version?: string;
  canonical_profile?: string;
  processing_status?: ProcessingStatus;
  error_message?: string;
}

export interface OrderQuery {
  order_id?: string;
  status?: ProcessingStatus;
  limit?: number;
  offset?: number;
}

export interface OrderSummary {
  id: number;
  order_id: string;
  import_timestamp: string;
  processing_status: ProcessingStatus;
  created_at: string;
}

export interface MetadataRecord {
  key: string;
  value: string;
  updated_at: string;
}
