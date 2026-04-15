/**
 * Mapping Engine - Public API
 */

export * from './types';
export * from './engine';
export * from './transformations';
export * from './suggester';
export * from './config';
export * from './rules';

import { MappingEngine } from './engine';
import { createDefaultConfig, mergeConfig } from './config';
import { suggestMappings, suggestAllMappings } from './suggester';
import { MappingConfig, MappingResult, FieldSuggestion, SuggestionCriteria } from './types';

/**
 * Transform SAP Order to One Record Canonical Order using default configuration
 */
export async function transformOrder(sapOrder: any, customConfig?: Partial<MappingConfig>): Promise<MappingResult> {
  const config = customConfig ? mergeConfig(customConfig) : createDefaultConfig();
  const engine = new MappingEngine(config);
  return engine.transform(sapOrder);
}

/**
 * Suggest mappings for a specific field
 */
export function suggestFieldMappings(criteria: SuggestionCriteria): FieldSuggestion[] {
  return suggestMappings(criteria);
}

/**
 * Suggest mappings for all unmapped fields
 */
export function suggestDocumentMappings(
  sourceDoc: any,
  targetSchema: any,
  existingMappings?: Set<string>
): Map<string, FieldSuggestion[]> {
  const mappings = existingMappings || new Set<string>();
  return suggestAllMappings(sourceDoc, targetSchema, mappings);
}

/**
 * Create a new mapping engine instance with custom configuration
 */
export function createMappingEngine(customConfig?: Partial<MappingConfig>): MappingEngine {
  const config = customConfig ? mergeConfig(customConfig) : createDefaultConfig();
  return new MappingEngine(config);
}

// Default export
export default {
  transformOrder,
  suggestFieldMappings,
  suggestDocumentMappings,
  createMappingEngine,
  MappingEngine,
  createDefaultConfig,
  mergeConfig,
};
