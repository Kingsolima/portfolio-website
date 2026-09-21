import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  /** ISO date string, YYYY-MM-DD. */
  date: string;
  summary: string;
  tags: string[];
  draft: boolean;
};

export type Post = PostMeta & {
  /** Raw MDX body with the frontmatter stripped. */
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function loadPost(filename: string): Post {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  if (typeof data.title !== "string" || typeof data.date !== "string") {
    throw new Error(
      `content/blog/${filename}: frontmatter needs at least "title" and "date".`,
    );
  }

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: typeof data.summary === "string" ? data.summary : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    content,
  };
}

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(loadPost)
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Previous (older) and next (newer) posts relative to `slug`. */
export function getAdjacentPosts(slug: string): {
  older?: PostMeta;
  newer?: PostMeta;
} {
  const posts = getAllPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  return {
    newer: i > 0 ? posts[i - 1] : undefined,
    older: i >= 0 && i < posts.length - 1 ? posts[i + 1] : undefined,
  };
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-09-21" -> "21 Sep 2026". Fixed format so it never depends on locale. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}
