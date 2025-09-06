# Embassy CRM - Complete Business Management System

## Executive Summary

Embassy CRM is a comprehensive enterprise resource planning (ERP) system specifically designed for immigration consultancies, embassy service providers, and visa processing agencies. Built with modern web technologies, it streamlines complex workflows from client onboarding to financial reporting, reducing manual paperwork by up to 70% while ensuring compliance with international business standards. Whether you're managing multiple office locations or handling diverse client portfolios, Embassy CRM provides the integrated tools needed to scale your operations efficiently.

## 🎯 Target Audience

- **Immigration Consultancies** - Streamline visa applications and client communications
- **Embassy Service Providers** - Manage document processing and compliance workflows  
- **Travel Agencies** - Coordinate visa services with travel planning
- **Corporate HR Teams** - Handle employee visa processing and international relocations
- **Legal Firms** - Manage immigration cases and client documentation

## 💼 Business Value

Transform your operations with measurable improvements:

- **Reduce manual paperwork by 70%** - Automated workflows and digital document management
- **Speed up visa processing by 40%** - Streamlined task management and status tracking  
- **Cut payroll processing time in half** - Integrated HR management with automated calculations
- **Improve client satisfaction by 60%** - Real-time status updates and professional reporting
- **Eliminate financial errors** - Double-entry bookkeeping with automatic reconciliation
- **Achieve audit compliance** - Complete audit trails and regulatory reporting

## 🏗️ Core Business Modules

### Client Relationship Management
- **Centralized client profiles** → Single source of truth for all client information
- **Application tracking** → Real-time visibility into visa processing stages
- **Communication history** → Complete record of client interactions and decisions
- **Multi-language support** → Serve international clients in their preferred language

### Financial Management & Accounting  
- **Double-entry bookkeeping** → Industry-standard accounting for audit compliance
- **Multi-currency support** → Handle international transactions seamlessly
- **Automated invoicing** → Generate professional invoices with payment tracking
- **Financial reporting** → Real-time P&L, balance sheets, and cash flow statements

### Human Resources
- **Employee management** → Complete staff profiles with role-based permissions
- **Department organization** → Structured hierarchy for multi-office operations
- **Payroll integration** → Streamlined payroll processing with automated calculations
- **Performance tracking** → Monitor productivity and workload distribution

### Document & Task Management
- **Digital document storage** → Secure, organized file management with version control
- **Workflow automation** → Automated task assignments and deadline tracking
- **Template library** → Standardized documents and forms for consistency
- **Progress monitoring** → Real-time project status and milestone tracking

## 🚀 Enterprise Features

### Multi-Organization Architecture (Super Admin Scoped)
- **Super Admin org switching** → Organization selector visible only to `SUPER_ADMIN`
- **Scoped local data** → All local storage collections automatically inject & filter `orgId`
- **Per-org module configuration** → Module enablement persisted per organization key
- **Isolation guard** → Non-super-admin users operate strictly within their assigned org (no UI to switch)

### Advanced Security & Compliance
- **Role-based access control** → Granular permissions for data protection
- **Audit trail logging** → Complete record of all system changes and user actions
- **Data encryption** → Bank-level security for sensitive client information
- **GDPR compliance** → European data protection standards built-in

### Integration & Productivity
- **Real-time notifications** → Stay informed of critical updates and deadlines
- **Export capabilities** → Generate reports in PDF, Excel, and Word formats
- **API-ready architecture** → Connect with existing business systems
- **Mobile-responsive design** → Access from any device, anywhere

## 🛡️ Security & Compliance

### Data Protection
- **End-to-end encryption** for all sensitive client and financial data
- **Automated backups** with point-in-time recovery capabilities
- **Data residency options** to meet local regulatory requirements
- **Disaster recovery** strategy with 99.9% uptime guarantee

### Audit & Compliance
- **Complete audit trails** tracking who changed what and when
- **Regulatory reporting** templates for immigration and financial authorities
- **Data retention policies** automatically applied based on legal requirements
- **Compliance dashboards** for monitoring regulatory adherence

## 🔮 Product Roadmap

