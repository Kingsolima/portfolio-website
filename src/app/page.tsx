import Link from "next/link";
import { site } from "@content/site";
import { getAllPosts } from "@/lib/blog";
import { HudButton } from "@/components/HudButton";
import { HudPanel } from "@/components/HudPanel";
import { PostCard } from "@/components/PostCard";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { HoloPuck3D } from "@/components/HoloPuck3D";
import { Terminal } from "@/components/Terminal";

export default function Home() {
  const featured = site.projects.filter((p) => p.featured).slice(0, 3);
  const posts = getAllPosts().slice(0, 2);

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-line">
        {/* Visor layers: grid, helmet shading, edge ticks, scan sweep */}
        <div aria-hidden className="hud-grid absolute inset-0" />
        <div aria-hidden className="visor-shade" />
        <div aria-hidden className="visor-ticks" />
        <div aria-hidden className="visor-sweep" />

        <div className="relative mx-auto max-w-5xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16 sm:pb-28">
          {/* Visor readouts */}
          <div
            aria-hidden
            className="mb-10 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted"
          >
            <span>
              <span className="text-amber-dim">┌ </span>
              Tgt lock
            </span>
            <span className="hidden sm:inline">
              Rng 00.42
              <span className="mx-2 text-line-strong">·</span>
              Brg 117°
            </span>
            <span>
              Sys nominal
              <span className="text-amber-dim"> ┐</span>
            </span>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-[1fr_minmax(340px,440px)]">
            <div>
              <p className="hud-label text-amber">
                <span aria-hidden>{"// "}</span>
                00
                <span aria-hidden className="mx-2 text-line-strong">
                  ·
                </span>
                Ident confirmed
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
                {site.name}
              </h1>

              <div className="mt-6">
                <Terminal
                  user={site.terminal.user}
                  host={site.terminal.host}
                  session={site.terminal.session}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <HudButton href="/projects" variant="primary">
                  View projects
                </HudButton>
                <HudButton href={site.resume.pdf} download>
                  Resume ↓
                </HudButton>
              </div>
            </div>

            <HoloPuck3D />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-24 px-4 pt-20 sm:px-6">
        {/* -------------------------------------------------------------- */}
        {/* About                                                           */}
        {/* -------------------------------------------------------------- */}
        <Reveal>
          <section aria-labelledby="about-title">
            <SectionHeader
              level="h2"
              index="01"
              label="What drives me"
              title="Builder first. Fan a close second."
              className="mb-8"
            />
            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
              <div className="space-y-5 text-base leading-relaxed text-fg/90 sm:text-lg">
                {site.about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <HudPanel className="self-start p-5">
                <p className="hud-label text-amber-dim">Creed</p>
                <ul className="mt-3 space-y-2 font-mono text-sm text-fg/90">
                  <li>&gt; Ship it, then make it better.</li>
                  <li>&gt; Boring tech, interesting problems.</li>
                  <li>&gt; Weapons are part of my religion.*</li>
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  *Keyboard, terminal, debugger.
                </p>
              </HudPanel>
            </div>
          </section>
        </Reveal>

        {/* -------------------------------------------------------------- */}
        {/* Hobbies                                                         */}
        {/* -------------------------------------------------------------- */}
        <Reveal>
          <section aria-labelledby="hobbies-title">
            <SectionHeader
              level="h2"
              index="02"
              label="Off-duty"
              title="When the helmet comes off"
              className="mb-8"
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {site.hobbies.map((h, i) => (
                <HudPanel as="li" key={h.name} className="p-5">
                  <span className="hud-label">
                    <span aria-hidden>[ </span>
                    {String(i + 1).padStart(2, "0")}
                    <span aria-hidden> ]</span>
                  </span>
                  <h3 className="mt-3 font-semibold tracking-tight">{h.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {h.blurb}
                  </p>
                </HudPanel>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* -------------------------------------------------------------- */}
        {/* Featured projects                                               */}
        {/* -------------------------------------------------------------- */}
        <Reveal>
          <section aria-labelledby="work-title">
            <SectionHeader
              level="h2"
              index="03"
              label="Featured work"
              title="Selected projects"
              className="mb-8"
              aside={<HudButton href="/projects">All projects</HudButton>}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {featured.map((p, i) => (
                <ProjectCard key={p.title} project={p} index={i} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* -------------------------------------------------------------- */}
        {/* Latest posts                                                    */}
        {/* -------------------------------------------------------------- */}
        {posts.length > 0 ? (
          <Reveal>
            <section aria-labelledby="posts-title">
              <SectionHeader
                level="h2"
                index="04"
                label="Latest transmissions"
                title="From the blog"
                className="mb-8"
                aside={<HudButton href="/blog">All posts</HudButton>}
              />
              <div className="grid gap-4 md:grid-cols-2">
                {posts.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          </Reveal>
        ) : null}

        {/* -------------------------------------------------------------- */}
        {/* Contact strip                                                   */}
        {/* -------------------------------------------------------------- */}
        <Reveal>
          <HudPanel className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="hud-label text-amber-dim">Open channel</p>
              <p className="mt-2 text-lg font-semibold tracking-tight">
                Have a job, a project, or a Star Wars hot take?
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <HudButton href="/socials" variant="primary">
                Get in touch
              </HudButton>
              <Link
                href="/experience"
                className="inline-flex items-center px-2 font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-amber"
              >
                Service record →
              </Link>
            </div>
          </HudPanel>
        </Reveal>
      </div>
    </>
  );
}
