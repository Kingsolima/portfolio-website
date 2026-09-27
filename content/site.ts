/**
 * ALL site content lives here. Replace every `[PLACEHOLDER …]` string,
 * trim or extend the arrays, and the site updates everywhere.
 *
 * Blog posts live separately as MDX files in `content/blog/`.
 * Projects live separately as MDX files in `content/projects/`; their
 * frontmatter feeds the index cards and the page headers.
 * The resume PDF is built from `resume/resume.tex` by `npm run resume`
 * and lands at `public/resume.pdf`.
 * The hologram portrait (optional) lives at `public/portrait.png`.
 */

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

/** The bounty-puck hologram in the hero. */
export type Hologram = {
  /**
   * Transparent-background cutout PNG under /public, e.g. "/portrait.png".
   * Head and shoulders, front-lit, background removed. Swap the file and
   * the hologram updates; nothing else needs to change. null renders an
   * armored-bust placeholder in the CSS fallback.
   */
  portrait: string | null;
  /** True while the image is the stock placeholder; shows a small credit line. */
  portraitIsPlaceholder: boolean;
  /** Attribution for the placeholder image. Ignored once portraitIsPlaceholder is false. */
  portraitCredit?: string;
  /** Word shown in Aurebesh above the bust. Screen readers get the Latin text. */
  wanted: string;
  /** Red neon figure below the bust. */
  bounty: { amount: string; unit: string };
};

/** One typed command and the lines it prints. */
export type TerminalCommand = {
  cmd: string;
  output: string[];
};

export type Terminal = {
  user: string;
  host: string;
  /** Typed in order on page load. Commands type at human speed, output lands faster. */
  session: TerminalCommand[];
};

