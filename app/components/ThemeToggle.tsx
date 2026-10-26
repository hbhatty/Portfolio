"use client";

import { useEffect, useRef, useState } from "react";

const batMask = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160"><path d="M120 145 C100 112 78 110 60 122 C62 99 42 82 12 90 C30 66 25 40 5 20 C45 34 66 46 91 49 L99 21 L112 40 L128 40 L141 21 L149 49 C174 46 195 34 235 20 C215 40 210 66 228 90 C198 82 178 99 180 122 C162 110 140 112 120 145Z"/></svg>')}")`;

// Keep blocked-storage choices across client-side page remounts.
let preference: string | null = null;

export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  const [busy, setBusy] = useState(false);
  const active = useRef<ViewTransition | null>(null);
  const animation = useRef<Animation | null>(null);
  const running = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const system = window.matchMedia("(prefers-color-scheme: light)");
    try { preference = localStorage.getItem("portfolio-theme"); } catch { /* Storage may be blocked; the session still works. */ }
    setLight(document.documentElement.dataset.theme === "light");
    const sync = () => {
      active.current?.skipTransition();
      const next = preference === "light" || (preference !== "dark" && system.matches);
      document.documentElement.dataset.theme = next ? "light" : "dark";
      setLight(next);
    };
    const storage = (event: StorageEvent) => {
      if (event.key !== "portfolio-theme" && event.key !== null) return;
      preference = event.newValue;
      sync();
    };
    system.addEventListener("change", sync);
    window.addEventListener("storage", storage);
    return () => {
      mounted.current = false;
      active.current?.skipTransition();
      animation.current?.cancel();
      system.removeEventListener("change", sync);
      window.removeEventListener("storage", storage);
    };
  }, []);

  async function toggleTheme(button: HTMLButtonElement) {
    if (running.current) return;
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const update = () => {
      root.dataset.theme = next;
      preference = next;
      try { localStorage.setItem("portfolio-theme", next); } catch { /* Keep the in-memory choice when storage is unavailable. */ }
      if (mounted.current) {
        setLight(next === "light");
      }
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !document.startViewTransition || !root.animate) {
      update();
      return;
    }
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    running.current = true;
    setBusy(true);
    root.style.setProperty("--theme-mask", batMask);
    root.classList.add("theme-transition");
    const transition = document.startViewTransition(update);
    active.current = transition;
    const skip = () => {
      transition.skipTransition();
      animation.current?.finish();
    };
    reduced.addEventListener("change", skip);
    try {
      await transition.ready;
      // Radius 32 fits inside the bat at (120, 80); reach the farthest viewport corner from the button.
      const scale = Math.max(
        Math.hypot(x, y),
        Math.hypot(window.innerWidth - x, y),
        Math.hypot(x, window.innerHeight - y),
        Math.hypot(window.innerWidth - x, window.innerHeight - y),
      ) / 32 + 0.5;
      const width = 240 * scale;
      const height = 160 * scale;
      // mask-position places the image's top-left, so offset by half its size to keep the bat centred on the button.
      animation.current = root.animate(
        {
          maskSize: ["0px", `${width}px`],
          maskPosition: [`${x}px ${y}px`, `${x - width / 2}px ${y - height / 2}px`],
        },
        { duration: 700, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)", fill: "forwards" },
      );
      await animation.current.finished;
    } catch {
      // Skipped or unsupported transitions reject ready; the theme update still completes.
    } finally {
      transition.skipTransition();
      await transition.finished.catch(() => {});
      animation.current?.cancel();
      animation.current = null;
      active.current = null;
      reduced.removeEventListener("change", skip);
      root.classList.remove("theme-transition");
      root.style.removeProperty("--theme-mask");
      running.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  const label = `Switch to ${light ? "dark" : "light"} theme`;
  return (
    <button type="button" className="theme-toggle" aria-label={label} title={label} aria-disabled={busy} onClick={(event) => toggleTheme(event.currentTarget)}>
      <svg className="theme-bat" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M12 16.35 C10.61 14.05 9.08 13.91 7.83 14.75 C7.97 13.15 6.57 11.97 4.49 12.52 C5.74 10.85 5.39 9.04 4 7.65 C6.78 8.62 8.24 9.46 9.98 9.67 L10.54 7.72 L11.44 9.04 L12.56 9.04 L13.46 7.72 L14.02 9.67 C15.76 9.46 17.22 8.62 20 7.65 C18.61 9.04 18.26 10.85 19.51 12.52 C17.43 11.97 16.03 13.15 16.17 14.75 C14.92 13.91 13.39 14.05 12 16.35 Z" fill="currentColor" /></svg>
    </button>
  );
}
