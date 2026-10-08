import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  X,
} from "lucide-react";
import {
  EMAIL,
  EXPERIENCE,
  FILES,
  PROJECTS,
  RESUME,
  SOCIALS,
} from "./caseData";

function Tags({ items }) {
  return (
    <div className="file-tags">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ProfileFile() {
  return (
    <div className="profile-file">
      <figure>
        <img
          src="/shreyas-headshot.png"
          alt="Shreyas Boddani smiling in front of a brick wall"
        />
        <figcaption>A face to go with the code.</figcaption>
      </figure>
      <div>
        <p className="file-kicker">A LITTLE ABOUT ME / CUMMING, GEORGIA</p>
        <h3>Hey, I’m Shreyas.</h3>
        <p>
          I’m a senior at North Forsyth High School, interested in computer
          science, business, and what happens when you use both to solve a real
          problem.
        </p>
        <p>
          My week moves between code, student teams, research, and tutoring. I’m
          learning how to make things useful by building them and paying
          attention to the people using them.
        </p>
        <p>
          Outside of that: squash, business strategy, and whatever the next
          project sends me down a rabbit hole about.
        </p>
        <div className="handwritten file-personal">
          There’s a person behind all of this.
        </div>
        <a className="file-link" href={RESUME} target="_blank" rel="noreferrer">
          The whole story, on one page <Download size={16} />
        </a>
      </div>
    </div>
  );
}

function ProjectsFile() {
  return (
    <div className="file-projects">
      {PROJECTS.map((project, i) => (
        <article key={project.name} className="file-project">
          {project.image && (
            <img
              src={project.image}
              alt={`${project.name} application screenshot`}
              loading="lazy"
            />
          )}
          <div>
            <p className="file-kicker">
              BUILD {String(i + 1).padStart(2, "0")} / {project.kind}
            </p>
            <h3>{project.name}</h3>
            {project.date && <span className="file-date">{project.date}</span>}
            <p>{project.description}</p>
            {project.detail && <p>{project.detail}</p>}
            <Tags items={project.tags} />
            {project.href && (
              <a
                className="file-link"
                href={project.href}
                target="_blank"
                rel="noreferrer"
              >
                {project.link} <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function ExperienceFile() {
  return (
    <div className="file-timeline">
      {EXPERIENCE.map((item) => (
        <article key={item.org}>
          <p className="file-date">{item.date}</p>
          <h3>{item.org}</h3>
          <span className="role-label">{item.role}</span>
          <p>{item.description}</p>
          {item.href && (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="file-link"
            >
              Visit the organization <ArrowUpRight size={16} />
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

function ResearchFile() {
  return (
    <>
      <div className="file-note">
        <span className="handwritten">Questions worth following.</span>
        <p>
          Two different ways of looking for patterns, testing an idea, and
          figuring out what the data can actually support.
        </p>
      </div>
      <article className="file-section">
        <p className="file-kicker">RESEARCH NOTE A / 2025–2026</p>
        <h3>Silver nanoparticles & machine learning</h3>
        <p>
          I contributed to professor-supervised research on silver nanoparticle
          experimental data and paper drafting. In an independent ML extension,
          I explored Random Forest models, cross-validation, and feature
          importance.
        </p>
        <Tags
          items={["Random Forest", "Cross-validation", "Feature importance"]}
        />
        <a
          className="file-link"
          href="https://github.com/shreyasboddani/Nano-Particles-ML-Prediction"
          target="_blank"
          rel="noreferrer"
        >
          Read the ML project <ArrowUpRight size={16} />
        </a>
      </article>
      <article className="file-section">
        <p className="file-kicker">RESEARCH NOTE B / 2025–2026</p>
        <h3>Space debris collision prediction</h3>
        <p>
          I analyzed orbital data and developed collision-risk prediction
          components and orbital visualizations. An exploration of how machine
          learning can help make a large, messy problem easier to examine.
        </p>
        <Tags items={["Orbital data", "ML modeling", "Visualization"]} />
      </article>
    </>
  );
}

function CommunityFile() {
  return (
    <>
      <div className="file-note green-note">
        <span className="handwritten">Useful work isn’t always code.</span>
      </div>
      {EXPERIENCE.slice(2, 5).map((item, i) => (
        <article className="file-section" key={item.org}>
          <p className="file-kicker">
            CONNECTION {i + 1} / {item.date}
          </p>
          <h3>{item.org}</h3>
          <span className="role-label">{item.role}</span>
          <p>{item.description}</p>
          {i === 0 && (
            <p>
              Our nonprofit outreach and assistant prototypes include work for
              The Place, Bald Ridge Lodge, and Mentor Me.
            </p>
          )}
          {item.href && (
            <a
              className="file-link"
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              Explore Learn AI Forsyth <ArrowUpRight size={16} />
            </a>
          )}
        </article>
      ))}
    </>
  );
}

function EducationFile() {
  return (
    <>
      <div className="file-stats">
        <div>
          <strong>2027</strong>
          <span>Graduating class</span>
        </div>
        <div>
          <strong>4.569</strong>
          <span>Weighted GPA</span>
        </div>
        <div>
          <strong>3 / 522</strong>
          <span>Class rank</span>
        </div>
      </div>
      <article className="file-section">
        <p className="file-kicker">AUG. 2024 — MAY 2027 / CUMMING, GA</p>
        <h3>North Forsyth High School</h3>
        <p>
          Computer Science / Web Development pathway. AP coursework includes
          Computer Science A, Chemistry, Statistics, English Language, and U.S.
          History, with Calculus AB/BC and Physics C in progress.
        </p>
        <p>
          CTAE Computer Science Ambassador, FBLA President, and Educo
          Co-President.
        </p>
      </article>
      <article className="file-section">
        <p className="file-kicker">FALL 2025 / DUAL ENROLLMENT</p>
        <h3>Georgia Institute of Technology</h3>
        <p>
          Distance Computer Science Dual Enrollment. CS 1301: Introduction to
          Computing — earned an A.
        </p>
      </article>
      <article className="file-section">
        <p className="file-kicker">DUAL ENROLLMENT</p>
        <h3>Georgia State University</h3>
        <p>
          Government, Humanities, Information Systems, Business, and Critical
          Thinking coursework.
        </p>
      </article>
      <article className="file-section">
        <p className="file-kicker">AUG. 2023 — MAY 2024 / CHATTANOOGA, TN</p>
        <h3>The McCallie School</h3>
        <p>
          Honors coursework and AP Computer Science Principles. Michaels-Dickson
          Merit Scholar.
        </p>
      </article>
      <article className="file-section">
        <p className="file-kicker">TOOLS OF THE TRADE</p>
        <h3>What I work with</h3>
        <Tags
          items={[
            "Python",
            "Java",
            "JavaScript",
            "TypeScript",
            "SQL",
            "React",
            "Next.js",
            "Flask",
            "Express",
            "HTML/CSS",
            "Tailwind CSS",
            "PostgreSQL",
            "MongoDB",
            "SQLite",
            "Scikit-learn",
            "TensorFlow / Keras",
            "Pandas",
            "NumPy",
            "RAG",
            "Git / GitHub",
            "REST APIs",
            "OAuth",
            "Render",
            "Vercel",
            "Google Cloud",
            "Matplotlib",
          ]}
        />
      </article>
    </>
  );
}

function RecognitionFile() {
  return (
    <>
      <div className="file-award">
        <span className="stamp">FOR THE RECORD</span>
        <h3>
          1st in Georgia.
          <br />
          4th nationally.
        </h3>
        <p>
          2026 FBLA Social Media Strategies. North Forsyth’s first top-10
          National Leadership Conference finish in 10 years.
        </p>
      </div>
      <div className="file-timeline">
        {[
          [
            "Georgia Governor’s Honors Program",
            "Computer Science State Semifinalist · 2026",
          ],
          [
            "IT Specialist — Software Development",
            "Certiport / Pearson VUE · April 2025",
          ],
          [
            "CIW Website Development Associate",
            "Certified in website development",
          ],
          [
            "Michaels-Dickson Scholar",
            "$28,000 merit scholarship · The McCallie School",
          ],
          ["Dr. T.E.P. Woods Award", "Academic Excellence"],
          ["University of Georgia", "Certificate of Merit"],
        ].map(([title, text]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function ContactFile() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setError(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setError(true);
    }
  };
  return (
    <div className="contact-file">
      <p className="handwritten">Let’s see where this goes.</p>
      <p>
        I’m up for a project, an opportunity to learn, or a conversation about
        something worth building.
      </p>
      <div className="file-email">
        <a href={`mailto:${EMAIL}`}>
          {EMAIL}
          <ArrowUpRight size={20} />
        </a>
        <button
          aria-label={copied ? "Email copied" : "Copy email address"}
          onClick={copy}
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
      <p className="copy-status" role="status">
        {copied
          ? "Copied. Talk soon!"
          : error
            ? "Select the address to copy it, or click it to send an email."
            : "\u00a0"}
      </p>
      <div className="contact-links">
        {SOCIALS.map((social) => (
          <a
            className="file-link"
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
          >
            {social.label}
            <ArrowUpRight size={16} />
          </a>
        ))}
        <a className="file-link" href={RESUME} target="_blank" rel="noreferrer">
          Resume
          <Download size={16} />
        </a>
      </div>
      <span className="file-signature handwritten">— Shreyas</span>
    </div>
  );
}

const CONTENT = {
  profile: ProfileFile,
  projects: ProjectsFile,
  experience: ExperienceFile,
  research: ResearchFile,
  community: CommunityFile,
  education: EducationFile,
  recognition: RecognitionFile,
  contact: ContactFile,
};

export function FileContent({ id }) {
  const Content = CONTENT[id];
  return Content ? <Content /> : null;
}

export default function CaseFile({
  selected,
  visited,
  onSelect,
  onClose,
  closing,
}) {
  const dialog = useRef(null);
  const body = useRef(null);
  const previousFocus = useRef(null);
  const file = FILES.find((item) => item.id === selected);
  const Content = CONTENT[selected];
  const index = FILES.findIndex((item) => item.id === selected);
  useEffect(() => {
    previousFocus.current = document.activeElement;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, []);
  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [selected]);
  return (
    <dialog
      ref={dialog}
      className={`case-dialog ${closing ? "is-closing" : ""}`}
      aria-labelledby="case-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="case-folder">
        <div className="folder-cover" aria-hidden="true">
          <span>ON MY DESK / SHREYAS BODDANI</span>
          <strong>{file?.label || "A little bit of everything."}</strong>
          <i>OPEN. GET CURIOUS.</i>
          <small>{file?.code || "INDEX"} / NOTES & THINGS</small>
        </div>
        <div className="folder-tab">ON MY DESK / SHREYAS BODDANI</div>
        <div className="case-file-header">
          <div>
            <p className="file-kicker">
              {file
                ? `NOTE ${file.code} / ${file.label.toUpperCase()}`
                : "DESK INDEX / FOLLOW YOUR CURIOSITY"}
            </p>
            <h2 id="case-title">{file?.title || "Everything on the table."}</h2>
            <p>
              {file?.subtitle || "Open any file. There’s no required order."}
            </p>
          </div>
          <button
            className="close-file"
            onClick={onClose}
            aria-label="Close file"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="file-tabs" aria-label="Portfolio files">
          <button
            className={selected === "index" ? "selected" : ""}
            onClick={() => onSelect("index")}
            aria-pressed={selected === "index"}
          >
            Index
          </button>
          {FILES.map((item) => (
            <button
              key={item.id}
              className={selected === item.id ? "selected" : ""}
              aria-pressed={selected === item.id}
              aria-label={`Note ${item.code}: ${item.label}`}
              title={item.label}
              onClick={() => onSelect(item.id)}
            >
              {item.code}
            </button>
          ))}
        </nav>
        <div
          className="case-file-body"
          ref={body}
          tabIndex={0}
          role="region"
          aria-label={`${file?.label || "Desk index"} contents`}
        >
          <div className="file-page-turn" key={selected}>
            {Content ? (
              <Content />
            ) : (
              <div className="case-index">
                {FILES.map((item) => (
                  <button
                    key={item.id}
                    className={`index-card index-${item.color}`}
                    onClick={() => onSelect(item.id)}
                  >
                    <span className="index-code">
                      NOTE {item.code}
                      {visited.includes(item.id) && (
                        <Check size={14} aria-label="Opened" />
                      )}
                    </span>
                    <strong>{item.label}</strong>
                    <span>{item.subtitle}</span>
                    <ArrowUpRight size={19} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="case-file-footer">
          <span>PERSONAL ARCHIVE / SHREYAS BODDANI</span>
          <div>
            {file && (
              <>
                <button
                  onClick={() =>
                    onSelect(
                      FILES[(index + FILES.length - 1) % FILES.length].id,
                    )
                  }
                  aria-label="Previous file"
                >
                  <ArrowLeft size={16} />
                </button>
                <span>{file.code} / 008</span>
                <button
                  onClick={() => onSelect(FILES[(index + 1) % FILES.length].id)}
                  aria-label="Next file"
                >
                  <ArrowRight size={16} />
                </button>
              </>
            )}
            <button className="return-board" onClick={onClose}>
              Put it back <X size={13} />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