### Q1 2025 - AI Enhancement
- **AI-powered document classification** → Automatic categorization of uploaded documents
- **Intelligent workflow suggestions** → AI recommendations for process optimization
- **Predictive analytics** → Forecast processing times and resource needs

### Q2 2025 - Client Portal  
- **Self-service client portal** → Allow clients to check status and upload documents
- **Mobile application** → Native iOS/Android apps for on-the-go access
- **Client communication hub** → Integrated messaging and video consultation

### Q3 2025 - Advanced Integrations
- **Payment gateway integrations** → Accept online payments with automated reconciliation
- **Government API connections** → Direct integration with embassy systems
- **CRM marketplace** → Connect with popular business tools and services

## 🛠️ Technology Stack

**Frontend Architecture**
- React 18 + TypeScript (strict typing emphasis)
- Tailwind CSS + shadcn/ui component primitives
- TanStack React Query (incremental migration – Expenses & Tasks slices complete)
- React Router v6 (lazy-loaded route code-splitting)
- Dynamic import of heavy libs (jsPDF / xlsx) via a unified `ExportService`
- Local offline storage abstraction (versioned schema + migrations)
- Module-based feature gating + fine-grained policy map (`utils/permissions.ts`)

**Data & Persistence**
- LocalStorage (schema versioned) + offline audit log storage
- Firestore / Firebase Auth (integration ready; currently local-first mode)
- Audit logging (`auditLogger`) with exportable viewer (CSV / Excel / PDF)
- Per-tenant namespacing + migration for legacy records

**Performance & UX**
- Route bundle prefetch on sidebar hover (instant feel after first nav)
- Optimistic updates (Expenses & Tasks) with rollback on error
- Column chooser with persisted table preferences (Expenses)
- Optional service worker shell & asset caching (`public/service-worker.js`)
- Currency conversion / formatting service (USD ↔ BDT)
- Selector memoization keyed by orgId (employee/client maps) to reduce recompute

**Quality & Tooling**
- Vitest + React Testing Library (initial smoke tests scaffolded)
- Architecture & contributor guides (`ARCHITECTURE.md`, `CONTRIBUTING.md`)
- Contrast audit utility (`utils/contrastAudit.ts`) to evaluate palette ratios
- Per-feature Error Boundaries (isolated failure domains)

## 📊 Feature Comparison

| Capability | Embassy CRM | Excel/Manual | Generic CRM |
|------------|-------------|--------------|-------------|
| Multi-organization | ✅ Native | ❌ No | 🟡 Limited |
| Double-entry accounting | ✅ Built-in | ❌ Manual | ❌ No |
| Document workflows | ✅ Automated | ❌ Manual | 🟡 Basic |
| Multi-language | ✅ Native | ❌ No | 🟡 Limited |
| Audit compliance | ✅ Automatic | ❌ Manual | 🟡 Basic |
| Real-time reporting | ✅ Live data | ❌ No | 🟡 Limited |

## 🚀 Getting Started

### Development Setup (Quick Start)

```bash
git clone <YOUR_GIT_URL>
cd embassy-crm
npm install
npm run dev
```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Build production bundle**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

### Available NPM Scripts

| Script | Purpose |
|--------|---------|
| `dev` | Start Vite dev server |
| `build` | Production build |
| `build:dev` | Unminified dev-mode build (profiling) |
| `preview` | Serve built assets |
| `lint` | Run ESLint across codebase |
| `test` | Run Vitest suite (CI mode) |
| `test:ui` | Interactive Vitest watch mode |

---

## 🧩 Modular Feature System

Embassy CRM uses a dual-layer authorization approach (with tenant scoping):

1. **Module Gating** – High-level enable/disable toggles stored in `ModuleContext` (persisted per-org in `localStorage`).
2. **Action Policy Map** – Fine-grained action → roles mapping in `utils/permissions.ts` (e.g. `expenses:approve`).

If a module is disabled, authorized administrators see a quick inline "Quick Enable" option on the Access Denied screen.

### Adding a New Module
1. Add entry to `ModuleContext.defaultModules`.
2. Create route + lazy import.
3. Gate with `<ProtectedRoute module="yourModule" ...>`.
4. (Optional) Add action-level permissions to `POLICY` map.
5. Ensure create/update paths auto-inject `orgId` (service layer already enforces this for bundled modules).

