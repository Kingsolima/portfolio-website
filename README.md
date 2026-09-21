# Portfolio: Visor HUD

Personal portfolio for Omar Soliman. Dark, Mandalorian-helmet-HUD inspired: amber accents, corner brackets, monospace telemetry. Built with Next.js (App Router) + Tailwind CSS v4, exported as a fully static site.

## Run it

Requires Node 22 (see `.nvmrc`).

```bash
nvm use            # picks up .nvmrc
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static export -> out/
npx serve out      # preview the exact files that get deployed
```

## Edit content

Everything you'd want to change lives in three places:

| What | Where |
|---|---|
| Name, role, status, about, hobbies, projects, experience, resume, socials | [`content/site.ts`](content/site.ts) |
| Hologram: your bounty amount and the "WANTED" word | `hologram` block in `site.ts` |
| Hologram portrait (optional) | Cutout PNG with a **transparent background**, head and shoulders, front-lit, ~800px tall, saved as `public/portrait.png`. Then set `hologram.portrait: "/portrait.png"`. remove.bg or Photoshop will do the cutout. Until then an armored bust is projected. |
| Terminal intro script (what gets typed on the home page) | `terminal.session` in `site.ts`: an ordered list of `{ cmd, output[] }`. Make it as long as you like; it types once per page load and click skips it. |
| Blog posts | [`content/blog/*.mdx`](content/blog/) |
| Resume PDF | `public/resume.pdf` (replace the placeholder file) |

Search for `PLACEHOLDER` and replace every hit. Types in `site.ts` will tell you if something is missing.

### Add a blog post

Create `content/blog/my-post.mdx`:

```mdx
---
title: "My post"
date: "2026-10-01"
summary: "One line shown in the list."
tags: ["engineering"]
---

Markdown body here. Code blocks are highlighted at build time.
```

The filename is the URL (`/blog/my-post/`). Add `draft: true` to hide a post without deleting it.

## Deploy

The build produces plain HTML/CSS/JS in `out/`. No server, no adapters.

**Netlify**: connect the repo; `netlify.toml` already sets the build command, publish dir, and Node 22.

**Cloudflare Pages**: connect the repo and set:
- Build command: `npm run build`
- Build output directory: `out`
- Environment variable: `NODE_VERSION` = `22`

**Anything else** (GitHub Pages, S3, nginx): upload `out/`. Routes use trailing slashes (`/blog/slug/index.html`) so any static host resolves them.

Before going live, set `url` in `content/site.ts` to your real domain; it drives canonical and Open Graph URLs.

## Structure

```
content/            <- your content (site.ts + blog/*.mdx)
public/             <- resume.pdf, static assets
src/app/            <- routes (one folder per tab) + layout + globals.css
src/components/     <- HudPanel, Nav, cards, etc.
src/lib/            <- blog loader (gray-matter) + MDX compiler
```

Design tokens (colours, fonts) are in the `@theme` block at the top of `src/app/globals.css`.
