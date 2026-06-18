# BuildSpace AI — Information Architecture & Navigation Blueprint
## Global Site Maps, Routing Systems, User Flows, and AI-First Interface Specs
**Document Version:** 1.0.0  
**Date:** June 18, 2026  
**Confidentiality:** Public Open Architecture Specification  
**Status:** Approved for Frontend Design & Implementation  

---

## Section 1: Information Architecture Principles

BuildSpace AI’s Information Architecture (IA) prioritizes cognitive load reduction and progressive disclosure to support complex site operations:

*   **Progressive Disclosure:** Present users with high-level summaries first, keeping dense project files and data configurations secondary.
*   **Cognitive Load Reduction:** Minimize manual data entry fields, replacing them with voice-first notes and automated checks.
*   **Accessibility First:** UI components align with WCAG 2.2 Level AA accessibility standards, featuring high-contrast themes and keyboard controls.
*   **AI-Assisted Navigation:** The AI assistant provides smart, context-aware routing shortcuts to help users find relevant drawings or logs instantly.

---

## Section 2: Content Inventory & Hierarchy

The platform coordinates a hierarchy of data models across corporate operations:

```
                            PLATFORM DATA INVENTORY
  [Organization]
        |
        +---> [Branch Office]
                    |
                    +---> [Business Unit]
                                |
                                +---> [Project Hub]
                                            |
                                            +---> [Construction Site]
                                                        |
                                                        +---> [Active Zones / Floors]
                                                                    |
                                                                    +---> Tasks & Checklists
                                                                    +---> Materials & PO Logs
                                                                    +---> Equipment Telemetry
                                                                    +---> Daily Progress Photo
```

---

## Section 3: Global Navigation Structure

BuildSpace AI uses custom navigation systems to optimize layouts across different screen sizes:

*   **Desktop & Large Displays:** A persistent left-hand sidebar manages global navigation, with top-level search bars, custom quick actions, and project breadcrumbs.
*   **Tablet & Mobile:** Responsive side-drawers collapse into bottom tab bars for fast navigation on mobile devices.
*   **Context Menus:** Right-click context menus on web dashboards and long-press menus on mobile apps provide quick shortcuts to edit, share, or archive project items.

---

## Section 4: Site Map & URL Naming Conventions

The platform uses a structured RESTful routing pattern to map URLs to specific dashboard panels:

```
                              ROUTING TREE MAP
/ (Landing Page)
|
+--- /auth (Login / Register)
|
+--- /org (Organization Settings)
|
+--- /projects (Global Projects Portfolio)
        |
        +--- /:projectId (Project Dashboard Hub)
                 |
                 +--- /sites (Geofenced Work Locations)
                 |       |
                 |       +--- /:siteId (Active Site Walk)
                 |
                 +--- /tasks (Milestones & Checklists)
                 +--- /documents (BIM Models, Drawings & Permits)
                 +--- /materials (Inventory & PO Ledgers)
```

---

## Section 5: End-to-End User Journeys

### 5.1 Project Creation & BIM Setup
*   **Actors:** Project Manager (PM), BIM Coordinator.
*   **Happy Path Steps:**
    1.  PM accesses the projects hub and clicks "Create Project".
    2.  System prompts user to upload a Revit/IFC BIM file.
    3.  The AI engine parses the geometry data to map project zones and floors automatically.
    4.  PM verifies the auto-mapped zones and publishes the project structure.
*   **Edge Case Resolution:** If the BIM file fails to parse, the system triggers a manual layout wizard allowing the PM to set up site zones manually.

---

## Section 6: User Flow Diagrams

### 6.1 User Invitation & Role Allocation Flow

```
[Super Admin clicks invite] --(Sends magic-link email)--> [User registers profile]
                                                                  |
                                                           (Selects Auth Provider)
                                                                  |
                                                                  v
                                                       [Firebase Auth Token]
                                                                  |
                                                       (Maps roles & permissions)
                                                                  |
                                                                  v
                                                       [Access Granted to Site]
```

### 6.2 Field Photo Rework Detection Flow

```
[Site Eng uploads photo] --(Pushes to S3)--> [BuildSpace AI Scan Engine]
                                                        |
                                            (Detects structural crack)
                                                        |
                                           +------------+------------+
                                           |                         |
                                   Confidence > 85%          Confidence < 85%
                                           v                         v
                                   [Auto-log Task]          [Send to PM review]
```

