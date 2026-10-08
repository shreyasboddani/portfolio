# The Boddani Files

[Shreyas Boddani’s portfolio](https://shreyasboddani.vercel.app/), told through an interactive detective string board. A real portrait anchors a collection of pinned project screenshots, letters, research notes, tickets, clippings, and an envelope. Red string connects the pieces.

## Run

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run build
npm run preview
```

The site is a static React + Vite application. Build with `npm run build` and deploy `dist/`. The existing GitHub integration deploys `main` to Vercel.

## Explore

- **Follow the thread:** normal page scrolling moves the camera through six chapters. The dots and phone navigation arrows jump between chapters.
- **Explore freely:** drag the board to pan. The controls zoom, fit the entire board, or return to the portrait. With the board focused, arrow keys pan, `+` and `-` zoom, and `0` fits the board.
- **Open a clue:** pinned items open one of eight case files. The case index provides direct access to every topic. File tabs and previous/next controls navigate the folder.
- **Read comfortably:** native modal dialogs trap focus, support Escape, and return focus on close. Long files scroll within the folder. Reduced-motion preferences start in a stationary exploration view and remove animated camera travel and folder entrances.

## Structure

- `src/caseData.js`: facts, projects, experience, file labels, board coordinates, and camera stops.
- `src/App.jsx`: scroll camera, free exploration, controls, and selected-file state.
- `src/EvidenceBoard.jsx`: physical board, strings, and pinned artwork.
- `src/CaseFile.jsx`: readable case files and native dialog behavior.
- `src/App.css`: lighting, cork, paper, tape, pins, and responsive layouts.
- `public/`: the real portrait, actual project screenshots, procedural SVG grain, and the supplied resume.

The artwork is built from native HTML, CSS, and SVG. There is no WebGL requirement. Framer Motion animates the camera and string entrances. Fonts are Special Elite, Libre Baskerville, Caveat, and IBM Plex Mono, with system fallbacks.

## Content updates

The content follows the supplied October 2026 resume. Replace `public/shreyas-resume.pdf` and bump the `RESUME` version query in `caseData.js` when updating it. The supplied PDF is preserved byte for byte.

Before shipping, verify portrait framing on phones and desktop, all six camera stops, drag and keyboard panning, zoom and reset, all eight files, focus return, internal file scrolling, clipboard copying, the resume endpoint, reduced motion, and accessibility contrast.
