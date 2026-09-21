/**
 * Activation timeline for the hologram, in seconds since activation.
 *
 *   standby        puck only, emitter pulses faintly
 *   activating     0.0 to 0.3   emitter flashes, beam expands upward
 *   materializing  0.3 to 1.1   bust assembles from horizontal slices
 *   revealing      1.1 to 2.2   scan line passes through, text resolves
 *   idle           2.2 onward   float, flicker, particles, rare tears
 */
export type Phase =
  | "standby"
  | "activating"
  | "materializing"
  | "revealing"
  | "idle";

export const T = {
  activate: 0.3,
  materialize: 1.1,
  reveal: 2.2,
} as const;

export function phaseAt(t: number | null): Phase {
  if (t === null) return "standby";
  if (t < T.activate) return "activating";
  if (t < T.materialize) return "materializing";
  if (t < T.reveal) return "revealing";
  return "idle";
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Normalised progress values the shaders and lights read every frame. */
export function progressAt(t: number | null) {
  if (t === null) {
    return { beam: 0, build: 0, scan: -1, flash: 0, idle: 0 };
  }
  return {
    /** Beam height / opacity, 0 to 1 over the activation flash. */
    beam: clamp01(t / T.activate),
    /** Slice assembly, 0 to 1 during materialization. */
    build: clamp01((t - T.activate) / (T.materialize - T.activate)),
    /** Scan line position, 0 (bottom) to 1 (top) during reveal; -1 = off. */
    scan:
      t >= T.materialize && t < T.reveal
        ? (t - T.materialize) / (T.reveal - T.materialize)
        : -1,
    /** Emitter flash, spikes at activation and decays. */
    flash: Math.max(0, 1 - t / 0.9),
    /** Seconds spent in idle, for slow ambient motion. */
    idle: Math.max(0, t - T.reveal),
  };
}

/** Values for a scene that must render finished and still (reduced motion). */
export const STILL = { beam: 1, build: 1, scan: -1, flash: 0, idle: 0 };
