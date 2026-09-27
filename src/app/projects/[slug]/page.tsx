import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@content/site";
import {
  getAdjacentProjects,
  getAllProjects,
  getProjectBySlug,
  isTodo,
  type Project,
} from "@/lib/projects";
import { renderMdx } from "@/lib/mdx";
import { HudButton } from "@/components/HudButton";
import { HudPanel } from "@/components/HudPanel";
import { TagList } from "@/components/Tag";

// Static export: every project is pre-rendered at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      authors: [site.name],
    },
  };
}

/**
 * One label/value pair in the header. Values still holding a `[TODO: …]`
 * marker render in amber with a dashed rule, so an unfinished page is
 * obvious on sight rather than shipping quietly.
 */
function Fact({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  const todo = isTodo(value);
  return (
    <div>
      <dt className="hud-label text-amber-dim">{label}</dt>
      <dd
        className={`mt-1.5 text-sm leading-relaxed ${
          todo
            ? "border-b border-dashed border-amber/50 pb-0.5 font-mono text-xs text-amber"
            : "text-fg/90"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function StatusPill({ status }: { status: Project["status"] }) {
  const ongoing = status === "ongoing";
  return (
    <span
      className={`hud-label inline-flex items-center gap-2 border px-2.5 py-1 ${
        ongoing ? "border-teal/60 text-teal" : "border-line-strong text-muted"
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rotate-45 ${
          ongoing ? "bg-teal" : "bg-line-strong"
        }`}
      />
      {ongoing ? "Ongoing" : "Complete"}
    </span>
  );
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const body = await renderMdx(project.content);
  const { prev, next } = getAdjacentProjects(slug);
  const { links } = project;

  return (
    <article className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-20">
      <header className="mb-10 border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="hud-label text-amber">
            <span aria-hidden>{"// "}</span>
            Project dossier
          </p>
          <StatusPill status={project.status} />
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          {project.summary}
        </p>

        {project.confidential ? (
          <HudPanel className="mt-6 border-amber/40 p-4">
            <p className="hud-label text-amber">Client work</p>
            <p className="mt-2 text-sm leading-relaxed text-fg/90">
              {project.client}. No code or repository is published. This page
              describes the design only.
            </p>
          </HudPanel>
        ) : null}

        {project.metric ? (
          <HudPanel className="mt-6 p-5">
            <p className="font-mono text-3xl tracking-tight text-amber sm:text-4xl">
              {project.metric.value}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.metric.label}
            </p>
          </HudPanel>
        ) : null}

        <dl className="mt-6 grid gap-5 sm:grid-cols-3">
          <Fact label="My role" value={project.role} />
          <Fact label="Team" value={project.team} />
          <Fact label="When" value={project.dates} />
        </dl>

        <TagList tags={project.tags} className="mt-6" />

        {links.repo || links.demo || links.evals ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {links.demo ? (
              <HudButton href={links.demo} variant="primary">
                Live demo
              </HudButton>
            ) : null}
            {links.repo ? <HudButton href={links.repo}>Source</HudButton> : null}
            {links.evals ? (
              <HudButton href={links.evals}>Full evaluation</HudButton>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="prose-hud">{body}</div>

      <nav
        aria-label="Adjacent projects"
        className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
      >
        <div>
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group block font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-amber"
            >
              <span aria-hidden>← </span>Previous
              <span className="mt-1 block font-sans text-sm normal-case tracking-normal text-fg group-hover:text-amber">
                {prev.title}
              </span>
            </Link>
          ) : null}
        </div>
        <div className="sm:text-right">
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group block font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-amber"
            >
              Next<span aria-hidden> →</span>
              <span className="mt-1 block font-sans text-sm normal-case tracking-normal text-fg group-hover:text-amber">
                {next.title}
              </span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
