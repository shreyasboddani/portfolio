import { useEffect, useRef, useState } from "react";
import {
  motion as Motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Download,
  FileSearch,
  Grid2X2,
  Maximize,
  Minus,
  Move,
  Plus,
  RotateCcw,
  ScanLine,
} from "lucide-react";
import EvidenceBoard from "./EvidenceBoard";
import CaseFile from "./CaseFile";
import { FILES, RESUME, TRAIL } from "./caseData";
import "./App.css";

function useViewport() {
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  useEffect(() => {
    const resize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return viewport;
}

export default function App() {
  const reduced = useReducedMotion();
  const viewport = useViewport();
  const mobile = viewport.width < 700;
  const stage = useRef(null);
  const windowRef = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "explore"
      : "story",
  );
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [visited, setVisited] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(null);
  const freeX = useMotionValue(0);
  const freeY = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 30,
    restDelta: 0.0001,
  });
  const fit = Math.min(
    (viewport.width - (mobile ? 24 : 85)) / 1600,
    Math.max(180, viewport.height - (mobile ? 227 : 210)) / 1000,
  );
  const stops = TRAIL.map((_, i) => i / (TRAIL.length - 1));
  const mobileProfileScale = Math.min(
    0.78,
    (viewport.width - 46) / 410,
    Math.max(180, viewport.height - 270) / 510,
  );
  const scales = TRAIL.map((item) =>
    mobile
      ? Math.min(
          item.file === "profile" ? mobileProfileScale : item.mobile,
          (viewport.width - 46) / (item.file === "profile" ? 410 : 300),
        )
      : fit * item.factor,
  );
  const storyScale = useTransform(smoothProgress, stops, scales);
  const storyX = useTransform(
    smoothProgress,
    stops,
    TRAIL.map((item, i) => (800 - item.x) * scales[i]),
  );
  const storyY = useTransform(
    smoothProgress,
    stops,
    TRAIL.map((item, i) => (500 - item.y) * scales[i]),
  );
  const focusScale = mobile ? mobileProfileScale : fit * 1.16;
  const exploreScale = fit * (zoomLevel ?? focusScale / fit);
  const current = TRAIL[step];
  const storyRotation = useTransform(
    smoothProgress,
    stops,
    [-0.1, 1.1, -1.2, 0.9, -0.8, 0.2],
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (mode === "story")
      setStep(
        Math.min(TRAIL.length - 1, Math.round(value * (TRAIL.length - 1))),
      );
  });
  const open = (id) => {
    setSelected(id);
    if (id !== "index")
      setVisited((previous) =>
        previous.includes(id) ? previous : [...previous, id],
      );
  };
  const switchMode = (next) => {
    if (next === "explore") {
      freeX.set(reduced ? (800 - current.x) * scales[step] : storyX.get());
      freeY.set(reduced ? (500 - current.y) * scales[step] : storyY.get());
      setZoomLevel((reduced ? scales[step] : storyScale.get()) / fit);
    } else {
      setStep(0);
    }
    setMode(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const goToStep = (index) => {
    if (mode !== "story") return;
    const rect = stage.current.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const distance = stage.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (distance * index) / (TRAIL.length - 1),
      behavior: reduced ? "instant" : "smooth",
    });
  };
  const reset = () => {
    setMode("explore");
    setZoomLevel(1);
    freeX.set(0);
    freeY.set(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const zoom = (direction) => {
    const currentScale =
      mode === "story"
        ? reduced
          ? scales[step]
          : storyScale.get()
        : exploreScale;
    const nextZoom = Math.max(
      0.65,
      Math.min(5, currentScale / fit + direction * 0.25),
    );
    const ratio = (nextZoom * fit) / currentScale;
    const currentX =
      mode === "story"
        ? reduced
          ? (800 - current.x) * currentScale
          : storyX.get()
        : freeX.get();
    const currentY =
      mode === "story"
        ? reduced
          ? (500 - current.y) * currentScale
          : storyY.get()
        : freeY.get();
    freeX.set(currentX * ratio);
    freeY.set(currentY * ratio);
    setZoomLevel(nextZoom);
    if (mode === "story") {
      setMode("explore");
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };
  const pointerDown = (event) => {
    if (
      mode !== "explore" ||
      event.target.closest("a") ||
      event.button > 0 ||
      !event.isPrimary
    )
      return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      startX: freeX.get(),
      startY: freeY.get(),
      moved: false,
      pointerId: event.pointerId,
    };
    suppressClick.current = false;
  };
  const pointerMove = (event) => {
    if (!drag.current || event.pointerId !== drag.current.pointerId) return;
    if (
      !drag.current.moved &&
      Math.hypot(
        event.clientX - drag.current.x,
        event.clientY - drag.current.y,
      ) < 7
    )
      return;
    if (!drag.current.moved) {
      drag.current.moved = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const limitX = Math.max(viewport.width / 2, 800 * exploreScale);
    const limitY = Math.max(viewport.height / 2, 500 * exploreScale);
    freeX.set(
      Math.max(
        -limitX,
        Math.min(limitX, drag.current.startX + event.clientX - drag.current.x),
      ),
    );
    freeY.set(
      Math.max(
        -limitY,
        Math.min(limitY, drag.current.startY + event.clientY - drag.current.y),
      ),
    );
  };
  const pointerUp = (event) => {
    suppressClick.current = drag.current?.moved || false;
    if (
      drag.current &&
      !drag.current.moved &&
      event.pointerType === "touch" &&
      event.type !== "pointercancel"
    ) {
      const evidence = event.target.closest(".evidence");
      if (evidence) {
        open(evidence.dataset.file);
        suppressClick.current = true;
      }
    }
    drag.current = null;
    setDragging(false);
  };
  const handleKeyboard = (event) => {
    if (mode !== "explore" || event.target !== event.currentTarget) return;
    const offsets = {
      ArrowLeft: [80, 0],
      ArrowRight: [-80, 0],
      ArrowUp: [0, 80],
      ArrowDown: [0, -80],
    };
    if (offsets[event.key]) {
      event.preventDefault();
      freeX.set(freeX.get() + offsets[event.key][0]);
      freeY.set(freeY.get() + offsets[event.key][1]);
    }
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoom(1);
    }
    if (event.key === "-") {
      event.preventDefault();
      zoom(-1);
    }
    if (event.key === "0") {
      event.preventDefault();
      reset();
    }
  };

  return (
    <>
      <a className="skip-link" href="#case-index" onClick={() => open("index")}>
        Skip to case index
      </a>
      <main className={`investigation mode-${mode}`}>
        <h1 className="sr-only">Shreyas Boddani — The Boddani Files</h1>
        <section
          ref={stage}
          className="scroll-stage"
          style={{ height: mode === "story" ? "560svh" : "100svh" }}
          aria-label="Shreyas Boddani’s interactive evidence board"
        >
          <div className="scene-shell">
            <div className="room-texture" />
            <div className="room-light" />
            <div className="scene-vignette" />
            <header className="archive-header">
              <a
                className="archive-brand"
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (mode === "story") goToStep(0);
                  else reset();
                }}
                aria-label="Return to the opening board"
              >
                <FileSearch size={25} />
                <span>
                  THE BODDANI FILES<small>A PERSONAL PORTFOLIO</small>
                </span>
              </a>
              <span className="header-case">
                <i /> CASE 027 <span>/</span> STILL IN PROGRESS
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
                  <Grid2X2 size={15} /> Case index
                </button>
              </div>
            </header>
            <div
              ref={windowRef}
              className={`board-window ${dragging ? "is-dragging" : ""}`}
              tabIndex={mode === "explore" ? 0 : -1}
              aria-label={
                mode === "explore"
                  ? "Explore the board. Drag to pan, or use arrow keys. Plus and minus zoom; zero fits the board."
                  : "Scroll to follow the story. Click any piece of evidence to open its case file."
              }
              onPointerDown={pointerDown}
              onPointerMove={pointerMove}
              onPointerUp={pointerUp}
              onPointerCancel={pointerUp}
              onClickCapture={(event) => {
                if (suppressClick.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  suppressClick.current = false;
                }
              }}
              onKeyDown={handleKeyboard}
            >
              <Motion.div
                className="board-camera"
                style={{
                  x:
                    mode === "story"
                      ? reduced
                        ? (800 - current.x) * scales[step]
                        : storyX
                      : freeX,
                  y:
                    mode === "story"
                      ? reduced
                        ? (500 - current.y) * scales[step]
                        : storyY
                      : freeY,
                  rotate:
                    mode === "story" && !reduced && !mobile ? storyRotation : 0,
                  scale:
                    mode === "story"
                      ? reduced
                        ? scales[step]
                        : storyScale
                      : exploreScale,
                }}
              >
                <EvidenceBoard
                  active={mode === "story" ? current.file : null}
                  mode={mode}
                  visited={visited}
                  onOpen={open}
                  onFocusEvidence={(item) => {
                    freeX.set((800 - item.x - item.w / 2) * exploreScale);
                    freeY.set((500 - item.y - item.h / 2) * exploreScale);
                  }}
                />
              </Motion.div>
            </div>
            <div className="board-tools" aria-label="Board controls">
              <button onClick={() => zoom(-1)} aria-label="Zoom out">
                <Minus size={17} />
              </button>
              <button onClick={() => zoom(1)} aria-label="Zoom in">
                <Plus size={17} />
              </button>
              <span className="tool-divider" />
              <button
                onClick={reset}
                aria-label="Fit entire board"
                title="Fit entire board"
              >
                <Maximize size={16} />
              </button>
              <button
                onClick={() => {
                  switchMode("explore");
                  freeX.set(0);
                  freeY.set((500 - 466) * focusScale);
                  setZoomLevel(focusScale / fit);
                }}
                aria-label="Return to portrait"
                title="Return to portrait"
              >
                <RotateCcw size={15} />
              </button>
            </div>
            <div className="board-view-hint">
              <span className="hint-line" />
              <span>
                {mode === "story"
                  ? "A STORY IN CONNECTED PIECES"
                  : "DRAG THE BOARD / OPEN A CLUE"}
              </span>
            </div>
            <footer className="story-rail">
              <div className="rail-story">
                <span className="rail-counter">
                  {mode === "story" ? `0${step + 1} / 06` : "FREE / VIEW"}
                </span>
                <div>
                  <h2>
                    {mode === "story"
                      ? current.title
                      : "Follow your own curiosity."}
                  </h2>
                  <p>
                    {mode === "story"
                      ? current.text
                      : "Drag to explore, zoom in, or open any of the pinned files."}
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
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
