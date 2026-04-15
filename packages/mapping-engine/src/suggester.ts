/**
 * Automatic Mapping Suggestion Engine
 * 
 * Suggests candidate mappings for unmapped fields based on:
 * - Name similarity
 * - Token normalization
 * - Structural context
 */

import { compareTwoStrings } from 'string-similarity';
import { FieldSuggestion, SuggestionCriteria } from './types';

/**
 * Suggest candidate mappings for a source field
 */
export function suggestMappings(criteria: SuggestionCriteria): FieldSuggestion[] {
  const { sourcePath, sourceValue, sourceType, targetSchema } = criteria;

  // Get all possible target paths from schema
  const targetPaths = extractTargetPaths(targetSchema);

  const suggestions: FieldSuggestion[] = [];

  for (const targetPath of targetPaths) {
    const reasons: string[] = [];
    let similarityScore = 0;

    // 1. Name similarity
    const nameSimilarity = calculateNameSimilarity(sourcePath, targetPath);
    if (nameSimilarity > 0.3) {
      similarityScore += nameSimilarity * 0.5;
      reasons.push(`Name similarity: ${Math.round(nameSimilarity * 100)}%`);
    }

    // 2. Token matching
    const tokenMatch = calculateTokenMatch(sourcePath, targetPath);
    if (tokenMatch > 0) {
      similarityScore += tokenMatch * 0.3;
      reasons.push(`Token match: ${tokenMatch} common tokens`);
    }

    // 3. Business term matching
    const businessTermMatch = matchBusinessTerms(sourcePath, targetPath);
    if (businessTermMatch) {
      similarityScore += 0.2;
      reasons.push(`Business term match: ${businessTermMatch}`);
    }

    // Only include if there's some similarity
    if (similarityScore > 0.2) {
      const confidence = Math.min(similarityScore * 100, 100);

      suggestions.push({
        targetPath,
        confidence: Math.round(confidence),
        reasons,
        similarityScore,
        suggestedTransform: suggestTransform(sourcePath, targetPath, sourceValue),
      });
    }
  }

  // Sort by confidence (highest first)
  suggestions.sort((a, b) => b.confidence - a.confidence);

  // Return top 5 suggestions
  return suggestions.slice(0, 5);
}

/**
 * Calculate name similarity between source and target paths
 */
function calculateNameSimilarity(sourcePath: string, targetPath: string): number {
  // Extract final field names
  const sourceField = sourcePath.split('.').pop() || '';
  const targetField = targetPath.split('.').pop() || '';

  // Normalize for comparison
  const normalizedSource = normalizeFieldName(sourceField);
  const normalizedTarget = normalizeFieldName(targetField);

  return compareTwoStrings(normalizedSource, normalizedTarget);
}

/**
 * Calculate token match count
 */
function calculateTokenMatch(sourcePath: string, targetPath: string): number {
  const sourceTokens = tokenize(sourcePath);
  const targetTokens = tokenize(targetPath);

  const commonTokens = sourceTokens.filter(t => targetTokens.includes(t));
  return commonTokens.length;
}

/**
 * Match business terms
 */
function matchBusinessTerms(sourcePath: string, targetPath: string): string | null {
  const businessTerms = {
    'SalesDocument': 'orderNumber',
    'DocumentDate': 'issueDate',
    'DocumentCurrency': 'documentCurrencyCode',
    'CustomerNumber': 'partyIdentification',
    'Name1': 'partyName',
    'Street': 'streetName',
    'City': 'cityName',
    'PostalCode': 'postalZone',
    'Country': 'countryCode',
    'TaxNumber': 'companyID',
    'MaterialNumber': 'sellersItemIdentification',
    'MaterialDescription': 'name',
    'OrderQuantity': 'quantity',
    'NetPrice': 'priceAmount',
    'NetValue': 'lineExtensionAmount',
    'TaxAmount': 'taxAmount',
    'TaxRate': 'percent',
  };

  for (const [sapTerm, canonicalTerm] of Object.entries(businessTerms)) {
    if (sourcePath.includes(sapTerm) && targetPath.includes(canonicalTerm)) {
      return `${sapTerm} → ${canonicalTerm}`;
    }
  }

  return null;
}

