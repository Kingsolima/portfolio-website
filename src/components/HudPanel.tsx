import type { ComponentPropsWithoutRef, ElementType } from "react";

type HudPanelProps<T extends ElementType> = {
  /** Render as a different element, e.g. "li", "article", "a". */
  as?: T;
  /** Adds hover/focus glow. Use when the whole panel is a link or contains one. */
  interactive?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/**
 * The one card primitive: hairline border, panel fill, four amber corner
 * brackets. Every boxed thing on the site is one of these.
 */
export function HudPanel<T extends ElementType = "div">({
  as,
  interactive = false,
  className = "",
  children,
  ...rest
}: HudPanelProps<T>) {
  // Typed as "div" for JSX purposes: the real element is whatever `as` says,
  // but a generic ElementType would pull in every intrinsic element's props
  // (including three.js ones from R3F) and collapse `children` to never.
  const Tag = (as ?? "div") as "div";
  return (
    <Tag
      className={`hud-panel ${interactive ? "hud-panel-interactive" : ""} ${className}`}
      {...rest}
    >
      <span aria-hidden className="hud-corner hud-corner-tl" />
      <span aria-hidden className="hud-corner hud-corner-tr" />
      <span aria-hidden className="hud-corner hud-corner-bl" />
      <span aria-hidden className="hud-corner hud-corner-br" />
      {children}
    </Tag>
  );
}
