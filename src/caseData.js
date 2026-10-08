export const EMAIL = "shreyasboddani@gmail.com";
export const RESUME = "/shreyas-resume.pdf?v=20261007";
export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/shreyasboddani" },
  { label: "LinkedIn", href: "https://linkedin.com/in/shreyas-boddani" },
];

export const PROJECTS = [
  {
    name: "Mentics",
    kind: "Co-founder & full-stack developer",
    date: "June 2025 — present",
    description:
      "I co-founded and launched a free college-planning beta with about 50 users. It builds personalized SAT and college roadmaps with Flask, React, SQL, and Gemini.",
    detail:
      "I built authentication, persistent user data, AI guidance, and deployment, then iterated from user feedback.",
    tags: ["React", "Flask", "SQL", "Gemini"],
    image: "/mentics.png",
    href: "https://www.mentics.app/",
    link: "Explore Mentics",
  },
  {
    name: "SafeRoute",
    kind: "Hack Forsyth build",
    date: "September 2025",
    description:
      "A civilian safety route simulator built in 5.5 hours. Python, OpenStreetMap, and OSRM turn map data into routing around danger zones.",
    tags: ["Python", "OpenStreetMap", "OSRM"],
    image: "/saferoute.png",
    href: "https://github.com/shreyasboddani/SafeRoute",
    link: "Read the source",
  },
  {
    name: "The Place assistant",
    kind: "Nonprofit chatbot prototype",
    date: "2026 — present",
    description:
      "A source-grounded information assistant with document retrieval, answer citations, and FAQ-based fallbacks.",
    tags: ["RAG", "Information retrieval", "Citations"],
    href: "https://theplacechatbot.vercel.app/",
    link: "Open the prototype",
  },
  {
    name: "Space debris collision prediction",
    kind: "Machine learning project",
    date: "2025 — 2026",
    description:
      "An exploration of orbital data, collision-risk prediction components, and orbital visualizations.",
    tags: ["Machine learning", "Orbital data", "Visualization"],
  },
  {
    name: "Anime Discovery",
    kind: "Content-based recommendation engine",
    date: "July 2025",
    description:
      "Recommendation models using TF-IDF, similarity methods, and an autoencoder. Custom filtering keeps sequels and spin-offs from taking over the recommendations.",
    tags: ["TensorFlow", "TF-IDF", "Similarity"],
    image: "/anime.png",
    href: "https://github.com/shreyasboddani/anime-recommender",
    link: "Read the source",
  },
  {
    name: "Mind Metrics",
    kind: "Earlier ML exploration",
    description:
      "An earlier project exploring student stress data with machine learning.",
    tags: ["Scikit-learn", "Student wellness"],
    href: "https://www.kaggle.com/code/shreyasboddani/shreyas-student-stress-monitoring-ml-project",
    link: "Open the notebook",
  },
];

export const EXPERIENCE = [
  {
    date: "Aug. 2026 — present",
    role: "Software Engineering Intern",
    org: "Cloud Supply Chain Services",
    description:
      "Contributing to 3D warehouse visualization and designing 2D floor-plan features for operational dashboards. Researching API-driven tools and documenting engineering requirements for the intern team.",
  },
  {
    date: "Summer 2026",
    role: "Programming Intern",
    org: "Cirrus Labs",
    description:
      "Merged code after senior engineer review, resolved data blockers, and prototyped requested AI/ML features. Co-authored AI safety research presented to the CTO and earned a two-month internship extension.",
  },
  {
    date: "2026 — present",
    role: "Co-Founder & Project Lead",
    org: "Learn AI Forsyth",
    description:
      "Co-leading free AI education, with outreach content reaching 180+ students. Developing accessible learning materials and managing nonprofit outreach and AI assistant prototypes.",
    href: "https://learnai-forsyth.vercel.app/",
  },
  {
    date: "2025 — present",
    role: "President; former VP Community Service",
    org: "North Forsyth FBLA",
    description:
      "Directing recruitment, meetings, and service operations. Training officers and mentoring younger competitors. Built the chapter’s first React site; as service VP, helped exceed the annual volunteer goal by 52%.",
  },
  {
    date: "May 2026 — present",
    role: "Co-President",
    org: "Educo Tutoring",
    description:
      "Co-managing peer tutoring logistics, tutor matching, and scheduling. Delivered 40+ hours of chemistry tutoring and helped recruit student tutors.",
  },
  {
    date: "2025 — 2026",
    role: "Student Researcher",
    org: "Biochemistry / Machine Learning Research",
    description:
      "Contributed to professor-supervised silver nanoparticle research and paper drafting. Explored Random Forest models, cross-validation, and feature importance in an independent ML extension.",
  },
];

