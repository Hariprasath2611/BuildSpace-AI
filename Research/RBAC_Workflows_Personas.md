# BuildSpace AI — User Personas, Roles, Workflows, & RBAC Specification
## Platform Security Architecture, Persona Schemas, & Workflow Engine Blueprint
**Document Version:** 1.0.0  
**Date:** June 18, 2026  
**Confidentiality:** Public / Open Architecture Document  
**Prepared By:** Lead Enterprise Architect, Security Specialist, & Core UX Strategist  

---

## Section 1: Platform Organizational Structure

BuildSpace AI uses a multi-tenant corporate hierarchy. The system is designed to support multi-company operations, joint ventures, regional branch offices, and location-specific construction sites.

### 1.1 Organizational Hierarchy Diagram

```
                              PLATFORM INSTANCE (SaaS)
                                         |
                                         v
                         SUPER ADMINISTRATIVE SYSTEM (Platform Owner)
                                         |
                                         v
                            ORGANIZATION (Tenant Account)
                                         |
                                         +-----------------------------------+
                                         |                                   |
                                         v                                   v
                                   BRANCH OFFICE 1                     BRANCH OFFICE 2
                                         |                                   |
                                         v                                   v
                                 BUSINESS UNIT (e.g., Civil)       BUSINESS UNIT (e.g., MEP)
                                         |                                   |
                                         +-----------------+                 |
                                         |                 |                 |
                                         v                 v                 v
                                     PROJECT A         PROJECT B         PROJECT C
                                         |
                                         +-----------------+
                                         |                 |
                                         v                 v
                                  CONSTRUCTION SITE 1  CONSTRUCTION SITE 2
                                         |
                                         +-----------------+
                                         |                 |
                                         v                 v
                                    DEPARTMENT 1      DEPARTMENT 2
                                   (e.g., Safety)    (e.g., Quality)
                                         |
                                         v
                                       TEAMS
                                         |
                                         v
                                  INDIVIDUAL USERS
```

### 1.2 Hierarchy Level Relationships
*   **Platform Owner / Super Admin:** Manages global subscriptions, allocates system resources, overrides system conflicts, and monitors infrastructure security.
*   **Organization (Tenant):** Represents the primary legal entity (e.g., Apex General Contractors). Has a dedicated database workspace, unique billing configuration, and global settings.
*   **Branch Office:** Local corporate divisions (e.g., Western Region, Southern Region). Manages overhead costs and local staff allocations.
*   **Business Unit:** Structural divisions within a branch (e.g., Infrastructure, Earthworks, Interior MEP).
*   **Project:** A specific contracted building engagement (e.g., Seattle mixed-use tower). Projects contain project budgets, master schedules, and primary documents.
*   **Construction Site:** Physical locations under a project. A project can have multiple sites (e.g., Phase 1 Excavation, Phase 2 Structure).
*   **Departments & Teams:** Logical groups within a site (e.g., Safety Crew, Quality Inspection Squad, Electrical Sub-Trade).
*   **Individual Users:** Accounts mapped to permissions under this hierarchy. Users can be assigned to multiple projects with different roles.

---

## Section 2: Complete User Roles & Actor Index

The system identifies and manages 50 discrete roles across five primary user categories:

### 2.1 Governance & Administrative Actors
1.  **Platform Owner:** System administrator who monitors platform performance, configures billing, and manages global integrations.
2.  **Super Admin:** Manages organization settings, configures user profiles, and audits company-wide access logs.
3.  **Auditor (External/Internal):** Read-only access to audit logs, financial records, and change histories for compliance purposes.

### 2.2 Executive & Management Actors
4.  **Company Owner:** Executive user with read/write access to company financials, project health statistics, and strategy dashboards.
5.  **Managing Director:** Oversees regional branch operations, business unit performances, and division budgets.
6.  **CEO (Chief Executive Officer):** Reviews portfolio IRR, corporate growth metrics, and high-level milestones.
7.  **COO (Chief Operating Officer):** Tracks division delivery schedules, labor efficiencies, and equipment use.
8.  **CTO (Chief Technology Officer):** Oversees API connections, database syncs, and system integrations.
9.  **Operations Manager:** Manages division scheduling, resource allocation, and general contractor relationships.
10. **Regional Manager:** Monitors group performance across regional branch offices.
11. **Branch Manager:** Manages local branch offices, local hiring, and overhead spending.
12. **Project Director:** Coordinates multiple project managers and project delivery schedules.
13. **Project Manager (PM):** Manages project budgets, change orders, schedules, and subcontractor assignments.
14. **Assistant Project Manager (APM):** Assists the PM in managing RFIs, submittals, progress photos, and client updates.

