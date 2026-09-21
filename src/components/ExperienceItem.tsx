import type { Experience } from "@content/site";
import { HudPanel } from "./HudPanel";
import { TagList } from "./Tag";

export function ExperienceItem({
  item,
  index,
  compact = false,
  headingLevel: Heading = "h3",
}: {
  item: Experience;
  index: number;
  /** Tighter variant for the resume page. */
  compact?: boolean;
  /** h2 when the item sits directly under a page h1; h3 inside a section. */
  headingLevel?: "h2" | "h3";
}) {
  const period = `${item.start} — ${item.end ?? "Present"}`;
  return (
    <li className="relative pl-8 sm:pl-10">
      {/* Timeline rail marker */}
      <span
        aria-hidden
        className="absolute top-6 left-0 flex h-3 w-3 items-center justify-center"
      >
        <span
          className={`h-2 w-2 rotate-45 border ${
            item.end === null ? "border-teal bg-teal/30" : "border-amber-dim bg-void"
          }`}
        />
      </span>

      <HudPanel as="article" className={compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="hud-label">
            <span aria-hidden>[ </span>
            {String(index + 1).padStart(2, "0")}
            <span aria-hidden> ]</span>
          </span>
          <span
            className={`font-mono text-xs tracking-[0.08em] ${
              item.end === null ? "text-teal" : "text-muted"
            }`}
          >
            {period}
          </span>
        </div>

        <Heading className="mt-3 text-lg font-semibold tracking-tight">
          {item.role}
        </Heading>
        <p className="mt-0.5 text-sm text-muted">
          {item.company}
          {item.location ? (
            <>
              <span aria-hidden className="mx-2 text-line-strong">
                ·
              </span>
              {item.location}
            </>
          ) : null}
        </p>

        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg/90">
          {item.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span aria-hidden className="mt-[0.15rem] font-mono text-amber-dim">
                &gt;
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {item.tags && item.tags.length > 0 ? (
          <TagList tags={item.tags} className="mt-5" />
        ) : null}
      </HudPanel>
    </li>
  );
}