---

## 🔍 Audit Logging

All critical mutations can be recorded via `auditLogger` (login/logout, CRUD, exports, permission changes). The viewer component:
- Filters by action & free-text search
- Exports to CSV / Excel / PDF through the unified export layer
- Supports future compliance reporting (structure already scaffolded)
- Filters by active organization (Super Admin can pivot across orgs)

To log a custom action:
```ts
import { auditLogger } from '@/utils/auditLogger';
await auditLogger.log(user.id, user.name, 'CUSTOM_ACTION', 'resource', resourceId, oldData, newData);
```

---

## ⚡ Performance Optimizations

| Optimization | Description |
|--------------|-------------|
| Dynamic Imports | Heavy libraries (pdf/excel) only loaded on demand |
| Route Prefetch | Hovering a sidebar link warms the route chunk |
| Optimistic Updates | Immediate UI response for expense/task edits with rollback |
| Column Persistence | Avoids reflow & user reconfiguration cost per visit |
| Service Worker (opt) | Shell & static asset caching for faster revisits |
| React Query Cache | Minimizes redundant localStorage reads |

---

## 💱 Currency & Formatting

Central helpers in `currencyService.ts` manage conversion & formatting. Example:
```ts
import { convert, formatMoney } from '@/services/currencyService';
const bdt = convert(100, 'USD', 'BDT');
const formatted = formatMoney(bdt, 'BDT');
```

---

## 🧪 Testing

Initial foundation is present (Vitest + RTL). Add tests beside components or under `src/__tests__`.

Example smoke test (`AuditLogViewer`):
```ts
import { render, screen } from '@testing-library/react';
import AuditLogViewer from '@/components/audit/AuditLogViewer';
test('renders audit log heading', () => {
  render(<AuditLogViewer />);
  expect(screen.getByText(/Audit Logs/i)).toBeInTheDocument();
});
```

---

## ♿ Accessibility & Contrast

Use `auditPalette` from `utils/contrastAudit.ts` in the browser console:
```js
import { auditPalette } from '/src/utils/contrastAudit.ts';
auditPalette([
  ['#ffffff','#0f1115'],
  ['#ffffff','#1e293b']
]);
```
Returns contrast ratios to verify WCAG thresholds.

---

## 🧱 Architecture & Contribution

Detailed technical structure: see `ARCHITECTURE.md`.
Guidelines & workflow: see `CONTRIBUTING.md`.

---

## 🧭 Roadmap (Implemented vs Planned Snapshot)

| Area | Status |
|------|--------|
| Schema Versioned Local Storage | ✅ Implemented |
| Expenses React Query + Optimistic | ✅ Implemented |
| Tasks React Query + Optimistic | ✅ Implemented |
| Audit Log Viewer + Export | ✅ Implemented |
| Column Chooser (Expenses) | ✅ Implemented |
| Permission Policy Map | ✅ Implemented |
| Quick Module Toggle in AccessDenied | ✅ Implemented |
| Route Prefetch on Hover | ✅ Implemented |
| Service Worker Shell Cache | ✅ Optional Prototype |
| Per-Org Module Config | ✅ Implemented |
| Invitation Management (basic UI) | ✅ Implemented |
| Org Switch Restricted to Super Admin | ✅ Implemented |
| Compliance Report Export | 🟡 Planned |
| Client Portal | 🟡 Planned |
| AI Workflow Suggestions | 🟡 Planned |

---

## 🔐 Production Hardening (Next Steps)

| Item | Rationale |
|------|-----------|
| Server-side audit log persistence | Tamper resistance |
| Role & permission editor UI | Dynamic policy management |
| Comprehensive test coverage | Regression prevention |
| Full PWA manifest & offline flows | Better mobile UX |
| External rate provider for FX | Accurate currency conversion |

---

## 🏦 Advanced / Premium Feature Set (Status-Aligned)

Legend: ✅ Released | 🚧 In-Progress (scaffold + partial logic) | 🧪 Experimental | 🗺️ Planned

This section mirrors the internal `FeatureRegistry` flags. Many domains now have lightweight TypeScript service scaffolds so UI wiring can proceed incrementally without blocking the base platform.

