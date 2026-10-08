import { useEffect, useRef, useState } from "react";
import {
  motion as Motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  FileSearch,
  Fingerprint,
} from "lucide-react";
import ExperienceSwitch from "./ExperienceSwitch";
import { FileContent } from "./CaseFile";
import { EXPERIENCE, PROJECTS, RESUME } from "./caseData";
import "./StoryWebsite.css";

const CHAPTERS = [
  ["person", "The person"],
  ["projects", "The builds"],
  ["experience", "In the field"],
  ["research", "A closer look"],
  ["community", "The people"],
  ["background", "The foundations"],
  ["contact", "The next thread"],
];

function Reveal({ children, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <Motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion.div>
  );
}

function Chapter({ id, number, eyebrow, title, lead, children, dark = false }) {
  return (
    <section
      id={id}
      className={`web-chapter ${dark ? "web-chapter-dark" : ""}`}
    >
      <div className="chapter-marker" aria-hidden="true">
        <span>{number}</span>
        <i />
      </div>
      <Reveal className="chapter-heading">
        <p className="web-kicker">
          {number} / {eyebrow}
        </p>
        <h2>{title}</h2>
        <p className="chapter-lead">{lead}</p>
      </Reveal>
      <Reveal className="chapter-evidence">{children}</Reveal>
    </section>
  );
}

