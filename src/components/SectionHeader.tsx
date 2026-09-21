import type { ReactNode } from "react";

type Props = {
  /** Two-digit section index, e.g. "02". */
  index: string;
  /** Uppercase mono label, e.g. "PROJECTS". */
  label: string;
  title: string;
  description?: string;
  /** Rendered to the right of the title on wide screens (e.g. a button). */
  aside?: ReactNode;
  /** Use h2 when the header sits inside a page (home sections). */
  level?: "h1" | "h2";
  className?: string;
};

/** `// 02 · PROJECTS` eyebrow + title. Every page and home section uses this. */
export function SectionHeader({
  index,
  label,
  title,
  description,
  aside,
  level = "h1",
  className = "",
}: Props) {
  const Heading = level;
  return (
    <header className={`mb-10 ${className}`}>
      <p className="hud-label text-amber">
        <span aria-hidden>{"// "}</span>
        {index}
        <span aria-hidden className="mx-2 text-line-strong">
          ·
        </span>
        {label}
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Heading
          className={
            level === "h1"
              ? "text-3xl font-semibold tracking-tight sm:text-4xl"
              : "text-2xl font-semibold tracking-tight sm:text-3xl"
          }
        >
          {title}
        </Heading>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </header>
  );
}
