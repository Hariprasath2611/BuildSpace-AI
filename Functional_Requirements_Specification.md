# BuildSpace AI — Functional Requirements Specification (FRS)
## The Enterprise Blueprint for the AI-Powered Construction Operating System
**Document Version:** 1.0.0  
**Date:** June 18, 2026  
**Confidentiality:** Public Open Architecture Specification  
**Status:** Ready for Engineering Sprint Planning  

---

## Document Metadata & Reference Matrix
This document establishes the functional blueprints for all 30 core modules of the BuildSpace AI platform. All specifications use standardized Functional Requirement IDs (`FR-XXX`), validation tables, state transition charts, and database schemas.

---

## Module 1: Company Management (CMP)

*   **Module ID:** `CMP`
*   **Purpose:** Establishes the organizational structures, regional tax settings, timezones, and hierarchical approval rules for a tenant company.
*   **Business Value:** Simplifies multi-region operations and consolidates regional branch offices and corporate units under a single billing framework.

### 1.1 Functional Requirements Matrix

| Requirement ID | Feature Name | Description | User Role | Permissions |
|---|---|---|---|---|
| `FR-CMP-001` | Company Registration | Register new corporate tenant with legal name, GSTIN, and corporate email. | Super Admin | `Create:Tenant` |
| `FR-CMP-002` | Branch Setup | Create regional branch divisions (e.g., Western Region, Singapore Branch). | Company Owner| `Manage:Branch` |
| `FR-CMP-003` | Approval Hierarchy | Define custom spending limits and multi-tiered sign-off workflows. | Managing Dir | `Manage:Settings` |

### 1.2 User Story & Acceptance Criteria
*   **User Story:** *As a Company Owner, I want to create regional branch offices and assign managing directors to them so that I can delegate operations while maintaining central control over budgets.*
*   **Acceptance Criteria:**
    1.  System must allow creation of branch nodes with unique timezones and currency settings.
    2.  Deleting a branch node must require double-factor verification and check that no active project sites are mapped to it.

### 1.3 State Transition Diagram

```
[Draft Profile] --(Submit Legal Info)--> [Pending Verification] --(Approve Tax ID)--> [Active Tenant]
                                                                                            |
                                                                                    (Suspend / Unpaid)
                                                                                            v
                                                                                    [Suspended Tenant]
```

### 1.4 API Contract Reference
```http
POST /api/v1/tenant/register
Content-Type: application/json
Authorization: Bearer <token>

{
  "legal_name": "Apex General Contractors Ltd",
  "tax_identifier": "99AABCA1234F1Z0",
  "country": "IN",
  "timezone": "Asia/Kolkata",
  "currency": "INR",
  "billing_plan": "Enterprise"
}
```

---

## Module 2: User Management (USR)

*   **Module ID:** `USR`
*   **Purpose:** Coordinates user invitations, profile registers, skill qualifications, and biometric check-ins.
*   **Business Value:** Cuts down on time card errors and ensures only certified workers are assigned to specialized site tasks.

### 2.1 Functional Requirements Matrix

| Requirement ID | Feature Name | Description | User Role | Permissions |
|---|---|---|---|---|
| `FR-USR-001` | Invite User | Send invite email with predefined role mapping and project access limits. | PM, Admin | `Manage:Users` |
| `FR-USR-002` | Biometric Register | Register face coordinates via mobile camera to support biometrics logins. | Worker, Eng | `Create:Identity` |
| `FR-USR-003` | Skills Matrix | Log certifications (e.g., scaffolding license, welding credentials) with alert dates. | HR Manager | `Manage:Workers` |

### 2.2 Validation Rules

| Field Name | Type | Validation Constraint | Error Message |
|---|---|---|---|
| `email` | String | Must match standard RFC 5322 email regex pattern. | "Invalid email format." |
| `license_expiry` | Date | Must be a future date (> current site date). | "Certification expiration date must be in the future." |

---

## Module 3: Project Management (PRJ)

