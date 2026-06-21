# BuildSpace AI

BuildSpace AI is a next-generation, AI-native construction management platform designed to challenge legacy enterprise solutions like Autodesk Construction Cloud and Procore. The platform seamlessly integrates 3D Digital Twins, Deep Computer Vision, IoT Hardware Telemetry, and conversational LLM Agents to automate construction workflows at scale.

## 🏗️ Architecture

The platform operates on a massive multi-tenant microservices architecture:

- **Frontend (`/frontend`)**: Next.js 14 (App Router) + React + TailwindCSS + Zustand + React Three Fiber (for BIM/Digital Twins).
- **Backend API (`/backend`)**: Node.js + Express + TypeScript + Mongoose (Tenant-Isolated).
- **Realtime Gateway (`/realtime`)**: Socket.io + Redis Pub/Sub for live chat and notifications.
- **AI Core (`/future/ai-core`)**: Python + FastAPI + PyTorch/YOLOv11 for Deep Computer Vision & LangChain for LLM Agents.
- **IoT Gateway (`/future/iot-gateway`)**: Node.js + MQTT for ingesting high-frequency telemetry from Smart Helmets and site sensors.
- **Digital Twin API (`/future/digital-twin`)**: Node.js + Web-IFC for backend BIM parsing and Live State Fusion.
- **Mobile (`/mobile`)**: React Native framework targeting iOS and Android for on-site field engineers.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Node.js (v20+)
- Python (3.11+)

### 1. Launch the Infrastructure Stack
Spin up the entire platform (Mongo, Redis, Grafana, Prometheus, Backend, Frontend, Realtime, AI) using Docker.

```bash
docker-compose up -d
```
*Note: If your local machine lacks an NVIDIA GPU, the AI Core container may fail to boot. The `docker-compose.yml` has been updated to run without strict GPU reservations for local testing.*

### 2. Seed the Database
Populate the local MongoDB database with mock data for three enterprise construction companies, complete with Admin, Project Manager, and Safety Officer accounts.

```bash
cd backend
npm install
npx ts-node scripts/seed.ts
```

## 🧪 End-to-End Testing

BuildSpace AI uses **Playwright** for complete End-to-End browser testing.

```bash
cd tests/e2e
npm install
npx playwright install chromium

# Run the test suite
npx playwright test

# View the HTML Report (Includes traces, videos, and screenshots)
npx playwright show-report
```

## 📚 Modules

The platform is strictly organized into domain-driven blueprints spanning 10 massive volumes:
- **Volume 1-2**: Foundation & Dashboards (Auth, Layouts)
- **Volume 3-4**: Safety & Workforce (PPE Detection, Labor Tracking)
- **Volume 5-6**: Project & Materials (Scheduling, BOQ Estimation)
- **Volume 7-8**: Client Portals & Infrastructure (K8s, Multi-tenant DB)
- **Volume 9-10**: Business & Future Tech (Invoicing, Digital Twins, MQTT)

For detailed technical specifications, check the generated architecture blueprints inside the internal documentation.

---
**BuildSpace AI** - *Engineering the Future of Construction.*
