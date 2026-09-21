import type { Project } from "@content/site";
import { HudPanel } from "./HudPanel";
import { TagList } from "./Tag";

export function ProjectCard({
  project,
  index,
  headingLevel: Heading = "h3",
}: {
  project: Project;
  index: number;
  /** h2 when the card sits directly under a page h1; h3 inside a section. */
  headingLevel?: "h2" | "h3";
}) {
  const primary = project.live ?? project.repo;
  return (
    <HudPanel as="article" interactive className="flex h-full flex-col p-5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="hud-label">
          <span aria-hidden>[ </span>
          {String(index + 1).padStart(3, "0")}
          <span aria-hidden> ]</span>
        </span>
        <span className="hud-label text-amber-dim">Project</span>
      </div>

      <Heading className="mt-4 text-lg font-semibold tracking-tight">
        {primary ? (
          <a
            href={primary}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0 hover:text-amber"
          >
            {project.title}
          </a>
        ) : (
          project.title
        )}
      </Heading>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {project.summary}
      </p>

      <TagList tags={project.tags} className="mt-5" />

      {(project.repo || project.live) && (
        <div className="relative mt-5 flex gap-4 border-t border-line pt-4 font-mono text-xs uppercase tracking-[0.14em]">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 text-muted hover:text-amber"
            >
              Source <span aria-hidden>↗</span>
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 text-teal hover:text-amber"
            >
              Live <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      )}
    </HudPanel>
  );
}
