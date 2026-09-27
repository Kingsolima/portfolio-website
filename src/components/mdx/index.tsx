import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

type Components = NonNullable<MDXRemoteProps["components"]>;

function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span aria-hidden className="ml-0.5 text-xs">
        ↗
      </span>
    </a>
  );
}

/**
 * The project write-ups lean on wide result tables. Squeezing five columns
 * into a phone makes them unreadable, so the table keeps a floor width and
 * scrolls sideways inside its own box instead of stretching the page.
 */
function Table({ children, ...rest }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table {...rest} className="min-w-[34rem]">
        {children}
      </table>
    </div>
  );
}

/**
 * Overrides applied to every MDX post. Typography itself is handled by the
 * `.prose-hud` styles in globals.css; these only change behaviour.
 */
export const mdxComponents: Components = {
  a: Anchor,
  table: Table,
};
