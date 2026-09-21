import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "ghost";

type Props = {
  href: string;
  variant?: Variant;
  /** Force a plain <a> (downloads, mailto, external). Auto-detected for http/mailto. */
  external?: boolean;
  download?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

const base =
  "group inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-200";

const variants: Record<Variant, string> = {
  primary:
    "border-amber bg-amber text-void hover:bg-transparent hover:text-amber",
  ghost:
    "border-line-strong text-fg hover:border-amber hover:text-amber",
};

/** `[ LABEL ]` button. Brackets are decorative and hidden from screen readers. */
export function HudButton({
  href,
  variant = "ghost",
  external,
  download,
  className = "",
  children,
  ...rest
}: Props) {
  const isExternal =
    external ?? (/^(https?:|mailto:)/.test(href) || download === true);
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      <span aria-hidden className="opacity-60 transition-opacity group-hover:opacity-100">
        [
      </span>
      <span>{children}</span>
      <span aria-hidden className="opacity-60 transition-opacity group-hover:opacity-100">
        ]
      </span>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={cls}
        download={download}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}
