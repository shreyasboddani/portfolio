import { EVIDENCE } from "./caseData";

export default function DeskMap({ active, visited, onOpen }) {
  return (
    <nav className="desk-map" aria-label="Quick desk navigation">
      <span className="map-label">THE BIG PICTURE</span>
      <div className="map-layout">
        <svg viewBox="0 0 1600 1000" aria-hidden="true">
          <path d="M800 470L330 347M800 470L247 680M800 470L1300 400M800 470L1300 720M800 470L549 850M800 470L800 100M800 470L1270 130M800 470L975 890" />
        </svg>
        {EVIDENCE.map((item) => (
          <button
            key={item.id}
            onClick={() => onOpen(item.file, item.id)}
            className={`${active === item.file ? "map-active" : ""} ${visited.includes(item.file) ? "map-visited" : ""}`}
            style={{
              left: `${item.x / 16}%`,
              top: `${item.y / 10}%`,
              width: `${item.w / 16}%`,
              height: `${item.h / 10}%`,
            }}
            aria-label={`Desk map: ${item.label}`}
            title={item.label}
          />
        ))}
      </div>
    </nav>
  );
}
