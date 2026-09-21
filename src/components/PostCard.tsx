import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/blog";
import { HudPanel } from "./HudPanel";
import { TagList } from "./Tag";

export function PostCard({
  post,
  headingLevel: Heading = "h3",
}: {
  post: PostMeta;
  /** h2 when the card sits directly under a page h1; h3 inside a section. */
  headingLevel?: "h2" | "h3";
}) {
  return (
    <HudPanel as="article" interactive className="p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <time
          dateTime={post.date}
          className="font-mono text-xs tracking-[0.08em] text-muted"
        >
          {formatDate(post.date)}
        </time>
        <span className="hud-label text-amber-dim">Transmission</span>
      </div>
      <Heading className="mt-3 text-lg font-semibold tracking-tight sm:text-xl">
        <Link
          href={`/blog/${post.slug}`}
          className="after:absolute after:inset-0 hover:text-amber"
        >
          {post.title}
        </Link>
      </Heading>
      {post.summary ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{post.summary}</p>
      ) : null}
      <TagList tags={post.tags} className="mt-4" />
    </HudPanel>
  );
}
