# BuildSpace AI — Non-Functional Requirements (NFR) Specification
## Global Quality Attributes, Reliability Targets, and Security Architecture Blueprint
**Document Version:** 1.0.0  
**Date:** June 18, 2026  
**Confidentiality:** Public Open Architecture Specification  
**Status:** Approved for Core Infrastructure Design  

---

## Section 1: Quality Attribute Overview

### 1.1 Understanding Non-Functional Requirements
Non-Functional Requirements (NFRs) define the operational envelopes, safety limits, performance parameters, and quality benchmarks of the BuildSpace AI platform. While Functional Requirements define *what* the system does, NFRs define *how well* the system performs its duties under production conditions.

### 1.2 Enterprise Quality Goals
For an AI-first platform operating on heavy, unstructured datasets (such as point-clouds, BIM files, and high-fidelity video streams), NFRs are crucial. System latency directly impacts field crew adoption. 

If mobile synchronization is slow or fails in low-connectivity areas, field teams will revert to paper logs, resulting in data gaps that degrade the accuracy of the AI engine. This document establishes measurable goals to ensure the platform remains secure, reliable, and performant.

### 1.3 Quality Attribute Matrix

```
+-----------------------------------------------------------------------------------------------------------------+
| Quality Attribute     | Target Metric / SLA       | Core Business Value                                         |
|-----------------------+---------------------------+-------------------------------------------------------------|
| Availability          | 99.99% Uptime             | Prevents field work delays due to system outages.           |
| Latency (API Write)   | < 200 ms (p95)            | Ensures fast data entry and updates on mobile apps.         |
| Security Compliance   | SOC 2 Type II, ISO 27001  | Required to pass enterprise and government security reviews.|
| Offline Sync Latency  | < 5 seconds upon network  | Syncs field logs automatically when connectivity is restored.|
| AI Accuracy (Recall)  | > 95% on safety checks    | Protects site safety and keeps projects compliant.          |
+-----------------------------------------------------------------------------------------------------------------+
```

---

## Section 2: Performance Requirements

### 2.1 Measurable Operational Budgets

| NFR ID | Operational Metric | Target Threshold (SLA) | Performance Budget (p99) |
|---|---|---|---|
| `NFR-PERF-001` | First Contentful Paint (FCP)| < 1.2 seconds | < 1.8 seconds |
| `NFR-PERF-002` | API Gateway Response Time | < 150 ms | < 250 ms |
| `NFR-PERF-003` | Global RAG Document Search | < 2.5 seconds | < 4.0 seconds |
| `NFR-PERF-004` | Image Defect Classification | < 1.8 seconds | < 3.0 seconds |
| `NFR-PERF-005` | Offline DB Write Transaction| < 45 ms | < 100 ms |

### 2.2 Maximum Payload & Payload Restraints
*   **Media Compression limits:** The mobile app compresses progress photo uploads to under 1.5MB before transport.
*   **Vector Search Payloads:** Vector search queries are capped at a maximum of 512 dimensions to keep query processing under 300ms.

---

## Section 3: Scalability Playbook

The platform uses a modular, cloud-native architecture to scale resource allocation based on tenant demand:

*   **Load Balancing & Event Hubs:** Inbound requests are routed through a cluster of load balancers (e.g., NGINX / Cloudflare) to Kafka event hubs for parallel processing.
*   **Horizontal Pod Auto-Scaling (HPA):** Kubernetes clusters dynamically adjust pod counts based on CPU and memory utilization thresholds.
*   **Database Partitioning & Sharding:** Databases are partitioned by tenant organization and sharded by geographic region.
*   **GPU Auto-Scaling:** Dedicated GPU instances scale dynamically during peak image-processing hours (e.g., when drone scans and progress photos are uploaded at the end of shifts).

---

## Section 4: High Availability (HA) & Deployment Strategy

### 4.1 SLO & SLA Matrix
*   **Target availability:** 99.99% annual uptime.
*   **Allowed unplanned downtime:** Less than 52 minutes per year.

### 4.2 Zero Downtime Deployments
*   **Canary Deployments:** New software updates are rolled out to a test group of 2% of users first to verify stability.
*   **Blue-Green Routing:** The system routes traffic between active (Blue) and staging (Green) environments to prevent downtime during updates.

```
                            BLUE-GREEN ROUTING FLOW
+-------------------------------------------------------------------------------+
| INCOMING REQUEST (User Client)                                                |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| TRAFFIC ROUTER (Env: Blue - Active Production)                                |
+-------------------------------------------------------------------------------+
                                       |
                   (Perform Green Deployment Verification)
                                       |
                                       v
+-------------------------------------------------------------------------------+
| SWITCH TRAFFIC TO ENV: GREEN (New Production Active; Zero Downtime)           |
+-------------------------------------------------------------------------------+
```