*   **Module ID:** `PRJ`
*   **Purpose:** Coordinates project calendars, milestone tracking, timeline scheduling, and Gantt charts.
*   **Business Value:** Minimizes project delays by predicting critical path issues 30 days in advance.

### 3.1 Functional Requirements Matrix

| Requirement ID | Feature Name | Description | User Role | Permissions |
|---|---|---|---|---|
| `FR-PRJ-001` | Project Setup | Create a project profile using templates or BIM configuration structures. | Project Dir | `Manage:Projects`|
| `FR-PRJ-002` | Critical Path Sync | Auto-calculate critical path variations using CPM models. | Planning Eng | `Manage:Projects`|
| `FR-PRJ-003` | Project Health Score | Generate health forecasts based on schedule updates and budget variances. | AI Assistant | `Manage:AI` |

### 3.2 Workflow: Schedule Variation Escalation

```
[Planning Eng Updates Task]
             |
             v
[BuildSpace AI CPM Engine Runs]
             |
   Schedule Slip > 5 Days?
             |
     +-------+-------+
     |               |
    Yes              No
     v               v
[Escalate Alert to PM]   [Update Dashboard Chart]
```

---

## Module 4: Site Management (SIT)

*   **Module ID:** `SIT`
*   **Purpose:** Configures geofenced site areas, coordinates active work zones, tracks daily visitor logs, and registers local weather conditions.
*   **Business Value:** Prevents safety incidents by warning users when they enter high-risk zones, and logs weather impacts automatically.

### 4.1 Functional Requirements Matrix

| Requirement ID | Feature Name | Description | User Role | Permissions |
|---|---|---|---|---|
| `FR-SIT-001` | Geofence Zone | Map GPS coordinates to set site boundaries and configure active work zones. | Site Engineer | `Manage:Sites` |
| `FR-SIT-002` | Weather Logger | Pull local weather data hourly and log impacts on open concrete pours. | AI Assistant | `Read:Weather` |

---

## Module 5: Task Management (TSK)

*   **Module ID:** `TSK`
*   **Purpose:** Manages task assignments, priorities, checklist updates, comments, and approvals.
*   **Business Value:** Keeps teams aligned and ensures quality checks are completed before tasks are signed off.

### 5.1 State Transitions

```
[Backlog] --(Assign User)--> [Assigned] --(Start Task)--> [In Progress] --(Complete Check)--> [Pending Review] --(Sign-off)--> [Closed]
                                                                 ^                                    |
                                                                 |----------------(Reject / Rework)---|
```

---

## Module 6: Workforce Management (WRK)

*   **Module ID:** `WRK`
*   **Purpose:** Coordinates biometric timecards, shift schedules, payroll structures, and contract wage audits.
*   **Business Value:** Reduces timecard errors and ensures compliance with labor rules.

### 6.1 Functional Requirements Matrix

| Requirement ID | Feature Name | Description | User Role | Permissions |
|---|---|---|---|---|
| `FR-WRK-001` | Biometric In/Out | Check-in/out on-site using GPS geofencing and facial verification. | Worker, Eng | `Create:Attendance`|
| `FR-WRK-002` | Daily Wage Audit | Calculate day-wage payouts for subcontractors based on shift logs. | Accountant | `Manage:Payroll` |

---

## Module 7: Material Management (MAT)

*   **Module ID:** `MAT`
*   **Purpose:** Manages materials inventories, warehouse allocations, purchase requests, and waste tracking.
*   **Business Value:** Minimizes inventory delays and cuts down on material waste.

### 7.1 Flow: Material Request & PO Approval

```
[Site Engineer creates request] --(Checks Budget)--> [Project Manager]
                                                           |
                                                Spend > $5,000 Threshold?
                                                           |
                                              +------------+------------+
                                              |                         |
                                             Yes                        No
                                              v                         v
                                    [Finance Mgr Review]         [System Auto-PO]
```

---

## Module 8: Equipment Management (EQP)

