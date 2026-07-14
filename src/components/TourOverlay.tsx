
import type { CSSProperties } from "react";
import { useTour } from "../useTour";
import { useElementRect, useTargetElement } from "../utils/useTargetRect";

export function TourOverlay() {
  const { state, currentStep, stop, options } = useTour();
  const target = useTargetElement(currentStep?.target, state.stepIndex);
  const rect = useElementRect(currentStep?.disableSpotlight ? null : target);

  if (!currentStep) return null;

  const handleOverlayClick = () => {
    if (options.exitOnOverlayClick) stop("overlay");
  };

  const padding = options.spotlightPadding;
  const radius = options.spotlightRadius;

  const overlayClassName = ["guidr-overlay-wrapper", options.overlayClassName].filter(Boolean).join(" ");

  // No target (centered/modal step): dim the whole viewport, no cutout.
  if (!rect) {
    return (
      <div
        className={["guidr-overlay", "guidr-overlay-full", options.overlayClassName].filter(Boolean).join(" ")}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
    );
  }

  const hole = {
    top: Math.max(rect.top - padding, 0),
    left: Math.max(rect.left - padding, 0),
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };

  const boxStyle: CSSProperties = { position: "fixed" };

  return (
    <div className={overlayClassName} aria-hidden="true">
      <div
        className="guidr-overlay"
        style={{ ...boxStyle, top: 0, left: 0, right: 0, height: hole.top }}
        onClick={handleOverlayClick}
      />
      <div
        className="guidr-overlay"
        style={{
          ...boxStyle,
          top: hole.top + hole.height,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onClick={handleOverlayClick}
      />
      <div
        className="guidr-overlay"
        style={{
          ...boxStyle,
          top: hole.top,
          left: 0,
          width: hole.left,
          height: hole.height,
        }}
        onClick={handleOverlayClick}
      />
      <div
        className="guidr-overlay"
        style={{
          ...boxStyle,
          top: hole.top,
          left: hole.left + hole.width,
          right: 0,
          height: hole.height,
        }}
        onClick={handleOverlayClick}
      />
      <div
        className="guidr-spotlight"
        style={{
          top: hole.top,
          left: hole.left,
          width: hole.width,
          height: hole.height,
          borderRadius: radius,
        }}
      />
      {currentStep.disableInteraction && (
        <div
          className="guidr-interaction-blocker"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
