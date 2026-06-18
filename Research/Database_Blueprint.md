# BuildSpace AI — Database Design & Data Modeling Blueprint
## MongoDB Atlas, Redis, & Pinecone Vector Database Schemas and Lifecycle Management Specifications
**Document Version:** 1.0.0  
**Date:** June 18, 2026  
**Confidentiality:** Public Open Architecture Specification  
**Status:** Approved for Core Data Layer Implementation  

---

## Section 1: Database Design Principles

BuildSpace AI uses a multi-database strategy to support high scalability and real-time AI capabilities:

```
                            DISTRIBUTED DATA HUB
+-----------------------------------------------------------------------+
|                       EXPRESS.JS / DATA ROUTER                        |
+-----------------------------------------------------------------------+
        |                                |                        |
  (Transactional)                  (Search Cache)           (RAG Search)
        |                                |                        |
        v                                v                        v
+-----------------+              +-----------------+      +-----------------+
|  MONGODB ATLAS  |              |   REDIS CACHE   |      |  PINECONE DB    |
| (Document Hub)  |              | (Session State) |      | (Vector Index)  |
+-----------------+              +-----------------+      +-----------------+
```

### 1.1 Core Database Paradigms
1.  **Multi-Tenancy:** Tenant isolation is enforced using the `organizationId` partition key on all collections, preventing cross-tenant data queries.
2.  **Embedding vs. Referencing:** Embed volatile data with high cohesion (e.g., checklist tasks under Tasks). Reference large, separate business entities (e.g., mapping Projects to Organizations).
3.  **Read Optimization:** Implements secondary indexes and Redis caching for read-heavy resources (like user profiles and active drawing files).
4.  **AI-Ready Schema Design:** Schema layouts are designed to support Pinecone vector database integrations, syncing text blocks with vector pointers.

---

## Section 2: Global Document Standards

To ensure auditability and consistent data handling, every collection in MongoDB must include these core fields:

*   `_id`: UUID/ObjectID (Primary key).
*   `organizationId`: UUID (Tenant partition key).
*   `projectId`: UUID (Project scope key).
*   `branchId`: UUID (Branch division mapping).
*   `createdAt`: Timestamp (Creation date).
*   `updatedAt`: Timestamp (Last modification date).
*   `deletedAt`: Timestamp (Soft delete flag date).
*   `isDeleted`: Boolean (Soft delete flag; default: `false`).
*   `version`: Number (Incremental change counter for offline conflicts).
*   `auditTrail`: Array of Audit Log objects tracing modifications.

---

## Section 3: Core Database Collections (Mongoose / MongoDB)

Below are the Mongoose schemas and relationships for core platform entities:

### 3.1 Organizations Collection Schema (`organizations`)
```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["_id", "legalName", "taxIdentifier", "status", "version"],
    "properties": {
      "_id": { "bsonType": "objectId" },
      "legalName": { "bsonType": "string", "minLength": 2 },
      "taxIdentifier": { "bsonType": "string", "pattern": "^[0-9A-Z]{15}$" },
      "status": { "enum": ["Active", "Suspended", "Trial"] },
      "version": { "bsonType": "int" }
    }
  }
}
```

### 3.2 Projects Collection Schema (`projects`)
```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["_id", "organizationId", "name", "startDate", "status"],
    "properties": {
      "_id": { "bsonType": "objectId" },
      "organizationId": { "bsonType": "objectId" },
      "name": { "bsonType": "string", "minLength": 3 },
      "startDate": { "bsonType": "date" },
      "endDate": { "bsonType": "date" },
      "status": { "enum": ["Planning", "Active", "Completed", "Hold"] }
    }
  }
}
```

---

## Section 4: Material Management Collections

*   **Materials (`materials`):** Tracks material definitions, unit measurements (e.g., metric tons, bags), and safety thresholds.
*   **Inventory (`inventory`):** Logs current stock quantities across site laydown yards and warehouses.
*   **Stock Transactions (`stock_transactions`):** Logs inventory updates (e.g., arrivals, consumption, waste) with audit trails.

---

## Section 5: Equipment & Fleet Collections

*   **Equipment (`equipment`):** Tracks fleet details, maintenance histories, engine run-hours, and active bookings.
*   **IoT Telemetry (`iot_telemetry`):** High-velocity collection logging engine temperatures, fuel levels, and GPS locations hourly.

---

## Section 6: Finance Collections

*   **Budgets (`budgets`):** Maps allocated funds to standardized project cost codes.
*   **Invoices (`invoices`):** Stores vendor invoices, billing details, and OCR matching results.

---

## Section 7: Quality & Defects Collections

*   **Inspections (`inspections`):** Logs quality checks, checklists, and inspector approvals.
*   **Defects (`defects`):** Logs quality deviations pinned to drawing locations, and tracks remediation tasks.

