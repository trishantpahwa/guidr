import type { ReactNode } from "react";
import type { Placement } from "@floating-ui/react";

export interface TourStep {
  /** Unique id for this step. Defaults to its index if omitted. */
  id?: string;
  /**
   * CSS selector for the element to highlight, or a ref to it.
   * Omit to render a centered, non-anchored modal step (e.g. a welcome step).
   */
  target?: string | (() => Element | null);
  title?: ReactNode;
  content: ReactNode;
  /** Preferred tooltip placement relative to the target. Defaults to "bottom". */
  placement?: Placement;
  /** Extra horizontal/vertical space (px) between the target and the tooltip. */
  offset?: number;
  /** Disable the spotlight cutout for this step while still dimming the page. */
  disableSpotlight?: boolean;
  /** Disable pointer interaction with the highlighted element. Defaults to false. */
  disableInteraction?: boolean;
  /** Extra class name(s) merged onto this step's tooltip card (`.guidr-card`), for styling a single step without a global selector. */
  className?: string;
  /** Called right before this step is shown. */
  onBeforeStep?: () => void | Promise<void>;
  /** Called right after this step is shown. */
  onAfterStep?: () => void;
}

export interface TourOptions {
  steps: TourStep[];
  /** Show step counter ("Step 1 of 4"). Defaults to true. */
  showProgress?: boolean;
  /** Show the dot/bullet progress indicator. Defaults to true. */
  showBullets?: boolean;
  /** Show the "Skip" button. Defaults to true. */
  showSkipButton?: boolean;
  /** Allow closing the tour by clicking the overlay. Defaults to true. */
  exitOnOverlayClick?: boolean;
  /** Allow closing the tour with the Escape key. Defaults to true. */
  exitOnEsc?: boolean;
  /** Allow Arrow keys / Enter to navigate. Defaults to true. */
  keyboardNavigation?: boolean;
  /** Scroll the target element into view when a step becomes active. Defaults to true. */
  scrollIntoView?: boolean;
  /** Padding (px) between the highlighted element and the dimmed overlay. Defaults to 8. */
  spotlightPadding?: number;
  /** Corner radius (px) of the spotlight cutout. Defaults to 8. */
  spotlightRadius?: number;
  /** Extra class name(s) merged onto every step's tooltip card (`.guidr-card`). Combine with a step's own `className` for per-step overrides on top of a tour-wide one. */
  tooltipClassName?: string;
  /** Extra class name(s) merged onto the dimmed overlay (`.guidr-overlay-wrapper` / `.guidr-overlay-full`). */
  overlayClassName?: string;
  /** Labels for the built-in tooltip buttons. */
  labels?: Partial<{
    next: string;
    back: string;
    done: string;
    skip: string;
  }>;
  onStart?: () => void;
  onComplete?: () => void;
  onExit?: (reason: "skip" | "esc" | "overlay" | "manual") => void;
  onStepChange?: (index: number, step: TourStep) => void;
}

export interface TourState {
  isActive: boolean;
  stepIndex: number;
  steps: TourStep[];
}

export interface TourContextValue {
  state: TourState;
  start: (fromStepIndex?: number) => void;
  stop: (reason?: "skip" | "esc" | "overlay" | "manual") => void;
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  currentStep: TourStep | undefined;
  options: Required<
    Omit<TourOptions, "steps" | "onStart" | "onComplete" | "onExit" | "onStepChange" | "labels">
  > & {
    labels: Required<NonNullable<TourOptions["labels"]>>;
  };
}

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}