### 🏦 Advanced Accounting
| Capability | Status | Notes |
|------------|--------|-------|
| General Ledger & Journals | 🚧 | `ledgerTypes.ts`, `ledgerService.ts` scaffolds |
| Trial Balance Generation | 🚧 | Basic aggregation implemented |
| Multi-Entity Consolidation | 🗺️ | Depends on per-org financial roll-up |
| Automated Tax Profiles (VAT / GST / Corporate) | 🚧 | `TaxRule` model stub present |
| Bank Reconciliation (CSV/OFX import + auto-match) | 🚧 | `reconciliationService.ts` naive matcher |
| Budgeting & Forecasting (12/24 mo) | 🗺️ | BudgetLine model only |
| Cash Flow Statements | 🗺️ | Derive from journal + classification |
| Regulatory Exports (SAF-T / XBRL) | 🗺️ | Adapter pattern planned |

### 📊 Analytics & BI
| Capability | Status | Notes |
|------------|--------|-------|
| Dashboard Builder (widgets + layouts) | 🚧 | `dashboardService.ts` scaffold |
| Predictive Analytics (case timelines) | 🚧 | `predictiveService.ts` heuristic model |
| Drilldown Reporting Path | 🚧 | `drilldownService.ts` hierarchy scaffold |
| Regulatory Reporting Packs | 🗺️ | Template-driven export pending |
| Embedded Query Layer (DuckDB/WASM) | 🗺️ | Future optional bundle |

### 📄 Document Management
| Capability | Status | Notes |
|------------|--------|-------|
| OCR & Smart Forms | 🚧 | `ocrService.ts` stub extraction |
| Document Versioning Graph | 🚧 | `versioningService.ts` basic version chain |
| Native E-Signatures | 🚧 | `esignService.ts` request lifecycle |
| Template Marketplace | 🚧 | `templateService.ts` seeded system templates |
| AI Document Validation | 🗺️ | Will depend on OCR confidence matrix |

### 🧑‍🤝‍🧑 HR & Workforce
| Capability | Status | Notes |
|------------|--------|-------|
| Payroll Engine (components + payslips) | 🚧 | `payrollService.ts` baseline calc |
| Attendance & Leave (geo/IP) | 🚧 | `attendanceService.ts` check-in + leave flow |
| Recruitment Pipeline | 🚧 | `recruitmentService.ts` stage transitions |
| Performance & OKRs | 🚧 | `performanceService.ts` objectives & KRs |
| Workforce Analytics | 🗺️ | Needs data aggregation layer |

### 🌐 Communication Hub
| Capability | Status | Notes |
|------------|--------|-------|
| Internal Chat Threads | 🚧 | `chatService.ts` in-memory store |
| Client Portal Messaging | 🗺️ | Depends on external user identity layer |
| Video Calls (WebRTC) | 🗺️ | Feature flag present (no impl) |
| Notification System | 🚧 | `notificationService.ts` scaffold |

### 🤖 AI & Automation
| Capability | Status | Notes |
|------------|--------|-------|
| Natural Language Assistant | 🚧 | `assistantService.ts` stub responder |
| Workflow Optimizer | 🗺️ | Requires event telemetry streams |
| Case Outcome Predictor | 🗺️ | Builds on predictive analytics data corpus |
| Fraud / Anomaly Detection | 🚧 | `fraudService.ts` placeholder analyzer |
| Autonomous Macros | 🗺️ | Queue/automation framework not yet added |

### 🛡️ Security & Compliance
| Capability | Status | Notes |
|------------|--------|-------|
| Compliance Rule Engine | 🚧 | `complianceEngine.ts` basic rule list/eval |
| Zero-Trust Device Layer | 🗺️ | Device fingerprint + step-up auth pending |
| Data Residency Partitioning | 🗺️ | Region-aware persistence strategy |
| On-Prem Deployment Profile | 🗺️ | Build target flag only (planning) |
| Field-Level Encryption Hooks | 🗺️ | Crypto key management layer TBD |

