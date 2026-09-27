import type { Metadata } from "next";
import { site } from "@content/site";
import { getAllProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Projects",
  description: `Things ${site.name} has built.`,
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 sm:pt-20">
      <SectionHeader
        index="02"
        label="Projects"
        title="Things I've built"
        description="Each one has a write-up: the problem, the decisions that mattered, what the numbers say, and what they don't. Source is linked where it's public."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} headingLevel="h2" />
        ))}
      </div>
    </div>
  );
}
