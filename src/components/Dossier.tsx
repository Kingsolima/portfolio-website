import Image from "next/image";
import { site } from "@content/site";
import { HudPanel } from "./HudPanel";
import { TagList } from "./Tag";

/**
 * Bounty Guild dossier: the hero's "who is this" card. Rendered as a teal
 * hologram so it reads as a projection sitting inside the amber HUD.
 */
export function Dossier() {
  const d = site.dossier;
  const rows: { key: string; value: string; tone?: "teal" }[] = [
    { key: "Name", value: site.name },
    { key: "Rank", value: site.role },
    { key: "Sector", value: site.location },
    { key: "Status", value: site.status, tone: "teal" },
    { key: "Chain", value: d.chainCode },
  ];

  return (
    <HudPanel
      as="aside"
      aria-label="Guild dossier"
      className="holo p-5 sm:p-6"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em]">
        <span className="text-teal">
          <span aria-hidden className="animate-pulse-soft">◈ </span>
          Guild dossier
        </span>
        <span className="text-muted">Puck {d.puck}</span>
      </div>

      {/* Portrait + ident */}
      <div className="mt-5 grid grid-cols-[104px_1fr] gap-5 sm:grid-cols-[124px_1fr]">
        <div className="holo-portrait aspect-[4/5] border border-teal/40">
          {d.portrait ? (
            <Image
              src={d.portrait}
              alt={`Portrait of ${site.name}`}
              fill
              sizes="124px"
              className="object-cover opacity-90 mix-blend-luminosity"
            />
          ) : (
            <HelmetSilhouette />
          )}
          <span
            aria-hidden
            className="absolute bottom-1.5 left-1.5 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-teal/80"
          >
            Holo
          </span>
        </div>

        <dl className="grid content-start gap-y-2 font-mono text-xs">
          {rows.map((r) => (
            <div key={r.key} className="grid grid-cols-[3.6rem_1fr] gap-x-3">
              <dt className="uppercase tracking-[0.14em] text-teal/70">{r.key}</dt>
              <dd
                className={`min-w-0 break-words ${
                  r.tone === "teal" ? "text-teal" : "text-fg"
                }`}
              >
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Bounty */}
      <div className="mt-5 border-t border-teal/20 pt-4">
        <p className="hud-label text-teal">Bounty</p>
        <p className="mt-1.5 text-sm leading-relaxed text-fg/90">{d.bounty}</p>
      </div>

      <TagList tags={d.specialties} className="mt-4" />
    </HudPanel>
  );
}

/** Placeholder portrait: helmet outline drawn in teal projection lines. */
function HelmetSilhouette() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 80"
      className="absolute inset-0 h-full w-full p-3 text-teal"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      {/* Dome */}
      <path
        d="M12 36c0-13 9-23 20-23s20 10 20 23v12c0 7-5 12-11 14l-9 3-9-3c-6-2-11-7-11-14z"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* T-visor */}
      <path
        d="M17 33h30v6H36v18h-8V39H17z"
        fill="currentColor"
        fillOpacity="0.55"
        stroke="none"
      />
      {/* Cheek plates */}
      <path d="M12 44l-3 8v10l7 4M52 44l3 8v10l-7 4" strokeOpacity="0.6" />
      {/* Shoulders */}
      <path d="M6 78c4-8 12-12 26-12s22 4 26 12" strokeOpacity="0.5" />
    </svg>
  );
}
