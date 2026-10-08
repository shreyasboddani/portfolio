import { motion as Motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Fingerprint } from "lucide-react";
import { EVIDENCE } from "./caseData";

function ResearchSketch() {
  return (
    <svg className="research-sketch" viewBox="0 0 280 100" aria-hidden="true">
      <g fill="none" stroke="currentColor">
        <ellipse
          cx="137"
          cy="49"
          rx="105"
          ry="30"
          transform="rotate(-18 137 49)"
        />
        <ellipse
          cx="137"
          cy="49"
          rx="69"
          ry="41"
          transform="rotate(28 137 49)"
        />
        <path
          d="M10 86L58 73L79 81L120 42L164 55L205 20L266 8"
          strokeDasharray="3 3"
        />
      </g>
      <g fill="currentColor">
        <circle cx="137" cy="49" r="7" />
        <circle cx="42" cy="71" r="3" />
        <circle cx="205" cy="20" r="3" />
        <circle cx="181" cy="92" r="3" />
        <circle cx="241" cy="20" r="3" />
      </g>
      <text x="10" y="15">
        orbital data / patterns?
      </text>
    </svg>
  );
}

function PaperContent({ item }) {
  if (item.kind === "portrait")
    return (
      <>
        <span className="paper-tape portrait-tape" />
        <span className="paper-code">SUBJECT PROFILE / NO. 001</span>
        <div className="board-portrait-image">
          <img
            src="/shreyas-headshot.png"
            alt="Shreyas Boddani"
            fetchPriority="high"
            draggable="false"
          />
          <span className="photo-corner corner-one" />
          <span className="photo-corner corner-two" />
        </div>
        <span className="portrait-name">Shreyas Boddani</span>
        <span className="portrait-role">
          Developer. Student. Still curious.
        </span>
        <span className="portrait-foot">
          <span>CUMMING, GA / CLASS OF ’27</span>
          <ArrowUpRight size={17} />
        </span>
      </>
    );
  if (item.kind === "project")
    return (
      <>
        <span className="paper-tape" />
        <span className="paper-code">EXHIBIT 002 / A WORKING IDEA</span>
        <img
          className="evidence-image"
          src="/mentics.png"
          alt="Mentics college planning interface"
          draggable="false"
        />
        <span className="paper-title">MENTICS</span>
        <span className="handwritten project-scribble">
          an idea → ~50 beta users
        </span>
        <span className="paper-caption">
          React + Flask + a lot of iteration
        </span>
      </>
    );
  if (item.kind === "map")
    return (
      <>
        <span className="paper-code">FIELD NOTE / HACK FORSYTH</span>
        <img
          className="evidence-image map-image"
          src="/saferoute.png"
          alt="SafeRoute map and route simulation"
          draggable="false"
        />
        <span className="map-title">
          SafeRoute <span className="handwritten">5.5 hours!</span>
        </span>
        <span className="paper-caption">A safer way from A to B.</span>
        <span className="paper-tape bottom-tape" />
      </>
    );
  if (item.kind === "letter")
    return (
      <>
        <span className="paper-code">EXHIBIT 003 / FIELD EXPERIENCE</span>
        <span className="paper-title letter-title">
          Learning
          <br />
          on the inside.
        </span>
        <span className="letter-rule" />
        <span className="letter-org">Cloud Supply Chain Services</span>
        <span className="paper-caption">
          Software Engineering Intern · 2026–
        </span>
        <span className="letter-org">Cirrus Labs</span>
        <span className="paper-caption">Programming Intern · Summer 2026</span>
        <span className="stamp letter-stamp">IN THE FIELD</span>
        <span className="paper-fold" />
      </>
    );
  if (item.kind === "research")
    return (
      <>
        <span className="paper-code">EXHIBIT 004 / RESEARCH NOTES</span>
        <ResearchSketch />
        <span className="paper-title research-title">
          What’s under
          <br />
          the surface?
        </span>
        <span className="paper-caption">Nanoparticles. ML. Orbital data.</span>
      </>
    );
  if (item.kind === "sticky")
    return (
      <>
        <span className="paper-code">EXHIBIT 005 / THE PEOPLE</span>
        <span className="handwritten sticky-title">
          Technology should
          <br />
          help someone.
        </span>
        <span className="sticky-orgs">Learn AI Forsyth / FBLA / Educo</span>
        <span className="handwritten sticky-hours">
          40+ hours of tutoring ↗
        </span>
      </>
    );
  if (item.kind === "ticket")
    return (
      <>
        <span className="ticket-stub">
          <span className="ticket-number">’27</span>
          <span>CLASS OF</span>
        </span>
        <span className="ticket-info">
          <span className="paper-code">EXHIBIT 006 / FOUNDATIONS</span>
          <span className="ticket-title">NORTH FORSYTH</span>
          <span className="paper-caption">
            Georgia Tech CS 1301 · Dual enrollment
          </span>
          <span className="ticket-bottom">
            CS / WEB DEVELOPMENT <span>→</span> STILL LEARNING
          </span>
        </span>
      </>
    );
  if (item.kind === "clipping")
    return (
      <>
        <span className="clipping-masthead">For the record.</span>
        <span className="clipping-subtitle">
          FBLA / SOCIAL MEDIA STRATEGIES / 2026
        </span>
        <span className="clipping-result">
          <strong>1st</strong> Georgia <span>/</span> <strong>4th</strong>{" "}
          Nationally
        </span>
        <span className="handwritten clipping-scribble">
          a moment I’m proud of.
        </span>
      </>
    );
  return (
    <>
      <span className="envelope-lines" />
      <span className="paper-code">EXHIBIT 008 / NEXT CONNECTION</span>
      <span className="handwritten envelope-title">The case stays open.</span>
      <span className="envelope-email">shreyasboddani@gmail.com</span>
      <span className="envelope-stamp">
        <Fingerprint size={28} />
      </span>
    </>
  );
}

