"use client";

import type { MouseEvent } from "react";
import { setChosenColor, type Theme } from "./theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  setChosenColor(theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Private browsing can block storage; the switch still works for this visit.
  }
}

// The new theme spreads out from the icon in a circle. Browsers without view transitions,
// and visitors who ask for less motion, get an instant switch.
function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
  const root = document.documentElement;
  const current = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next: Theme = current === "dark" ? "light" : "dark";
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyTheme(next);
    return;
  }

  const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
  const x = left + width / 2, y = top + height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // Hold the page's own colour transitions so the circle sweeps over finished colours.
  root.dataset.switching = "";
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(.3, .6, .2, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
  transition.finished.finally(() => delete root.dataset.switching);
}

// CSS (globals.css) shows the moon in day mode and the sun in night mode, so the icon and its
// spoken label are right before this script loads.
export function ThemeToggle() {
  return (
    <button type="button" className="theme-toggle" title="Day / night" onClick={toggleTheme}>
      <span className="to-dark">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13.5 9.8A5.5 5.5 0 0 1 6.2 2.5a5.5 5.5 0 1 0 7.3 7.3z" />
        </svg>
        <span className="visually-hidden">Switch to dark mode</span>
      </span>
      <span className="to-light">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" />
        </svg>
        <span className="visually-hidden">Switch to light mode</span>
      </span>
    </button>
  );
}