---

## Section 5: Reliability & Fault Tolerance

To maintain system reliability, BuildSpace AI implements the following fault-tolerance patterns:

*   **Circuit Breakers:** If an external service (e.g., Google Maps API) fails, the circuit breaker opens to prevent system backlog, returning cached data.
*   **Retry with Exponential Backoff:** Failed database writes or API queries retry automatically with growing delays (e.g., after 1s, 2s, 4s, 8s).
*   **Idempotency Locks:** All write actions include unique token identifiers to prevent duplicate entries (e.g., double-posting concrete delivery logs).

---

## Section 6: Enterprise Security Architecture

```
                          ZERO TRUST SECURITY FRAMEWORK
+-------------------------------------------------------------------------------+
| FIREWALL & BOT PROTECTION LAYER (Cloudflare WAF / Rate Limiter)                |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| API GATEWAY LAYER (Validate OAuth2 Tokens & JWT Signatures)                   |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| ACCESS AUTHORIZATION ENGINE (RBAC & Attribute-Based Access Control)           |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| DATA ENCRYPTION LAYER (TLS 1.3 in Transit / AES-256 for DB Storage)           |
+-------------------------------------------------------------------------------+
```

### 6.1 Cryptographic Controls
*   **Encryption In Transit:** All network connections require TLS 1.3 with secure HSTS policies enabled.
*   **Encryption At Rest:** Databases, vector indices, and cloud storage buckets use AES-256 encryption.

### 6.2 Application Security Safeguards
*   **OWASP Compliance:** Built-in safeguards protect against SQL injections, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF).
*   **Audit Logging:** Every user login, permission change, and file download is logged in a read-only, tamper-resistant database.

---

## Section 7: User Privacy & Data Governance

BuildSpace AI ensures user privacy and data security through clear compliance guidelines:

*   **Data Isolation:** Multi-tenant database structures enforce logical isolation, ensuring competing contractors cannot view other project data.
*   **Right to Export & Delete:** Users can export their complete data profile at any time, or request complete account deletion (complying with GDPR guidelines).
*   **Anonymization Pipelines:** Site photos used to train AI models are run through anonymization pipelines that blur faces and license plates automatically.

---

## Section 8: Compliance & Certifications

The platform is designed to meet major security and operational standards:

*   **SOC 2 Type II:** Undergoes annual audits validating security, availability, and processing integrity controls.
*   **ISO 27001:** Adheres to structured information security management systems (ISMS) guidelines.
*   **GDPR & DPDP Act:** Aligns with European and Indian data privacy standards.
*   **WCAG 2.2 Level AA:** Accessible UI designs supporting keyboard navigation and screen readers.

---

## Section 9: AI/ML Quality Specifications

To ensure reliable performance, our AI models must meet specific accuracy thresholds:

| Model Category | Task Area | Accuracy Target (p95) | Fallback / Escalation Path |
|---|---|---|---|
| **Computer Vision**| PPE detection | > 98% Precision | Flag low-confidence matches for safety officer review.|
| **RAG Document AI**| Drawing text search | > 96% Precision | Return source page links for manual validation. |
| **Gantt Scheduler**| Critical path analysis| > 92% Accuracy | Send alerts to the Project Manager for adjustment. |

---

## Section 10: Database Performance & Backups

*   **Vector Search Indexes:** Uses HNSW vector indexes to keep search times under 150ms for portfolios of up to 100,000 drawings.
*   **Database Backups:** Daily database snapshots are stored in secure, multi-region cloud buckets.
*   **Point-in-Time Recovery (PITR):** Transaction logs are backed up every 15 minutes, enabling data restoration to any point within the last 30 days.

---

## Section 11: Observability Specification

The platform utilizes a structured observability pipeline:

```
                            OBSERVABILITY PIPELINE
+-------------------------------------------------------------------------------+
| METRICS AGENT (Prometheus captures CPU, Memory, GPU temperatures)             |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| LOG ARCHIVAL SYSTEM (Vector captures application, security, and access logs) |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| TRANSACTION TRACER (OpenTelemetry traces database queries and API response times)|
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| GRAFANA DASHBOARD & ALERTS (SRE team notified when error rates exceed SLO)   |
+-------------------------------------------------------------------------------+
```

---

## Section 12: Disaster Recovery (DR)