export default function EvidenceBoard({
  active,
  mode,
  visited,
  onOpen,
  onFocusEvidence,
}) {
  const reduced = useReducedMotion();
  return (
    <div className="board-surface">
      <div className="cork-texture" />
      <div className="board-inner-shadow" />
      <span className="board-screw screw-tl" />
      <span className="board-screw screw-tr" />
      <span className="board-screw screw-bl" />
      <span className="board-screw screw-br" />
      <div className="board-corner-note">
        <span className="handwritten">
          Follow the thread.
          <br />
          Click a clue.
          <br />
          Get to know me.
        </span>
        <span className="corner-note-arrow" aria-hidden="true">
          ↘
        </span>
      </div>
      <svg className="strings" viewBox="0 0 1600 1000" aria-hidden="true">
        <defs>
          <filter
            id="string-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow dx="0" dy="3" stdDeviation="1.2" floodOpacity=".48" />
          </filter>
        </defs>
        {EVIDENCE.filter((item) => item.id !== "profile").map((item, i) => {
          const fromX = 804;
          const fromY = 242;
          const toX = item.x + item.w / 2;
          const toY = item.y + 16;
          const path = `M${fromX} ${fromY} Q${(fromX + toX) / 2} ${(fromY + toY) / 2 + (i % 2 ? 42 : -30)} ${toX} ${toY}`;
          return (
            <Motion.path
              key={item.id}
              d={path}
              className={
                active === item.file ? "string active-string" : "string"
              }
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: reduced ? 0 : 1.2,
                delay: reduced ? 0 : i * 0.08,
              }}
            />
          );
        })}
        <path
          className="string secondary-string"
          d="M336 220Q240 430 220 577M1304 284Q1460 490 1302 635M551 767Q760 936 974 829"
        />
      </svg>
      {EVIDENCE.map((item) => (
        <button
          key={item.id}
          className={`evidence paper-${item.kind} ${active === item.file ? "evidence-active" : ""} ${visited.includes(item.file) ? "evidence-opened" : ""}`}
          style={{
            left: item.x,
            top: item.y,
            width: item.w,
            height: item.h,
            "--angle": `${item.angle}deg`,
          }}
          aria-label={item.label}
          tabIndex={mode === "story" && item.file !== active ? -1 : 0}
          onFocus={(event) => {
            if (
              mode === "explore" &&
              event.currentTarget.matches(":focus-visible")
            )
              onFocusEvidence(item);
          }}
          onClick={() => onOpen(item.file)}
        >
          <PaperContent item={item} />
          <span className="pushpin" aria-hidden="true" />
          {visited.includes(item.file) && (
            <span className="opened-mark">VIEWED</span>
          )}
        </button>
      ))}
      <div className="board-label">
        <span>THE BODDANI FILES</span>
        <span>PERSONAL ARCHIVE / CASE 027</span>
        <span className="label-barcode" aria-hidden="true" />
      </div>
      <div className="board-margin-note handwritten">
        different projects.
        <br />
        same curiosity.
      </div>
    </div>
  );
}
