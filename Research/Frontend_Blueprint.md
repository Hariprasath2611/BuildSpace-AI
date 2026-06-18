# BuildSpace AI — Frontend Engineering Blueprint
## React 19, Vite, TypeScript, Tailwind CSS, Zustand, & TanStack Query Engineering Handbook
**Document Version:** 1.0.0  
**Date:** June 18, 2026  
**Confidentiality:** Public Open Architecture Specification  
**Status:** Approved for Core Frontend Development  

---

## Section 1: Frontend Architecture Philosophy

BuildSpace AI’s frontend architecture is built on a **Feature-Based Architecture** designed to support large-scale SaaS development:

```
                            FRONTEND ARCHITECTURE LOGIC
+-----------------------------------------------------------------------+
|                       CORE PRESENTATION SHELL                         |
|  - React 19 Runtime Engine      - React Router DOM Routing            |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                       STATE & DATA ORCHESTRATION                      |
|  - Global App Store (Zustand)   - Async Data Fetch / Cache (Query)    |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                         FEATURE BUNDLES (Silos)                       |
|  +--------------------+  +--------------------+  +-----------------+  |
|  |    auth feature    |  |  projects feature  |  |  safety feature |  |
|  +--------------------+  +--------------------+  +-----------------+  |
|            |                        |                     |           |
|            +------------------------+---------------------+           |
|                                     |                                 |
|                                     v                                 |
|                       REUSABLE COMPONENTS & UTILS                     |
|  - Shadcn UI Primitives         - CSS Variable Tokens                 |
+-----------------------------------------------------------------------+
```

### 1.1 Core Frontend Principles
1.  **Component-Driven Development:** UI views are built from modular, single-responsibility React components.
2.  **Feature-Based Architecture:** Group code (components, hooks, styles, tests) by feature domain rather than technology layer.
3.  **Separation of Concerns:** Separate data fetching, business logic, and view rendering.
4.  **Accessibility First (WCAG 2.2 AA):** All components must support screen readers, keyboard navigation, and high-contrast styling.

---

## Section 2: Project Structure Layout

Our project structure keeps feature logic isolated and reusable components easily accessible:

```
src/
  ├── app/                # Global app shell (providers, routes registration)
  ├── assets/             # Global media files, fonts, and logos
  ├── components/         # Global reusable components
  │   ├── common/         # Buttons, inputs, card layouts
  │   ├── ui/             # Radix / Shadcn UI primitive components
  │   └── ai/             # AI prompt boxes, chat view panels
  ├── features/           # Feature Domains
  │   ├── auth/           # Authentication features
  │   │   ├── components/ # Local components
  │   │   ├── hooks/      # Local hooks (e.g., useAuthMutation)
  │   │   ├── store/      # Local Zustand stores
  │   │   └── index.ts    # Public feature API exports
  │   ├── projects/       # Projects features
  │   └── safety/         # Safety features
  ├── hooks/              # Global reusable React hooks
  ├── store/              # Global Zustand state configuration
  ├── routes/             # Path definitions and router setups
  ├── styles/             # Global Tailwind stylesheets
  └── app.tsx             # Application entrypoint
```

---

## Section 3: Core Application Architecture

*   **App Providers Wrapper:** The app entrypoint imports a unified `AppProviders` wrapper to register themes, queries, auth contexts, and toast systems.
*   **Lazy Loading Strategy:** Large page views and charts are lazy-loaded using React `Suspense` to reduce initial bundle sizes.
*   **Error Boundaries:** Wraps feature boundaries in React Error Boundaries to prevent a single component crash from breaking the entire application.

---

## Section 4: Routing Architecture

We manage routes using React Router DOM:

*   **Protected Routes:** Custom wrappers check user auth status and block unauthorized access.
*   **Role-Based Routes:** Routes check user claims (e.g., restricting access to billing setups to Admin roles).
*   **Nested Routes:** Site views are nested inside project shells (e.g., `/projects/:projectId/sites/:siteId`) to preserve layouts.

---

## Section 5: State Management Architecture

BuildSpace AI divides application state into specific scopes:

*   **Zustand Global Stores:** Handles global variables (active user, theme settings, WebSocket sync queues).
*   **Zustand Feature Stores:** Handles local feature states (e.g., open RFI search filters).
*   **Optimistic UI Updates:** Updates local state instantly during mutate queries, rolling back changes if server errors occur.

---

## Section 6: Data Fetching & Caching Strategy

We manage server state and asynchronous caching using TanStack Query:

```
                          ASYNC DATA FLOW CACHE
[Component Mounts] --(Checks Query Cache)--> [Cache Hit / Valid?]
                                                    |
                                    +---------------+---------------+
                                    |                               |
                                   Yes                              No
                                    v                               v
                            [Render cached data]          [Fetch via API Layer]
                                                                    |
                                                          [Cache Updated & Render]
```

---

## Section 7: API Client Layer

*   **Axios Configuration:** Includes base URLs, 10-second timeouts, and response mappings.
*   **JWT Token Interceptor:** Automatically adds Firebase ID tokens to outgoing HTTP headers.
*   **Automatic Retries:** Failed network requests retry automatically up to 3 times with exponential delays.

---

## Section 8: Component Standards & Styling

*   **Shadcn UI base:** Uses Radix primitive libraries to ensure accessibility compliance.
*   **Tailwind + CVA styling:** Coordinates class configurations using Class Variance Authority (CVA):

```typescript
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## Section 9: Form Architecture

*   **React Hook Form:** Coordinates form inputs and state validations.
*   **Zod Validation:** Validates form values at runtime, displaying clear errors.
*   **Autosave Support:** Checklists and logs auto-save draft changes locally to prevent data loss.

---

## Section 10: Performance Optimization

*   **Virtualization:** Uses list virtualization (e.g., react-window) to render large tables and lists.
*   **Image Compression:** Compresses photo uploads before transport to reduce bandwidth usage.
*   **Code Splitting:** Uses dynamic imports to keep bundle chunks under `500kB`.

---

## Section 11: Accessibility Compliance (WCAG 2.2 AA)

*   **Keyboard Focus Navigation:** All interactive elements support sequential focus states.
*   **ARIA attributes:** Maps accessible labels (`aria-label`, `aria-describedby`) to non-text elements.
*   **Touch Targets:** Touch elements on mobile devices have a minimum size of `48 x 48 dp`.

---

## Section 12: Testing Strategy

*   **Unit Tests (Vitest):** Validates utility functions and local hooks.
*   **Component Tests (React Testing Library):** Verifies component click events and renders.
*   **E2E Tests (Playwright):** Validates user journeys (e.g., registration, checkins, PDF exports).
*   **Accessibility Audits:** Integrates axe-core checks inside Vitest suites.
