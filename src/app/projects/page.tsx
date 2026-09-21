import type { Metadata } from "next";
import { site } from "@content/site";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Projects",
  description: `Things ${site.name} has built.`,
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 sm:pt-20">
      <SectionHeader
        index="02"
        label="Projects"
        title="Things I've built"
        description="Side projects, experiments, and the occasional thing that turned out to be useful. Source is linked where it's public."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {site.projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} headingLevel="h2" />
        ))}
      </div>
    </div>
  );
}
