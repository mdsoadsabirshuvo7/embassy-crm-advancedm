// Central registry for advanced / premium feature capability flags.
// These map to roadmap items in README. Flags allow progressive enhancement without breaking base build.

export type FeatureFlag =
  | 'advancedAccounting'
  | 'bankReconciliation'
  | 'predictiveAnalytics'
  | 'ocrExtraction'
  | 'nativeESign'
  | 'recruitment'
  | 'performanceOKR'
  | 'communicationHub'
  | 'videoCalls'
  | 'aiAssistant'
  | 'fraudDetection'
  | 'complianceEngine'
  | 'multiEntityAccounting'
  | 'budgetingForecasting'
  | 'dashboardBuilder'
  | 'drilldownReporting'
  | 'regulatoryReporting'
  | 'documentVersioning'
  | 'templateMarketplace'
  | 'aiDocumentValidation'
  | 'payrollEngine'
  | 'attendanceLeave'
  | 'clientPortal'
  | 'notificationSystem'
  | 'aiWorkflowOptimizer'
  | 'caseOutcomePredictor'
  | 'zeroTrustSecurity'
  | 'dataResidency'
  | 'onPremDeployment';

export interface FeatureMeta {
  key: FeatureFlag;
  label: string;
  description: string;
  status: 'planned' | 'in-progress' | 'experimental' | 'released';
  dependsOn?: FeatureFlag[];
}

const registry: FeatureMeta[] = [
  { key: 'advancedAccounting', label: 'Advanced Accounting', description: 'Full ledger, journals, trial balance, cash flow', status: 'in-progress' },
  { key: 'multiEntityAccounting', label: 'Multi-Entity Accounting', description: 'Consolidation across multiple orgs', status: 'planned', dependsOn: ['advancedAccounting'] },
  { key: 'bankReconciliation', label: 'Bank Reconciliation', description: 'Statement import & auto matching', status: 'in-progress', dependsOn: ['advancedAccounting'] },
  { key: 'budgetingForecasting', label: 'Budgeting & Forecasting', description: 'Rolling 12/24 month projections', status: 'planned', dependsOn: ['advancedAccounting'] },
  { key: 'predictiveAnalytics', label: 'Predictive Analytics', description: 'Approval timelines & workload forecasting', status: 'in-progress' },
  { key: 'dashboardBuilder', label: 'Dashboard Builder', description: 'Drag-and-drop KPI widgets', status: 'planned' },
  { key: 'drilldownReporting', label: 'Drilldown Reporting', description: 'Org → Dept → Staff → Case → Document path', status: 'planned' },
  { key: 'regulatoryReporting', label: 'Regulatory Reporting', description: 'Compliance bundles per jurisdiction', status: 'planned' },
  { key: 'ocrExtraction', label: 'OCR & Smart Forms', description: 'Extract structured data from IDs & passports', status: 'in-progress' },
  { key: 'documentVersioning', label: 'Document Versioning', description: 'Version graph + diff + signatures', status: 'planned' },
  { key: 'nativeESign', label: 'Native E-Signatures', description: 'Inbuilt signing + immutable audit hashes', status: 'planned', dependsOn: ['documentVersioning'] },
  { key: 'templateMarketplace', label: 'Template Marketplace', description: 'Embassy forms & HR templates', status: 'planned' },
  { key: 'aiDocumentValidation', label: 'AI Document Validation', description: 'Detect missing or invalid fields', status: 'planned', dependsOn: ['ocrExtraction'] },
  { key: 'recruitment', label: 'Recruitment', description: 'Job posts to onboarding pipeline', status: 'planned' },
  { key: 'payrollEngine', label: 'Payroll Engine', description: 'Salary components & payslips', status: 'in-progress' },
  { key: 'attendanceLeave', label: 'Attendance & Leave', description: 'Geo-fenced multi-office tracking', status: 'planned' },
  { key: 'performanceOKR', label: 'Performance & OKRs', description: 'Goal cycles & 360 feedback', status: 'planned' },
  { key: 'communicationHub', label: 'Communication Hub', description: 'Internal chat + client messaging', status: 'in-progress' },
  { key: 'clientPortal', label: 'Client Portal', description: 'Secure external messaging & uploads', status: 'planned', dependsOn: ['communicationHub'] },
  { key: 'videoCalls', label: 'Video Calls', description: 'Embedded WebRTC sessions', status: 'planned', dependsOn: ['communicationHub'] },
  { key: 'notificationSystem', label: 'Notification System', description: 'Real-time alerts & SLA escalations', status: 'planned' },
  { key: 'aiAssistant', label: 'AI Assistant', description: 'Natural language operational queries', status: 'planned' },
  { key: 'aiWorkflowOptimizer', label: 'AI Workflow Optimizer', description: 'Bottleneck & reassignment suggestions', status: 'planned' },
  { key: 'caseOutcomePredictor', label: 'Case Outcome Predictor', description: 'Historic decision modeling', status: 'planned', dependsOn: ['predictiveAnalytics'] },
  { key: 'fraudDetection', label: 'Fraud Detection', description: 'Duplicate / anomalous document detection', status: 'planned', dependsOn: ['ocrExtraction'] },
  { key: 'complianceEngine', label: 'Compliance Engine', description: 'Configurable rule packs (GDPR/HIPAA/SOC2)', status: 'planned' },
  { key: 'zeroTrustSecurity', label: 'Zero Trust Security', description: 'Device fingerprint & step-up auth', status: 'planned' },
  { key: 'dataResidency', label: 'Data Residency', description: 'Region-aware storage routing', status: 'planned' },
  { key: 'onPremDeployment', label: 'On-Prem Deployment', description: 'Air-gapped build target', status: 'planned' }
];

export const FeatureRegistry = {
  list(): FeatureMeta[] { return registry; },
  get(flag: FeatureFlag) { return registry.find(r => r.key === flag); },
  // Persistent localStorage flag map (super-admin editable)
  _key: 'app.featureFlags.v1',
  _subscribers: new Set<() => void>(),
  _readMap(): Record<string, boolean> {
    try {
      const raw = localStorage.getItem(this._key);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch { return {}; }
  },
  _writeMap(map: Record<string, boolean>) {
    try { localStorage.setItem(this._key, JSON.stringify(map)); } catch {}
  },
  isEnabled(flag: FeatureFlag): boolean {
    const map = this._readMap();
    return !!map[flag];
  },
  enable(flag: FeatureFlag) {
    const map = this._readMap();
    map[flag] = true; this._writeMap(map); this._emit();
  },
  disable(flag: FeatureFlag) {
    const map = this._readMap();
    delete map[flag]; this._writeMap(map); this._emit();
  },
  toggle(flag: FeatureFlag) { this.isEnabled(flag) ? this.disable(flag) : this.enable(flag); },
  subscribe(fn: () => void) { this._subscribers.add(fn); return () => { this._subscribers.delete(fn); }; },
  _emit() { for (const fn of this._subscribers) { try { fn(); } catch {} } }
};

export type { FeatureMeta as FeatureDefinition };