/**
 * Suggest appropriate transformation
 */
function suggestTransform(
  sourcePath: string,
  targetPath: string,
  sourceValue: any
): string | undefined {
  // Date transformations
  if (sourcePath.toLowerCase().includes('date') && typeof sourceValue === 'string') {
    return 'toISODate';
  }

  // Time transformations
  if (sourcePath.toLowerCase().includes('time') && typeof sourceValue === 'string') {
    return 'toISOTime';
  }

  // Currency transformations
  if (targetPath.includes('currencyCode')) {
    return 'toCurrencyCode';
  }

  // Unit of measure
  if (sourcePath.includes('Unit') && targetPath.includes('unitCode')) {
    return 'sapUoMToUNCEFACT';
  }

  // Tax code
  if (sourcePath.includes('TaxCode') && targetPath.includes('taxCategory')) {
    return 'sapTaxCodeToUBL';
  }

  return undefined;
}

/**
 * Normalize field name for comparison
 */
function normalizeFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1') // Insert space before caps
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .trim();
}

/**
 * Tokenize a path into meaningful tokens
 */
function tokenize(path: string): string[] {
  const tokens: string[] = [];

  // Split by dots and brackets
  const parts = path.split(/[.\[\]]+/).filter(Boolean);

  for (const part of parts) {
    // Split camelCase
    const camelTokens = part.split(/(?=[A-Z])/);
    tokens.push(...camelTokens.map(t => t.toLowerCase()));
  }

  return tokens.filter(t => t.length > 2); // Remove very short tokens
}

/**
 * Extract all possible target paths from a schema object
 */
function extractTargetPaths(schema: any, prefix = ''): string[] {
  const paths: string[] = [];

  if (!schema || typeof schema !== 'object') {
    return paths;
  }

  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      const path = prefix ? `${prefix}.${key}` : key;

      // Skip special keys
      if (key.startsWith('@') || key.startsWith('_')) {
        continue;
      }

      paths.push(path);

      const value = schema[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        paths.push(...extractTargetPaths(value, path));
      }
    }
  }

  return paths;
}

/**
 * Suggest mappings for all unmapped fields in a source document
 */
export function suggestAllMappings(
  sourceDoc: any,
  targetSchema: any,
  existingMappings: Set<string>
): Map<string, FieldSuggestion[]> {
  const suggestions = new Map<string, FieldSuggestion[]>();

  const sourcePaths = extractSourcePaths(sourceDoc);

  for (const sourcePath of sourcePaths) {
    if (!existingMappings.has(sourcePath)) {
      const sourceValue = getValueAtPath(sourceDoc, sourcePath);
      const criteria: SuggestionCriteria = {
        sourcePath,
        sourceValue,
        targetSchema,
      };

      const fieldSuggestions = suggestMappings(criteria);
      if (fieldSuggestions.length > 0) {
        suggestions.set(sourcePath, fieldSuggestions);
      }
    }
  }

  return suggestions;
}

/**
 * Extract all paths from source document
 */
function extractSourcePaths(obj: any, prefix = ''): string[] {
  const paths: string[] = [];

  if (!obj || typeof obj !== 'object') {
    return paths;
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const path = prefix ? `${prefix}.${key}` : key;

      // Skip special keys
      if (key.startsWith('_')) {
        continue;
      }

      paths.push(path);

      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        paths.push(...extractSourcePaths(value, path));
      } else if (Array.isArray(value) && value.length > 0) {
        // Add array element paths
        paths.push(...extractSourcePaths(value[0], `${path}[0]`));
      }
    }
  }

  return paths;
}

/**
 * Get value at a specific path
 */
function getValueAtPath(obj: any, path: string): any {
  const parts = path.split('.').map(p => p.replace(/\[\d+\]/, ''));
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}