### 2.3 Engineering, Architectural & Design Actors
15. **Site Engineer:** Reviews drawing alignments, logs daily progress, and coordinates field trades.
16. **Civil Engineer:** Oversees earthworks, grading, soil tests, and foundation construction.
17. **Structural Engineer:** Verifies structural frame alignments, concrete tests, and steel connection checks.
18. **Architect:** Manages design blueprints, reviews submittals, and answers structural RFIs.
19. **Interior Designer:** Manages interior finishes, coordination drawings, and material samples.
20. **MEP Engineer:** Coordinates Mechanical, Electrical, and Plumbing layouts, and runs spatial clash checks.
21. **Survey Engineer:** Coordinates site boundaries, elevation benchmarks, and coordinates data.
22. **Planning Engineer:** Manages Gantt schedules, tracks project progress, and flags critical path delays.

### 2.4 Quality, Safety & Field Enforcement Actors
23. **Quality Engineer:** Audits product specifications, logs punch items, and performs inspections.
24. **Quality Inspector:** Executes field inspection walks, logs defects, and verifies punch items.
25. **Safety Officer:** Conducts safety sweeps, runs site safety briefings, and logs safety violations.
26. **Environment Officer:** Tracks site environmental compliance, dust levels, and waste disposal.

### 2.5 Supply Chain, Inventory & Procurement Actors
27. **Quantity Surveyor (QS):** Manages material takeoffs, estimates project bills, and performs cost audits.
28. **Procurement Manager:** Manages purchase orders (POs), coordinates vendor agreements, and tracks material logistics.
29. **Purchase Officer:** Tracks purchase requests and verifies delivery receipts.
30. **Inventory Manager:** Oversees central yard inventories and monitors warehouse material levels.
31. **Store Keeper:** Manages site tool rooms and logs material issuances.
32. **Warehouse Manager:** Manages regional warehouses and coordinates tool transportation.
33. **Equipment Manager:** Schedules heavy machinery usage and coordinates maintenance cycles.
34. **Fleet Manager:** Tracks vehicle locations, fuel utilization, and preventative maintenance schedules.
35. **Vendor / Subcontractor Lead:** Manages subcontractor tasks and coordinate updates with the PM.
36. **Supplier Partner:** Tracks material orders and submits invoices via the Vendor Portal.

### 2.6 Back Office & Support Actors
37. **Finance Manager:** Manages cash flow forecasts, invoices, tax setups, and audits project bank accounts.
38. **Accountant:** Verifies invoice matching, processes payroll, and files taxes.
39. **HR Manager:** Manages staff onboardings, tracks license compliance, and coordinates staffing allocations.
40. **Payroll Officer:** Processes timesheets, handles trade union benefits, and prints checks.

### 2.7 External Stakeholders
41. **Client / Developer Representative:** Views high-level progress, registers design change requests, and approves payments.
42. **Technical Consultant:** Audits design compliance on behalf of the client.
43. **Government Inspector:** Issues building permits, conducts safety inspections, and logs compliance approvals.

### 2.8 Field Operations Actors
44. **Foreman:** Coordinates trade crews and log daily hours.
45. **Supervisor:** Oversees task completion and coordinates site safety checklists.
46. **Worker (Laborer):** Uses the mobile app to check-in/out and view assigned tasks.
47. **Security Guard:** Manages site gate entry, logs visitors, and scans delivery QR codes.
48. **Visitor:** Temporary read-only access for site tours.

### 2.9 Automated & AI Agents
49. **AI Assistant (BuildSpace Copilot):** Transcribes voice logs and drafts RFIs.
50. **System Bot (Integrations Sync):** Automates background data syncs between ERPs and databases.

---

## Section 3: Core User Persona Specifications

Below is an analysis of our core user roles, detailing their workflows and technology requirements:

### 3.1 Company Owner
*   **Department:** Executive Office.
*   **Daily Tasks:** Reviews portfolio returns, checks high-level budget variances, and approves large expenses.
*   **KPIs:** Portfolio IRR, corporate margins, safety incident frequency, and schedule slip rates.
*   **Pain Points:** Delayed cash-flow reports and manual tracking of project delivery risks.
*   **Preferred Devices:** iPad Pro, desktop computer.
*   **Offline Requirement:** None.
*   **AI Expectations:** Portfolio financial forecasts and automated risk alerts.
*   **Approval Authority:** Multi-million dollar expense sign-off.
*   **Dashboard Widgets:** Portfolio margin charts, active project risk maps, and safety compliance gauges.
*   **Expected Screen Time:** 1–2 hours/day.