### 12.1 RPO & RTO Specifications
*   **Recovery Point Objective (RPO):** Maximum allowed data loss is 15 minutes.
*   **Recovery Time Objective (RTO):** Maximum allowed restoration time is 4 hours.

### 12.2 DR Recovery Workflow

```
[Primary Region Failure Detected]
                |
                v
[Redirect Traffic via DNS Route]
                |
                v
[Activate Read-Replica DB in Region B]
                |
                v
[Verify System Health & Sync Status]
                |
                v
[Production Operations Restored]
```

---

## Section 13: Accessibility (WCAG 2.2 AA)

BuildSpace AI is designed to support accessible site operations:

*   **Keyboard Navigation:** All web dashboards support full keyboard navigation controls.
*   **Contrast Settings:** High-contrast modes ensure readability under direct sunlight.
*   **Screen Reader Integration:** Every element includes descriptive ARIA labels to support screen readers on site.

---

## Section 14: Offline-First Synchronization

The mobile application is designed to operate reliably in low-connectivity zones:

*   **Local SQLite Cache:** Caches drawing revisions, checklists, and timecard logs locally.
*   **Conflict Resolution:** Resolves offline data conflict issues using Conflict-Free Replicated Data Types (CRDTs) when connected.
*   **Automatic Media Retry:** Failed photo or video uploads retry in the background without blocking the user interface.

---

## Section 15: Mobile Performance Budgets

*   **Battery Optimization:** Restricts CPU usage and GPS pings in the background to prevent battery drain.
*   **Fast App Launches:** The mobile dashboard must load in under 2 seconds.
*   **App Crash Rate:** Target crash-free user sessions above 99.9%.

---

## Section 16: API Standards

*   **REST API Specifications:** Returns structured JSON responses using OpenAPI 3.0 standards.
*   **GraphQL Gateway:** Allows mobile clients to request specific data fields, reducing payload sizes.
*   **API Rate Limiting:** Restricts API requests to 100 calls per minute per user to prevent system overload.

---

## Section 17: DevOps & CI/CD Pipeline

*   **Infrastructure as Code (IaC):** Manages cloud hosting environments using Terraform templates.
*   **Git Branching Flow:** Uses structured branching (Feature -> Develop -> Main) with automated lint and test checks.
*   **Containerized Builds:** All microservices run in Docker containers managed by Kubernetes.

---

## Section 18: System Monitoring & Alerts

*   **Database Metrics:** Monitors connection counts, CPU load, and replication delays.
*   **AI Service Health:** Tracks GPU temperatures, memory utilization, and query queue times.
*   **Slack Alerts:** Alerts the engineering team on Slack when system errors or API timeouts occur.

---

## Section 19: Unified Logging Strategy

*   **Structured Logs:** All logs are written in JSON format to support easy searching.
*   **Log Retention:** Operational logs are stored for 30 days, while security and audit logs are retained for 1 year to meet compliance rules.

---

## Section 20: Quality Assurance (QA) & Testing

BuildSpace AI undergoes a structured quality assurance process:

*   **Unit & Integration Tests:** Targets over 80% code coverage on core software packages.
*   **Penetration Audits:** Undergoes quarterly vulnerability scans and annual external security reviews.
*   **Load & Stress Tests:** Simulates up to 100,000 concurrent active users to verify system stability.
*   **Chaos Engineering:** Periodically shuts down mock server nodes to verify automated failovers and self-healing systems.

---

## Section 21: Supportability

*   **Admin Tools:** Provides dashboards for managing users and verifying tenant licenses.
*   **Live Diagnostics:** Integrates error-tracking tools (e.g., Sentry) to record application bugs and trace error stacks.

---

## Section 22: Internationalization & Localization

*   **Multilingual Support:** Interface supports English, Spanish, Hindi, and regional languages.
*   **Regional Formats:** Adapts time formats, currencies, and units of measurement based on localized site settings.

---

## Section 23: Green Cloud & Sustainability

*   **Resource Optimization:** Shuts down unused staging and GPU server instances automatically during off-peak hours.
*   **Carbon Footprint Tracking:** Tracks hosting energy consumption to estimate overall platform carbon footprints.

---

## Section 24: Success Metrics & NFR KPIs

To verify platform stability and quality, we monitor the following metrics:

*   **MTTR (Mean Time to Repair):** Target restoration under 30 minutes for minor service issues.
*   **MTBF (Mean Time Between Failures):** Target zero high-severity service outages per quarter.
*   **Error Rate (API Gateway):** Target error rates below 0.05% under ordinary load conditions.
