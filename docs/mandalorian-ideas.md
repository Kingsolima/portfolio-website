# Making the site more Mandalorian

Working notes, 2026-09-21. Nothing here is implemented yet.

## Where it stands

The site is roughly 70% "amber sci-fi cockpit" and 30% Mandalorian. The T-visor framing, "This is the Way", the Guild Dossier card and the beskar blog post carry the specific signal. Everything else (scanlines, corner brackets, telemetry rows) would work just as well for a Blade Runner or Alien theme.

The fix is not more HUD. It is swapping generic sci-fi cues for things that only exist in the Mandalorian world, while keeping every page as simple and scannable as it is now.

## Ground rules

- One Star Wars reference per page, max. Past that it reads as cosplay, not a portfolio.
- Hand-drawn interpretations only. No official logos, traced helmet art or show stills.
- No em or en dashes anywhere in copy.
- Dark-only. No light theme.
- No autoplaying audio.

---

## Tier 1: high signal, small footprint

Do all of these first. None add clutter.

### 1. Mando'a script as decoration
The Mandalorian written language appears on armor, ships and the covert. Render each section eyebrow twice: Mando'a glyphs in muted amber, then the Basic label beside it (`// 02 · PROJECTS`). Unmistakable, and still readable because the English sits right there.

- Fan-made Mando'a fonts exist; check the license before bundling.
- Alternative: draw the ~26 glyphs as one small SVG sprite and own it outright.
- Also usable on the 404, the footer line and the dossier header strip.

### 2. Mythosaur skull as the site mark
The definitive Mandalorian sigil. Replace the helmet favicon and nav glyph with a custom-drawn mythosaur, and ghost it at 3 to 4% opacity behind the About section. One symbol does more than ten scanlines.

### 3. Beskar in the palette
The show's colors are beskar silver, worn leather brown and desert ochre. The site currently has none of them. Add:

- A brushed-silver tertiary token for the nav mark, dossier frame and resume header.
- A faint warm-brown tint on panel backgrounds (a few percent, not a color shift you consciously notice).

This alone moves the mood from "cyberpunk" to "forge".

### 4. Weathering
Din's armor is dented and scratched; the site is spotless. Mandalorian is analog sci-fi, not clean neon.

- Subtle grain texture on panels.
- Hairline scratches, very low opacity, a couple per panel at most.
- Slightly worn corner brackets (a tiny notch or break in one arm).
- Occasional rivet dots at panel corners.

### 5. Bounty puck hologram + terminal intro (done)
Omar's call, modelled on the show's puck: a lit metal cylinder on the table projects the portrait upward as a cyan hologram (light cone, projection lines, slow float, dropped frames, a rare horizontal tear). Red neon Aurebesh "WANTED" above, red neon bounty in credits below. Until a cutout photo exists, the projection is an armored bust.

The Guild Dossier card was retired; its ident rows moved into a terminal beside the hologram that types a scripted session once on load (`whoami`, `cat status.txt` with the 2027 internship search, `cat about.txt`, `ls skills/`, `./contact.sh`), then stays until refresh. Click skips.

Now a real three.js scene: PBR puck with procedural wear and seams, cyan emitter with standby pulse and activation flash, feathered additive beam, image-on-a-plane hologram shader (slice assembly, scan reveal, scanlines, edge glow, flicker, rare tears, depth ghost), drifting particles, restrained bloom and vignette, contact shadows and cyan spill on the surface. Activation sequence: standby, flash (0.3s), materialize (to 1.1s), reveal (to 2.2s), idle. Click or tap replays; drag rotates slightly; reduced motion renders it still; no WebGL falls back to the CSS version. Placeholder person is a CC-licensed marble bust of Plato until a cutout photo replaces it.

Possible layer on top: the helmet rule. Default the projection to the helmet; on hover or tap, the visor lifts and the face shows underneath.

---

## Tier 2: reframe existing sections

Good follow-ups once real content is in.

### Darksaber dividers
Section rules and the active-nav underline become a black line with a thin white crackling edge, instead of a plain amber hairline. Specific, subtle, and it gives a second accent that isn't more amber.

### Rank ladder on Experience
Map roles to Mandalorian ranks as a small mono label per entry. Recruiters still see the real title.

| Rank | Maps to |
|---|---|
| Foundling | internships, first job |
| Verd | junior |
| Mandalorian | mid-level |
| Alor | lead / senior |

### Projects as "the Forge"
Rename Projects to Forge or Armory. Index cards as `PLATE 001`. Mark status as "forged" (shipped) vs "cooling" (in progress). The Armorer's forge is amber, so the palette already agrees.

### Tracking fob in the nav
The `◈ ONLINE` pill becomes a tracking fob: a small red light that pulses slowly, faster on hover. Every fan knows the beep without hearing it.

### Signet on the dossier
Din earns the Mudhorn. Add a `SIGNET` slot to the card for one icon that means something to you (a mountain, a chess knight, whatever), with a one-line story on hover.

---

## Tier 3: copy and easter eggs

### Resol'nare-flavored creed
Rework the Creed panel around the six tenets, translated into engineering. Six lines, still casual:

1. Wear the armor: own your code.
2. Speak the language: write it down.
3. Defend yourself and your family: protect the team.
4. Raise your children as Mandalorians: mentor.
5. Contribute to the clan: open source.
6. Rally to the Mand'alor when called: be there when prod is down.

### 404 line
"This is not the Way." Cheap and perfect.

### Mando'a phrases, sparingly
- *Oya!* on a successful download or form submit.
- Skip anything heavy (remembrance phrases, funeral lines). Wrong register for a portfolio.

### Konami-style easter egg
Type `oya` anywhere: the visor sweep speeds up for a few seconds and the fob blinks once. Zero footprint for anyone who doesn't know.

---

## Skip these

- **Sound by default.** A HUD beep on hover is tempting. Make it opt-in or leave it out. Autoplaying audio is the fastest way to make a portfolio feel like a fan site.
- **Official assets.** Legal risk and it stops being yours.
- **Grogu.** Cute pulls against the simple, casual, professional line.
- **More scanlines / glitch effects.** Generic sci-fi, adds noise, says nothing about Mandalore.

---

## Recommended first pass

All of Tier 1, plus darksaber dividers and the 404 line. Six changes, no added clutter, and the balance moves to roughly 70% Mandalorian. Revisit Tier 2 and 3 after real content is in and you can see what each page actually needs.