export const FILES = [
  {
    id: "profile",
    code: "001",
    label: "The person",
    title: "Shreyas Boddani",
    subtitle: "Developer. Student leader. A work in progress.",
    color: "cream",
  },
  {
    id: "projects",
    code: "002",
    label: "The builds",
    title: "Ideas that made it out.",
    subtitle: "Products, prototypes, and a few rabbit holes.",
    color: "cream",
  },
  {
    id: "experience",
    code: "003",
    label: "Field experience",
    title: "Learning inside the work.",
    subtitle: "Engineering teams, responsibility, and real constraints.",
    color: "cream",
  },
  {
    id: "research",
    code: "004",
    label: "Research notes",
    title: "A closer look.",
    subtitle: "What happens when curiosity meets data.",
    color: "cream",
  },
  {
    id: "community",
    code: "005",
    label: "The people",
    title: "Bring people along.",
    subtitle: "There’s useful work on both sides of the screen.",
    color: "green",
  },
  {
    id: "education",
    code: "006",
    label: "The foundations",
    title: "Still learning.",
    subtitle: "North Forsyth, Georgia Tech, and the next question.",
    color: "cream",
  },
  {
    id: "recognition",
    code: "007",
    label: "For the record",
    title: "A few proud moments.",
    subtitle: "The milestones behind the small red pins.",
    color: "cream",
  },
  {
    id: "contact",
    code: "008",
    label: "Make a connection",
    title: "The next thread.",
    subtitle: "A project, an opportunity, or a good conversation.",
    color: "yellow",
  },
];

// Locations refer to a 1600 × 1000 physical board; the camera handles screen size.
export const EVIDENCE = [
  {
    id: "profile",
    file: "profile",
    x: 602,
    y: 225,
    w: 396,
    h: 490,
    angle: -3,
    kind: "portrait",
    label: "Open Shreyas Boddani’s profile",
  },
  {
    id: "mentics",
    file: "projects",
    x: 194,
    y: 204,
    w: 284,
    h: 286,
    angle: -7,
    kind: "project",
    label: "Open projects: Mentics and other builds",
  },
  {
    id: "saferoute",
    file: "projects",
    x: 85,
    y: 563,
    w: 270,
    h: 236,
    angle: 5,
    kind: "map",
    label: "Open projects: SafeRoute",
  },
  {
    id: "experience",
    file: "experience",
    x: 1150,
    y: 270,
    w: 305,
    h: 260,
    angle: 4,
    kind: "letter",
    label: "Open internships and experience",
  },
  {
    id: "research",
    file: "research",
    x: 1158,
    y: 620,
    w: 290,
    h: 216,
    angle: -5,
    kind: "research",
    label: "Open research notes",
  },
  {
    id: "community",
    file: "community",
    x: 410,
    y: 751,
    w: 278,
    h: 193,
    angle: -5,
    kind: "sticky",
    label: "Open leadership and community work",
  },
  {
    id: "education",
    file: "education",
    x: 611,
    y: 32,
    w: 385,
    h: 130,
    angle: 2,
    kind: "ticket",
    label: "Open education and skills",
  },
  {
    id: "recognition",
    file: "recognition",
    x: 1128,
    y: 35,
    w: 286,
    h: 191,
    angle: -4,
    kind: "clipping",
    label: "Open awards and recognition",
  },
  {
    id: "contact",
    file: "contact",
    x: 824,
    y: 814,
    w: 299,
    h: 150,
    angle: 5,
    kind: "envelope",
    label: "Open contact information",
  },
];

export const TRAIL = [
  {
    file: "profile",
    title: "Every story starts with a person.",
    text: "I’m Shreyas. This is what I’ve been working on, and the things that connect it.",
    x: 800,
    y: 466,
    factor: 1.16,
    mobile: 0.78,
  },
  {
    file: "projects",
    title: "An idea became something real.",
    text: "Mentics started with college planning. It became a working beta with about 50 users.",
    x: 366,
    y: 349,
    factor: 1.85,
    mobile: 1.05,
  },
  {
    file: "experience",
    title: "Then the work got bigger.",
    text: "Professional engineering teams. 3D warehouse tools. AI safety research. More to learn.",
    x: 1296,
    y: 404,
    factor: 1.9,
    mobile: 1.0,
  },
  {
    file: "research",
    title: "Follow a question a little further.",
    text: "Nanoparticle data, machine learning, and orbital collision risk. Curiosity has range.",
    x: 1304,
    y: 723,
    factor: 2,
    mobile: 1.05,
  },
  {
    file: "community",
    title: "The thread comes back to people.",
    text: "Free AI education, student leadership, and 40+ hours of chemistry tutoring.",
    x: 552,
    y: 850,
    factor: 1.9,
    mobile: 1.02,
  },
  {
    file: "contact",
    title: "And the case stays open.",
    text: "Still building. Still figuring it out. Maybe the next connection starts with you.",
    x: 974,
    y: 876,
    factor: 1.7,
    mobile: 1.0,
  },
];
