export type DomainWing = "tech" | "non-tech";

export type DomainId =
  | "rpa-ai"
  | "core-ml"
  | "web-dev"
  | "data-analytics"
  | "cloud-automation"
  | "rnd"
  | "graphic-design"
  | "speo"
  | "media-production"
  | "corporate-relations"
  | "content-writing"
  | "media-strategy";

export interface DomainInfo {
  id: DomainId;
  code: string;
  indexLabel: string;
  wing: DomainWing;
  title: string;
  fullNameSubtitle?: string;
  tagline: string;
  description: string;
  chips: readonly [string, string, string];
  tools: readonly string[];
  whatYouWorkOn: readonly string[];
  leads: readonly string[];
  codename: string;
}

export const DOMAINS_DATA: readonly DomainInfo[] = [
  // ================= TECH WING (06) =================
  {
    id: "rpa-ai",
    code: "T-01",
    indexLabel: "TECH // 01",
    wing: "tech",
    title: "RPA & AI",
    tagline: "Building intelligent software robots and autonomous agentic workflows.",
    description:
      "Architect autonomous digital workers, multi-agent UiPath Maestro pipelines, and end-to-end campus automations that eliminate repetitive manual effort.",
    chips: ["UiPath Studio", "Agentic AI", "Process Automation"],
    tools: [
      "UiPath Studio",
      "UiPath Maestro",
      "Document Understanding",
      "Agentic Workflows",
      "APIs",
    ],
    whatYouWorkOn: [
      "Autonomous software robots for KIIT student clubs, registrations, and hackathons",
      "Multi-agent UiPath Maestro workflows connecting LLMs, databases, and web apps",
      "Hands-on bootcamp labs and challenge templates for HACK-A-BOT & MAESTROVA",
    ],
    leads: ["Kohinoor", "Prema", "Harsh"],
    codename: "Orchestrator Prime",
  },
  {
    id: "core-ml",
    code: "T-02",
    indexLabel: "TECH // 02",
    wing: "tech",
    title: "Core ML",
    tagline: "Designing deep learning models, predictive engines, and intelligent algorithms.",
    description:
      "Build, train, and fine-tune neural networks, computer vision systems, and NLP models that power smart community products and hackathon solutions.",
    chips: ["Deep Learning", "Neural Networks", "Model Training"],
    tools: ["PyTorch", "TensorFlow", "Scikit-Learn", "Hugging Face", "OpenCV"],
    whatYouWorkOn: [
      "Custom deep learning and computer vision models for real-world campus use cases",
      "RAG pipelines, fine-tuned transformers, and intelligent classification engines",
      "Technical ML study jams and competitive model-building sprints",
    ],
    leads: ["Joshika", "Safalta"],
    codename: "Neural Forge",
  },
  {
    id: "web-dev",
    code: "T-03",
    indexLabel: "TECH // 03",
    wing: "tech",
    title: "Web Development",
    tagline: "Engineering high-performance web platforms, interactive UIs, and full-stack apps.",
    description:
      "Ship fast, resilient, and visually striking web applications—from 3D interactive microsites to live hackathon portals and internal community tools.",
    chips: ["React & Next.js", "Full-Stack", "Modern UI"],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Three.js"],
    whatYouWorkOn: [
      "Official USC KIIT web platforms, 3D hero experiences, and event microsites",
      "Real-time registration portals, squad passes, and judging dashboards",
      "Full-stack APIs, database schemas, and scalable frontend architectures",
    ],
    leads: ["Jagadish", "Debayan"],
    codename: "Fullstack Vanguard",
  },
  {
    id: "data-analytics",
    code: "T-04",
    indexLabel: "TECH // 04",
    wing: "tech",
    title: "Data Analytics",
    tagline: "Turning complex datasets into actionable insights, dashboards, and decisions.",
    description:
      "Analyze event metrics, user telemetry, and real-world datasets using statistical modeling and interactive BI dashboards to guide community strategy.",
    chips: ["Python & SQL", "BI Dashboards", "Data Storytelling"],
    tools: ["Python", "SQL", "Power BI", "Tableau", "Pandas", "Excel"],
    whatYouWorkOn: [
      "Interactive BI dashboards tracking event turnout, engagement, and growth",
      "Exploratory data analysis and predictive trend reports on messy datasets",
      "Data-driven workshops teaching SQL, visualization, and analytics storytelling",
    ],
    leads: ["Aryya", "Arnab"],
    codename: "Insight Matrix",
  },
  {
    id: "cloud-automation",
    code: "T-05",
    indexLabel: "TECH // 05",
    wing: "tech",
    title: "Cloud Automation",
    tagline: "Scaling orchestrators, cloud infrastructure, and automated deployment pipelines.",
    description:
      "Manage cloud-native infrastructure, UiPath Orchestrator environments, containerized services, and zero-downtime CI/CD pipelines.",
    chips: ["UiPath Orchestrator", "Cloud Ops", "CI/CD Pipelines"],
    tools: ["UiPath Orchestrator", "Docker", "AWS / Azure", "GitHub Actions", "Linux"],
    whatYouWorkOn: [
      "Cloud-hosted UiPath Orchestrator queues, triggers, and unattended bot runners",
      "Automated CI/CD deployment pipelines for USC KIIT web services",
      "Containerized environments and scalable backend hosting for hackathon demos",
    ],
    leads: ["Indira"],
    codename: "Cloud Sentinel",
  },
  {
    id: "rnd",
    code: "T-06",
    indexLabel: "TECH // 06",
    wing: "tech",
    title: "Research & Development",
    tagline: "Exploring emerging AI paradigms, technical papers, and experimental prototypes.",
    description:
      "Investigate frontier technologies, dissect research papers, and build experimental proof-of-concepts before they become mainstream.",
    chips: ["Applied Research", "Prototyping", "Emerging Tech"],
    tools: ["arXiv / Papers", "Agentic Frameworks", "Rapid PoCs", "System Architecture"],
    whatYouWorkOn: [
      "Weekly research paper breakdowns on autonomous agents and emerging AI",
      "Experimental cross-domain prototypes combining robotics, AI, and web tech",
      "Technical whitepapers and R&D showcases representing USC KIIT",
    ],
    leads: ["Diptansu", "Rahil"],
    codename: "Frontier Lab",
  },

  // ================= NON-TECH WING (06) =================
  {
    id: "graphic-design",
    code: "NT-01",
    indexLabel: "NON-TECH // 01",
    wing: "non-tech",
    title: "Graphic Designing",
    tagline: "Crafting USC KIIT's visual identity, event posters, UI assets, and brand systems.",
    description:
      "Shape the visual language of every hackathon, bootcamp, and social campaign through cohesive typography, 3D-inspired layouts, and crisp brand kits.",
    chips: ["Figma", "Brand Identity", "Visual Systems"],
    tools: ["Figma", "Adobe Illustrator", "Photoshop", "Canva Pro", "Design Systems"],
    whatYouWorkOn: [
      "Flagship event branding, stage backdrops, merch, and squad passes",
      "High-impact social posters, carousels, and UI asset libraries",
      "Consistent visual systems across web, print, and campus installations",
    ],
    leads: ["Ritik", "Ashika", "Serena"],
    codename: "Pixel Architect",
  },
  {
    id: "speo",
    code: "NT-02",
    indexLabel: "NON-TECH // 02",
    wing: "non-tech",
    title: "SPEO",
    fullNameSubtitle: "Sponsorship, PR, Events & Operations",
    tagline: "Orchestrating flagship hackathons, campus logistics, public relations, and sponsors.",
    description:
      "Command the ground operations behind 600+ attendee hackathons—managing auditorium logistics, sponsor deliverables, public relations, and seamless execution.",
    chips: ["Event Ops", "Sponsorships", "Public Relations"],
    tools: ["Runbooks", "Sponsorship Decks", "Logistics Ops", "Campus PR", "Notion"],
    whatYouWorkOn: [
      "End-to-end execution of HACK-A-BOT, MAESTROVA, and campus workshops",
      "Sponsorship outreach, partner onboarding, and auditorium coordination",
      "Public relations, stage management, and volunteer crew coordination",
    ],
    leads: ["Dwipayan", "Sahil", "Chandni"],
    codename: "Command Ops",
  },
  {
    id: "media-production",
    code: "NT-03",
    indexLabel: "NON-TECH // 03",
    wing: "non-tech",
    title: "Media Production",
    tagline: "Capturing event cinema, aftermovies, motion graphics, and high-impact reels.",
    description:
      "Direct, shoot, and edit cinematic aftermovies, motion-graphic teasers, and fast-paced event coverage that immortalize every USC KIIT milestone.",
    chips: ["Cinematography", "Video Editing", "Motion Design"],
    tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "DSLR / Gimbal"],
    whatYouWorkOn: [
      "Cinematic hackathon aftermovies and high-energy launch teasers",
      "Live event photography, speaker reels, and behind-the-scenes stories",
      "Motion graphics packages and animated announcements",
    ],
    leads: ["Souvik"],
    codename: "Kinetic Frame",
  },
  {
    id: "corporate-relations",
    code: "NT-04",
    indexLabel: "NON-TECH // 04",
    wing: "non-tech",
    title: "Corporate Relations",
    tagline: "Connecting USC KIIT with industry leaders, speakers, mentors, and tech partners.",
    description:
      "Build lasting bridges between KIIT students and the tech industry by onboarding mentors, guest speakers, judges, and corporate collaborators.",
    chips: ["Industry Outreach", "Partnerships", "Speaker Relations"],
    tools: ["LinkedIn Outreach", "Partner Decks", "CRM Tracking", "Executive Comms"],
    whatYouWorkOn: [
      "Inviting UiPath MVPs, engineers, and industry founders to KIIT sessions",
      "Coordinating hackathon judges, technical mentors, and corporate tie-ups",
      "Maintaining long-term alumni and industry partner relationships",
    ],
    leads: ["Pratyush", "Shubham"],
    codename: "Bridge Builder",
  },
  {
    id: "content-writing",
    code: "NT-05",
    indexLabel: "NON-TECH // 05",
    wing: "non-tech",
    title: "Content Writing",
    tagline: "Shaping the community voice through technical blogs, scripts, captions, and copy.",
    description:
      "Translate complex automation concepts into crisp narratives—writing everything from website copy and event scripts to technical blogs and social captions.",
    chips: ["Technical Writing", "Copywriting", "Editorial"],
    tools: ["Technical Blogs", "Scriptwriting", "Brand Copy", "Documentation"],
    whatYouWorkOn: [
      "Event scripts, MC cues, and crisp microsite / announcement copy",
      "Engaging LinkedIn articles, Medium tutorials, and recap newsletters",
      "Punchy social captions and storytelling threads for every campaign",
    ],
    leads: ["Abhishek", "Ayetri"],
    codename: "Narrative Core",
  },
  {
    id: "media-strategy",
    code: "NT-06",
    indexLabel: "NON-TECH // 06",
    wing: "non-tech",
    title: "Media Strategy",
    tagline: "Driving digital growth, campaign rollouts, analytics, and social engagement.",
    description:
      "Plan multi-channel launch calendars, optimize reach across Instagram and LinkedIn, and turn campus buzz into record-breaking registrations.",
    chips: ["Campaign Growth", "Social Strategy", "Digital Reach"],
    tools: ["Content Calendars", "Social Analytics", "Growth Loops", "Campaign Ops"],
    whatYouWorkOn: [
      "Multi-week launch roadmaps for flagship hackathons and recruitments",
      "Audience engagement experiments, reach optimization, and trend jacking",
      "Cross-platform campaign coordination with Design, Content, and Media",
    ],
    leads: ["Shivanshi", "Arunav"],
    codename: "Signal Amplifier",
  },
];

export const TECH_DOMAINS = DOMAINS_DATA.filter((d) => d.wing === "tech");
export const NON_TECH_DOMAINS = DOMAINS_DATA.filter((d) => d.wing === "non-tech");
