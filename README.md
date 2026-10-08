# On My Desk

[Shreyas Boddani’s portfolio](https://shreyasboddani.vercel.app/), explored as a real-time 3D room. An authored Blender model contains the solid walnut desk, metal legs and drawers, freestanding portrait, hinged folders, hollow ceramic mug, articulated lamp, notebook, plant, bookshelves, and divided window. Three.js renders the GLB with physical materials, lights, shadows, and a perspective camera.

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
- **Explore freely:** drag to orbit around the solid models; scroll to zoom. Right-drag or modified drag pans. On touch screens, one finger orbits and two fingers pan/pinch to zoom. Controls zoom, fit the room, or return to the portrait. With the scene focused, arrow keys pan, `+` and `-` zoom, and `0` fits the desk.
- **Pick something up:** raycasting selects the actual meshes, while projected native buttons provide keyboard access. Picking a folder moves the camera and rotates its modeled cover around a hinge, then opens the readable portfolio file. The desk index and map provide direct access to all eight topics. Escape cancels a dive; putting a file back restores the camera and closes the 3D cover.
- **Change the view:** the camera control cycles between the portrait, an overhead desk view, and an oblique room view. Dragging reveals the modeled sides and backs of the objects. Sound is optional and off by default; the sound button enables quiet synthesized paper and click effects.
- **Read comfortably:** native modal dialogs trap focus, support Escape, and return focus on close. Long files scroll within the folder. Escape also cancels a pending camera dive. Reduced-motion preferences start in a stationary exploration view, skip the dive, and remove folder and ambient animations.

## Structure

- `src/caseData.js`: facts, projects, experience, file labels, board coordinates, and camera stops.
- `src/App.jsx`: story chapters, camera controls, opening/closing state, and readable-file navigation.
- `src/Desk3D.jsx`: lazily loaded React bridge to the WebGL engine.
- `src/deskScene.js`: GLB loading, physical lighting, shadow rendering, OrbitControls, raycasting, 3D hinge animation, camera choreography, projected keyboard controls, and resource cleanup.
- `tools/build_desk.py`: reproducible Blender geometry and GLB export.
- `assets/blender/on-my-desk.blend`: editable Blender source with the photographs and screenshots packed into it.
- `public/models/on-my-desk.glb`: deployed 3D scene; Blender is not required on the deployment server.
- `src/DeskMap.jsx`: direct navigation through a small desk map.
- `src/CaseFile.jsx`: readable portfolio files, hinged covers, and native dialog behavior.
- `src/useDeskAudio.js`: opt-in Web Audio effects; no downloaded audio assets.
- `src/App.css`, `src/Desk.css`, and `src/Scene3D.css`: interface, native reading folders, projected controls, loading/fallback views, and responsive layouts.
- `public/`: the real portrait, actual project screenshots, procedural SVG grain, and the supplied resume.

The scene is rendered in a WebGL canvas, with geometry and materials exported from Blender. It uses the real portrait and project screenshots, with no generated stock artwork. The renderer loads separately from the main interface. Device pixel ratio and shadow resolution are capped on phones, static shadows are reused, and rendering pauses while a readable folder covers a settled scene. All topics remain available in native HTML if WebGL cannot start. Fonts are Space Grotesk, Special Elite, Libre Baskerville, Caveat, and IBM Plex Mono, with system fallbacks.

## Rebuild the 3D model

Open `assets/blender/on-my-desk.blend` in Blender to edit the source, or regenerate it with:

```sh
blender --background --factory-startup --python tools/build_desk.py
```

The script writes both the packed `.blend` source and the runtime `.glb`. Named `item_*` objects carry `evidenceId` and `fileId` extras; named `hinge_*` nodes provide cover pivots. GLB export converts Blender’s Z-up coordinates to Three.js Y-up coordinates. No model export runs during the Vercel build.

## Content updates

The content follows the supplied October 2026 resume. Replace `public/shreyas-resume.pdf` and bump the `RESUME` version query in `caseData.js` when updating it. The supplied PDF is preserved byte for byte.

Before shipping, verify GLB loading, actual mesh picking, orbit/zoom/pinch gestures, portrait framing, all six camera stops, all three angles, camera dives and cancellation, physical hinge opening/closing, all eight readable files, focus return, clipboard copying, the resume endpoint, reduced motion, fallback access, and accessibility contrast.
