"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@content/site";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/resume", label: "Resume" },
  { href: "/socials", label: "Socials" },
  { href: "/blog", label: "Blog" },
] as const;

function normalize(p: string) {
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

function isActive(pathname: string, href: string) {
  const p = normalize(pathname);
  if (href === "/") return p === "/";
  return p === href || p.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav
      aria-label="Primary"
      className="no-print sticky top-0 z-40 border-b border-line bg-void/85 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Mark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-fg hover:text-amber"
        >
          <VisorMark />
          <span>{site.handle}</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] whitespace-nowrap transition-colors ${
                    active ? "text-amber" : "text-muted hover:text-fg"
                  }`}
                >
                  {l.label}
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-[13px] h-px bg-amber"
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Status pill + mobile toggle */}
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 border border-line px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] whitespace-nowrap text-teal sm:inline-flex md:hidden lg:inline-flex">
            <span aria-hidden className="animate-pulse-soft">◈</span>
            {site.status}
          </span>
          <button
            type="button"
            className="font-mono text-xs uppercase tracking-[0.14em] text-fg hover:text-amber md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="text-amber-dim">[ </span>
            {open ? "Close" : "Menu"}
            <span aria-hidden className="text-amber-dim"> ]</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-void md:hidden"
      >
        <ul className="mx-auto max-w-5xl px-4 py-2 sm:px-6">
          {NAV_LINKS.map((l, i) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 py-3 font-mono text-sm uppercase tracking-[0.14em] ${
                    active ? "text-amber" : "text-muted"
                  }`}
                >
                  <span aria-hidden className="text-xs text-amber-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/** Tiny helmet + T-visor glyph. */
function VisorMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className="shrink-0"
    >
      <path
        d="M5 10.5C5 6.4 8.1 3.5 12 3.5s7 2.9 7 7v3.4c0 2.3-1.5 3.8-3.4 4.5L12 19.5l-3.6-1.1C6.5 17.7 5 16.2 5 13.9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="text-line-strong"
      />
      <path d="M7 9.5h10v1.8h-3.9V17h-2.2v-5.7H7z" fill="#ffb03a" />
    </svg>
  );
}
