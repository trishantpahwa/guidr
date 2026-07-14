# guidr

A lightweight, dependency-free (besides [Floating UI](https://floating-ui.com/)) step-by-step product tour library, built for Next.js App Router but works in any React 18+ app.

Think [intro.js](https://introjs.com/), but as React components/hooks with `"use client"` baked in, TypeScript types, and no jQuery-era DOM APIs.

## Features

- Highlights a target element with a dimmed spotlight overlay
- Auto-positioned tooltips (via Floating UI) that flip/shift to stay on screen
- Keyboard navigation (Arrow keys, Enter, Escape)
- Auto-scrolls the target into view
- Centered "modal" steps with no target (great for welcome/intro steps)
- Fully themeable via CSS variables
- Works with the Next.js App Router — ships `"use client"` directives, no config needed

## Install

```bash
npm install guidrjs
```

## Usage

```tsx
// app/dashboard/page.tsx
"use client";

import { TourProvider, useTour } from "guidrjs";
import "guidrjs/styles.css";

const steps = [
  {
    title: "Welcome 👋",
    content: "Let's take a quick look around your new dashboard.",
  },
  {
    target: "#create-project-btn",
    title: "Create a project",
    content: "Click here any time to start a new project.",
    placement: "bottom",
  },
  {
    target: "#nav-settings",
    content: "Manage billing, teammates, and integrations here.",
    placement: "right",
  },
];

export default function DashboardPage() {
  return (
    <TourProvider steps={steps} onComplete={() => console.log("tour complete")}>
      <Dashboard />
    </TourProvider>
  );
}

function Dashboard() {
  const { start } = useTour();

  return (
    <div>
      <button onClick={() => start()}>Start tour</button>
      <button id="create-project-btn">New project</button>
      <nav id="nav-settings">Settings</nav>
    </div>
  );
}
```

Mount `<TourProvider>` once near the root of the layout/page that owns the elements you're targeting (a root `app/providers.tsx` client component works well for app-wide tours).

## API

### `<TourProvider steps={...} {...options}>`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `TourStep[]` | — | The steps to walk through. |
| `showProgress` | `boolean` | `true` | Show the "1 / 4" counter. |
| `showBullets` | `boolean` | `true` | Show dot progress indicators. |
| `showSkipButton` | `boolean` | `true` | Show the "×" close button. |
| `exitOnOverlayClick` | `boolean` | `true` | Clicking the dimmed overlay ends the tour. |
| `exitOnEsc` | `boolean` | `true` | Escape key ends the tour. |
| `keyboardNavigation` | `boolean` | `true` | Arrow keys / Enter navigate steps. |
| `scrollIntoView` | `boolean` | `true` | Auto-scroll the target into view. |
| `spotlightPadding` | `number` | `8` | Padding (px) around the highlighted element. |
| `spotlightRadius` | `number` | `8` | Corner radius (px) of the spotlight. |
| `tooltipClassName` | `string` | — | Extra class(es) merged onto every step's tooltip card (`.guidr-card`). |
| `overlayClassName` | `string` | — | Extra class(es) merged onto the dimmed overlay. |
| `labels` | `{ next, back, done, skip }` | English defaults | Button label overrides (i18n). |
| `onStart` / `onComplete` / `onExit` / `onStepChange` | `function` | — | Lifecycle callbacks. |

### `TourStep`

```ts
interface TourStep {
  id?: string;
  target?: string | (() => Element | null); // CSS selector, or omit for a centered step
  title?: ReactNode;
  content: ReactNode;
  placement?: Placement; // "top" | "bottom" | "left" | "right" | ...
  offset?: number;
  disableSpotlight?: boolean;
  disableInteraction?: boolean;
  className?: string; // merged onto this step's tooltip card
  onBeforeStep?: () => void | Promise<void>;
  onAfterStep?: () => void;
}
```

### `useTour()`

Returns `{ start, stop, next, back, goTo, state, currentStep, isFirstStep, isLastStep, options }`. Call `start()` from anywhere inside the `TourProvider` (e.g. a "Take a tour" button, or a `useEffect` for first-time users).

## Theming

Override CSS variables anywhere above the tour (e.g. on `:root`):

```css
:root {
  --guidr-accent: #16a34a;
  --guidr-card-radius: 6px;
  --guidr-overlay-color: rgba(0, 0, 0, 0.75);
}
```

Or ignore `guidr/styles.css` entirely and target the `.guidr-*` class names directly.

## License

MIT
