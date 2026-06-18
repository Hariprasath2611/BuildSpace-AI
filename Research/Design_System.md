# BuildSpace AI — Enterprise Design System & Brand Guidelines
## Design Tokens, Visual Identity Systems, Component Libraries, and AI Interface Specs
**Document Version:** 1.0.0  
**Date:** June 18, 2026  
**Confidentiality:** Public Open Architecture Specification  
**Status:** Approved for Core Platform Styling & Frontend Implementation  

---

## Section 1: Brand Foundation

BuildSpace AI’s identity bridges physical building trades with advanced machine learning logic:

*   **Mission:** To democratize enterprise-grade construction intelligence, helping builders of all scales eliminate budget overruns, prevent delays, and protect site safety.
*   **Vision:** To serve as the global AI operating system orchestrating the physical construction lifecycle.
*   **Brand Personality:** Professional, precise, modern, stable, and collaborative.
*   **Brand Voice:** Clear, authoritative, and direct. Avoid tech jargon; speak with field-tested clarity.
*   **Tagline:** *"The AI Operating System for Modern Construction."*

---

## Section 2: Visual Identity & Logo Rules

The brand assets are built around the **Construction Box** and the **AI Neural Connector**:

*   **Primary Logo Structure:** A stylized 3D hex-box combining grid structural beams with neural junction points at the coordinates.
*   **App Icon:** A high-contrast hex-box set against a deep obsidian gradient background, optimized for mobile home screens.
*   **Favicons:** Simplified 16x16 and 32x32 vectors of the core hex-box symbol.
*   **Logo Rules:** Keep a minimum clear space equal to 1.5x the width of the hex-box around the logo. Minimum logo width for web is `120px`; minimum height for print is `20mm`.

---

## Section 3: Color Tokens & Accessibility

Our theme combines high-visibility construction colors with deep AI gradients, meeting WCAG 2.2 AA contrast rules:

```
                            COLOR HUE MATRICES
+--------------------+---------------------+---------------------+
| Primary Obsidian   | High-Viz Safety     | AI Neon Blue        |
| #0B0F19 (Base)     | #FF7B00 (Primary)   | #00C8FF (Accent)    |
| Contrast: 12.5:1   | Contrast: 4.8:1     | Contrast: 4.5:1     |
+--------------------+---------------------+---------------------+
```

### 3.1 Global Palette Tokens

| Token Name | Hex Value | Purpose / Mapping | WCAG Contrast |
|---|---|---|---|
| `--color-bg-dark` | `#0B0F19` | Dark theme canvas | 12.5:1 vs. white |
| `--color-bg-light`| `#F8F9FC` | Light theme canvas | 10.2:1 vs. dark text |
| `--color-safety` | `#FF7B00` | High-visibility warning alert| 4.8:1 vs. dark bg |
| `--color-accent` | `#00C8FF` | Interactive links and buttons| 4.5:1 vs. dark bg |
| `--color-success` | `#00E676` | Quality checklist approval | 4.6:1 vs. dark bg |
| `--color-danger` | `#FF1744` | Structural clash or fall hazard| 4.7:1 vs. dark bg |

---

## Section 4: Typography Scale

BuildSpace AI uses **Inter** for UI copy, **Outfit** for headings, and **JetBrains Mono** for specifications and cost code lists:

| Typography Token | Font Family | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `--font-h1` | Outfit | Bold (700) | `32px` | `40px` | `-0.02em` |
| `--font-h2` | Outfit | Medium (500) | `24px` | `32px` | `-0.01em` |
| `--font-body` | Inter | Regular (400) | `16px` | `24px` | `0` |
| `--font-caption`| Inter | Regular (400) | `12px` | `16px` | `+0.01em` |
| `--font-mono` | JetBrains Mono| Regular (400)| `14px` | `20px` | `0` |

---

## Section 5: Global Design Tokens

Our design tokens manage colors, typography, sizing, and elevations across devices:

```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "16px",
    "full": "9999px"
  },
  "elevation": {
    "flat": "none",
    "raised": "0 2px 4px rgba(0, 0, 0, 0.08)",
    "floating": "0 8px 16px rgba(0, 0, 0, 0.12)"
  }
}
```

---

## Section 6: Spacing & Layout System

*   **Responsive Grid:** We use a 12-column grid system with `16px` margins on mobile, `24px` on tablet, and `32px` on desktop layouts.
*   **Component Spacing:** Component gaps align with our 8px grid scale (e.g., margins of `8px`, `16px`, `24px`, or `32px`).
*   **Safe Areas:** Mobile app layouts must incorporate iOS/Android device notches and bottom home-indicator safe areas.

---

## Section 7: Iconography

*   **Filled vs. Outlined:** Tab bars and menus use outlined icons, toggling to filled states when active.
*   **Line Weight:** Icons use a persistent stroke width of `2px` to ensure visibility.
*   **Core Icon Categories:**
    *   *Construction:* Hammer, crane, blueprint, zone-boundary, geofence-map.
    *   *AI:* Neural-connection, spark-stars, chat-assistant, RAG-search.
    *   *System Actions:* Checkmark-box, trash, edit, export-pdf.