*   **Module ID:** `EQP`
*   **Purpose:** Tracks fleet GPS, coordinates scheduling bookings, logs breakdown reports, and predicts maintenance needs.
*   **Business Value:** Maximizes machinery utilization and prevents expensive breakdowns.

### 8.1 Functional Requirements Matrix

| Requirement ID | Feature Name | Description | User Role | Permissions |
|---|---|---|---|---|
| `FR-EQP-001` | Booking System | Reserve excavators, cranes, or machinery blocks to prevent schedule clashes. | PM, Site Eng | `Manage:Equipment`|
| `FR-EQP-002` | IoT Maintenance | Monitor engine hours via GPS telematics to predict service dates. | Fleet Manager| `Manage:Equipment`|

---

## Module 9: Procurement (PRO)

*   **Module ID:** `PRO`
*   **Purpose:** Coordinates vendor directories, RFQs, contract sign-offs, and payment schedules.
*   **Business Value:** Speeds up vendor selection and protects contract terms.

### 9.1 Functional Requirements Matrix
*   `FR-PRO-001`: Quotation Comparer: Compares bid submissions across cost, shipping, and quality metrics.
*   `FR-PRO-002`: Auto-Vendor Rating: Rates supplier delivery timeliness and accuracy using historic logs.

---

## Module 10: Finance (FIN)

*   **Module ID:** `FIN`
*   **Purpose:** Coordinates budget structures, cost codes, invoice matches, cash flow charts, and taxes.
*   **Business Value:** Protects project margins with real-time financial tracking.

