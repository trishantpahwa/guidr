
import { useEffect, useState } from "react";
import type { Rect, TourStep } from "../types";
import { resolveTargetElement } from "./dom";

/** Resolves a step's target element, retrying briefly in case it mounts asynchronously. */
export function useTargetElement(target: TourStep["target"], depKey: string | number): Element | null {
  const [el, setEl] = useState<Element | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let frame: number;

    function tryResolve() {
      const found = resolveTargetElement(target);
      if (found) {
        if (!cancelled) setEl(found);
        return;
      }
      attempts += 1;
      if (attempts < 15 && !cancelled) {
        frame = requestAnimationFrame(tryResolve);
      } else if (!cancelled) {
        setEl(null);
      }
    }

    tryResolve();
    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey]);

  return el;
}

/** Tracks an element's viewport-relative bounding box, live-updating on scroll/resize. */
export function useElementRect(el: Element | null): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (!el) {
      setRect(null);
      return;
    }

    const update = () => {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [el]);

  return rect;
}

/** Tracks the current viewport dimensions. */
export function useViewportSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
