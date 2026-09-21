import type { Metadata } from "next";
import { site } from "@content/site";
import { getAllPosts } from "@/lib/blog";
import { HudPanel } from "@/components/HudPanel";
import { PostCard } from "@/components/PostCard";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Blog",
  description: `Writing by ${site.name} on engineering, side projects, and the occasional Star Wars tangent.`,
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-20">
      <SectionHeader
        index="06"
        label="Transmission log"
        title="Blog"
        description="Notes on building things, what I learned the hard way, and the occasional Star Wars tangent."
      />
      {posts.length === 0 ? (
        <HudPanel className="p-8 text-center">
          <p className="hud-label text-amber-dim">No transmissions yet</p>
          <p className="mt-2 text-sm text-muted">
            Add an <code className="font-mono text-amber">.mdx</code> file to{" "}
            <code className="font-mono text-amber">content/blog/</code> to publish
            the first one.
          </p>
        </HudPanel>
      ) : (
        <div className="grid gap-4">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} headingLevel="h2" />
          ))}
        </div>
      )}
    </div>
  );
}
