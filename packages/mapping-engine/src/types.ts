/**
 * Mapping Engine Types
 */

// ============================================================================
// Mapping Configuration
// ============================================================================

export type MappingType = 'rule' | 'suggested' | 'transformed' | 'manualFallback' | 'calculated';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'SUGGEST';

export interface MappingRule {
  /** Source SAP field path */
  sourcePath: string;
  
  /** Target canonical field path */
  targetPath: string;
  
  /** Target semantic reference (fcior/busdoc URI) */
  targetSemanticReference?: string;
  
  /** Mapping type */
  mappingType: MappingType;
  
  /** Confidence level */
  confidence: ConfidenceLevel;
  
  /** Transformation function name (if applicable) */
  transformFunction?: string;
  
  /** Rationale/explanation */
  rationale?: string;
  
  /** Whether this field is required in target */
  required?: boolean;
  
  /** Default value if source is missing */
  defaultValue?: any;
  
  /** Condition for applying this rule */
  condition?: string;
}

export interface TransformationContext {
  /** Full source document */
  source: any;
  
  /** Current source value */
  sourceValue: any;
  
  /** Source field path */
  sourcePath: string;
  
  /** Target field path */
  targetPath: string;
  
  /** Configuration/lookup data */
  config?: any;
}

export type TransformFunction = (ctx: TransformationContext) => any;

// ============================================================================
// Mapping Report
// ============================================================================

export interface MappingEntry {
  /** Source SAP field path */
  sourcePath: string;
  
  /** Target canonical field path */
  targetPath: string;
  
  /** Target semantic reference */
  targetSemanticReference?: string;
  
  /** Mapping type */
  mappingType: MappingType;
  
  /** Confidence level */
  confidence: ConfidenceLevel;
  
  /** Rationale/explanation */
  rationale: string;
  
  /** Source value */
  sourceValue: any;
  
  /** Target value (after transformation) */
  targetValue: any;
  
  /** Transformation applied */
  transformationApplied?: string;
  
  /** Any issues or warnings */
  warnings?: string[];
}

export interface MappingReport {
  /** Transformation timestamp */
  timestamp: string;
  
  /** Source document ID */
  sourceDocumentID: string;
  
  /** Mapping engine version */
  mappingEngineVersion: string;
  
  /** Mapping rules version */
  mappingRulesVersion: string;
  
  /** All mapping entries */
  mappings: MappingEntry[];
  
  /** Unmapped SAP fields */
  unmappedSourceFields: Array<{
    path: string;
    value: any;
    reason: string;
  }>;
  
  /** Required canonical fields still missing */
  missingRequiredFields: Array<{
    path: string;
    semanticReference?: string;
    reason: string;
  }>;
  
  /** Semantic assumptions made */
  semanticAssumptions: Array<{
    assumption: string;
    affectedFields: string[];
    rationale: string;
  }>;
  
  /** Overall confidence score (0-100) */
  overallConfidence: number;
  
  /** Mapping statistics */
  statistics: {
    totalSourceFields: number;
    totalMappedFields: number;
    totalUnmappedFields: number;
    highConfidenceMappings: number;
    mediumConfidenceMappings: number;
    lowConfidenceMappings: number;
  };
}

// ============================================================================
// Mapping Result
// ============================================================================

export interface MappingResult {
  /** Transformed canonical order (JSON-LD) */
  canonicalOrder: any;
  
  /** Detailed mapping report */
  report: MappingReport;
  
  /** Success status */
  success: boolean;
  
  /** Errors (if any) */
  errors?: string[];
}

// ============================================================================
// Suggestion Engine
// ============================================================================

export interface FieldSuggestion {
  /** Suggested target path */
  targetPath: string;
  
  /** Confidence score (0-100) */
  confidence: number;
  
  /** Suggestion reasons */
  reasons: string[];
  
  /** Similarity score */
  similarityScore: number;
  
  /** Suggested transformation */
  suggestedTransform?: string;
}

export interface SuggestionCriteria {
  /** Source field path */
  sourcePath: string;
  
  /** Source value */
  sourceValue: any;
  
  /** Source field type */
  sourceType?: string;
  
  /** Available target schema */
  targetSchema: any;
}

// ============================================================================
// Configuration
// ============================================================================

export interface MappingConfig {
  /** Mapping rules */
  rules: MappingRule[];
  
  /** Transformation functions */
  transformFunctions: Record<string, TransformFunction>;
  
  /** Lookup tables */
  lookupTables: {
    orderTypeCodes?: Record<string, string>;
    taxCodes?: Record<string, string>;
    unitOfMeasure?: Record<string, string>;
    paymentTerms?: Record<string, string>;
    sellerMasterData?: Record<string, any>;
  };
  
  /** Configuration options */
  options: {
    enableAutoSuggestion?: boolean;
    minimumConfidence?: number;
    includeUnmappedFields?: boolean;
    strictMode?: boolean;
  };
  
  /** Engine metadata */
  metadata: {
    version: string;
    rulesVersion: string;
    description?: string;
  };
}

// ============================================================================
// Validation
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}