### 3.2 Project Manager (PM)
*   **Department:** Project Operations.
*   **Daily Tasks:** Checks schedules, updates budgets, reviews RFIs, and coordinates subcontractors.
*   **KPIs:** Cost Variance (CV), Schedule Variance (SV), RFI response times, and subcontractor scores.
*   **Pain Points:** Inconsistent field logs, manual data entry, and slow submittal approvals.
*   **Preferred Devices:** Laptop, iPhone.
*   **Offline Requirement:** Basic (access to offline drawing files and checklists).
*   **AI Expectations:** Automatically draft RFIs, predict schedule risks, and map trade densities.
*   **Approval Authority:** Project expenses up to $50,000.
*   **Dashboard Widgets:** Gantt views, open RFI/submittal logs, budget ledgers, and site camera feeds.
*   **Expected Screen Time:** 4–6 hours/day.

### 3.3 Site Engineer
*   **Department:** Field Construction.
*   **Daily Tasks:** Site walkthroughs, alignment checks, progress logs, and safety reports.
*   **KPIs:** Daily log completion, quality check pass rates, and trade productivity.
*   **Pain Points:** Spending hours writing logs at day's end, and looking for design drawings on site.
*   **Preferred Devices:** Android phone, rugged tablet.
*   **Offline Requirement:** High (requires full offline access to 2D drawings and checklists).
*   **AI Expectations:** Voice-to-text logging and automated drawing retrieval.
*   **Approval Authority:** Field quality and alignment approvals.
*   **Dashboard Widgets:** Task checklists, drawing viewer, photo uploader, and quick voice-logger.
*   **Expected Screen Time:** 3–5 hours/day (mostly mobile).

### 3.4 Safety Officer
*   **Department:** Environmental Health & Safety (EHS).
*   **Daily Tasks:** Safety sweeps, toolbox talks, hazard reporting, and PPE audits.
*   **KPIs:** Zero incident rates, PPE compliance index, and safety check frequency.
*   **Pain Points:** Worker resistance to safety rules, and massive compliance paperwork.
*   **Preferred Devices:** Rugged tablet, phone.
*   **Offline Requirement:** High (requires offline access to hazard maps and checklists).
*   **AI Expectations:** Camera-based PPE detection and unsafe behavior prediction.
*   **Approval Authority:** Stop-work orders for high-risk hazards.
*   **Dashboard Widgets:** Real-time safety gauges, safety cameras, incident loggers, and toolbox agendas.
*   **Expected Screen Time:** 2–3 hours/day (mobile).

---

## Section 4: Role-Based Access Control (RBAC) Specification

The system uses a role-based access control engine. The permissions matrix below outlines user access levels:

| User Role | Org Config | Projects | Schedules | Budgets | Daily Logs | Quality / Safety | BIM / Models | AI Models |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Super Admin** | Full R/W | Full R/W | Full R/W | Full R/W | Full R/W | Full R/W | Full R/W | Manage |
| **Company Owner** | Read Only| Full R/W | Full R/W | Full R/W | Full R/W | Full R/W | View | View |
| **Project Manager**| No | Limited | Write | Write | Write | Write | View | No |
| **Site Engineer**| No | No | No | No | Write | Write | View | No |
| **Safety Officer**| No | No | No | No | View | Write | View | No |
| **Finance Mgr** | No | No | No | Write | No | No | No | No |
| **Client Representative**| No | No | Read Only | Read Only | View | View | View | No |
| **Subcontractor** | No | No | No | No | Limited | View | View | No |
| **Worker** | No | No | No | No | No | No | No | No |

---

## Section 5: Authentication Strategy

BuildSpace AI uses a multi-tiered authentication flow to support both security compliance and field usability:

