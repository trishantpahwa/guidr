import type { TourStep } from "../types";

export function resolveTargetElement(target: TourStep["target"]): Element | null {
  if (!target) return null;
  if (typeof target === "function") return target();
  if (typeof target === "string") return document.querySelector(target);
  return null;
}

export function scrollElementIntoView(el: Element) {
  el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
}
