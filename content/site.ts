/**
 * ALL site content lives here. Replace every `[PLACEHOLDER …]` string,
 * trim or extend the arrays, and the site updates everywhere.
 *
 * Blog posts live separately as MDX files in `content/blog/`.
 * The resume PDF lives at `public/resume.pdf`.
 */

export type Project = {
  /** Short, punchy. */
  title: string;
  /** One or two sentences: what it is and why it matters. */
  summary: string;
  /** Tech / topic tags, 2 to 5 is a good range. */
  tags: string[];
  repo?: string;
  live?: string;
  /** Featured projects show on the home page (first 3). */
  featured?: boolean;
};

export type Experience = {
  company: string;
  role: string;
  /** Free text, e.g. "Jun 2024" */
  start: string;
  /** Free text, or null for "Present". */
  end: string | null;
  location?: string;
  bullets: string[];
  tags?: string[];
};

export type SkillGroup = {
  group: string;
  items: string[];
};

export type Education = {
  school: string;
  degree: string;
  years: string;
  notes?: string;
};

export type SocialKind =
  | "github"
  | "linkedin"
  | "x"
  | "instagram"
  | "email"
  | "link";

export type Social = {
  kind: SocialKind;
  label: string;
  /** Shown as the secondary line, e.g. "@handle" or an email address. */
  handle: string;
  url: string;
};

export type Hobby = {
  name: string;
  blurb: string;
};

export type Dossier = {
  puck: string;
  portrait: string | null;
  chainCode: string;
  bounty: string;
  specialties: string[];
};

