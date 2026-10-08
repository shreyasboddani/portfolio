import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "framer-motion";
import { FileSearch } from "lucide-react";
import "./App.css";
import "./Desk.css";
import "./StoryTransition.css";

const DeskExperience = lazy(() => import("./DeskExperience"));
const StoryWebsite = lazy(() => import("./StoryWebsite"));
const getView = () =>
  new URLSearchParams(window.location.search).get("view") === "web"
    ? "web"
    : "desk";

export default function App() {
  const reduced = useReducedMotion();
  const [view, setView] = useState(getView);
  const [transfer, setTransfer] = useState(null);
  const timers = useRef([]);
  useEffect(() => {
    const scheduled = timers.current;
    const back = () => {
      scheduled.forEach(clearTimeout);
      scheduled.length = 0;
      setTransfer(null);
      setView(getView());
    };
    window.addEventListener("popstate", back);
    return () => {
      window.removeEventListener("popstate", back);
      scheduled.forEach(clearTimeout);
    };
  }, []);
  useEffect(() => {
    if (view !== "web" || !window.location.hash) return;
    const target = window.location.hash.slice(1);
    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: "instant" });
      return;
    }
    const observer = new MutationObserver(() => {
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: "instant" });
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = window.setTimeout(() => observer.disconnect(), 10000);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [view]);
  const swap = (next) => {
    if (transfer || next === view) return;
    timers.current.forEach(clearTimeout);
    timers.current.length = 0;
    setTransfer(next);
    timers.current.push(
      window.setTimeout(
        () => {
          const url = new URL(window.location.href);
          url.searchParams.set("view", next);
          url.hash = "";
          window.history.pushState({ view: next }, "", url);
          setView(next);
          window.scrollTo({ top: 0, behavior: "instant" });
        },
        reduced ? 0 : 340,
      ),
    );
    timers.current.push(
      window.setTimeout(
        () => {
          setTransfer(null);
          document.querySelector("main")?.focus({ preventScroll: true });
        },
        reduced ? 80 : 1150,
      ),
    );
  };
  return (
    <>
      <Suspense
        fallback={
          <div className="edition-loading" role="status">
            <FileSearch size={34} />
            <p>Opening the next page…</p>
          </div>
        }
      >
        {view === "web" ? (
          <StoryWebsite onSwitch={() => swap("desk")} />
        ) : (
          <DeskExperience onSwitch={() => swap("web")} />
        )}
      </Suspense>
      <AnimatePresence>
        {transfer && (
          <Motion.div
            className="edition-transfer"
            role="status"
            aria-live="polite"
            initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{
              clipPath: "inset(0 0 0 100%)",
            }}
            transition={{
              duration: reduced ? 0 : 0.34,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <div className="transfer-folder-tab">
              ON MY DESK / SAME STORY, A NEW PERSPECTIVE
            </div>
            <FileSearch size={38} strokeWidth={1.2} />
            <p>
              {transfer === "web" ? "Turning the page." : "Stepping inside."}
            </p>
            <span>
              {transfer === "web"
                ? "OPENING THE WEB EDITION"
                : "ENTERING THE 3D STORY"}
            </span>
            <Motion.i
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: 0.25 }}
            />
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
