import { useState } from "react";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Braces, ChevronDown, Link2 } from "lucide-react";
import { JOURNEY, SKILL_GROUPS } from "./portfolioNotes";

export default function SkillsBoard({ onPaper }) {
  const [selected, setSelected] = useState("languages");
  const reduced = useReducedMotion();
  const group = SKILL_GROUPS.find((item) => item.id === selected);
  return (
    <div className="skills-board" id="skills">
      <div className="addition-heading">
        <p className="web-kicker">TOOLS OF THE TRADE / FOLLOW A CONNECTION</p>
        <h3>What’s in my toolkit?</h3>
        <p>
          Pick a thread. See the tools, the skills, and where I’ve used them.
        </p>
      </div>
      <div
        className="skill-categories"
        role="group"
        aria-label="Explore skill categories"
      >
        {SKILL_GROUPS.map((item, i) => (
          <button
            key={item.id}
            aria-pressed={selected === item.id}
            aria-controls="skill-evidence"
            onClick={() => {
              setSelected(item.id);
              onPaper();
            }}
          >
            <span>0{i + 1}</span>
            {item.label}
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div
        className="skill-evidence"
        id="skill-evidence"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="wait" initial={false}>
          <Motion.div
            key={selected}
            className="skill-sheet"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.15 }}
          >
            <div className="skill-sheet-top">
              <Braces size={22} aria-hidden="true" />
              <span>WORKING NOTES / {group.label.toUpperCase()}</span>
              <span className="skill-pin" aria-hidden="true" />
            </div>
            <h4>{group.title}</h4>
            <div className="skill-tool-tags">
              {group.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
            <p>{group.note}</p>
            <div className="skill-practice">
              <span>IN PRACTICE</span>
              <ul>
                {group.practice.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="skill-proof">
              <span>
                <Link2 size={14} aria-hidden="true" /> CONNECTED EVIDENCE
              </span>
              <div>
                {group.evidence.map(([label, id]) => (
                  <a href={`#${id}`} key={id}>
                    {label}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            </div>
          </Motion.div>
        </AnimatePresence>
      </div>
      <p className="skills-margin handwritten">
        The useful part is what you do with them.
      </p>
    </div>
  );
}

export function JourneyNotes({ onPaper }) {
  return (
    <div className="journey-notes" id="journey">
      <div className="addition-heading">
        <p className="web-kicker">THE TIMELINE / NOT A STRAIGHT LINE</p>
        <h3>
          No master plan.
          <br />
          Just a useful next step.
        </h3>
        <p>
          I kept following the work that made me curious and the people I could
          help. Open a note to see how one chapter led into the next.
        </p>
      </div>
      <div className="journey-thread">
        {JOURNEY.map((item, i) => (
          <details
            className="journey-note"
            key={item.period}
            open={i === 3}
            onToggle={(event) => {
              if (event.currentTarget.open) onPaper();
            }}
          >
            <summary>
              <span className="journey-pin" aria-hidden="true">
                0{i + 1}
              </span>
              <span>
                <small>{item.period}</small>
                <strong>{item.title}</strong>
              </span>
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <div className="journey-note-body">
              <p>{item.text}</p>
              <span className="journey-evidence">{item.evidence}</span>
              <a href={`#${item.href}`}>
                {item.link}
                <ArrowUpRight size={15} />
              </a>
            </div>
          </details>
        ))}
      </div>
      <p className="journey-postscript handwritten">
        Still a work in progress. That’s the point.
      </p>
    </div>
  );
}