function Project({ project, index }) {
  return (
    <Reveal className={`web-project ${index < 2 ? "featured-project" : ""}`}>
      <article>
        <div className="project-folder-tab">
          EXHIBIT {String(index + 1).padStart(2, "0")}
        </div>
        {project.image && (
          <div className="web-project-image">
            <img
              src={project.image}
              alt={`${project.name} application screenshot`}
              loading="lazy"
            />
          </div>
        )}
        <div className="web-project-copy">
          <p className="web-kicker">
            {project.kind}
            {project.date && ` / ${project.date}`}
          </p>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          {project.detail && <p>{project.detail}</p>}
          <div className="web-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {project.href && (
            <a href={project.href} target="_blank" rel="noreferrer">
              {project.link} <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function StoryWebsite({ onSwitch }) {
  const reduced = useReducedMotion();
  const main = useRef(null);
  const [active, setActive] = useState("person");
  const { scrollYProgress } = useScroll({
    target: main,
    offset: ["start start", "end end"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 0.12], [0, -75]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-12% 0px -65% 0px", threshold: 0 },
    );
    main.current
      .querySelectorAll("section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="web-edition">
      <a className="skip-link" href="#projects">
        Skip to projects
      </a>
      <header className="web-header">
        <a href="#person" className="web-brand">
          <FileSearch size={24} />
          <span>
            ON MY DESK<small>SHREYAS BODDANI / THE WEB EDITION</small>
          </span>
        </a>
        <div>
          <a
            href={RESUME}
            target="_blank"
            rel="noreferrer"
            className="web-resume"
          >
            Resume <Download size={15} />
          </a>
          <ExperienceSwitch view="web" onSwitch={onSwitch} />
        </div>
        <Motion.span
          className="web-reading-progress"
          style={{ scaleX: scrollYProgress }}
          aria-hidden="true"
        />
      </header>
      <nav className="web-chapter-nav" aria-label="Website chapters">
        {CHAPTERS.map(([id, label], index) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
          >
            <span>0{index + 1}</span>
            {label}
          </a>
        ))}
      </nav>
      <main ref={main} tabIndex={-1} id="web-story">
        <section className="web-hero" id="person">
          <svg
            className="hero-thread"
            viewBox="0 0 1400 800"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <Motion.path
              d="M-40 610 C260 610 180 125 420 240 S760 735 970 350 S1280 130 1440 170"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, delay: 0.25, ease: "easeInOut" }}
            />
          </svg>
          <div className="web-hero-copy">
            <Motion.p
              className="web-kicker"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              A PERSONAL PORTFOLIO / CUMMING, GEORGIA
            </Motion.p>
            <Motion.h1
              initial={reduced ? false : { opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12 }}
            >
              Behind every build,
              <br />
              <em>a person.</em>
            </Motion.h1>
            <Motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <p className="web-introduction">
                Hey, I’m <strong>Shreyas Boddani.</strong>
              </p>
              <p>
                I’m a high school senior who builds things, follows questions,
                and brings people along. This is the work—and the person
                connecting it.
              </p>
              <a className="web-primary-link" href="#projects">
                Follow the thread <ArrowDown size={17} />
              </a>
              <p className="hero-margin-note handwritten">
                A few things made it out of my notebook.
              </p>
            </Motion.div>
          </div>
          <Motion.div
            className="hero-dossier"
            style={{ y: reduced ? 0 : portraitY }}
            initial={reduced ? false : { opacity: 0, rotate: 0, y: 40 }}
            animate={{ opacity: 1, rotate: -3, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-folder-tab">001 / THE PERSON</div>
            <div className="hero-paper">
              <span className="paperclip" aria-hidden="true" />
              <figure>
                <img
                  src="/shreyas-headshot.png"
                  alt="Shreyas Boddani smiling in front of a brick wall"
                  fetchPriority="high"
                />
                <figcaption className="handwritten">
                  Still figuring it out. Still building.
                </figcaption>
              </figure>
              <div className="dossier-label">
                <Fingerprint size={30} />
                <div>
                  <strong>SHREYAS BODDANI</strong>
                  <span>DEVELOPER · STUDENT · CURIOUS HUMAN</span>
                </div>
              </div>
            </div>
            <span className="dossier-stamp">A WORK IN PROGRESS</span>
          </Motion.div>
          <div className="hero-case-note">
            <span>THE THREAD</span>
            <p>Curiosity → something useful → people.</p>
          </div>
        </section>
        <section className="web-person-note" aria-label="A little about me">
          <Reveal>
            <span className="handwritten">
              Before we get into the evidence…
            </span>
            <p>
              I’m a senior at North Forsyth High School, interested in computer
              science, business, and what happens when you use both to solve a
              real problem. My week moves between code, student teams, research,
              and tutoring. Outside of that: squash, business strategy, and the
              next rabbit hole.
            </p>
          </Reveal>
        </section>
        <Chapter
          id="projects"
          number="02"
          eyebrow="IDEAS THAT MADE IT OUT"
          title={
            <>
              A question.
              <br />
              Then a working thing.
            </>
          }
          lead="College planning. Safer routes. Better access to information. The projects start with something that could be a little more useful."
        >
          <div className="web-proof-strip">
            <div>
              <strong>~50</strong>
              <span>Mentics beta users</span>
            </div>
            <div>
              <strong>5.5 hrs</strong>
              <span>SafeRoute hackathon build</span>
            </div>
            <span className="handwritten">
              Real projects. Plenty of revisions.
            </span>
          </div>
          <div className="web-project-grid">
            {PROJECTS.map((project, index) => (
              <Project key={project.name} project={project} index={index} />
            ))}
          </div>
        </Chapter>
        <Chapter
          id="experience"
          number="03"
          eyebrow="IN THE FIELD"
          dark
          title={
            <>
              The work gets real.
              <br />
              <em>So do the responsibilities.</em>
            </>
          }
          lead="Building on my own is one thing. Contributing to an engineering team brings reviews, constraints, and people depending on the work."
        >
          <div className="web-experience">
            {EXPERIENCE.slice(0, 2).map((item, i) => (
              <article key={item.org}>
                <span className="field-number">0{i + 1}</span>
                <p className="web-kicker">{item.date}</p>
                <h3>{item.org}</h3>
                <span className="web-role">{item.role}</span>
                <p>{item.description}</p>
                <span className="field-signoff">FIELD NOTE / ENGINEERING</span>
              </article>
            ))}
          </div>
          <div className="field-thread" aria-hidden="true">
            <i />
            <span>BUILD → REVIEW → LEARN → BUILD AGAIN</span>
            <i />
          </div>
        </Chapter>
        <Chapter
          id="research"
          number="04"
          eyebrow="LOOK A LITTLE CLOSER"
          title={
            <>
              Some questions
              <br />
              deserve another page.
            </>
          }
          lead="What can experimental data tell us? How do we examine orbital collision risk? Research gives curiosity a more careful way to work."
        >
          <div className="web-file-content web-research">
            <FileContent id="research" />
          </div>
        </Chapter>
        <Chapter
          id="community"
          number="05"
          eyebrow="THE THREAD COMES BACK TO PEOPLE"
          title={
            <>
              Useful work happens
              <br />
              <em>away from the keyboard, too.</em>
            </>
          }
          lead="Free AI education, student teams, and chemistry tutoring. A tool matters more when people can actually use it."
        >
          <div className="web-file-content web-community">
            <FileContent id="community" />
          </div>
          <div className="community-proof">
            <span>
              <strong>180+</strong> students reached through outreach content
            </span>
            <span>
              <strong>40+</strong> hours of chemistry tutoring
            </span>
          </div>
        </Chapter>
        <Chapter
          id="background"
          number="06"
          eyebrow="FOUNDATIONS & MILESTONES"
          title={
            <>
              Still a student.
              <br />
              Still collecting questions.
            </>
          }
          lead="The coursework, tools, and moments behind the work. There’s a lot left to learn."
        >
          <div className="web-file-content web-background">
            <FileContent id="education" />
            <div className="web-record">
              <h3 className="record-heading">A few notes for the record.</h3>
              <FileContent id="recognition" />
            </div>
          </div>
        </Chapter>
        <Chapter
          id="contact"
          number="07"
          eyebrow="AN OPEN ENDING"
          dark
          title={
            <>
              The next thread
              <br />
              <em>could start with you.</em>
            </>
          }
          lead="A project, an opportunity to learn, or a good conversation. I’d like to see where it goes."
        >
          <div className="web-file-content web-contact">
            <FileContent id="contact" />
          </div>
          <button className="web-desk-invitation" onClick={onSwitch}>
            <FileSearch size={24} />
            <span>
              <strong>There’s a whole room behind these pages.</strong>
              <small>Step inside the interactive 3D story.</small>
            </span>
            <ArrowUpRight size={22} />
          </button>
        </Chapter>
      </main>
      <footer className="web-footer">
        <span>SHREYAS BODDANI / ON MY DESK</span>
        <span className="handwritten">Thanks for following the thread.</span>
        <a href="#person">Back to the beginning ↑</a>
      </footer>
    </div>
  );
}