---

## Section 8: Safety & EHS Collections

*   **PPE Violations (`ppe_violations`):** Logs safety gear anomalies (e.g., missing helmets) detected by computer vision.
*   **Incidents (`incidents`):** Logs injury reports, near-miss events, and emergency alerts.

---

## Section 9: Document Collections

*   **Documents (`documents`):** Tracks document versions, permission lists, and OCR data.
*   **Drawings (`drawings`):** Stores drawing revisions, coordinate metadata, and Pinecone vector links.

---

## Section 10: Media & Annotations Collections

*   **Images (`images`):** Tracks progress photos, drawing coordinates, and computer vision tags.
*   **Drone Footage (`drone_footage`):** Logs flight coordinates and orthophoto map links.

---

## Section 11: Real-Time Communication Collections

*   **Messages (`messages`):** Logs chat communications, voice note URLs, and user mentions.
*   **Activity Feed (`activity_feed`):** Logs project actions (e.g., PO approvals, daily logs) to update dashboard feeds.

---

## Section 12: AI & Analytics Collections

*   **AI Recommendations (`ai_recommendations`):** Logs alerts generated by AI scheduling models.
*   **Predictions (`predictions`):** Logs project cost and schedule forecasts.

---

## Section 13: System Audit Collections

*   **Audit Logs (`audit_logs`):** A read-only, append-only collection logging authorization changes, data exports, and logins.
*   **Refresh Tokens (`refresh_tokens`):** Handles secure session renewals.

---

## Section 14: Analytics Collections

*   **Metrics (`metrics`):** Logs aggregate indicators (e.g., hourly checkins, concrete pour volumes) to update dashboard charts.

---

## Section 15: Marketplace Collections

*   **Products & Orders (`marketplace_orders`):** Manages supplier listings, tool rentals, order checkout processes, and transaction fees.

---

## Section 16: Database Relationships & Normalization Model

```
                    CORE ENTITY RELATIONSHIP MODEL
 [Organization] (1)
        |
        +---> [Branch Office] (1:N)
                     |
                     +---> [Project Hub] (1:N)
                                 |
                                 +---> [Construction Site] (1:N)
                                             |
                                             +---> [Task Checklist] (1:N)
                                             +---> [Material Inventory] (1:N)
```

---

## Section 17: Indexing Strategy

To keep query times under our 150ms SLA, we implement specific indexes:

| Target Collection | Index Fields | Index Type | Rationale |
|---|---|---|---|
| `users` | `organizationId: 1, email: 1` | Compound | Fast user validation within organizations. |
| `tasks` | `projectId: 1, status: 1` | Compound | Speeds up Gantt chart reads. |
| `drawings`| `organizationId: 1, coordinates: "2dsphere"` | Geospatial | Coordinates drawing lookups with GPS locations. |
| `audit_logs`| `createdAt: 1` | TTL (1 Year) | Deletes expired audit logs automatically. |

---

## Section 18: Schema Validation Rules

*   **Enums:** Enforces strict state options (e.g., Task Status: `Backlog`, `In Progress`, `Completed`).
*   **JSON Schema Validation:** Enforces data type structures at the MongoDB layer, rejecting invalid documents.

---

## Section 19: Audit Trails & Version Controls

*   **Soft Delete:** Documents mark `isDeleted: true` and record `deletedAt` timestamps, preventing data loss.
*   **History Trails:** Mutations record the modifying user ID and change history to track revisions.

---

## Section 20: Data Lifecycle Management

*   **Hot Tier:** Active projects store data on high-performance SSD drives (MongoDB Atlas M30+ tiers).
*   **Cold Archive:** Completed projects are exported to low-cost S3 Glacier storage after 1 year to reduce costs.

---

## Section 21: Redis Caching Architecture

*   **Session Cache:** Stores authenticated session data (TTL: 15 minutes).
*   **Permission Cache:** Caches RBAC/ABAC permissions to speed up API authorization checks (TTL: 1 hour).
*   **Rate Limiter Cache:** Tracks user API request rates to prevent server overload.

---

## Section 22: Pinecone Vector Database Design

*   **Dimension Size:** 1536 dimensions (matching standard OpenAI/Gemini embedding models).
*   **Namespaces:** Vector records are partitioned by Project ID (`projectId`) to ensure secure searches.
*   **Metadata Mapping:** Embeddings store document IDs, page references, and section headers to coordinate search results.

---

## Section 23: Data Security & PII Protection

*   **PII Masking:** Encrypts sensitive personal data (e.g., worker phone numbers, payroll info) at the database layer.
*   **Secrets Management:** API keys and credentials are encrypted using HashiCorp Vault.
