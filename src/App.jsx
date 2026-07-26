import { createElement, useEffect, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Code2,
  Download,
  Github,
  GraduationCap,
  HeartHandshake,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import './App.css';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/shreyasboddani', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/shreyas-boddani-15785834a', icon: Linkedin },
  { label: 'Email', href: 'mailto:shreyasboddani@gmail.com', icon: Mail },
];

const NOW = [
  {
    icon: BriefcaseBusiness,
    title: 'Summer intern',
    org: 'CirrusLabs',
    meta: 'Summer 2026 · Alpharetta, GA',
    text: 'Building internal Python and React full-stack projects and contributing to AI research.',
    tone: 'orange',
  },
  {
    icon: Users,
    title: 'Chapter president',
    org: 'North Forsyth FBLA',
    meta: '2026–27',
    text: 'Leading the chapter after a year as VP of Community Service, with a focus on useful programs and a strong team culture.',
    tone: 'green',
  },
  {
    icon: HeartHandshake,
    title: 'Co-president',
    org: 'Educo',
    meta: '2026–present',
    text: 'Helping run a student tutoring organization after serving as a tutor and VP of Community Service.',
    tone: 'lavender',
  },
  {
    icon: Sparkles,
    title: 'Co-founder',
    org: 'LearnAI Forsyth',
    meta: '2026–present',
    text: 'Co-leading a student team that runs free AI workshops and builds practical AI tools for Forsyth County businesses and nonprofits.',
    link: 'https://learnai-forsyth.vercel.app/',
    linkLabel: 'Explore LearnAI Forsyth',
    tone: 'yellow',
  },
  {
    icon: GraduationCap,
    title: 'CS ambassador',
    org: 'Forsyth County Schools',
    meta: '2026–present',
    text: 'Representing North Forsyth High School and the county’s computer science pathway.',
    tone: 'blue',
  },
];

const PROJECTS = [
  {
    name: 'Mentics',
    type: 'AI college planning platform',
    description: 'A full-stack product that turns college goals into practical roadmaps, progress tracking, and AI-guided support.',
    tags: ['React', 'Flask', 'Gemini AI', 'OAuth 2.0'],
    image: '/mentics.png',
    href: 'https://mentics.onrender.com/',
    accent: 'violet',
  },
  {
    name: 'SafeRoute',
    type: 'Hackathon prototype',
    description: 'A civilian safety simulation with danger zones and real-time evacuation routing, built in 5.5 hours.',
    tags: ['Python', 'Tkinter', 'OpenStreetMap', 'OSRM'],
    image: '/saferoute.png',
    href: 'https://github.com/shreyasboddani/SafeRoute',
    accent: 'moss',
  },
  {
    name: 'Anime Discovery',
    type: 'ML recommender',
    description: 'A recommendation engine combining content-based filtering, custom heuristics, and autoencoders.',
    tags: ['TensorFlow', 'TF-IDF', 'Pandas'],
    image: '/anime.png',
    href: 'https://anime-discovery-48yh.onrender.com/',
    accent: 'berry',
  },
  {
    name: 'Mind Metrics',
    type: 'Student wellness ML',
    description: 'A machine-learning pipeline that predicts student stress at roughly 90% accuracy and surfaces key factors.',
    tags: ['Scikit-learn', 'SVM', 'Random Forest'],
    image: '/ml.png',
    href: 'https://www.kaggle.com/code/shreyasboddani/shreyas-student-stress-monitoring-ml-project',
    accent: 'coral',
  },
];

const TOOLKIT = [
  'Python', 'Java', 'JavaScript', 'React', 'Flask', 'HTML & CSS',
  'Tailwind CSS', 'TensorFlow', 'scikit-learn', 'Pandas', 'SQLite',
  'REST APIs', 'OAuth 2.0', 'Git & GitHub',
];

const LEARNING = [
  {
    school: 'North Forsyth High School',
    detail: 'Class of 2027 · Cumming, Georgia',
  },
  {
    school: 'Georgia Institute of Technology',
    detail: 'Dual enrollment · CS 1301 · Fall 2025',
  },
  {
    school: 'Georgia State University',
    detail: 'Additional dual-enrollment study',
  },
  {
    school: 'The McCallie School',
    detail: 'Student · 2023–24',
  },
];