### 10.1 Database Entity Schema
```sql
CREATE TABLE project_budgets (
    budget_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(project_id),
    cost_code VARCHAR(50) NOT NULL,
    allocated_amount DECIMAL(15,2) NOT NULL,
    committed_amount DECIMAL(15,2) DEFAULT 0.00,
    actual_spent DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## Module 11: Quality Management (QLY)

*   **Module ID:** `QLY`
*   **Purpose:** Logs punch lists, defects, non-conformance reports (NCRs), and corrective actions.
*   **Business Value:** Reduces rework costs by catching quality issues early.

### 11.1 Functional Requirements Matrix
*   `FR-QLY-001`: Defect Register: Pin defects to 2D site drawings, coordinate fix tasks, and track rework progress.
*   `FR-QLY-002`: Defect Detector: Analyze mobile photos using computer vision models to flag concrete cracks or alignment deviations.

---

## Module 12: Safety Management (SAF)

*   **Module ID:** `SAF`
*   **Purpose:** Tracks PPE compliance, registers site hazards, audits safety checks, and manages emergency SOS alerts.
*   **Business Value:** Prevents incidents, keeps sites OSHA-compliant, and protects worker safety.

### 12.1 Functional Requirements Matrix
*   `FR-SAF-001`: Safety Scan: Automatically check for hard hats and vests on CCTV camera feeds.
*   `FR-SAF-002`: Emergency SOS: Send location-tagged emergency alerts to site foremen and safety teams.

---

## Module 13: Document Management (DOC)

*   **Module ID:** `DOC`
*   **Purpose:** Stores site plans, bills of quantities (BOQs), permits, and contracts with full version controls.
*   **Business Value:** Keeps team aligned on the latest design documents.

### 13.1 Functional Requirements Matrix
*   `FR-DOC-001`: Version Engine: Maintain drawing revision histories and push updates to mobile apps.
*   `FR-DOC-002`: Plan Search: Parse text inside drawings and scan PDFs using OCR systems to find specific mechanical nodes.

---

## Module 14: Photo & Video Management (PHV)

*   **Module ID:** `PHV`
*   **Purpose:** Stores progress photos and drone videos, and generates project time-lapses.
*   **Business Value:** Provides clear, visual progress records to protect against client disputes.

### 14.1 Functional Requirements Matrix
*   `FR-PHV-001`: Drawing Sync: Pin photos and drone flight points directly to coordinates on the 2D project layout.
*   `FR-PHV-002`: Progress Slider: Generate side-by-side photo comparisons showing weekly progress.

---

## Module 15: Communication (COM)

*   **Module ID:** `COM`
*   **Purpose:** Configures user chat channels, logs voice transcripts, and runs video meetings.
*   **Business Value:** Eliminates communication silos between field crews and office teams.

### 15.1 Functional Requirements Matrix
*   `FR-COM-001`: Voice Transcription: Convert field voice notes to written logs and extract tasks automatically.
*   `FR-COM-002`: Site Channels: Configure chat channels for specific project sub-trades (e.g., Level 2 Electrical Team).

---

## Module 16: Calendar & Scheduling (CAL)

*   **Module ID:** `CAL`
*   **Purpose:** Tracks delivery schedules, machinery bookings, inspections, and project milestones.
*   **Business Value:** Prevents site scheduling overlaps and trade delays.

### 16.1 Functional Requirements Matrix
*   `FR-CAL-001`: Sync Engine: Sync site events and checklists with Google and Outlook calendars.
*   `FR-CAL-002`: Delivery Scheduler: Coordinate delivery slots to prevent traffic backlog at the site gate.

---

## Module 17: Reporting (REP)

*   **Module ID:** `REP`
*   **Purpose:** Compiles daily, weekly, safety, and financial reports.
*   **Business Value:** Automates client reporting, saving PMs hours of manual drafting.

### 17.1 Functional Requirements Matrix
*   `FR-REP-001`: Daily log Generator: Compile camera logs, weather feeds, and timesheets to auto-draft daily site summaries.
*   `FR-REP-002`: Export Engine: Export reports directly to formatted PDF or raw Excel worksheets.

---

## Module 18: Analytics (ANL)

*   **Module ID:** `ANL`
*   **Purpose:** Consolidates project KPIs, cost trends, and equipment statistics.
*   **Business Value:** Helps management make decisions using accurate, real-time metrics.

### 18.1 Executive Dashboard Configuration
*   **Charts:** Cost Variance (CV), Schedule Variance (SV), and cumulative budget trend lines.
*   **KPIs:** Labor efficiency rates, concrete waste percentages, and safety incident scores.

---

## Module 19: AI Copilot (COP)

*   **Module ID:** `COP`
*   **Purpose:** Answers natural language queries and analyzes project risk indicators.
*   **Business Value:** Speeds up document search and catches project risks early.

### 19.1 AI Query & RAG Workflow
```
[User inputs natural language query]
                 |
                 v
[System searches localized project documents]
                 |
                 v
