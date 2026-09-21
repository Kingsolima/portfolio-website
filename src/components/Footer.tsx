import Link from "next/link";
import { site } from "@content/site";

export function Footer() {
  return (
    <footer className="no-print mt-24 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
          <span aria-hidden className="text-amber-dim">{"// "}</span>
          This is the Way.
        </p>
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} {site.name}
          <span aria-hidden className="mx-2 text-line-strong">·</span>
          <Link href="/socials" className="hover:text-amber">
            comms
          </Link>
          <span aria-hidden className="mx-2 text-line-strong">·</span>
          <a
            href={site.resume.pdf}
            className="hover:text-amber"
            download
          >
            resume.pdf
          </a>
        </p>
      </div>
    </footer>
  );
}
