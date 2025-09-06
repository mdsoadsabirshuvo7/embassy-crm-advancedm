// Fraud detection placeholder
export interface FraudSignal { id: string; type: string; severity: 'LOW'|'MEDIUM'|'HIGH'; message: string; relatedIds: string[]; }

export const FraudService = {
  analyzeDocument(docId: string): FraudSignal[] {
    // Stub logic: randomly flag nothing.
    return [];
  }
};
