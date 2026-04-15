/**
 * One Record Mapping Engine
 * 
 * Transforms SAP Order documents into One Record canonical Order format
 * using declarative mapping rules.
 */

import { 
  ONE_RECORD_ORDER_MAPPING, 
  ORDER_LINE_MAPPING, 
  buildTaxSubtotals,
  type MappingRule 
} from '@one-record/shared/mapping-rules';

export interface MappingResult {
  oneRecordOrder: any;
  mappingTrace: MappingTraceEntry[];
  errors: MappingError[];
  warnings: string[];
}

export interface MappingTraceEntry {
  targetPath: string;
  sourcePath?: string;
  sourceValue: any;
  targetValue: any;
  transform?: string;
  description?: string;
}

export interface MappingError {
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

export class MappingEngine {
  /**
   * Transform a SAP Order into One Record format
   */
  transform(sapOrder: any): MappingResult {
    const oneRecordOrder: any = {};
    const mappingTrace: MappingTraceEntry[] = [];
    const errors: MappingError[] = [];
    const warnings: string[] = [];

    // Apply document-level mappings
    for (const rule of ONE_RECORD_ORDER_MAPPING) {
      try {
        const result = this.applyRule(rule, sapOrder);
        
        if (result.value !== undefined) {
          this.setNestedValue(oneRecordOrder, rule.targetPath, result.value);
          
          mappingTrace.push({
            targetPath: rule.targetPath,
            sourcePath: rule.sourcePath,
            sourceValue: result.sourceValue,
            targetValue: result.value,
            transform: rule.transform ? rule.transform.toString() : undefined,
            description: rule.description
          });
        } else if (rule.required) {
          errors.push({
            rule: rule.targetPath,
            message: `Required field missing: ${rule.targetPath}`,
            severity: 'error'
          });
        }
      } catch (error) {
        errors.push({
          rule: rule.targetPath,
          message: `Mapping error for ${rule.targetPath}: ${(error as Error).message}`,
          severity: 'error'
        });
      }
    }

    // Map order lines
    const orderLines: any[] = [];
    const sapItems = sapOrder.OrderItems || [];
    
    for (const sapItem of sapItems) {
      const orderLine: any = {};
      
      for (const rule of ORDER_LINE_MAPPING) {
        try {
          const result = this.applyRule(rule, sapItem, sapOrder);
          
          if (result.value !== undefined) {
            this.setNestedValue(orderLine, rule.targetPath, result.value);
            
            mappingTrace.push({
              targetPath: `orderLine[${sapItem.ItemNumber}].${rule.targetPath}`,
              sourcePath: rule.sourcePath ? `OrderItems[${sapItem.ItemNumber}].${rule.sourcePath}` : undefined,
              sourceValue: result.sourceValue,
              targetValue: result.value,
              description: rule.description
            });
          } else if (rule.required) {
            errors.push({
              rule: `orderLine.${rule.targetPath}`,
              message: `Required line field missing: ${rule.targetPath} for item ${sapItem.ItemNumber}`,
              severity: 'error'
            });
          }
        } catch (error) {
          errors.push({
            rule: `orderLine.${rule.targetPath}`,
            message: `Line mapping error for ${rule.targetPath}: ${(error as Error).message}`,
            severity: 'error'
          });
        }
      }
      
      orderLines.push(orderLine);
    }
    
    oneRecordOrder.orderLine = orderLines;

    // Build tax subtotals
    try {
      const taxSubtotals = buildTaxSubtotals(sapOrder);
      if (!oneRecordOrder.taxTotal) {
        oneRecordOrder.taxTotal = {};
      }
      oneRecordOrder.taxTotal.taxSubtotal = taxSubtotals;
      
      mappingTrace.push({
        targetPath: 'taxTotal.taxSubtotal',
        sourcePath: 'OrderItems[*].{TaxRate, NetValue, TaxAmount}',
        sourceValue: 'Aggregated from line items',
        targetValue: taxSubtotals,
        description: 'Tax subtotals aggregated by rate'
      });
    } catch (error) {
      warnings.push(`Could not build tax subtotals: ${(error as Error).message}`);
    }

    return {
      oneRecordOrder,
      mappingTrace,
      errors,
      warnings
    };
  }

  /**
   * Apply a single mapping rule
   */
  private applyRule(rule: MappingRule, data: any, contextData?: any): { value: any; sourceValue: any } {
    let value: any;
    let sourceValue: any;

    // Get source value
    if (rule.sourceFunction) {
      sourceValue = rule.sourceFunction(data, contextData);
      value = sourceValue;
    } else if (rule.sourcePath) {
      sourceValue = this.getNestedValue(data, rule.sourcePath);
      value = sourceValue;
    }

    // Apply transform if present
    if (rule.transform && value !== undefined) {
      value = rule.transform(value, contextData || data);
    }

    return { value, sourceValue };
  }

  /**
   * Get a nested value from an object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }

    return current;
  }

  /**
   * Set a nested value in an object using dot notation
   * Handles special cases like @type, @id, and attributes with @
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }

  /**
   * Validate that required fields are present in the result
   */
  validate(oneRecordOrder: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check required document fields
    if (!oneRecordOrder.orderNumber) {
      errors.push('Missing required field: orderNumber');
    }
    if (!oneRecordOrder.issueDate) {
      errors.push('Missing required field: issueDate');
    }
    if (!oneRecordOrder.documentCurrency) {
      errors.push('Missing required field: documentCurrency');
    }
    if (!oneRecordOrder.buyerCustomerParty) {
      errors.push('Missing required field: buyerCustomerParty');
    }
    if (!oneRecordOrder.legalMonetaryTotal) {
      errors.push('Missing required field: legalMonetaryTotal');
    }
    if (!oneRecordOrder.orderLine || oneRecordOrder.orderLine.length === 0) {
      errors.push('Missing required field: orderLine (must have at least one line)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const mappingEngine = new MappingEngine();