---

## Section 7: Screen Relationship Map

The diagram below outlines parent-child relationships across core application views:

```
+-----------------------------------+
|         PROJECT PORTFOLIO         | (Parent View)
+-----------------------------------+
                  |
                  v
+-----------------------------------+
|         PROJECT DASHBOARD         | (Child View)
+-----------------------------------+
                  |
        +---------+---------+
        |                   |
        v                   v
+---------------+   +---------------+
|   SITE MAPS   |   |   DOCUMENTS   | (Grandchild Views)
+---------------+   +---------------+
```

---

## Section 8: Routing Strategy & Protected Navigation

*   **React Router Integration:** Uses React Router to manage web URL hashes, lazy-loading chunks dynamically.
*   **Role-Based Protected Routes:** Wraps application routes in auth checks to restrict access (e.g., preventing subcontractors from accessing budget routes).
*   **Deep-Linking Router:** React Native Navigation handles deep-links, routing users directly to specific site logs or task checklists from push notifications.

---

## Section 9: State Management Architecture

BuildSpace AI separates application state into three distinct scopes:

*   **Global State (Zustand):** Manages user session details, active tenant settings, and offline upload queues.
*   **Server State (TanStack Query):** Manages project datasets, task details, and document caches, running background updates.
*   **Local UI State (Context API):** Handles dashboard toggle inputs, filter queries, and temporary local inputs.

---

## Section 10: Global Search & Discoverability

*   **Universal Search Bar:** A top-level search bar supports natural language queries (e.g., *"concrete curing spec"*).
*   **Search Suggestions:** Autocompletes queries based on historic searches and cost code labels.
*   **Command Palette:** Keyboard shortcuts (`Ctrl + K` or `Cmd + K`) launch the command palette to let users execute quick shortcuts (e.g., `/create-task`).

---

## Section 11: Dashboard Information Hierarchy

Dashboards prioritize layout widgets based on the user's operational role:

*   **Executive Dashboard:** Top-level KPIs (IRR, cost variances), portfolio maps, and active risk alerts.
*   **Site Engineer Dashboard:** Daily task checklist, quick photo uploader, geofenced weather updates, and site checklist statuses.

---

## Section 12: AI User Experience Specs

*   **Floating Assistant:** A persistent chat assistant on web dashboards supports natural language questions.
*   **Contextual Actions:** Auto-drafts RFI responses or creates task checklists based on uploaded documents.

---

## Section 13: Mobile Interface Controls

*   **Bottom Navigation Bar:** Mobile screens feature a tab bar with shortcuts for Tasks, Drawings, Sockets, and Profile logs.
*   **Floating Action Button (FAB):** A prominent button on active screens launches context actions (e.g., Log Progress, Take Photo).

---

## Section 14: Responsive Breakpoints

*   **Mobile:** `< 480px` (Optimized for single-hand touch control).
*   **Tablet:** `481px – 1024px` (Optimized for landscape split-panes).
*   **Desktop:** `> 1025px` (Optimized for dense datasets and complex tables).

---

## Section 15: Accessibility Focus (WCAG 2.2 AA)

*   **Touch Targets:** Touch elements on mobile devices have a minimum size of `48 x 48 dp` to support gloved use.
*   **Contrast Ratios:** Text maintains a minimum contrast ratio of `4.5:1` to ensure readability under direct sunlight.

---

## Section 16: Error & Empty States

*   **No Internet Sync Alert:** A persistent network bar displays connection statuses, running sync updates when online.
*   **Empty State Templates:** Displays helpful wizards and templates when project logs or checklists are empty.

---

## Section 17: Notification Journeys

*   **Push Alerts:** Notifications route to mobile devices when task assignments or hazard flags occur.
*   **Escalation Rules:** Unacknowledged safety warnings escalate to SMS alerts if not signed off in 5 minutes.

---

## Section 18: Future Information Architecture

*   **Digital Twin Sync:** Establishes UI view structures to sync 3D BIM models with live IoT telemetry data.
*   **Developer SDK Portal:** Portal layout structures supporting external developers building custom integrations.

---

## Section 19: Design Validation Metrics

We audit navigation efficiency using these usability benchmarks:

*   **Task Success Rate:** Target above 95% on daily log submissions.
*   **Click Path Efficiency:** Users must be able to launch inspections or drawing views in under 3 clicks from the homepage.