export const site = {
  /** Used for <title>, OG tags and the canonical URL. Set to your real domain. */
  url: "https://example.com",
  name: "Omar Soliman",
  /** Short mono identifier shown in the nav. */
  handle: "OMAR.SOLIMAN",
  role: "AI & Software Engineer",
  /** Nav status pill. */
  status: "Seeking Summer 2027 internships",
  location: "London, Ontario",
  /** <meta description>. Keep under ~160 characters. */
  description:
    "Portfolio of Omar Soliman, a computer science student at Western University who builds AI and data pipelines that survive real data.",

  hologram: {
    /** Replace with your own cutout, e.g. "/portrait.png", then set portraitIsPlaceholder: false. */
    portrait: "/placeholder-bust.png" as string | null,
    portraitIsPlaceholder: true,
    portraitCredit:
      "Placeholder: Plato bust. Photo Marie-Lan Nguyen (CC BY 2.5), cutout S. Perquin (CC0), Wikimedia Commons",
    wanted: "WANTED",
    bounty: { amount: "20,000", unit: "credits" },
  } satisfies Hologram,

  terminal: {
    user: "omar",
    host: "razor-crest",
    session: [
      {
        cmd: "whoami",
        output: [
          "Omar Soliman",
          "B.Sc. Computer Science, Western University, Class of 2028",
          "Sector: London, Ontario",
        ],
      },
      {
        cmd: "cat status.txt",
        output: [
          "STATUS: Seeking Summer 2027 software engineering internships",
          "Open to: on-site, hybrid, remote",
          "Available: May 2027",
        ],
      },
      {
        cmd: "cat about.txt",
        output: [
          "I build data and AI pipelines that keep running unattended.",
          "I care more about a number being right than about it being high.",
          "This is the Way. It is also roughly my code review policy.",
        ],
      },
      {
        cmd: "ls skills/",
        output: ["python/  sql/  fastapi/  postgres/  gcp/  terraform/"],
      },
      {
        cmd: "./contact.sh",
        output: ["Comms channels open at /socials", "Resume at /resume"],
      },
    ],
  } satisfies Terminal,

  about: [
    "I like the unglamorous half of AI work: the ingestion, the queues, the retries. Most of what I build ends in a model call, but the part that decides whether it works is everything before it: backfilling 280k procurement records through a rate limited job queue, checkpointing extracted document text so a failed embedding run resumes instead of starting over, grouping raw solar telemetry into events an operator can actually act on. If it cannot survive being run unattended at 3am, it is a demo, not a system.",
    "The work I am proudest of is a number I made worse. A classifier of mine hit 0.91 ROC-AUC, which felt great until I traced it to study overlap across splits and test set exposure during feature selection. Rebuilt with cohort grouped cross validation and fold specific selection, it reported 0.64. That is the honest number, and finding it taught me more than the first one would have. I would rather ship something defensible than something impressive.",
    "The Mandalorian thing is about craft, not cosplay. A covert of people who are very good at one narrow trade, who maintain their own gear, who take a creed seriously enough to be inconvenienced by it. Beskar gets reforged, never thrown out. That is a fair description of how I feel about a codebase you intend to keep.",
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

  experience: [
    {
      company: "Gestalt Communications",
      role: "AI Engineer Intern",
      start: "Jul 2026",
      end: null,
      location: "Oakville, Ontario",
      bullets: [
        "Built a pipeline ingesting United Nations procurement notices and awards to surface bidding opportunities relevant to Gestalt's services, backfilling 280k+ records on a rate limited PostgreSQL job queue.",
        "Extended it with a document pipeline: attachment retrieval, PDF/DOCX extraction, Document AI OCR fallback for scanned files, sentence aware chunking, and Vertex AI embeddings stored in pgvector.",
        "Persisted document text and chunks in transactional checkpoints before embedding, so failed embedding stages resume without repeating extraction or chunking.",
        "Provisioned Terraform managed GCP infrastructure spanning Cloud Run Jobs, Cloud SQL, a versioned GCS archive, workload scoped IAM, Secret Manager and monitoring alerts.",
        "Configured CI with PostgreSQL integration tests covering concurrent job claims, expired lease recovery and duplicate free record versioning, alongside lint and type checks.",
      ],
      tags: ["Python", "PostgreSQL", "pgvector", "GCP", "Terraform"],
    },
    {
      company: "Swish Solar",
      role: "Software Engineer Intern",
      start: "Sep 2025",
      end: "May 2026",
      location: "Waterloo, Ontario",
      bullets: [
        "Sole engineer on a Python pipeline converting solar SCADA and weather exports into monthly performance and data health PDFs, built to replace manual reporting.",
        "Built Isolation Forest anomaly detection on interval performance ratio, power residual and AC/DC efficiency features rather than raw power output, to cut false positives from normal sunrise and sunset dips.",
        "Added rule based fault categories, severity and recommended actions so operators know what to act on, and grouped consecutive zero output daylight intervals into events for reporting.",
      ],
      tags: ["Python", "pandas", "scikit-learn"],
    },
  ] satisfies Experience[],

  resume: {
    /** Path under /public. Replace the placeholder PDF with your real one. */
    pdf: "/resume.pdf",
    summary:
      "Computer science student at Western University, currently an AI engineer intern at Gestalt Communications. I am strongest on the plumbing behind AI systems: ingestion and job queues that survive rate limits and restarts, document and embedding pipelines, and the Terraform and CI around them. Looking for a Summer 2027 software engineering internship where correctness matters more than demo speed.",
    skills: [
      {
        group: "Languages",
        items: ["Python", "SQL", "Java", "C++", "JavaScript", "Bash"],
      },
      {
        group: "Frameworks",
        items: [
          "FastAPI",
          "React",
          "Pydantic",
          "asyncio",
          "Playwright",
          "pandas",
          "NumPy",
          "seaborn",
        ],
      },
      {
        group: "AI & ML",
        items: [
          "Claude API",
          "Vertex AI Embeddings",
          "Google Document AI",
          "scikit-learn",
          "XGBoost",
        ],
      },
      {
        group: "Cloud & Tools",
        items: [
          "GCP",
          "PostgreSQL",
          "MySQL",
          "pgvector",
          "Supabase",
          "Terraform",
          "Docker",
          "Git",
          "GitHub Actions",
          "Linux",
        ],
      },
    ] satisfies SkillGroup[],
    education: [
      {
        school: "Western University, London, Ontario",
        degree: "B.Sc. Computer Science",
        years: "2024 to 2028 (expected)",
        notes: "Dean's Honour List.",
      },
    ] satisfies Education[],
    certifications: [] as string[],
  },

  socials: [
    {
      kind: "github",
      label: "GitHub",
      handle: "@KingSolima",
      url: "https://github.com/KingSolima",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      handle: "/in/omar-soliman-662939283",
      url: "https://www.linkedin.com/in/omar-soliman-662939283/",
    },
    {
      kind: "email",
      label: "Email",
      handle: "osolima6@uwo.ca",
      url: "mailto:osolima6@uwo.ca",
    },
  ] satisfies Social[],
} as const;

export type Site = typeof site;
