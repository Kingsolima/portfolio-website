import type { Metadata } from "next";
import { site } from "@content/site";
import { ExperienceItem } from "@/components/ExperienceItem";
import { HudButton } from "@/components/HudButton";
import { HudPanel } from "@/components/HudPanel";
import { SectionHeader } from "@/components/SectionHeader";
import { TagList } from "@/components/Tag";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name}, ${site.role}.`,
};

function SubHeading({ index, children }: { index: string; children: string }) {
  return (
    <h2 className="hud-label mb-5 flex items-center gap-3 text-amber">
      <span>
        <span aria-hidden>{"// "}</span>
        {index}
      </span>
      <span className="text-fg">{children}</span>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </h2>
  );
}

export default function ResumePage() {
  const { resume } = site;
  return (
    <div className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-20">
      <SectionHeader
        index="04"
        label="Resume"
        title={site.name}
        description={`${site.role} · ${site.location}`}
        aside={
          <HudButton href={resume.pdf} variant="primary" download className="no-print">
            Download PDF ↓
          </HudButton>
        }
      />

      <div className="space-y-14">
        <section aria-labelledby="summary">
          <SubHeading index="01">Summary</SubHeading>
          <p className="text-base leading-relaxed text-fg/90 sm:text-lg">
            {resume.summary}
          </p>
        </section>

        <section aria-labelledby="experience">
          <SubHeading index="02">Experience</SubHeading>
          <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line">
            {site.experience.map((item, i) => (
              <ExperienceItem
                key={`${item.company}-${item.role}`}
                item={item}
                index={i}
                compact
              />
            ))}
          </ol>
        </section>

        <section aria-labelledby="skills">
          <SubHeading index="03">Skills</SubHeading>
          <div className="grid gap-4 sm:grid-cols-3">
            {resume.skills.map((g) => (
              <HudPanel key={g.group} className="p-4">
                <p className="hud-label text-amber-dim">{g.group}</p>
                <TagList tags={g.items} className="mt-3" />
              </HudPanel>
            ))}
          </div>
        </section>

        <section aria-labelledby="education">
          <SubHeading index="04">Education</SubHeading>
          <ul className="space-y-4">
            {resume.education.map((e) => (
              <HudPanel as="li" key={e.school} className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-semibold tracking-tight">{e.degree}</h3>
                  <span className="font-mono text-xs tracking-[0.08em] text-muted">
                    {e.years}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{e.school}</p>
                {e.notes ? (
                  <p className="mt-3 text-sm leading-relaxed text-fg/80">{e.notes}</p>
                ) : null}
              </HudPanel>
            ))}
          </ul>
        </section>

        {resume.certifications.length > 0 ? (
          <section aria-labelledby="certs">
            <SubHeading index="05">Certifications & awards</SubHeading>
            <ul className="space-y-2 text-sm leading-relaxed text-fg/90">
              {resume.certifications.map((c) => (
                <li key={c} className="flex gap-3">
                  <span aria-hidden className="font-mono text-amber-dim">
                    &gt;
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
