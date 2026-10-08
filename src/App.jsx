import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Download,
  FileSearch,
  Grid2X2,
  Maximize,
  Orbit,
  Minus,
  Move,
  Plus,
  RotateCcw,
  ScanLine,
  Volume2,
  VolumeX,
} from "lucide-react";
import CaseFile from "./CaseFile";
import DeskMap from "./DeskMap";
import useDeskAudio from "./useDeskAudio";
import { EVIDENCE, FILES, RESUME, TRAIL } from "./caseData";
import "./App.css";
import "./Desk.css";
import "./Scene3D.css";

const Desk3D = lazy(() => import("./Desk3D"));

export default function App() {
  const reduced = useReducedMotion();
  const stage = useRef(null);
  const scene = useRef(null);
  const transitionTimer = useRef(null);
  const [mode, setMode] = useState("explore");
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [visited, setVisited] = useState([]);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const [inspection, setInspection] = useState(null);
  const [orbit, setOrbit] = useState(0);
  const [renderStatus, setRenderStatus] = useState("loading");
  const audio = useDeskAudio();
  const current = TRAIL[step];
  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (mode === "story") {
      scene.current?.travel(value);
      setStep(
        Math.min(TRAIL.length - 1, Math.round(value * (TRAIL.length - 1))),
      );
    }
  });
  const open = (id, sourceId) => {
    clearTimeout(transitionTimer.current);
    setClosing(false);
    audio.play("paper");
    const reveal = () => {
      setSelected(id);
      setOpening(false);
      if (id !== "index")
        setVisited((previous) =>
          previous.includes(id) ? previous : [...previous, id],
        );
    };
    if (selected || id === "index" || reduced || renderStatus !== "ready")
      reveal();
    else {
      const item = EVIDENCE.find((entry) =>
        sourceId ? entry.id === sourceId : entry.file === id,
      );
      setInspection(item);
      setOpening(true);
      scene.current?.inspect(item?.id, reveal);
    }
  };
  const close = () => {
    if (closing) return;
    clearTimeout(transitionTimer.current);
    audio.play("paper");
    setClosing(true);
    transitionTimer.current = setTimeout(
      () => {
        setSelected(null);
        setClosing(false);
        scene.current?.restore();
      },
      reduced ? 0 : 300,
    );
  };
  useEffect(() => () => clearTimeout(transitionTimer.current), []);
  useEffect(() => {
    const cancel = (event) => {
      if (event.key === "Escape" && opening) {
        scene.current?.cancel();
        setOpening(false);
      }
    };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, [opening]);
  const switchMode = (next) => {
    if (opening || closing) return;
    setMode(next);
    if (next === "story") {
      setStep(0);
      scene.current?.travel(0);
      scene.current?.home();
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const goToStep = (index) => {
    if (mode !== "story" || opening) return;
    const top = window.scrollY + stage.current.getBoundingClientRect().top;
    const distance = stage.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (distance * index) / (TRAIL.length - 1),
      behavior: reduced ? "instant" : "smooth",
    });
  };
  const reset = () => {
    if (opening || closing) return;
    switchMode("explore");
    audio.play("click");
    scene.current?.fit();
  };
  const home = () => {
    if (opening || closing) return;
    switchMode("explore");
    setOrbit(0);
    scene.current?.home();
  };
  const zoom = (direction) => {
    if (opening || closing) return;
    switchMode("explore");
    audio.play("click");
    scene.current?.zoom(direction);
  };
  const changeAngle = () => {
    if (opening || closing) return;
    switchMode("explore");
    const next = (orbit + 1) % 3;
    setOrbit(next);
    audio.play("click");
    scene.current?.angle(next);
  };

  return (
    <>
      <a className="skip-link" href="#case-index" onClick={() => open("index")}>
        Skip to desk index
      </a>
      <main
        className={`investigation mode-${mode} ${opening ? "is-inspecting" : ""}`}
      >
        <h1 className="sr-only">On My Desk — Shreyas Boddani</h1>
        <section
          ref={stage}
          className="scroll-stage"
          style={{ height: mode === "story" ? "560svh" : "100svh" }}
          aria-label="Shreyas Boddani’s interactive 3D desk"
        >
          <div className="scene-shell">
            <div className="room-texture" />
            <div className="room-light" />
            <div className="scene-vignette" />
            <div className="desk-atmosphere" aria-hidden="true">
              {Array.from({ length: 16 }, (_, i) => (
                <i key={i} style={{ "--i": i }} />
              ))}
            </div>
            <header className="archive-header">
              <a
                className="archive-brand"
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (mode === "story") goToStep(0);
                  else reset();
                }}
                aria-label="Return to the opening desk"
              >
                <FileSearch size={25} />
                <span>
                  ON MY DESK
                  <small>SHREYAS BODDANI / A PERSONAL PORTFOLIO</small>
                </span>
              </a>
              <span className="header-case">
                <i /> IDEAS, WORK & EVERYTHING BETWEEN
              </span>
              <div className="header-actions">
                <a
                  href={RESUME}
                  target="_blank"
                  rel="noreferrer"
                  className="header-resume"
                >
                  Resume <Download size={14} />
                </a>
                <button
                  id="case-index"
                  className="index-button"
                  onClick={() => open("index")}
                >
                  <Grid2X2 size={15} /> Desk index
                </button>
              </div>
            </header>
            <div className="board-window real-3d-window">
              <Suspense fallback={null}>
                {renderStatus !== "error" && (
                  <Desk3D
                    ref={scene}
                    mode={mode}
                    reduced={reduced}
                    locked={opening || Boolean(selected) || closing}
                    onPick={open}
                    onStatus={setRenderStatus}
                  />
                )}
              </Suspense>
              {renderStatus === "loading" && (
                <div className="scene-loading" role="status">
                  <img src="/shreyas-headshot.png" alt="Shreyas Boddani" />
                  <p>ON MY DESK</p>
                  <span>GETTING THINGS READY</span>
                  <i />
                </div>
              )}
              {renderStatus === "error" && (
                <div className="scene-fallback">
                  <img src="/shreyas-headshot.png" alt="Shreyas Boddani" />
                  <h2>Hey, I?m Shreyas.</h2>
                  <p>
                    Explore my work, research, and the things that connect them.
                  </p>
                  <div>
                    {FILES.map((file) => (
                      <button key={file.id} onClick={() => open(file.id)}>
                        {file.label} <ArrowRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="board-tools" aria-label="Desk controls">
              <button onClick={() => zoom(-1)} aria-label="Zoom out">
                <Minus size={17} />
              </button>
              <button onClick={() => zoom(1)} aria-label="Zoom in">
                <Plus size={17} />
              </button>
              <span className="tool-divider" />
              <button
                onClick={reset}
                aria-label="Fit entire desk"
                title="Fit entire desk"
              >
                <Maximize size={16} />
              </button>
              <button
                onClick={home}
                aria-label="Return to portrait"
                title="Return to portrait"
              >
                <RotateCcw size={15} />
              </button>
              <span className="tool-divider" />
              <button
                onClick={changeAngle}
                aria-label="Change camera angle"
                aria-pressed={orbit !== 0}
                title={`Camera: ${["cinematic", "overhead", "perspective"][orbit]}`}
              >
                <Orbit size={17} />
              </button>
              <button
                onClick={audio.toggle}
                aria-label={audio.enabled ? "Turn sound off" : "Turn sound on"}
                aria-pressed={audio.enabled}
                title={audio.enabled ? "Sound on" : "Sound off"}
              >
                {audio.enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
            <DeskMap
              active={
                opening
                  ? inspection?.file
                  : mode === "story"
                    ? current.file
                    : null
              }
              visited={visited}
              onOpen={open}
            />
            {opening && (
              <div className="inspection-hud" role="status">
                <span />
                <p>TAKING A CLOSER LOOK</p>
                <strong>
                  {FILES.find((item) => item.id === inspection?.file)?.label}
                </strong>
                <small>ESC TO PULL BACK</small>
              </div>
            )}
            <div className="board-view-hint">
              <span className="hint-line" />
              <span>
                {mode === "story"
                  ? "A STORY IN CONNECTED PIECES"
                  : "DRAG TO ORBIT / SCROLL TO ZOOM"}
              </span>
            </div>
            <footer className="story-rail">
              <div className="rail-story">
                <span className="rail-counter">
                  {mode === "story" ? `0${step + 1} / 06` : "FREE / VIEW"}
                </span>
                <div>
                  <h2>
                    {mode === "story" ? current.title : "Hey, I’m Shreyas."}
                  </h2>
                  <p>
                    {mode === "story"
                      ? current.text
                      : "Drag to look around. Pick up a folder. Follow a thread."}
                  </p>
                </div>
              </div>
              <div className="rail-actions">
                {mode === "story" ? (
                  <>
                    <div className="trail-dots" aria-label="Story chapters">
                      {TRAIL.map((item, i) => (
                        <button
                          key={item.file}
                          className={step === i ? "current" : ""}
                          onClick={() => goToStep(i)}
                          aria-label={`Chapter ${i + 1}: ${FILES.find((file) => file.id === item.file).label}`}
                          aria-current={step === i ? "step" : undefined}
                        >
                          <span />
                        </button>
                      ))}
                    </div>
                    <button
                      className="rail-open"
                      onClick={() => open(current.file)}
                    >
                      Open this file <ArrowRight size={14} />
                    </button>
                  </>
                ) : (
                  <span className="exploration-count">
                    {visited.length} / 8 FILES OPENED
                  </span>
                )}
                <button
                  className="mode-toggle"
                  onClick={() =>
                    switchMode(mode === "story" ? "explore" : "story")
                  }
                >
                  {mode === "story" ? (
                    <Move size={14} />
                  ) : (
                    <ScanLine size={14} />
                  )}
                  {mode === "story" ? "Explore freely" : "Follow the thread"}
                </button>
              </div>
            </footer>
            {mode === "story" && (
              <div className="scroll-cue">
                <span>
                  {step === 5
                    ? "SCROLL UP TO RETRACE"
                    : "SCROLL TO FOLLOW THE THREAD"}
                </span>
                <ArrowDown size={13} />
              </div>
            )}
            <span className="scene-corner corner-left" aria-hidden="true" />
            <span className="scene-corner corner-right" aria-hidden="true" />
            <nav
              className="mobile-chapter-arrows"
              aria-label="Story navigation"
            >
              {mode === "story" && (
                <>
                  <button
                    disabled={step === 0}
                    onClick={() => goToStep(step - 1)}
                    aria-label="Previous story chapter"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    disabled={step === 5}
                    onClick={() => goToStep(step + 1)}
                    aria-label="Next story chapter"
                  >
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
            </nav>
          </div>
        </section>
      </main>
      {selected && (
        <CaseFile
          selected={selected}
          visited={visited}
          onSelect={open}
          onClose={close}
          closing={closing}
        />
      )}
    </>
  );
}
