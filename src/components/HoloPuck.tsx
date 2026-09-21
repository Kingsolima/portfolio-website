import Image from "next/image";
import { site } from "@content/site";
import { AurebeshWanted } from "./AurebeshWanted";

/**
 * CSS-only bounty puck hologram. This is the no-WebGL / no-JS fallback and
 * the first paint underneath the three.js scene while it loads.
 * `bare` drops the wrapper role and text overlays (the 3D wrapper supplies
 * its own) and renders just the visual.
 */
export function HoloPuck({ bare = false }: { bare?: boolean }) {
  const h = site.hologram;
  const label = `Bounty puck projecting a hologram of ${site.name}. ${h.wanted}. Bounty: ${h.bounty.amount} ${h.bounty.unit}.`;

  const bust = h.portrait ? (
    <Image
      src={h.portrait}
      alt=""
      fill
      sizes="(min-width: 1024px) 300px, 260px"
      priority
    />
  ) : (
    <ArmoredBust />
  );

  return (
    <div
      className="holo-stage"
      {...(bare ? {} : { role: "img", "aria-label": label })}
    >
      <div aria-hidden className="holo-ambient" />
      <div aria-hidden className="holo-shadow" />
      <div aria-hidden className="puck-side" />
      <div aria-hidden className="puck-top" />
      <div aria-hidden className="holo-cone" />

      <div aria-hidden className="holo-bust">
        {bust}
      </div>
      <div aria-hidden className="holo-bust holo-glitch">
        {bust}
      </div>

      {bare ? null : (
        <>
          <p aria-hidden className="holo-bounty neon-red font-mono">
            <span className="block text-4xl font-semibold tracking-[0.08em] sm:text-5xl">
              {h.bounty.amount}
            </span>
            <span className="mt-1.5 block text-[0.7rem] uppercase tracking-[0.24em]">
              {h.bounty.unit}
            </span>
          </p>
          <AurebeshWanted className="holo-wanted neon-svg" />
          {h.portraitIsPlaceholder && h.portraitCredit ? (
            <p className="holo3d-credit holo-credit-css">{h.portraitCredit}</p>
          ) : null}
        </>
      )}
    </div>
  );
}

/** Placeholder projection: helmet, pauldrons, chest plate. Used when no portrait is set. */
function ArmoredBust() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 240"
      className="text-teal"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path
        d="M14 240c6-46 34-70 86-70s80 24 86 70z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path
        d="M22 176l34-22 26 14-10 32-42 8z"
        fill="currentColor"
        fillOpacity="0.32"
      />
      <path
        d="M178 176l-34-22-26 14 10 32 42 8z"
        fill="currentColor"
        fillOpacity="0.32"
      />
      <path
        d="M76 160h48l6 30-30 12-30-12z"
        fill="currentColor"
        fillOpacity="0.28"
      />
      <path d="M100 160v42" strokeOpacity="0.7" />
      <path d="M84 176h32" strokeOpacity="0.5" />
      <path d="M86 128h28v26H86z" fill="currentColor" fillOpacity="0.2" />
      <path
        d="M52 78c0-30 21-52 48-52s48 22 48 52v30c0 16-10 26-24 31l-24 8-24-8c-14-5-24-15-24-31z"
        fill="currentColor"
        fillOpacity="0.22"
      />
      <path d="M52 100l-8 18v20l14 8M148 100l8 18v20l-14 8" strokeOpacity="0.7" />
      <path
        d="M62 68h76v14H110v40H90V82H62z"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="none"
      />
      <path d="M58 62h84" strokeOpacity="0.6" />
    </svg>
  );
}
