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
      if (!mounted.current) return;
      root.dataset.theme = next;
      preference = next;
      setLight(next === "light");
      try { localStorage.setItem("portfolio-theme", next); } catch { /* Keep the in-memory choice when storage is unavailable. */ }
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
    } catch (error) {
      // Skipped transitions reject ready; the theme update still completes.
      if (!(error instanceof DOMException && error.name === "AbortError")) throw error;
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
      <svg className="theme-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
      <svg className="theme-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z" /></svg>
    </button>
  );
}