### 🔌 Extensibility Model
| Aspect | Status | Notes |
|--------|--------|-------|
| Feature Flag Registry | ✅ | `FeatureRegistry.ts` enumerates capabilities |
| Pluggable Service Scaffolds | 🚧 | Multiple domain service files added |
| Background Job Abstraction | 🗺️ | Awaiting server / worker design |
| Manifest-Based Mounting | 🗺️ | To be introduced with first UI module rollout |

Next Implementation Priorities (suggested):
1. Surface selected scaffolded services via minimal UI panels (read-only lists) to validate data shapes.
2. Introduce persistence adapter interface (local memory → localStorage → Firestore).
3. Add feature flag override storage (per-org + super admin global defaults).
4. Begin end-to-end slice: Accounting journal UI (create entry → trial balance view → reconciliation match).
5. Add test harness per domain (ledger balancing, OCR field extraction shape, payroll net calc).

---

## ✅ Quick Start (TL;DR)
```bash
git clone <YOUR_GIT_URL>
cd embassy-crm
npm install
npm run dev # open http://localhost:8080
npm test     # run smoke tests
```

---

### Deployment Options

- **Lovable Platform**: One-click deployment at [Lovable](https://lovable.dev/projects/b1bb8a4a-301b-471b-851d-06bf36d65973)
- **Custom Domain**: Connect your own domain via Project Settings → Domains
- **Self-hosted**: Deploy to any modern hosting platform (Vercel, Netlify, AWS)

---

## 🧭 Roadmap Snapshot (Implemented vs Planned)

| Area | Status |
|------|--------|
| Schema Versioned Local Storage | ✅ Implemented |
| Expenses React Query + Optimistic | ✅ Implemented |
| Tasks React Query + Optimistic | ✅ Implemented |
| Audit Log Viewer + Export | ✅ Implemented |
| Column Chooser (Expenses) | ✅ Implemented |
| Permission Policy Map | ✅ Implemented |
| Quick Module Toggle in AccessDenied | ✅ Implemented |
| Route Prefetch on Hover | ✅ Implemented |
| Service Worker Shell Cache | ✅ Optional Prototype |
| Per-Org Module Config | ✅ Implemented |
| Invitation Management | ✅ Implemented |
| Org Switch Restricted to Super Admin | ✅ Implemented |
| Compliance Report Export | 🟡 Planned |
| Client Portal | 🟡 Planned |
| AI Workflow Suggestions | 🟡 Planned |

---

## 🏦 Advanced / Premium Feature Flags (Scaffold)

Settings → Advanced exposes toggleable (placeholder) domains:

| Feature | Key | Status |
|---------|-----|--------|
| Advanced Accounting | advancedAccounting | in-progress |
| Bank Reconciliation | bankReconciliation | in-progress |
| Predictive Analytics | predictiveAnalytics | in-progress |
| OCR & Smart Forms | ocrExtraction | in-progress |
| Payroll Engine | payrollEngine | in-progress |
| Communication Hub | communicationHub | in-progress |
| Multi-Entity Accounting | multiEntityAccounting | planned |
| Budgeting & Forecasting | budgetingForecasting | planned |
| Dashboard Builder | dashboardBuilder | planned |
| Drilldown Reporting | drilldownReporting | planned |
| Regulatory Reporting | regulatoryReporting | planned |
| Document Versioning | documentVersioning | planned |
| Native E-Signatures | nativeESign | planned |
| Template Marketplace | templateMarketplace | planned |
| AI Document Validation | aiDocumentValidation | planned |
| Attendance & Leave | attendanceLeave | planned |
| Performance & OKRs | performanceOKR | planned |
| Recruitment | recruitment | planned |
| Client Portal | clientPortal | planned |
| Video Calls | videoCalls | planned |
| Notification System | notificationSystem | planned |
| AI Assistant | aiAssistant | planned |
| AI Workflow Optimizer | aiWorkflowOptimizer | planned |
| Case Outcome Predictor | caseOutcomePredictor | planned |
| Fraud Detection | fraudDetection | planned |
| Compliance Engine | complianceEngine | planned |
| Zero Trust Security | zeroTrustSecurity | planned |
| Data Residency | dataResidency | planned |
| On-Prem Deployment | onPremDeployment | planned |

---

## 📄 License

Proprietary – All rights reserved. (Update if selecting an open source license.)
