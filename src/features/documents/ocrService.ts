// OCR and smart document extraction placeholder
// Real implementation would integrate with Tesseract, Azure Form Recognizer, AWS Textract, or Google Vision.

export interface OcrExtractField {
  field: string;
  value: string;
  confidence: number; // 0..1
}

export interface OcrResult {
  documentId: string;
  type: string; // PASSPORT, ID, etc.
  fields: OcrExtractField[];
  warnings: string[];
  completedAt: string;
}

export const OcrService = {
  async extract(documentId: string, file: File, type: string): Promise<OcrResult> {
    // Fake delay and heuristic parse (stub)
    await new Promise(r => setTimeout(r, 300));
    const demoFields: OcrExtractField[] = [
      { field: 'passportNumber', value: 'P' + Math.floor(Math.random()*1e7), confidence: 0.61 },
      { field: 'surname', value: 'DOE', confidence: 0.88 },
      { field: 'givenNames', value: 'JOHN', confidence: 0.84 },
      { field: 'expirationDate', value: new Date(Date.now()+86400000*365).toISOString().slice(0,10), confidence: 0.77 }
    ];
    return { documentId, type, fields: demoFields, warnings: [], completedAt: new Date().toISOString() };
  }
};
