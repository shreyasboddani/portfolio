import { ArrowUpRight, BookOpen, Orbit } from "lucide-react";
import "./ExperienceSwitch.css";

export default function ExperienceSwitch({ view, onSwitch }) {
  return (
    <button className="experience-switch" onClick={onSwitch}>
      {view === "desk" ? <BookOpen size={16} /> : <Orbit size={17} />}
      <span>{view === "desk" ? "Webpage version" : "Enter the 3D story"}</span>
      <ArrowUpRight size={14} aria-hidden="true" />
    </button>
  );
}