```
                            AUTHENTICATION ROUTER
+-------------------------------------------------------------------------------+
| INCOMING AUTHENTICATION REQUEST                                               |
+-------------------------------------------------------------------------------+
                  |                                             |
                  | Enterprise / Office User                     | Field Worker / Site Engineer
                  v                                             v
+-----------------------------------+         +---------------------------------+
| OAuth 2.0 / SAML (Okta/Azure AD);  |         | Phone Number + SMS OTP;         |
| FIDO2 WebAuthn (Biometric ID).    |         | FaceID scan / Pin Code.         |
+-----------------------------------+         +---------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| MFA VERIFICATION ENGINE (App push or hardware key verification)               |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| JSON WEB TOKEN (JWT) ISSUED (15-min expiration; 7-day refresh token cache)   |
+-------------------------------------------------------------------------------+
```

*   **Firebase Authentication:** Handles mobile registration, SMS OTP routing, and magic-link delivery.
*   **Single Sign-On (SSO):** Full SAML 2.0 and OIDC support for enterprise clients (Okta, Microsoft Azure AD).
*   **MFA Requirements:** Multi-factor authentication is required for financial roles, PMs, and admin users.
*   **Session Security:** 15-minute token expirations with encrypted storage in browser localStorage or mobile SQLite databases.

---

## Section 6: Authorization Engine

Permissions are evaluated dynamically at runtime based on the user's role and coordinate context:

*   **Inheritance Model:** Permissions cascade down the organizational hierarchy (e.g., a Project Director inherits write permissions for all projects under their branch).
*   **Temporary Permissions:** PMs can grant temporary read/write access to external consultants (e.g., 3-day access to quality checklists).
*   **Location-Based Permissions:** Users can only log daily progress or complete checks if their GPS coordinate is within the geo-fenced boundary of the site.
*   **Audit Engine:** Every permission change, data export, and document sign-off is logged in a read-only database ledger.

---

## Section 7: Dashboard User Experience Specifications

Custom dashboards align features with the user's immediate job requirements:

### 7.1 Site Engineer Mobile Dashboard
*   **Quick Actions:** Log Daily Progress, Report Quality Defect, Voice Note Upload, View Active Drawing.
*   **Widgets:** Active task checklists, geofenced weather updates, and site checklist statuses.
*   **AI Recommendations:** *"Plumbing sleeves check on Zone B is on the critical path today. Tap to view design specifications."*

### 7.2 Executive Portfolio Dashboard
*   **Charts:** Cash-flow trends, budget vs. actuals variance, safety index over time.
*   **Quick Actions:** Approve Pending Expenses (> $50k), Export Financial Audits, Review Milestone Schedules.
*   **AI Recommendations:** *"Seattle high-rise project materials budget is projecting a 4.5% overrun. Recommend auditing the structural steel vendor invoice ledger."*

---

## Section 8: Visual Workflow Diagrams

### 8.1 Material Request & Purchase Order Approval Workflow

```
[Site Engineer] --(Creates Request)--> [Project Manager]
                                             |
                                    (Checks Project Budget)
                                             |
                                 +-----------+-----------+
                                 |                       |
                       Budget < $10k           Budget > $10k
                                 v                       v
                         [Auto-Approve]          [Finance Manager]
                                 |                       |
                                 v                       v
                         [Supplier PO]           [Executive Approval]
```

### 8.2 Site Defect Inspection & Rework Workflow

```
[Quality Inspector] --(Detects Defect on Cam)--> [BuildSpace AI]
                                                       |
                                            (Auto-categorizes Defect)
                                                       |
                                                       v
                                            [Subcontractor Lead]
                                                       |
                                               (Completes Rework)
                                                       |
                                                       v
                                            [Quality Inspector]
                                                       |
                                                (Final Sign-Off)
```

---

## Section 9: End-to-End User Journeys

### 9.1 Company Onboarding & Team Invites
1.  **System Setup:** The Super Admin registers the company profile, selects the subscription level, and configures authentication rules.
2.  **Team Invites:** The admin invites project managers, finance leads, and branch directors via email magic-links.
3.  **Permissions Config:** The system automatically maps invited users to their respective positions in the access control hierarchy.

### 9.2 Daily Progress walks & Verification
1.  **Field Walk:** The Site Engineer enters the geofenced site boundary and opens the BuildSpace mobile app.
2.  **Voice Logging:** The engineer records a voice log detailing work progress, and uploads photos of completed framing.
3.  **AI Verification:** The AI transcribes the audio, runs a visual verification on the photo uploads, matches the results against the schedule, and drafts the daily report.
4.  **Sign-off:** The PM reviews the automated report on their dashboard, edits as needed, and signs off.

---

## Section 10: Role-Specific AI Assistant Personalization

BuildSpace AI uses a multi-agent AI system where agents operate within specific context constraints:

```
                            AI CONTEXT MAPPING ENGINE
+-------------------------------------------------------------------------------+
| AI AGENT COORDINATOR                                                          |
+-------------------------------------------------------------------------------+
                  |                                             |
                  | safety_agent                                | finance_agent
                  v                                             v
+-----------------------------------+         +---------------------------------+
| - Context: Safety regulations,    |         | - Context: Budget ledgers, POs, |
|   OSHA rules, EHS checklist database|       |   invoice histories, taxes.     |
| - Action: Detect PPE violations,  |         | - Action: Audit invoices, check |
|   suggest hazard mitigations.     |         |   cost overruns, predict burn.  |
+-----------------------------------+         +---------------------------------+
```

*   **Safety AI Agent:** Analyzes site photos and CCTV feeds to detect safety violations, and provides hazard recommendations during toolbox talks.
*   **Finance AI Agent:** Audits vendor invoices, flags duplicate billing codes, and forecasts cash-flow burn rates.
*   **BIM Copilot:** Aligns physical photos with design models to flag structural clashes and coordinate adjustments.

---

## Section 11: Notification Matrix

The notification engine routes alerts based on severity and role requirements:

| Alert Category | Target Roles | Channel | Priority | Trigger Condition | Escalation Path |
|---|---|---|---|---|---|
| **Critical Hazard** | Safety Officer, PM | SMS, Push | High | Wearable sensor detects a fall or unsafe zone entry. | Alert escalates to Branch Director if unacknowledged in 5m. |
| **Daily Log Draft** | PM, APM | In-App, Email| Medium | Daily progress walk completed and analyzed by AI. | Nudge sent at 5:00 PM if log remains unsubmitted. |
| **Invoice Match** | Accountant | Desktop, Slack| Medium | OCR matches vendor invoice with purchase order. | Sent to Finance Manager if invoice has a price mismatch. |
| **Clash Alert** | Architect, MEP | Email, Teams | High | Computer vision detects a physical-to-BIM mismatch. | Nudge sent daily until RFI is logged or resolved. |

---

## Section 12: Mobile Field Experience Specifications

The BuildSpace mobile app is optimized for field deployment:

*   **Offline SQLite Sync:** Full offline accessibility for 2D plans, safety checklists, and attendance sheets.
*   **Camera Integration:** Uses the phone's native camera for face-checkins, progress photo capture, and document scans.
*   **Geofencing & GPS:** Enforces location-based checkins and logs project site entries.
*   **QR/Barcode Scans:** Scans material deliveries to update inventory logs instantly.

---

## Section 13: Audit & Security Logs

To support SOC 2 Type II compliance, the system records all operations in a tamper-resistant audit database:

*   **Activity Logging:** Records user logins, drawing access sessions, and document downloads.
*   **Security Alerts:** Flags logins from new devices, concurrent sessions, and anomalous permission updates.
*   **Data Export Auditing:** Logs all CSV/PDF exports, identifying the exporting user and data parameters.

---

## Section 14: Autonomous AI Agent Specifications

BuildSpace AI uses autonomous background agents to handle complex administrative tasks:

*   **AI Project Manager Agent:** Automatically updates schedule Gantt charts when site inspections verify completion milestones.
*   **AI Procurement Agent:** Reviews inventory levels daily, predicts supply chain delay risks, and drafts purchase orders for upcoming material needs.
*   **AI Compliance Officer:** Monitors municipal permit deadlines, trade license validity, and safety certification dates to warn teams of upcoming expirations.

---

## Section 15: Edge Case Management Specifications

The platform is designed to handle common operational exceptions:

*   **Employee Transfers:** When an engineer moves to a new project site, the system transfers their location-based permissions and updates their geofenced access boundaries.
*   **Offline Conflict Resolution:** If multiple users update the same drawing checklist offline, the system reconciles changes using Conflict-Free Replicated Data Types (CRDTs).
*   **Legal Hold Requests:** Administrators can lock project documents, files, and chat logs to prevent changes during legal review.

---

## Section 16: Platform Scalability

BuildSpace AI scales to support growing organizations and complex project portfolios:

*   **Global Organizations:** Supports multi-region cloud configurations to host data close to client offices.
*   **Cross-Organization Sharing:** Allows general contractors to share drawings, schedules, and RFIs with subcontractors while keeping internal budgets and margins secure.
*   **Enterprise Scaling:** Optimized database schemas handle up to 100 million tasks, logs, and sensor alerts per tenant.
