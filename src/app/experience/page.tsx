import type { Metadata } from "next";
import { site } from "@content/site";
import { ExperienceItem } from "@/components/ExperienceItem";
import { HudButton } from "@/components/HudButton";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Experience",
  description: `Where ${site.name} has worked and what they did there.`,
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-20">
      <SectionHeader
        index="03"
        label="Service record"
        title="Experience"
        description="Roles, in reverse chronological order. The full version lives on the resume page."
        aside={<HudButton href="/resume">Full resume</HudButton>}
      />
      <ol className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line">
        {site.experience.map((item, i) => (
          <ExperienceItem
            key={`${item.company}-${item.role}`}
            item={item}
            index={i}
            headingLevel="h2"
          />
        ))}
      </ol>
    </div>
  );
}
