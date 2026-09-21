import type { Metadata } from "next";
import { site } from "@content/site";
import { HudPanel } from "@/components/HudPanel";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialIcon } from "@/components/SocialIcon";

export const metadata: Metadata = {
  title: "Socials",
  description: `Where to find ${site.name} online.`,
};

export default function SocialsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-20">
      <SectionHeader
        index="05"
        label="Comms channels"
        title="Find me"
        description="Fastest response is email. Everything else, I check when I remember to."
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {site.socials.map((s, i) => {
          const isMail = s.url.startsWith("mailto:");
          return (
            <HudPanel as="li" key={s.url} interactive className="p-5">
              <a
                href={s.url}
                {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className="flex items-center gap-4 after:absolute after:inset-0"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line-strong text-amber">
                  <SocialIcon kind={s.kind} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold tracking-tight">{s.label}</span>
                  <span className="block truncate font-mono text-xs text-muted">
                    {s.handle}
                  </span>
                </span>
                <span className="hud-label shrink-0">
                  <span aria-hidden>[ </span>
                  {String(i + 1).padStart(2, "0")}
                  <span aria-hidden> ]</span>
                </span>
              </a>
            </HudPanel>
          );
        })}
      </ul>
    </div>
  );
}