[AI outputs specific page/drawing specifications]
```

---

## Module 20: Computer Vision (COV)

*   **Module ID:** `COV`
*   **Purpose:** Analyzes camera feeds to count workers, track materials, and detect defects.
*   **Business Value:** Automates site progress tracking and safety checks.

### 20.1 Functional Requirements Matrix
*   `FR-COV-001`: Worker Counter: Count active site staff hourly using geofenced camera zones.
*   `FR-COV-002`: Crack Detector: Detect structural concrete cracks on site photos.

---

## Module 21: OCR & Document AI (OCR)

*   **Module ID:** `OCR`
*   **Purpose:** Extracts data from invoices, POs, and submittal sheets.
*   **Business Value:** Minimizes manual administrative entry errors.

### 21.1 Functional Requirements Matrix
*   `FR-OCR-001`: Invoice Parser: Extract billing details, line items, and taxes from invoices.
*   `FR-OCR-002`: BOQ Extractor: Auto-populate estimate ledgers from uploaded PDF bills.

---

## Module 22: Voice AI (VAI)

*   **Module ID:** `VAI`
*   **Purpose:** Hands-free voice updates and regional language logging.
*   **Business Value:** Boosts mobile adoption among non-English speaking field crews.

### 22.1 Functional Requirements Matrix
*   `FR-VAI-001`: Field voice-to-text logging in regional languages.
*   `FR-VAI-002`: Hands-free voice commands for drawing lookups on site.

---

## Module 23: Notifications (NTF)

*   **Module ID:** `NTF`
*   **Purpose:** Routes push alerts, emails, SMS notifications, and WhatsApp updates.
*   **Business Value:** Keeps teams aligned on critical project events.

### 23.1 Notification Routing Logic
*   **Critical Safety Incidents:** Sent immediately via SMS and WhatsApp.
*   **RFI Updates:** Sent as in-app dashboard items with daily email summaries.

---

## Module 24: Client Portal (CLP)

*   **Module ID:** `CLP`
*   **Purpose:** Read-only portal for project progress, photos, and change requests.
*   **Business Value:** Keeps clients aligned on progress to speed up payouts.

### 24.1 Functional Requirements Matrix
*   `FR-CLP-001`: Client Progress View: Display photos and verified milestones.
*   `FR-CLP-002`: Payment Approvals: Approve change orders and verify invoice milestones.

---

## Module 25: Admin Panel (ADM)

*   **Module ID:** `ADM`
*   **Purpose:** Super Admin dashboard for managing tenants, billing, and logs.
*   **Business Value:** Simplifies system administration and security checks.

### 25.1 Functional Requirements Matrix
*   `FR-ADM-001`: Tenant Manager: Provision tenant database workspaces and update licensing scopes.
*   `FR-ADM-002`: System Log Auditor: Review global authorization changes and API calls.

---

## Section 26: Settings (SET)

*   **Module ID:** `SET`
*   **Purpose:** Manages localization preferences, active integrations, and database backups.
*   **Business Value:** Tailors the platform to match regional and company workflows.

### 26.1 Functional Requirements Matrix
*   `FR-SET-001`: Database Backups: Schedule daily database snapshots with AES-256 encryption.
*   `FR-SET-002`: Integration Manager: Toggle external connections (e.g., SAP ERP, QuickBooks).

---

## Module 27: Marketplace (MKT)

*   **Module ID:** `MKT`
*   **Purpose:** Supplier listings for materials, equipment, and developer plugins.
*   **Business Value:** Simplifies purchasing logistics within the dashboard.

### 27.1 Functional Requirements Matrix
*   `FR-MKT-001`: Supplier Registry: Browse verified materials vendors, equipment rental agencies, and subcontractors.
*   `FR-MKT-002`: Direct Checkout: Process materials and rental bookings within the app.

---

## Module 28: Integrations (INT)

*   **Module ID:** `INT`
*   **Purpose:** Standard APIs for SAP, Oracle, Autodesk BIM, and drone telemetry.
*   **Business Value:** Prevents data fragmentation across systems.

### 28.1 Functional Requirements Matrix
*   `FR-INT-001`: BIM Connector: Sync spatial geometries directly between Revit models and the site twin database.
*   `FR-INT-002`: ERP Bridge: Send verified invoices and progress milestones to SAP/Oracle ERPs.

---

## Module 29: Mobile Features (MOB)

*   **Module ID:** `MOB`
*   **Purpose:** Local database caching, digital signatures, and offline checks.
*   **Business Value:** Keeps field crews productive in areas without internet connectivity.

### 29.1 Functional Requirements Matrix
*   `FR-MOB-001`: Offline Sync: Cache changes in a local database and sync them automatically upon reconnection.
*   `FR-MOB-002`: Digital Sign-Off: Securely sign inspection sheets and checklists on site.

---

## Module 30: Future Modules (FUT)

*   **Module ID:** `FUT`
*   **Purpose:** Pre-allocations for advanced AR views, carbon tracking, and robotic systems.
*   **Business Value:** Future-proofs platform architecture for emerging technologies.

### 30.1 Future Architecture Scope
*   **Carbon Ledger:** Trace material shipping and concrete types to calculate carbon footprints.
*   **AR Overlay:** Sync 3D BIM models with field cameras to show layout lines dynamically.
