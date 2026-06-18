# BuildSpace AI — Backend Engineering Blueprint
## Node.js (TypeScript), Express.js, MongoDB Atlas, Redis, Firebase Auth, & Socket.io Engineering Handbook
**Document Version:** 1.0.0  
**Date:** June 18, 2026  
**Confidentiality:** Public Open Architecture Specification  
**Status:** Approved for Core Development & Implementation  

---

## Section 1: Backend Architecture Philosophy

BuildSpace AI uses a **Modular Monolith** architecture that is structured to transition to independent microservices as transaction volumes scale.

```
                          MODULAR MONOLITH BOUNDARIES
+-----------------------------------------------------------------------+
|                       KONG ENTERPRISE API GATEWAY                     |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                       EXPRESS.JS APPLICATION HOST                     |
|  +--------------------+  +--------------------+  +-----------------+  |
|  |   Auth Module      |  |   Project Module   |  |  Safety Module  |  |
|  |   (auth-svc)       |  |   (prj-svc)        |  |  (saf-svc)      |  |
|  +--------------------+  +--------------------+  +-----------------+  |
|            |                        |                     |           |
|            +------------------------+---------------------+           |
|                                     |                                 |
|                                     v                                 |
|                       REDIS CACHE / PUB-SUB BUS                       |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                       DATABASE PERSISTENCE CLUSTERS                   |
|       [MongoDB Atlas]          [Pinecone Vector]         [Cloudinary] |
+-----------------------------------------------------------------------+
```

### 1.1 Core Engineering Principles
1.  **Clean Architecture:** Separates domain entities and business rules from frameworks, databases, and UI APIs.
2.  **Domain-Driven Design (DDD):** Isolates modules by clear business boundaries (e.g., separating Project, Task, and Finance collections).
3.  **Repository Pattern:** Decouples data retrieval operations from the service layer to support future database additions.
4.  **Event-Driven Communication:** Core actions publish internal events to a Redis Pub/Sub bus to run background tasks asynchronously.

---

## Section 2: Folder Directory Tree

The directory layout below establishes the organization of the codebase:

```
src/
  ├── config/             # Config loaders and environment setups
  ├── middleware/         # App-wide middleware (Auth, validation, CORS)
  ├── routes/             # Core route registration gateways
  ├── shared/             # Shared types, constants, and utils
  ├── modules/            # Domain Modules
  │   ├── auth/           # Authentication Domain
  │   │   ├── controllers/# Express HTTP Controllers
  │   │   ├── services/   # Business Logic Engines
  │   │   ├── repositories/# MongoDB Queries
  │   │   ├── models/     # Mongoose Schemas
  │   │   ├── dtos/       # Data Transfer Objects
  │   │   ├── validators/ # Joi / Zod validation schemas
  │   │   └── events/     # Domain Event Publishers
  │   ├── project/        # Project Domain
  │   └── safety/         # Safety Domain
  ├── jobs/               # Background task queues (BullMQ)
  ├── sockets/            # Socket.io connection systems
  └── app.ts              # Express App Entrypoint
```

---

## Section 3: Domain Module Design

Each domain module (e.g., Auth, Project, Safety) is self-contained:

*   **Responsibilities:** Modules encapsulate their own business rules, Mongoose models, validation routines, and data transfer formats.
*   **Dependencies:** Modules communicate with other domains only through public service interfaces, avoiding direct cross-repository database queries.
*   **Events:** Emit transaction events (e.g., `project.created`, `safety.violation`) to trigger background tasks.

---

## Section 4: Request Lifecycle Flow

The diagram below outlines the request validation and routing stages:

```
                            REQUEST LIFECYCLE ROUTE
[Client Request] --> [Cloudflare WAF] --> [Firebase Auth Middleware]
                                                    |
                                          (Validates ID Token JWT)
                                                    |
                                                    v
                                      [Role-Based ABAC Authorization]
                                                    |
                                          (Checks geofence boundary)
                                                    |
                                                    v
                                      [DTO Payload Validator]
                                                    |
                                                    v
                                      [Controller Route Gateway]
                                                    |
                                                    v
                                      [Domain Service Engine]
                                                    |
                                                    v
                                      [Repository Database Query]
                                                    |
                                                    v
                                      [JSON Response Formatter]
```

---

## Section 5: Unified Error Exception Handler

The platform uses a centralized error handler. All custom exceptions extend the base `AppError` class:

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Standard JSON Error Response Format
{
  "status": "error",
  "statusCode": 403,
  "message": "Access Denied: Geofence check failed.",
  "correlationId": "tx-99a2c1b-f81"
}
```

---

## Section 6: Configuration Management

*   **Environment Variables:** Env configurations are loaded and validated using Joi/Zod schemas at startup to check for missing credentials.
*   **Configuration Loader:** Uses profiles (`development`, `staging`, `production`) to coordinate database strings, Redis hosts, and Firebase keys.

---

## Section 7: Observability & Logger Architecture

*   **Structured JSON Logs:** Writes logs in JSON format to standard output streams to support centralized log analysis.
*   **Winston Configuration:** Winston handles log routing, separating application info from system errors.
*   **Correlation IDs:** Inbound HTTP requests receive unique correlation IDs (`x-correlation-id`) that trace transactions through microservice networks.

---

## Section 8: Background Task Queues

We manage heavy, asynchronous computations (like drone calculations, PDF OCRs, and report compile runs) using BullMQ:

```
                            BACKGROUND TASK PIPELINE
[HTTP Upload Service] --(Creates Job)--> [Redis Task Queue (BullMQ)]
                                                   |
                                                   v
                                        [Background Workers Cluster]
                                                   |
                                 +-----------------+-----------------+
                                 |                                   |
                         On Success (Complete)               On Failure (Retry)
                                 v                                   v
                      [Update Socket Dashboard]            [Dead Letter Queue (DLQ)]
```

---

## Section 9: Real-Time Sockets.io Channels

Socket.io handles live notifications, equipment tracking, and active chat logs:

*   **Namespaces:** Mapped by primary project boundaries (`/project`).
*   **Rooms:** Mapped by specific construction sites (`/site/:siteId`) and chat channels (`/chat/:channelId`).
*   **Presence Tracking:** Redis tracks active socket links to update user availability states instantly.

---

## Section 10: Code Standards & Git Conventions

*   **TypeScript Style:** Enforces strict type checking, interface definitions, and lint checks.
*   **Git Branching Flow:** Uses structured branches (`feature/`, `bugfix/`, `release/`) with strict PR reviews.
*   **Commit Format:** Commits follow conventional formatting (e.g., `feat(safety): integrate YOLO vest check`).
