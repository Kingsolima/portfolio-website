import type { ReactNode } from "react";

export type TelemetryRow = {
  key: string;
  value: ReactNode;
  /** Highlight the value (e.g. STATUS in teal). */
  tone?: "default" | "teal" | "amber";
};

const toneClass = {
  default: "text-fg",
  teal: "text-teal",
  amber: "text-amber",
} as const;

/** `> KEY:   VALUE` readout rows, the core HUD motif. */
export function Telemetry({
  rows,
  className = "",
}: {
  rows: TelemetryRow[];
  className?: string;
}) {
  return (
    <dl
      className={`grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-sm ${className}`}
    >
      {rows.map((row) => (
        <div key={row.key} className="contents">
          <dt className="whitespace-nowrap text-muted">
            <span aria-hidden className="mr-2 text-amber-dim">
              &gt;
            </span>
            <span className="uppercase tracking-[0.14em]">{row.key}:</span>
          </dt>
          <dd className={toneClass[row.tone ?? "default"]}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
