import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { HudPanel } from "./HudPanel";
import { TagList } from "./Tag";

export function ProjectCard({
  project,
  index,
  headingLevel: Heading = "h3",
}: {
  project: ProjectMeta;
  index: number;
  /** h2 when the card sits directly under a page h1; h3 inside a section. */
  headingLevel?: "h2" | "h3";
}) {
  return (
    <HudPanel as="article" interactive className="flex h-full flex-col p-5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="hud-label">
          <span aria-hidden>[ </span>
          {String(index + 1).padStart(3, "0")}
          <span aria-hidden> ]</span>
        </span>
        <span
          className={`hud-label ${
            project.status === "ongoing" ? "text-teal" : "text-amber-dim"
          }`}
        >
          {project.status === "ongoing" ? "Ongoing" : "Project"}
        </span>
      </div>

      <Heading className="mt-4 text-lg font-semibold tracking-tight">
        <Link
          href={`/projects/${project.slug}`}
          className="after:absolute after:inset-0 hover:text-amber"
        >
          {project.title}
        </Link>
      </Heading>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {project.summary}
      </p>

      {project.metric ? (
        <p className="mt-4 border-t border-line pt-4">
          <span className="block font-mono text-xl tracking-tight text-amber">
            {project.metric.value}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-muted">
            {project.metric.label}
          </span>
        </p>
      ) : null}

      <TagList tags={project.tags} className="mt-5" />

      <span className="hud-label mt-5 border-t border-line pt-4 text-muted">
        Read the dossier <span aria-hidden>→</span>
      </span>
    </HudPanel>
  );
}
