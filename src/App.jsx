import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion as Motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Github,
  Linkedin,
  Menu,
  Pause,
  Play,
  X,
} from "lucide-react";
import "./App.css";

const Sculpture = lazy(() => import("./Sculpture.jsx"));
const EMAIL = "shreyasboddani@gmail.com";
const RESUME = "/shreyas-resume.pdf?v=20261007";
const CHAPTERS = [
  {
    id: "build",
    number: "01",
    label: "Build something useful",
    title: "Start with a problem.\nMake something people can try.",
    description:
      "With Mentics, I went from an idea about college planning to a free beta with about 50 users. Building authentication, persistent data, and AI guidance was only part of it. The next part was listening to the people using it.",
    aside: "From an idea to a real beta",
    stat: "~50",
    statLabel: "Mentics beta users",
    tags: ["React + Flask", "User feedback", "Full-stack development"],
  },
  {
    id: "learn",
    number: "02",
    label: "Go a little deeper",
    title: "The interesting part\nis under the surface.",
    description:
      "Georgia Tech’s CS 1301 strengthened my foundations. Research took me further: silver nanoparticle experimental data, Random Forest models, and orbital collision-risk prediction. I like the process of finding out what the data can actually tell us.",
    aside: "A classroom is a starting point",
    stat: "CS 1301",
    statLabel: "Georgia Tech dual enrollment · A",
    tags: ["Machine learning", "Research", "Data visualization"],
  },
  {
    id: "people",
    number: "03",
    label: "Bring people along",
    title: "Good work gets better\nwhen it’s shared.",
    description:
      "I co-founded Learn AI Forsyth to help make AI education accessible. I also lead North Forsyth’s FBLA chapter and co-manage Educo’s peer tutoring. Sometimes useful work is a product. Sometimes it’s helping someone through a chemistry problem.",
    aside: "Beyond the screen",
    stat: "40+",
    statLabel: "Hours of chemistry tutoring",
    tags: ["Learn AI Forsyth", "FBLA president", "Educo co-president"],
  },
];
const PROJECTS = [
  {
    number: "01",
    name: "Mentics",
    category: "College planning, with a plan.",
    description:
      "A free college-planning beta that turns SAT and college goals into personalized roadmaps. I co-founded it, built the full stack, and kept iterating from user feedback.",
    detail: "~50 beta users · Co-founder & developer",
    tags: ["React", "Flask", "SQL", "Gemini"],
    image: "/mentics.png",
    href: "https://www.mentics.app/",
    link: "Explore the beta",
    className: "mentics",
  },
  {
    number: "02",
    name: "SafeRoute",
    category: "A safer way from A to B.",
    description:
      "A civilian safety route simulator built in 5.5 hours at Hack Forsyth. It combines map data and routing to explore paths around danger zones.",
    detail: "Hack Forsyth · September 2025",
    tags: ["Python", "OpenStreetMap", "OSRM"],
    image: "/saferoute.png",
    href: "https://github.com/shreyasboddani/SafeRoute",
    link: "View the source",
    className: "saferoute",
  },
];
const EXPERIENCE = [
  {
    date: "AUG 2026 — PRESENT",
    role: "Software Engineering Intern",
    org: "Cloud Supply Chain Services",
    text: "Contributing to 3D warehouse visualization and 2D floor-plan features for operational dashboards. Researching API tools and documenting requirements for the intern team.",
  },
  {
    date: "SUMMER 2026",
    role: "Programming Intern",
    org: "Cirrus Labs",
    text: "Prototyped AI/ML features, resolved data blockers, and merged code after senior engineer review. Co-authored AI safety research presented to the CTO and earned a two-month internship extension.",
  },
  {
    date: "2026 — PRESENT",
    role: "Co-Founder & Project Lead",
    org: "Learn AI Forsyth",
    text: "Co-leading free AI education, with outreach content reaching 180+ students. Developing learning materials and nonprofit assistant prototypes for The Place, Bald Ridge Lodge, and Mentor Me.",
    href: "https://learnai-forsyth.vercel.app/",
  },
  {
    date: "2025 — PRESENT",
    role: "President",
    org: "North Forsyth FBLA",
    text: "Leading recruitment, meetings, and service operations. Built the chapter’s first React site; as VP of Community Service, helped exceed the annual volunteer goal by 52%.",
  },
  {
    date: "MAY 2026 — PRESENT",
    role: "Co-President",
    org: "Educo Tutoring",
    text: "Co-managing tutor matching and session scheduling, recruiting peer tutors, and delivering 40+ hours of chemistry tutoring.",
  },
  {
    date: "2025 — 2026",
    role: "Student Researcher",
    org: "Biochemistry & Machine Learning",
    text: "Contributed to professor-supervised silver nanoparticle research and paper drafting. Explored Random Forest models, cross-validation, and feature importance in an independent ML extension.",
  },
];
const LAB = [
  {
    name: "The Place assistant",
    text: "Nonprofit chatbot with document retrieval, answer citations, and FAQ fallbacks.",
    type: "RAG / PROTOTYPE",
    href: "https://theplacechatbot.vercel.app/",
  },
  {
    name: "Space debris collision prediction",
    text: "Orbital data, collision-risk prediction components, and orbital visualizations.",
    type: "ML / RESEARCH",
  },
  {
    name: "Anime Discovery",
    text: "TF-IDF, similarity methods, and an autoencoder for finding your next watch.",
    type: "ML / RECOMMENDER",
    href: "https://github.com/shreyasboddani/anime-recommender",
  },
  {
    name: "Mind Metrics",
    text: "An earlier exploration of machine learning and student stress data.",
    type: "ML / EXPLORATION",
    href: "https://www.kaggle.com/code/shreyasboddani/shreyas-student-stress-monitoring-ml-project",
  },
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <Motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion.div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#top"
        onClick={() => setOpen(false)}
        aria-label="Shreyas Boddani, home"
      >
        <span className="brand-symbol" aria-hidden="true">
          sb.
        </span>
        <span>
          SHREYAS
          <br />
          BODDANI
        </span>
      </a>
      <nav
        id="navigation"
        className={open ? "navigation is-open" : "navigation"}
        aria-label="Main navigation"
      >
        <a href="#work" onClick={() => setOpen(false)}>
          The work <span>01</span>
        </a>
        <a href="#story" onClick={() => setOpen(false)}>
          The story <span>02</span>
        </a>
        <a href="#about" onClick={() => setOpen(false)}>
          The person <span>03</span>
        </a>
        <a
          className="mobile-contact"
          href="#contact"
          onClick={() => setOpen(false)}
        >
          Say hello <ArrowUpRight size={16} />
        </a>
      </nav>
      <div className="nav-right">
        <a
          className="resume-link"
          href={RESUME}
          target="_blank"
          rel="noreferrer"
        >
          Resume <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-button"
          aria-controls="navigation"
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <Motion.div
        className="reading-progress"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}

