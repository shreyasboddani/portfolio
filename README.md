# On My Desk

[Shreyas Boddani’s portfolio](https://shreyasboddani.vercel.app/), explored as a spatial desk. The portrait, real project screenshots, notes, and connections sit on a leather mat over a wooden table, surrounded by a lamp, notebook, coffee cup, and pen. Picking up a note moves the camera in before a folder unfolds; putting it back reverses the sequence.

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
- **Explore freely:** drag the desk to pan and scroll over it to zoom. Controls zoom, fit the desk, or return to the portrait. With the desk focused, arrow keys pan, `+` and `-` zoom, and `0` fits the desk.
- **Pick something up:** notes open one of eight portfolio files, with a camera dive and a hinged folder cover. The desk index and desktop map provide direct access. File tabs and previous/next controls navigate the folder.
- **Change the view:** the camera control cycles between cinematic, overhead, and perspective views. A subtle pointer-driven glance adds depth on desktop. Sound is optional and off by default; the sound button enables quiet synthesized paper and click effects.
- **Read comfortably:** native modal dialogs trap focus, support Escape, and return focus on close. Long files scroll within the folder. Escape also cancels a pending camera dive. Reduced-motion preferences start in a stationary exploration view, skip the dive, and remove folder and ambient animations.

## Structure

- `src/caseData.js`: facts, projects, experience, file labels, board coordinates, and camera stops.
- `src/App.jsx`: scroll camera, free exploration, camera dives, controls, and selected-file state.
- `src/EvidenceBoard.jsx`: connected notes and paper artwork.
- `src/DeskProps.jsx`: physical desk edges and decorative objects.
- `src/DeskMap.jsx`: direct navigation through a small desk map.
- `src/CaseFile.jsx`: readable portfolio files, hinged covers, and native dialog behavior.
- `src/useDeskAudio.js`: opt-in Web Audio effects; no downloaded audio assets.
- `src/App.css` and `src/Desk.css`: lighting, materials, 3D depth, folder choreography, and responsive layouts.
- `public/`: the real portrait, actual project screenshots, procedural SVG grain, and the supplied resume.

The spatial artwork uses HTML, CSS perspective with preserved 3D transforms, and SVG. Framer Motion animates spring-driven camera position, zoom, tilt, and string entrances. The scene keeps native buttons and text, with no canvas or WebGL requirement. Fonts are Space Grotesk, Special Elite, Libre Baskerville, Caveat, and IBM Plex Mono, with system fallbacks.

## Content updates

The content follows the supplied October 2026 resume. Replace `public/shreyas-resume.pdf` and bump the `RESUME` version query in `caseData.js` when updating it. The supplied PDF is preserved byte for byte.

Before shipping, verify portrait framing on phones and desktop, all six camera stops, drag and keyboard panning, wheel/button zoom, all three angles, camera dives and cancellation, folder opening/closing, all eight files, focus return, internal scrolling, clipboard copying, the resume endpoint, reduced motion, and accessibility contrast.