---

## Section 8: Illustration Style

*   **Style:** Flat vector illustrations with high-visibility construction highlights (e.g., safety orange, warning red, neural blue).
*   **Empty States:** Clear illustrations (e.g., an empty trailer model or a dormant crane) paired with simple setup wizard steps.
*   **AI Assistant Representation:** Visualized as clean, animated light pulses or a hex-box symbol that responds to user inputs.

---

## Section 9: Component Library Specification

Below are specifications for core library components:

### 9.1 Primary Button
*   **Purpose:** Primary call to action (e.g., Save, Approve, Submit).
*   **Variants:** Filled, Outlined, Ghost.
*   **States:** Default, Hover, Active, Disabled, Loading.
*   **Interactions:** Hover transitions run a 150ms transform, increasing background saturation.
*   **Accessibility:** Minimum touch target size of `48 x 48 dp` on mobile. Focus indicator shows a prominent `2px` focus ring.

### 9.2 Text Input Fields
*   **Purpose:** Simple text entry for names, notes, and metrics.
*   **Variants:** Standard, Floating Label, Error State, With Icon.
*   **Validation:** Error states display input borders in `--color-danger` with clear, inline warning microcopy.

---

## Section 10: Data Visualization Standards

BuildSpace AI uses specific chart formats to present complex site data clearly:

*   **Gantt Schedule View:** Timelines show active dependencies. Delayed items on the critical path are displayed in high-visibility safety orange.
*   **Project Risk Matrix:** A 5x5 color-coded grid mapping risk likelihood against impact (from low-green to critical-red).
*   **Progress Rings:** Displays percentage-complete stats for active work zones (e.g., concrete poured on Level 2).

---

## Section 11: Motion System & Timing

Transitions use clean, fast timing curves to keep dashboards responsive:

*   **Interactive Hover:** `150ms` duration using `cubic-bezier(0.4, 0, 0.2, 1)` curves.
*   **Drawer / Sheet Open:** `250ms` duration using `cubic-bezier(0.0, 0, 0.2, 1)` (decelerate) curves.
*   **AI Processing Loop:** A continuous, pulsating loop with a `1.5s` period, showing processing status without blocking inputs.

---

## Section 12: Responsive Breakpoints

We adjust app layouts across devices using these breakpoints:

```
                            BREAKPOINT TOPOLOGY
  [Mobile Screen]  < 480px  ----------------------------> Single Column Tab layout
  [Tablet Screen]  481px - 1024px  --------------------> Split-Pane Drawer layout
  [Desktop Screen] > 1025px  --------------------------> 12-Column Sidebar layout
```

---

## Section 13: Accessibility Checklist (WCAG 2.2 AA)

*   **Screen Readers:** All UI elements use descriptive ARIA labels (e.g., `aria-label="Approve purchase order"`).
*   **Keyboard Focus:** Focus states use high-contrast borders and clear focus indicators.
*   **Reduced Motion:** Layout transitions disable automatically if user device settings request reduced motion.

---

## Section 14: AI Experience Patterns

We present AI actions to users via consistent interface patterns:

*   **AI Copilot Chat Panel:** A right-hand sidebar panel displays the conversational AI assistant, complete with prompt templates.
*   **Confidence Indicators:** AI suggestions (e.g., progress predictions) display their confidence score (e.g., *"Confidence: 94%"*).
*   **Citations:** RAG search results provide direct links to the source drawings, documents, or cost codes.

---

## Section 15: Mobile Interface Standards

*   **Bottom Navigation Tabs:** Mobile layouts feature 4 or 5 primary tabs, positioning action buttons (FABs) within easy thumb reach.
*   **Offline Indicator Banner:** A top-level banner displays connection statuses, turning yellow when offline and pulsing green upon sync completion.

---

## Section 16: Screen Layout Templates

*   **Master-Detail View:** A split-pane screen displaying project lists in the left pane and details in the right pane, optimized for tablet views.
*   **Forms & Wizard Layout:** A step-by-step layout with a top progress bar, optimized for onboarding checklists.

---

## Section 17: Microcopy & Voice Guidelines

*   **Success Alerts:** Keep microcopy direct (e.g., *"Daily log submitted successfully"*).
*   **Error Messaging:** Always explain the error and provide a recovery path (e.g., *"Sync failed due to network timeout. Tap to retry"*).

---

## Section 18: Theming Systems

*   **Construction Site Mode:** A high-contrast light theme with enlarged text and touch targets, optimized for outdoor site walks under direct sunlight.
*   **Presentation Mode:** Simplifies layouts to display clear progress charts during investor or client reviews.

---

## Section 19: Brand Applications & Marketing Assets

*   **Email Templates:** Clean email templates with prominent call-to-action buttons for task alerts and document approvals.
*   **Social Media Assets:** Design systems for LinkedIn and YouTube, featuring high-contrast text overlays.

---

## Section 20: Design System Governance

*   **Component Versioning:** Reusable UI components are versioned and managed in central design packages.
*   **Contribution Process:** Team members submit new component proposals to the design system team for review and approval.