export const site = {
  /** Used for <title>, OG tags and the canonical URL. Set to your real domain. */
  url: "https://example.com",
  name: "Omar Soliman",
  /** Short mono identifier shown in the nav. */
  handle: "OMAR.SOLIMAN",
  role: "[PLACEHOLDER: Software Engineer]",
  status: "Open to work",
  location: "[PLACEHOLDER: City, Country]",
  tagline:
    "[PLACEHOLDER: One sentence about what you build and what you care about.]",
  /** <meta description>. Keep under ~160 characters. */
  description:
    "Portfolio of Omar Soliman. [PLACEHOLDER: one-line description of who you are and what you do].",

  /**
   * The Bounty Guild dossier card in the hero. This is the "introduce me"
   * block: portrait, ident rows, and what you're after.
   */
  dossier: {
    /** Puck / dossier number, purely decorative. */
    puck: "001",
    /** Path under /public, e.g. "/portrait.jpg". null renders a helmet silhouette. */
    portrait: null as string | null,
    /** Any short ID-looking string. Initials + city + year works well. */
    chainCode: "[PLACEHOLDER: OS-CAI-26]",
    /** One line on what you're looking for. This is the "bounty". */
    bounty:
      "[PLACEHOLDER: e.g. A team that ships real things to real users, and lets me own the hard parts.]",
    /** 3 to 5 top skills or interests. */
    specialties: ["TypeScript", "React", "Systems", "[PLACEHOLDER]"],
  } satisfies Dossier,

  about: [
    "[PLACEHOLDER: Paragraph 1, what drives you. What kind of problems pull you in, what you love about building things.]",
    "[PLACEHOLDER: Paragraph 2, how you work. Your values, how you learn, what you're chasing next.]",
    "[PLACEHOLDER: Paragraph 3, the Mandalorian bit. Why the show, the creed, the craft of it resonates with you. Keep it to one paragraph: charming, not cosplay.]",
  ],

  hobbies: [
    {
      name: "[PLACEHOLDER: Hobby one]",
      blurb: "[PLACEHOLDER: One line about it.]",
    },
    {
      name: "[PLACEHOLDER: Hobby two]",
      blurb: "[PLACEHOLDER: One line about it.]",
    },
    {
      name: "[PLACEHOLDER: Hobby three]",
      blurb: "[PLACEHOLDER: One line about it.]",
    },
    {
      name: "Star Wars",
      blurb:
        "[PLACEHOLDER: Favourite era, favourite ship, hot take. Whatever you'd argue about at 2am.]",
    },
  ] satisfies Hobby[],

  projects: [
    {
      title: "[PLACEHOLDER: Project One]",
      summary:
        "[PLACEHOLDER: What it does, who it's for, and the one hard problem you solved.]",
      tags: ["TypeScript", "Next.js", "PostgreSQL"],
      repo: "https://github.com/[PLACEHOLDER]/project-one",
      live: "https://example.com",
      featured: true,
    },
    {
      title: "[PLACEHOLDER: Project Two]",
      summary:
        "[PLACEHOLDER: What it does, who it's for, and the one hard problem you solved.]",
      tags: ["Python", "FastAPI"],
      repo: "https://github.com/[PLACEHOLDER]/project-two",
      featured: true,
    },
    {
      title: "[PLACEHOLDER: Project Three]",
      summary:
        "[PLACEHOLDER: What it does, who it's for, and the one hard problem you solved.]",
      tags: ["Go", "gRPC"],
      repo: "https://github.com/[PLACEHOLDER]/project-three",
      featured: true,
    },
    {
      title: "[PLACEHOLDER: Project Four]",
      summary: "[PLACEHOLDER: Smaller project or experiment.]",
      tags: ["Rust"],
      repo: "https://github.com/[PLACEHOLDER]/project-four",
    },
  ] satisfies Project[],

  experience: [
    {
      company: "[PLACEHOLDER: Company]",
      role: "[PLACEHOLDER: Role]",
      start: "[PLACEHOLDER: Mon YYYY]",
      end: null,
      location: "[PLACEHOLDER: City / Remote]",
      bullets: [
        "[PLACEHOLDER: Impact statement with a number in it.]",
        "[PLACEHOLDER: Something you owned end to end.]",
        "[PLACEHOLDER: Something you improved for the team.]",
      ],
      tags: ["TypeScript", "React", "AWS"],
    },
    {
      company: "[PLACEHOLDER: Previous Company]",
      role: "[PLACEHOLDER: Role]",
      start: "[PLACEHOLDER: Mon YYYY]",
      end: "[PLACEHOLDER: Mon YYYY]",
      location: "[PLACEHOLDER: City]",
      bullets: [
        "[PLACEHOLDER: Impact statement with a number in it.]",
        "[PLACEHOLDER: Something you shipped.]",
      ],
      tags: ["Python", "Docker"],
    },
  ] satisfies Experience[],

  resume: {
    /** Path under /public. Replace the placeholder PDF with your real one. */
    pdf: "/resume.pdf",
    summary:
      "[PLACEHOLDER: 2 to 3 sentence professional summary. Who you are, what you're strongest at, what you're looking for.]",
    skills: [
      {
        group: "Languages",
        items: ["TypeScript", "Python", "Go", "[PLACEHOLDER]"],
      },
      {
        group: "Frameworks",
        items: ["React", "Next.js", "Node.js", "[PLACEHOLDER]"],
      },
      {
        group: "Infra & Tools",
        items: ["Docker", "AWS", "PostgreSQL", "Git", "[PLACEHOLDER]"],
      },
    ] satisfies SkillGroup[],
    education: [
      {
        school: "[PLACEHOLDER: University]",
        degree: "[PLACEHOLDER: B.Sc. Computer Science]",
        years: "[PLACEHOLDER: YYYY to YYYY]",
        notes: "[PLACEHOLDER: Honours, thesis, or leave blank]",
      },
    ] satisfies Education[],
    certifications: [
      "[PLACEHOLDER: Certification or award]",
    ] as string[],
  },

  socials: [
    {
      kind: "github",
      label: "GitHub",
      handle: "@[PLACEHOLDER]",
      url: "https://github.com/[PLACEHOLDER]",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      handle: "/in/[PLACEHOLDER]",
      url: "https://www.linkedin.com/in/[PLACEHOLDER]",
    },
    {
      kind: "x",
      label: "X",
      handle: "@[PLACEHOLDER]",
      url: "https://x.com/[PLACEHOLDER]",
    },
    {
      kind: "email",
      label: "Email",
      handle: "[PLACEHOLDER]@example.com",
      url: "mailto:[PLACEHOLDER]@example.com",
    },
  ] satisfies Social[],
} as const;

export type Site = typeof site;
