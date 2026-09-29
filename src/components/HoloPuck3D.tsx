"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { site, type Hologram } from "@content/site";
import { HoloPuck } from "./HoloPuck";
import { AurebeshWanted } from "./AurebeshWanted";
import type { Phase } from "./holo/sequence";

// The whole three.js bundle loads only in the browser, only when this mounts.
const HoloScene = dynamic(() => import("./holo/HoloScene"), {
  ssr: false,
  loading: () => null,
});

type Support = "unknown" | "webgl" | "none";

function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function detectLowTier(): boolean {
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const small = window.innerWidth < 768;
  return cores <= 4 || mem <= 4 || small;
}

/**
 * Interactive bounty-puck hologram. Renders the CSS version first (and
 * keeps it as the fallback for no-WebGL, no-JS, or while the 3D bundle
 * loads), then fades in the three.js scene. Text stays as HTML overlays.
 */
export function HoloPuck3D() {
  const h: Hologram = site.hologram;
  const [support, setSupport] = useState<Support>("unknown");
  const [motion, setMotion] = useState(true);
  const [lowTier, setLowTier] = useState(false);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("standby");
  const [replayToken, setReplayToken] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  // Capability detection, after mount (async so lint is happy).
  useEffect(() => {
    const t = window.setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setMotion(!reduce);
      setLowTier(detectLowTier());
      setSupport(detectWebGL() && h.portrait ? "webgl" : "none");
    }, 0);
    return () => window.clearTimeout(t);
  }, [h.portrait]);

  // Pause the render loop when scrolled away.
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-activate shortly after the scene is ready.
  useEffect(() => {
    if (!ready || !motion) return;
    const t = window.setTimeout(() => setReplayToken((n) => n + 1), 650);
    return () => window.clearTimeout(t);
  }, [ready, motion]);

  const onPhase = useCallback((p: Phase) => setPhase(p), []);
  const onReady = useCallback(() => setReady(true), []);
  const replay = () => setReplayToken((n) => n + 1);

  const textIn = phase === "revealing" || phase === "idle" || !motion;
  const label = `Bounty puck projecting a hologram. ${h.wanted}. Bounty: ${h.bounty.amount} ${h.bounty.unit}.`;

  if (support !== "webgl") {
    // Server render, first client paint, and any device without WebGL.
    return <HoloPuck />;
  }

  return (
    <div ref={root} className="holo3d">
      {/* CSS version stays underneath until the scene has rendered a frame */}
      <div aria-hidden className={`holo3d-fallback ${ready ? "is-hidden" : ""}`}>
        <HoloPuck bare />
      </div>

      {/* The scene is the image; controls below are separate so nothing interactive is nested in it */}
      <div
        role="img"
        aria-label={label}
        className={`holo3d-canvas ${ready ? "is-ready" : ""}`}
      >
        <HoloScene
          portrait={h.portrait as string}
          motion={motion}
          lowTier={lowTier}
          active={visible}
          replayToken={replayToken}
          onPhase={onPhase}
          onReady={onReady}
        />
      </div>

      {/* HTML overlays: crisp, selectable, accessible */}
      {/* Flicker animations live on inner elements so the outer fade is not overridden */}
      <div aria-hidden className={`holo3d-ui ${ready ? "is-ready" : ""} phase-${phase}`}>
        <div className="holo3d-wanted">
          <AurebeshWanted className="neon-svg" />
        </div>
        <p className={`holo3d-bounty font-mono ${textIn ? "is-in" : ""}`}>
          <span className="neon-red block">
            <span className="block text-4xl font-semibold tracking-[0.08em] sm:text-5xl">
              {h.bounty.amount}
            </span>
            <span className="mt-1.5 block text-[0.7rem] uppercase tracking-[0.24em]">
              {h.bounty.unit}
            </span>
          </span>
        </p>
      </div>

      <div className="holo3d-controls">
        {motion ? (
          <button
            type="button"
            onClick={replay}
            className="holo3d-replay"
            aria-label="Replay hologram activation"
          >
            <span aria-hidden className="text-amber-dim">[ </span>
            replay
            <span aria-hidden className="text-amber-dim"> ]</span>
          </button>
        ) : null}
        {h.portraitIsPlaceholder && h.portraitCredit ? (
          <p className="holo3d-credit">{h.portraitCredit}</p>
        ) : null}
      </div>
    </div>
  );
}
