import Image from "next/image";
import { site } from "@content/site";

/**
 * Bounty puck hologram: a lit metal disc on the table projecting the
 * portrait upward, red neon Aurebesh above, red neon bounty below.
 * Falls back to an armored bust until `site.hologram.portrait` is set.
 */
export function HoloPuck() {
  const h = site.hologram;
  const label = `Bounty puck projecting a hologram of ${site.name}. ${h.wanted}. Bounty: ${h.bounty.amount} ${h.bounty.unit}.`;

  const bust = h.portrait ? (
    <Image
      src={h.portrait}
      alt=""
      fill
      sizes="(min-width: 768px) 300px, 260px"
      priority
    />
  ) : (
    <ArmoredBust />
  );

  return (
    <div className="holo-stage" role="img" aria-label={label}>
      <div aria-hidden className="holo-ambient" />
      <div aria-hidden className="holo-shadow" />
      <div aria-hidden className="puck-side" />
      <div aria-hidden className="puck-top" />
      <div aria-hidden className="holo-cone" />

      <div aria-hidden className="holo-bust">
        {bust}
      </div>
      {/* Clipped duplicate that tears sideways occasionally */}
      <div aria-hidden className="holo-bust holo-glitch">
        {bust}
      </div>

      <p aria-hidden className="holo-bounty neon-red font-mono">
        <span className="block text-4xl font-semibold tracking-[0.08em] sm:text-5xl">
          {h.bounty.amount}
        </span>
        <span className="mt-1.5 block text-[0.7rem] uppercase tracking-[0.24em]">
          {h.bounty.unit}
        </span>
      </p>

      <AurebeshWanted className="holo-wanted neon-svg" />
    </div>
  );
}

/**
 * "WANTED" in Aurebesh, drawn by hand as strokes so there is no font to
 * license. Glyphs left to right: Wesk, Aurek, Nern, Trill, Esk, Dorn.
 */
function AurebeshWanted({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 56"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {/* Wesk (W) */}
      <polyline points="5,8 25,50 45,8" />
      <line x1="5" y1="8" x2="19" y2="8" />
      {/* Aurek (A) */}
      <polyline points="59,8 95,29 59,50 59,8" />
      {/* Nern (N) */}
      <polyline points="105,50 105,8 145,8 145,32" />
      {/* Trill (T) */}
      <line x1="155" y1="8" x2="195" y2="8" />
      <line x1="175" y1="8" x2="175" y2="50" />
      <line x1="175" y1="50" x2="189" y2="38" />
      {/* Esk (E) */}
      <polyline points="245,8 205,8 205,50" />
      <line x1="205" y1="29" x2="231" y2="50" />
      {/* Dorn (D) */}
      <polyline points="255,8 255,50 295,50 295,28 255,8" />
    </svg>
  );
}

/** Placeholder projection: helmet, pauldrons, chest plate. Replaced by the portrait. */
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
      {/* Cape / shoulders mass */}
      <path
        d="M14 240c6-46 34-70 86-70s80 24 86 70z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      {/* Pauldrons */}
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
      {/* Chest plates */}
      <path
        d="M76 160h48l6 30-30 12-30-12z"
        fill="currentColor"
        fillOpacity="0.28"
      />
      <path d="M100 160v42" strokeOpacity="0.7" />
      <path d="M84 176h32" strokeOpacity="0.5" />
      {/* Neck */}
      <path d="M86 128h28v26H86z" fill="currentColor" fillOpacity="0.2" />
      {/* Helmet dome */}
      <path
        d="M52 78c0-30 21-52 48-52s48 22 48 52v30c0 16-10 26-24 31l-24 8-24-8c-14-5-24-15-24-31z"
        fill="currentColor"
        fillOpacity="0.22"
      />
      {/* Cheek plates */}
      <path d="M52 100l-8 18v20l14 8M148 100l8 18v20l-14 8" strokeOpacity="0.7" />
      {/* T-visor */}
      <path
        d="M62 68h76v14H110v40H90V82H62z"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="none"
      />
      {/* Brow ridge */}
      <path d="M58 62h84" strokeOpacity="0.6" />
    </svg>
  );
}
