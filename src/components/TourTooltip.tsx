
import { useEffect, useLayoutEffect, useState } from "react";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { useTour } from "../useTour";
import { useTargetElement } from "../utils/useTargetRect";

const ARROW_SIZE = 8;

export function TourTooltip() {
  const { state, currentStep, next, back, stop, isFirstStep, isLastStep, options } = useTour();
  const target = useTargetElement(currentStep?.target, state.stepIndex);
  const [arrowEl, setArrowEl] = useState<SVGSVGElement | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: true,
    placement: currentStep?.placement ?? "bottom",
    // "fixed" (not the default "absolute") keeps the floating element
    // viewport-relative. With "absolute", anchoring to a `position: fixed`
    // reference (a common pattern for docked sidebars/toolbars) on a page
    // taller than one screen positions the tooltip document-relative
    // instead — it can render far off the intended spot, sometimes fully
    // outside the viewport. "fixed" is correct for in-flow targets too:
    // autoUpdate already re-measures on scroll/resize regardless of strategy.
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset((currentStep?.offset ?? 12) + ARROW_SIZE / 2),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      arrow({ element: arrowEl }),
    ],
  });

  useLayoutEffect(() => {
    refs.setReference(target);
  }, [refs, target]);

  useEffect(() => {
    if (!options.keyboardNavigation) return;
    // Keep focus on the tooltip's action buttons for accessibility once it mounts.
    const node = refs.floating.current;
    node?.querySelector<HTMLButtonElement>("[data-guidr-autofocus]")?.focus();
  }, [state.stepIndex, options.keyboardNavigation, refs.floating]);

  if (!currentStep) return null;

  const stepNumber = state.stepIndex + 1;
  const totalSteps = state.steps.length;
  const labels = options.labels;
  const cardClassName = ["guidr-card", options.tooltipClassName, currentStep.className]
    .filter(Boolean)
    .join(" ");

  const card = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof currentStep.title === "string" ? currentStep.title : "Tour step"}
      className={cardClassName}
    >
      {options.showSkipButton && !isLastStep && (
        <button
          type="button"
          className="guidr-skip-btn"
          aria-label={labels.skip}
          onClick={() => stop("skip")}
        >
          ×
        </button>
      )}

      {currentStep.title && <div className="guidr-title">{currentStep.title}</div>}
      <div className="guidr-content">{currentStep.content}</div>

      <div className="guidr-footer">
        <div className="guidr-progress-group">
          {options.showProgress && (
            <span className="guidr-progress-text">
              {stepNumber} / {totalSteps}
            </span>
          )}
          {options.showBullets && (
            <div className="guidr-bullets">
              {state.steps.map((_, i) => (
                <span
                  key={i}
                  className={`guidr-bullet${i === state.stepIndex ? " guidr-bullet-active" : ""}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="guidr-buttons">
          {!isFirstStep && (
            <button type="button" className="guidr-btn guidr-btn-secondary" onClick={back}>
              {labels.back}
            </button>
          )}
          <button
            type="button"
            className="guidr-btn guidr-btn-primary"
            data-guidr-autofocus
            onClick={next}
          >
            {isLastStep ? labels.done : labels.next}
          </button>
        </div>
      </div>
    </div>
  );

  if (!target) {
    return (
      <div className="guidr-modal-center">
        {card}
      </div>
    );
  }

  return (
    <div ref={refs.setFloating} style={floatingStyles} className="guidr-floating">
      <FloatingArrow ref={setArrowEl} context={context} width={16} height={ARROW_SIZE} className="guidr-arrow" />
      {card}
    </div>
  );
}