const JOURNEY = [
  {
    chapter: '01',
    period: '2023–24',
    title: 'Curiosity became direction.',
    text: 'At McCallie, computer science stopped feeling like just another class. It became the thing I wanted to keep doing after the assignment was over.',
  },
  {
    chapter: '02',
    period: '2024–25',
    title: 'I found the people side.',
    text: 'At North Forsyth, I joined FBLA and Educo, started tutoring, and learned that building trust and building software have more in common than I expected.',
  },
  {
    chapter: '03',
    period: '2025–26',
    title: 'Ideas started shipping.',
    text: 'Georgia Tech dual enrollment deepened the fundamentals while projects like Mentics and SafeRoute gave me a reason to apply them under real constraints.',
  },
  {
    chapter: '04',
    period: 'Now',
    title: 'The scope keeps growing.',
    text: 'I’m leading FBLA and Educo, co-building LearnAI Forsyth, learning inside a professional engineering team, and getting more intentional about the problems I choose.',
  },
];

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <Motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion.div>
  );
}

function Nav({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Shreyas Boddani, home" onClick={close}>
        <span>SB</span>
        <span className="brand-dot" aria-hidden="true" />
      </a>

      <div className="nav-actions">
        <nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
          <a href="#about" onClick={close}>About</a>
          <a href="#journey" onClick={close}>Journey</a>
          <a href="#now" onClick={close}>Now</a>
          <a href="#work" onClick={close}>Work</a>
          <a href="#contact" onClick={close}>Contact</a>
          <a className="resume-link" href="/shreyas-resume.pdf" target="_blank" rel="noreferrer" onClick={close}>
            Resume <Download size={15} />
          </a>
        </nav>

        <button
          className="theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="menu-button"
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function SocialLinks() {
  return (
    <div className="social-links" aria-label="Social links">
      {SOCIALS.map((social) => (
        <a key={social.label} href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
          {createElement(social.icon, { size: 17 })}
          <span>{social.label}</span>
        </a>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span /> Full-stack & ML developer · Student leader</p>
        <p className="hero-hello">Hi, I’m</p>
        <h1 aria-label="Shreyas Boddani">
          <span>SHREYAS</span>
          <span className="hero-last-name">BODDANI</span>
        </h1>
        <p className="hero-tagline">Developer, student leader, and professional problem-noticer.</p>
        <p className="hero-intro">
          I like code because it turns “someone should fix that” into “here, try this.”
          I’m a high school senior building useful software, leading student teams,
          and learning how good ideas become things people actually care about.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#work">
            See what I’ve built <ArrowDownRight size={18} />
          </a>
          <a className="text-link" href="#journey">
            Get to know me <ArrowDownRight size={17} />
          </a>
        </div>
        <SocialLinks />
      </div>

      <figure className="hero-portrait">
        <div className="portrait-image-wrap">
          <img src="/shreyas-headshot.png" alt="Shreyas Boddani" />
        </div>
        <figcaption className="portrait-caption">
          <div>
            <span>Shreyas Boddani</span>
            <strong>Full-stack & ML developer</strong>
          </div>
          <span className="portrait-class">Class of ’27</span>
        </figcaption>
        <div className="portrait-note">Build with people in mind.</div>
        <div className="portrait-location"><MapPin size={14} /> Cumming, Georgia</div>
      </figure>
    </section>
  );
}

function ProofStrip() {
  return (
    <section className="proof-strip" aria-label="A few quick facts">
      <div>
        <strong>’27</strong>
        <span>North Forsyth</span>
      </div>
      <div>
        <strong>GT</strong>
        <span>CS 1301 dual enrollment</span>
      </div>
      <div>
        <strong>4</strong>
        <span>Shipped projects across full-stack and ML</span>
      </div>
      <div>
        <strong>20+</strong>
        <span>Hours spent tutoring students</span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <Reveal className="section-heading">
        <p className="eyebrow"><span /> More than the GitHub graph</p>
        <h2>Technology is the tool.<br />People are the point.</h2>
      </Reveal>

      <div className="about-grid">
        <Reveal className="about-lead">
          <p>
            I’m an aspiring computer scientist drawn to the overlap between software,
            business, and real human problems. I like building from zero: finding the
            messy part, asking better questions, and turning it into something people can use.
          </p>
        </Reveal>
        <Reveal className="about-details" delay={0.08}>
          <p>
            That same instinct shows up outside code. I lead teams in FBLA and Educo,
            tutor younger students, and co-founded LearnAI Forsyth to make technical ideas
            feel less intimidating. Good work, to me, is clear, generous, and built to matter.
          </p>
          <div className="personal-note">
            <span>Also in the mix</span>
            <p>Squash, business strategy, presenting ideas, and learning whatever the next project demands.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section journey" id="journey">
      <Reveal className="section-heading heading-row">
        <div>
          <p className="eyebrow"><span /> The journey so far</p>
          <h2>No master plan.<br />Just a useful next step.</h2>
        </div>
        <p className="heading-note">
          I didn’t wake up with a personal brand. I kept following the work that made me curious and the people I could help.
        </p>
      </Reveal>

      <div className="journey-grid">
        {JOURNEY.map((item, index) => (
          <Reveal className="journey-chapter" delay={index * 0.05} key={item.chapter}>
            <div className="chapter-top">
              <span>{item.chapter}</span>
              <span>{item.period}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function NowSection() {
  return (
    <section className="section now-section" id="now">
      <Reveal className="section-heading heading-row">
        <div>
          <p className="eyebrow eyebrow-light"><span /> What I’m doing now</p>
          <h2>Building. Leading.<br />Still learning.</h2>
        </div>
        <p className="heading-note">A current snapshot of the work, teams, and communities I care about.</p>
      </Reveal>

      <div className="now-grid">
        {NOW.map((item, index) => (
          <Reveal className={`now-card tone-${item.tone}`} delay={index * 0.05} key={`${item.org}-${item.title}`}>
            <div className="now-icon"><item.icon size={22} /></div>
            <span className="now-meta">{item.meta}</span>
            <h3>{item.title}</h3>
            <h4>{item.org}</h4>
            <p>{item.text}</p>
            {item.link && (
              <a className="now-card-link" href={item.link} target="_blank" rel="noreferrer">
                {item.linkLabel} <ArrowUpRight size={16} />
              </a>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, featured = false }) {
  return (
    <article className={`project-card project-${project.accent} ${featured ? 'project-featured' : ''}`}>
      <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
        <div className="project-image-wrap">
          <img src={project.image} alt={`${project.name} interface`} loading="lazy" />
          <span className="project-open"><ArrowUpRight size={20} /></span>
        </div>
        <div className="project-copy">
          <div>
            <p className="project-type">{project.type}</p>
            <h3>{project.name}</h3>
          </div>
          <p className="project-description">{project.description}</p>
          <div className="tag-list">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </a>
    </article>
  );
}

function Work() {
  return (
    <section className="section work" id="work">
      <Reveal className="section-heading heading-row">
        <div>
          <p className="eyebrow"><span /> Selected work</p>
          <h2>Projects with<br />a reason to exist.</h2>
        </div>
        <p className="heading-note dark-note">
          Four builds across education, public safety, recommendations, and student wellness.
        </p>
      </Reveal>

      <div className="projects-grid">
        <Reveal className="project-feature-wrap"><ProjectCard project={PROJECTS[0]} featured /></Reveal>
        {PROJECTS.slice(1).map((project, index) => (
          <Reveal key={project.name} delay={index * 0.05}><ProjectCard project={project} /></Reveal>
        ))}
      </div>
    </section>
  );
}

function Learning() {
  return (
    <section className="section learning">
      <div className="learning-grid">
        <Reveal className="education-column">
          <p className="eyebrow"><span /> Education</p>
          <h2>Learning in<br />more than one room.</h2>
          <div className="learning-list">
            {LEARNING.map((item) => (
              <div key={item.school}>
                <h3>{item.school}</h3>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="toolkit-card" delay={0.08}>
          <div className="toolkit-heading">
            <Code2 size={24} />
            <div>
              <p className="eyebrow"><span /> Toolkit</p>
              <h2>What I build with</h2>
            </div>
          </div>
          <div className="toolkit-list">
            {TOOLKIT.map((tool) => <span key={tool}>{tool}</span>)}
          </div>
          <p className="toolkit-footnote">Tools change. Clear thinking travels well.</p>
        </Reveal>
      </div>

      <div className="credentials-grid">
        <Reveal className="credential-card credential-awards">
          <Trophy size={25} />
          <p className="credential-kicker">Recognition</p>
          <h3>2026 Georgia FBLA State Champion</h3>
          <p>Social Media Strategies · also 4th at the FBLA National Leadership Conference.</p>
        </Reveal>
        <Reveal className="credential-card" delay={0.06}>
          <Award size={25} />
          <p className="credential-kicker">Academic recognition</p>
          <h3>GHP State Semifinalist</h3>
          <p>Computer Science</p>
        </Reveal>
        <Reveal className="credential-card" delay={0.12}>
          <Award size={25} />
          <p className="credential-kicker">Certification</p>
          <h3>IT Specialist</h3>
          <p>Software Development</p>
        </Reveal>
        <Reveal className="credential-card" delay={0.18}>
          <Award size={25} />
          <p className="credential-kicker">Certification</p>
          <h3>CIW Associate</h3>
          <p>Website Development</p>
        </Reveal>
      </div>
    </section>
  );
}

function Future() {
  return (
    <section className="section future" id="future">
      <Reveal className="future-intro">
        <p className="eyebrow"><span /> What’s next</p>
        <h2>I’m building toward work that is technically strong and genuinely useful.</h2>
        <p>
          I want to study computer science, keep shipping products with real users,
          and grow into the kind of engineer who understands people and business as deeply as technology.
        </p>
      </Reveal>

      <div className="future-grid">
        <Reveal className="future-principles">
          <div>
            <span>01</span>
            <h3>Learn deeply</h3>
            <p>Build the fundamentals, stay curious, and avoid confusing familiarity with understanding.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Build for people</h3>
            <p>Make products that solve a real problem—and are clear enough that someone wants to use them.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Lead well</h3>
            <p>Create teams where people feel trusted, do their best work, and know why the work matters.</p>
          </div>
        </Reveal>

        <Reveal className="looking-card" delay={0.08}>
          <p className="aside-label">Right now, I’m looking for</p>
          <h3>Good problems and good people.</h3>
          <p>
            Internships where I can contribute, mentors who will challenge my thinking,
            and collaborators who care more about making something useful than sounding impressive.
          </p>
          <a href="mailto:shreyasboddani@gmail.com">Start a conversation <ArrowUpRight size={17} /></a>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="contact-spark" aria-hidden="true">✦</div>
      <Reveal>
        <p className="eyebrow eyebrow-light"><span /> Let’s make something useful</p>
        <h2>Have a problem worth<br /><em>building for?</em></h2>
        <p className="contact-copy">
          I’m always happy to talk about software, AI, student-led ideas, internships,
          or the ambitious thing you’re not quite sure how to start.
        </p>
        <a className="button button-light" href="mailto:shreyasboddani@gmail.com">
          shreyasboddani@gmail.com <ArrowUpRight size={18} />
        </a>
      </Reveal>

      <div className="footer-bottom">
        <div>
          <strong>Shreyas Boddani</strong>
          <span>Built with curiosity in Georgia.</span>
        </div>
        <SocialLinks />
        <span>© 2026</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="site-shell">
      <Nav theme={theme} onToggleTheme={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} />
      <main>
        <Hero />
        <ProofStrip />
        <About />
        <Journey />
        <NowSection />
        <Work />
        <Learning />
        <Future />
      </main>
      <Contact />
    </div>
  );
}