function SculptureFallback() {
  return (
    <div className="sculpture-fallback" aria-hidden="true">
      <div />
      <div />
      <div />
      <span />
    </div>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const handleUnavailable = useCallback(() => setUnavailable(true), []);
  return (
    <section id="top" className="hero page-width">
      <div className="hero-topline">
        <p>
          <span className="status-dot" /> DEVELOPER. STUDENT. STILL CURIOUS.
        </p>
        <span className="hero-location">
          CUMMING, GA <span>↗</span> CLASS OF ’27
        </span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="hello">
            Hey, I’m Shreyas <span aria-hidden="true">✳</span>
          </p>
          <h1>
            Curiosity,
            <br />
            put to{" "}
            <span className="work-word">
              work.
              <svg
                viewBox="0 0 350 25"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M3 18 Q120 1 340 10 M25 23 Q210 8 348 19" />
              </svg>
            </span>
          </h1>
          <p className="hero-description">
            I build software, explore machine learning, and bring people
            together. A high school senior in Georgia, figuring things out by
            making them.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#work">
              Take a look around <ArrowDownRight size={19} />
            </a>
            <a className="quiet-link" href="#contact">
              Let’s talk <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-coordinate coordinate-top">
            FIG. 01 / CONNECTING THE DOTS
          </div>
          <div className="orbit-outline orbit-one" />
          <div className="orbit-outline orbit-two" />
          {unavailable ? (
            <SculptureFallback />
          ) : (
            <Suspense fallback={<SculptureFallback />}>
              <Sculpture
                paused={paused || reduced}
                onUnavailable={handleUnavailable}
              />
            </Suspense>
          )}
          <span className="art-label label-build">
            <span /> building
          </span>
          <span className="art-label label-learn">
            <span /> learning
          </span>
          <span className="art-label label-people">
            <span /> people
          </span>
          <div className="art-bottom">
            <span>
              {unavailable || reduced
                ? "A FEW THINGS I KEEP CONNECTING"
                : "DRAG TO EXPLORE / A LITTLE PLAY GOES A LONG WAY"}
            </span>
            {!unavailable && !reduced && (
              <button
                type="button"
                className="art-pause"
                aria-label={paused ? "Play 3D animation" : "Pause 3D animation"}
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#work">
          <span className="scroll-arrow">
            <ArrowDown size={16} />
          </span>{" "}
          SCROLL. THERE’S A STORY HERE.
        </a>
        <p>
          Full-stack development <span>×</span> Machine learning <span>×</span>{" "}
          Community
        </p>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="work-section">
      <div className="page-width">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">01 / THE WORK</p>
            <h2>
              Less talking.
              <br />
              <span className="serif">More making.</span>
            </h2>
          </div>
          <p>
            Things I’ve built, problems I’ve explored,
            <br className="desktop-break" /> and a few ideas that made it out of
            my notebook.
          </p>
        </Reveal>
        <div className="selected-projects">
          {PROJECTS.map((project) => (
            <Reveal
              key={project.name}
              className={`project ${project.className}`}
            >
              <div className="project-visual">
                <div className="visual-top">
                  <span>SELECTED PROJECT / {project.number}</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <a
                  className="browser-frame"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${project.name}`}
                >
                  <div className="browser-chrome">
                    <span className="browser-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>{project.name.toLowerCase()} / a working idea</span>
                    <ArrowUpRight size={13} />
                  </div>
                  <img
                    src={project.image}
                    alt={`${project.name} application interface`}
                    loading="lazy"
                    width="1200"
                    height="750"
                  />
                </a>
                <div className="visual-caption">
                  <span>{project.detail}</span>
                  <span className="little-star" aria-hidden="true">
                    ✳
                  </span>
                </div>
              </div>
              <div className="project-copy">
                <span className="project-number">/{project.number}</span>
                <h3>{project.name}</h3>
                <p className="project-category">{project.category}</p>
                <p className="project-description">{project.description}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <a
                  className="project-link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.link}
                  <ArrowUpRight size={19} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="lab">
          <div className="lab-heading">
            <p className="eyebrow">ALSO ON THE WORKBENCH</p>
            <p>Experiments, prototypes & rabbit holes.</p>
          </div>
          {LAB.map((item, i) => {
            const Row = item.href ? "a" : "article";
            return (
              <Row
                className="lab-row"
                key={item.name}
                href={item.href}
                target={item.href ? "_blank" : undefined}
                rel={item.href ? "noreferrer" : undefined}
                aria-label={item.name}
              >
                <span className="lab-index">0{i + 3}</span>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                </div>
                <span className="lab-type">{item.type}</span>
                {item.href ? (
                  <ArrowUpRight size={23} />
                ) : (
                  <span className="research-note" aria-label="Research project">
                    —
                  </span>
                )}
              </Row>
            );
          })}
          <a
            className="quiet-link github-link"
            href="https://github.com/shreyasboddani"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={17} /> More on GitHub <ArrowUpRight size={15} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Story() {
  const target = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start center", "end center"],
  });
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const [active, setActive] = useState("build");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-25% 0px -40% 0px", threshold: 0 },
    );
    target.current
      .querySelectorAll(".story-chapter")
      .forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);
  return (
    <section className="story-section" id="story" ref={target}>
      <div className="page-width story-layout">
        <div className="story-sticky">
          <p className="eyebrow">02 / THE THREAD THAT CONNECTS IT</p>
          <h2>
            Build.
            <br />
            Learn.
            <br />
            <span className="serif">Give back.</span>
          </h2>
          <p className="story-intro">
            Different projects.
            <br />
            The same three instincts.
          </p>
          <nav className="chapter-nav" aria-label="Story chapters">
            {CHAPTERS.map((chapter) => (
              <a
                href={`#${chapter.id}`}
                key={chapter.id}
                className={active === chapter.id ? "active" : ""}
                aria-current={active === chapter.id ? "step" : undefined}
              >
                <span>{chapter.number}</span>
                {chapter.label}
                <ArrowDownRight size={15} />
              </a>
            ))}
          </nav>
          <Motion.div
            className="story-flower"
            style={{ rotate: reduced ? 0 : rotation }}
            aria-hidden="true"
          >
            ✳
          </Motion.div>
        </div>
        <div className="story-chapters">
          {CHAPTERS.map((chapter) => (
            <article className="story-chapter" id={chapter.id} key={chapter.id}>
              <Reveal>
                <div className="chapter-topline">
                  <span>CHAPTER {chapter.number}</span>
                  <span>{chapter.aside}</span>
                </div>
                <h3>
                  {chapter.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h3>
                <p className="chapter-description">{chapter.description}</p>
                <div className="chapter-stat">
                  <strong>{chapter.stat}</strong>
                  <span>{chapter.statLabel}</span>
                </div>
                <div className="tags">
                  {chapter.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="about" className="about-section page-width">
      <Reveal className="about-layout">
        <figure className="portrait">
          <div className="portrait-tape" aria-hidden="true" />
          <img
            src="/shreyas-headshot.png"
            alt="Shreyas smiling in front of a brick wall"
            loading="lazy"
            width="682"
            height="626"
          />
          <figcaption>
            <span>SHREYAS BODDANI</span>
            <span>A face to go with the code. ↗</span>
          </figcaption>
          <span className="portrait-note">yep, that’s me.</span>
        </figure>
        <div className="about-copy">
          <p className="eyebrow">03 / THE PERSON BEHIND THE PROJECTS</p>
          <h2>
            A work in
            <br />
            <span className="serif">progress.</span>
          </h2>
          <p>
            I’m Shreyas, a senior at North Forsyth High School. I’m interested
            in computer science, business, and what happens when you use both to
            solve a real problem.
          </p>
          <p>
            My week moves between code, student teams, research, and tutoring.
            Outside of that: squash, business strategy, and whatever the next
            project sends me down a rabbit hole about.
          </p>
          <div className="about-facts">
            <div>
              <strong>2027</strong>
              <span>North Forsyth graduating class</span>
            </div>
            <div>
              <strong>3 / 522</strong>
              <span>Class rank · 4.569 weighted GPA</span>
            </div>
          </div>
          <a
            className="quiet-link"
            href={RESUME}
            target="_blank"
            rel="noreferrer"
          >
            The full picture, on one page <Download size={16} />
          </a>
        </div>
      </Reveal>
      <div className="experience-layout">
        <Reveal>
          <p className="eyebrow">WHERE I’VE BEEN PUTTING IN THE WORK</p>
          <h2 className="smaller-heading">
            Learning
            <br />
            <span className="serif">by doing.</span>
          </h2>
          <p className="experience-note">
            A growing collection of teams,
            <br />
            responsibilities, and lessons.
          </p>
        </Reveal>
        <div className="experience-list">
          {(expanded ? EXPERIENCE : EXPERIENCE.slice(0, 3)).map((item) => (
            <Reveal className="experience-row" key={item.org}>
              <p className="experience-date">{item.date}</p>
              <h3>
                {item.org}
                {item.href && (
                  <a
                    href={item.href}
                    aria-label={`Visit ${item.org}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </h3>
              <p className="experience-role">{item.role}</p>
              <p className="experience-text">{item.text}</p>
            </Reveal>
          ))}
          <button
            className="experience-toggle"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Show leadership & research"}
            <span>{expanded ? "−" : "+"}</span>
          </button>
        </div>
      </div>
      <Reveal className="education-strip">
        <span className="eyebrow">THE FOUNDATIONS</span>
        <div>
          <strong>North Forsyth High School</strong>
          <span>Class of 2027 · CS / Web Development</span>
        </div>
        <div>
          <strong>Georgia Institute of Technology</strong>
          <span>CS 1301 · Dual enrollment · Fall 2025</span>
        </div>
        <div>
          <strong>Georgia State University</strong>
          <span>Dual enrollment coursework</span>
        </div>
        <div>
          <strong>The McCallie School</strong>
          <span>2023–24 · Michaels-Dickson Merit Scholar</span>
        </div>
      </Reveal>
      <Reveal className="recognition">
        <span className="recognition-symbol" aria-hidden="true">
          ✳
        </span>
        <div>
          <p className="eyebrow">A MOMENT I’M PROUD OF</p>
          <h3>
            1st in Georgia.
            <br />
            <span className="serif">4th in the nation.</span>
          </h3>
          <p>
            2026 FBLA Social Media Strategies. North Forsyth’s first top-10
            National Leadership Conference finish in 10 years.
          </p>
        </div>
        <div className="recognition-aside">
          <span>ALSO ALONG THE WAY</span>
          <p>GHP Computer Science State Semifinalist</p>
          <p>IT Specialist · Software Development</p>
          <p>CIW Website Development Associate</p>
          <p>UGA Certificate of Merit</p>
          <p>Dr. T.E.P. Woods Academic Excellence Award</p>
        </div>
      </Reveal>
      <Reveal className="toolkit">
        <p className="eyebrow">TOOLS I REACH FOR</p>
        <div>
          {[
            "Python",
            "TypeScript",
            "Java",
            "React / Next.js",
            "Flask / Express",
            "SQL",
            "TensorFlow",
            "Scikit-learn",
            "Pandas / NumPy",
            "RAG & retrieval",
            "Git / GitHub",
            "REST APIs",
          ].map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setCopyError(false);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <footer id="contact" className="contact-section">
      <div className="page-width">
        <Reveal className="contact-top">
          <div>
            <p className="eyebrow">04 / NEXT UP</p>
            <h2>
              Got something
              <br />
              <span className="serif">in mind?</span>
              <ArrowUpRight className="contact-arrow" aria-hidden="true" />
            </h2>
            <p>
              A project, an opportunity, or just a good conversation.
              <br />
              I’d like to hear about it.
            </p>
            <div className="email-line">
              <a href={`mailto:${EMAIL}`}>
                {EMAIL}
                <ArrowUpRight size={22} />
              </a>
              <button
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email address"}
                title={copied ? "Copied!" : "Copy email"}
              >
                {copied ? <Check size={19} /> : <Copy size={19} />}
              </button>
            </div>
            <span className="copy-status" role="status">
              {copied
                ? "Copied. Talk soon!"
                : copyError
                  ? "Select the email address to copy it, or click it to send a message."
                  : "\u00a0"}
            </span>
          </div>
          <div className="contact-note">
            <span aria-hidden="true">↙</span>
            <p>
              Always up for
              <br />a useful next step.
            </p>
          </div>
        </Reveal>
        <div className="footer-bottom">
          <a className="footer-brand" href="#top" aria-label="Back to top">
            sb.
          </a>
          <span>Shreyas Boddani · Georgia, USA</span>
          <div className="footer-links">
            <a
              href="https://github.com/shreyasboddani"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={15} /> GitHub <ArrowUpRight size={13} />
            </a>
            <a
              href="https://linkedin.com/in/shreyas-boddani"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={15} /> LinkedIn <ArrowUpRight size={13} />
            </a>
            <a href={RESUME} target="_blank" rel="noreferrer">
              Resume <ArrowUpRight size={13} />
            </a>
          </div>
          <a className="back-top" href="#top">
            Back to top <ArrowRight size={14} />
          </a>
        </div>
        <p className="colophon">
          A small corner of the internet. Built with care, still evolving.{" "}
          <span>© {new Date().getFullYear()}</span>
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <Story />
        <About />
      </main>
      <Contact />
    </>
  );
}
