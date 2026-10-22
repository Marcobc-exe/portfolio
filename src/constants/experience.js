// Work page timeline, oldest first (left to right). Text between ** ** is shown as a highlighted metric
const experience = [
  {
    id: "inacap",
    node: "2019",
    label: "INACAP",
    period: "2019 – 2021",
    duration: "2 yrs",
    tag: "Education",
    role: "Programmer Analyst",
    org: "INACAP",
    location: "Santiago, Chile",
    bullets: [
      "Programmer Analyst degree: the foundation in software development, databases and systems analysis behind everything that came next.",
    ],
    stack: [],
  },
  {
    id: "agrosat",
    node: "Mar 2023",
    label: "Agrosat",
    period: "Mar 2023 – Jun 2024",
    duration: "1 yr 4 mos",
    tag: "Agritech",
    role: "Junior Frontend Developer",
    org: "Agrosat",
    location: "Santiago, Chile",
    bullets: [
      "Cut manual crop-monitoring work by **30%+** with real-time, interactive map features built on Mapbox GL.",
      "Built and maintained web and mobile apps (React, React Native, Expo) used daily by **300+ farmers**.",
      "Shipped irrigation-scheduling and crop-management dashboards on top of Redux and GraphQL.",
    ],
    stack: ["React", "TypeScript", "React Native", "Expo", "Mapbox GL", "Redux", "GraphQL"],
  },
  {
    id: "datamart",
    node: "Jun 2024",
    label: "Datamart · BCI",
    period: "Jun 2024 – Nov 2024",
    duration: "6 mos",
    tag: "Fintech",
    role: "Intermediate Frontend Developer",
    org: "Datamart",
    client: "Bank BCI",
    location: "Santiago, Chile",
    bullets: [
      "Reduced critical registration errors by **30%** on Bank BCI's platform with secure SMB onboarding flows.",
      "Modeled multi-step registration as XState state machines (headcount, revenue, entity type) with secure document uploads over REST.",
      "Turned complex Figma prototypes into accessible, responsive Material UI components.",
    ],
    stack: ["React", "TypeScript", "XState", "GraphQL", "Material UI", "REST APIs"],
  },
  {
    id: "calgary",
    node: "Mar 2025",
    label: "Calgary, CA",
    period: "Mar 2025 – Sep 2026",
    duration: "1 yr 7 mos",
    tag: "Canada",
    role: "International Working Holiday",
    org: "Calgary, AB",
    location: "Canada",
    bullets: [
      "Relocated to Canada for 1.5 years and reached **professional English fluency**.",
      "Worked demanding, deadline-driven roles in structural framing and hospitality.",
      "Designed and shipped **Lockerpass** on my own: a Next.js/TypeScript UI, a Python/FastAPI REST API and a PostgreSQL schema for encrypted credentials.",
    ],
    stack: ["Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL"],
    links: [{ label: "Lockerpass on GitHub", href: "https://github.com/Marcobc-exe/PasswordManagerApp" }],
  },
  {
    id: "now",
    node: "Now",
    label: "Open to roles",
    period: "Oct 2026 – Present",
    tag: "Available",
    role: "Open to Front-End & Full-Stack roles",
    org: "Remote",
    location: "Santiago, Chile · EST/CST hours",
    bullets: [
      "Looking to join US and Canadian engineering teams or fast-paced startups, shipping React, Next.js and TypeScript.",
      "Currently building **Gainly**, a mobile app.",
    ],
    stack: [],
    links: [{ label: "Gainly on GitHub", href: "https://github.com/Marcobc-exe/Gainly-app" }],
    current: true,
  },
];

// Selected when the page opens: the most recent developer role
const DEFAULT_EXPERIENCE = "datamart";

export { experience, DEFAULT_EXPERIENCE };
