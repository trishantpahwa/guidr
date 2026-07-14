
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TourContextValue, TourOptions, TourState } from "./types";
import { resolveTargetElement, scrollElementIntoView } from "./utils/dom";
import { TourOverlay } from "./components/TourOverlay";
import { TourTooltip } from "./components/TourTooltip";

export const TourContext = createContext<TourContextValue | null>(null);

const DEFAULT_LABELS = {
  next: "Next",
  back: "Back",
  done: "Done",
  skip: "Skip",
};

export interface TourProviderProps extends TourOptions {
  children: ReactNode;
}

export function TourProvider({ children, steps, ...rest }: TourProviderProps) {
  const [state, setState] = useState<TourState>({
    isActive: false,
    stepIndex: 0,
    steps,
  });

  // Keep the latest steps/options/state in refs so callbacks stay stable across renders
  // and side effects never run inside a setState updater (which React may invoke twice).
  const optsRef = useRef(rest);
  optsRef.current = rest;
  const stateRef = useRef(state);
  stateRef.current = state;
  // Guards onComplete/onExit against firing more than once for the same tour run.
  const endedRef = useRef(true);

  useEffect(() => {
    setState((s) => ({ ...s, steps }));
  }, [steps]);

  const currentStep = state.steps[state.stepIndex];

  const start = useCallback((fromStepIndex = 0) => {
    endedRef.current = false;
    setState((s) => ({ ...s, isActive: true, stepIndex: fromStepIndex }));
    optsRef.current.onStart?.();
  }, []);

  const stop = useCallback((reason: "skip" | "esc" | "overlay" | "manual" = "manual") => {
    setState((s) => ({ ...s, isActive: false }));
    if (!endedRef.current) {
      endedRef.current = true;
      optsRef.current.onExit?.(reason);
    }
  }, []);

  const goTo = useCallback((index: number) => {
    setState((s) => {
      const clamped = Math.max(0, Math.min(index, s.steps.length - 1));
      return { ...s, stepIndex: clamped };
    });
  }, []);

  const next = useCallback(() => {
    const isLast = stateRef.current.stepIndex >= stateRef.current.steps.length - 1;
    setState((s) => {
      if (s.stepIndex >= s.steps.length - 1) {
        return { ...s, isActive: false };
      }
      return { ...s, stepIndex: s.stepIndex + 1 };
    });
    if (isLast && !endedRef.current) {
      endedRef.current = true;
      optsRef.current.onComplete?.();
    }
  }, []);

  const back = useCallback(() => {
    setState((s) => ({ ...s, stepIndex: Math.max(0, s.stepIndex - 1) }));
  }, []);

  // Fire onStepChange + per-step lifecycle hooks, and scroll the target into view.
  useEffect(() => {
    if (!state.isActive || !currentStep) return;
    optsRef.current.onStepChange?.(state.stepIndex, currentStep);
    currentStep.onBeforeStep?.();

    const scrollEnabled = optsRef.current.scrollIntoView ?? true;
    if (scrollEnabled) {
      const el = resolveTargetElement(currentStep.target);
      if (el) scrollElementIntoView(el);
    }

    currentStep.onAfterStep?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isActive, state.stepIndex]);

  // Keyboard navigation.
  useEffect(() => {
    if (!state.isActive) return;
    const keyboardNavigation = optsRef.current.keyboardNavigation ?? true;
    const exitOnEsc = optsRef.current.exitOnEsc ?? true;
    if (!keyboardNavigation && !exitOnEsc) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && exitOnEsc) {
        stop("esc");
        return;
      }
      if (!keyboardNavigation) return;
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        back();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [state.isActive, next, back, stop]);

  const isFirstStep = state.stepIndex === 0;
  const isLastStep = state.stepIndex === state.steps.length - 1;

  const value = useMemo<TourContextValue>(
    () => ({
      state,
      start,
      stop,
      next,
      back,
      goTo,
      isFirstStep,
      isLastStep,
      currentStep,
      options: {
        showProgress: rest.showProgress ?? true,
        showBullets: rest.showBullets ?? true,
        showSkipButton: rest.showSkipButton ?? true,
        exitOnOverlayClick: rest.exitOnOverlayClick ?? true,
        exitOnEsc: rest.exitOnEsc ?? true,
        keyboardNavigation: rest.keyboardNavigation ?? true,
        scrollIntoView: rest.scrollIntoView ?? true,
        spotlightPadding: rest.spotlightPadding ?? 8,
        spotlightRadius: rest.spotlightRadius ?? 8,
        labels: { ...DEFAULT_LABELS, ...rest.labels },
      },
    }),
    [
      state,
      start,
      stop,
      next,
      back,
      goTo,
      isFirstStep,
      isLastStep,
      currentStep,
      rest.showProgress,
      rest.showBullets,
      rest.showSkipButton,
      rest.exitOnOverlayClick,
      rest.exitOnEsc,
      rest.keyboardNavigation,
      rest.scrollIntoView,
      rest.spotlightPadding,
      rest.spotlightRadius,
      rest.labels,
    ],
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {state.isActive && currentStep && (
        <>
          <TourOverlay />
          <TourTooltip />
        </>
      )}
    </TourContext.Provider>
  );
}
