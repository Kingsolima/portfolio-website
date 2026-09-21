import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@content/site";
import {
  formatDate,
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
} from "@/lib/blog";
import { renderMdx } from "@/lib/mdx";
import { TagList } from "@/components/Tag";

// Static export: every post is pre-rendered at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      authors: [site.name],
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const body = await renderMdx(post.content);
  const { older, newer } = getAdjacentPosts(slug);

  return (
    <article className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-20">
      <header className="mb-10 border-b border-line pb-8">
        <p className="hud-label text-amber">
          <span aria-hidden>{"// "}</span>
          Transmission
          <span aria-hidden className="mx-2 text-line-strong">
            ·
          </span>
          <time dateTime={post.date} className="text-muted normal-case tracking-[0.08em]">
            {formatDate(post.date)}
          </time>
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        {post.summary ? (
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.summary}</p>
        ) : null}
        <TagList tags={post.tags} className="mt-5" />
      </header>

      <div className="prose-hud">{body}</div>

      <nav
        aria-label="Adjacent posts"
        className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
      >
        <div>
          {older ? (
            <Link
              href={`/blog/${older.slug}`}
              className="group block font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-amber"
            >
              <span aria-hidden>← </span>Older
              <span className="mt-1 block font-sans text-sm normal-case tracking-normal text-fg group-hover:text-amber">
                {older.title}
              </span>
            </Link>
          ) : null}
        </div>
        <div className="sm:text-right">
          {newer ? (
            <Link
              href={`/blog/${newer.slug}`}
              className="group block font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-amber"
            >
              Newer<span aria-hidden> →</span>
              <span className="mt-1 block font-sans text-sm normal-case tracking-normal text-fg group-hover:text-amber">
                {newer.title}
              </span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
