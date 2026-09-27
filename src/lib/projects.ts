import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ProjectStatus = "complete" | "ongoing";

/** The headline number on the index card and the page header. */
export type ProjectMetric = {
  value: string;
  label: string;
};

export type ProjectLinks = {
  repo?: string;
  demo?: string;
  evals?: string;
};

export type ProjectMeta = {
  slug: string;
  title: string;
  /** One or two sentences. Feeds the card and the <meta description>. */
  summary: string;
  /** What you personally did, as opposed to what the team did. */
  role: string;
  team: string;
  /** Free text, e.g. "Mar 2026". */
  dates: string;
  status: ProjectStatus;
  featured: boolean;
  /** Ascending. Lowest first on the index. */
  order: number;
  tags: string[];
  stack: string[];
  metric?: ProjectMetric;
  links: ProjectLinks;
  /** Set on client work. Rendered as a notice on the page. */
  client?: string;
  confidential: boolean;
  /** Drafts are excluded from the build entirely. */
  draft: boolean;
};

export type Project = ProjectMeta & {
  /** Raw MDX body with the frontmatter stripped. */
  content: string;
};

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

function loadProject(filename: string): Project {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = readFileSync(path.join(PROJECTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  if (typeof data.title !== "string" || typeof data.summary !== "string") {
    throw new Error(
      `content/projects/${filename}: frontmatter needs at least "title" and "summary".`,
    );
  }

  const metric =
    data.metric && typeof data.metric === "object"
      ? {
          value: str((data.metric as Record<string, unknown>).value),
          label: str((data.metric as Record<string, unknown>).label),
        }
      : undefined;

  const rawLinks = (data.links ?? {}) as Record<string, unknown>;

  return {
    slug,
    title: data.title,
    summary: data.summary,
    role: str(data.role),
    team: str(data.team),
    dates: str(data.dates),
    status: data.status === "ongoing" ? "ongoing" : "complete",
    featured: data.featured === true,
    order: typeof data.order === "number" ? data.order : 999,
    tags: strArray(data.tags),
    stack: strArray(data.stack),
    metric: metric && metric.value ? metric : undefined,
    links: {
      repo: str(rawLinks.repo) || undefined,
      demo: str(rawLinks.demo) || undefined,
      evals: str(rawLinks.evals) || undefined,
    },
    client: str(data.client) || undefined,
    confidential: data.confidential === true,
    draft: data.draft === true,
    content,
  };
}

/** All published projects, in `order`. Drafts never reach the build. */
export function getAllProjects(): Project[] {
  return readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(loadProject)
    .filter((p) => !p.draft)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

/** Previous and next project relative to `slug`, in index order. */
export function getAdjacentProjects(slug: string): {
  prev?: ProjectMeta;
  next?: ProjectMeta;
} {
  const projects = getAllProjects();
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}

/**
 * True when a frontmatter field is still an unfilled `[TODO: ...]` marker.
 * The page renders these visibly so they cannot quietly ship.
 */
export function isTodo(value: string): boolean {
  return /\[TODO\b/i.test(value);
}
