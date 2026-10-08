# On My Desk

[Shreyas Boddani’s portfolio](https://shreyasboddani.vercel.app/), told through two connected editions: a guided 3D room and a complete detective-themed webpage. Both follow the same facts, portrait, projects, and resume. An authored Blender model contains the solid walnut desk, metal legs and drawers, freestanding portrait, hinged folders, hollow ceramic mug, articulated lamp, notebook, plant, bookshelves, and divided window. Three.js renders the GLB with physical materials, lights, shadows, and a perspective camera.

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

- **Begin the story:** the default 3D edition opens with a prologue, a visible “Begin the story” button, and an immediate webpage alternative. Normal page scrolling pushes into the portrait and then moves the camera through six connected chapters with narrative captions, next-thread prompts, and direct file actions. The chapter dots jump between stops.
- **Read the web edition:** “Webpage version” switches to a full inline portfolio with an animated portrait dossier, connected chapter navigation, project folders, internship field notes, research, community, education, skills, recognition, and contact. It does not require WebGL. Open `?view=web` directly, or use anchors such as `?view=web#research`. The reading progress, thread drawing, and evidence reveals follow the scroll.
- **Switch perspectives:** the header button in either edition uses a folder-style page-turn transition. The URL records the selected edition and supports browser back/forward. Leaving the room disposes the WebGL renderer and its resources; a direct web-edition visit does not download the GLB or viewer. Returning to 3D starts its guided opening again.
- **Explore freely:** drag to orbit around the solid models; scroll to zoom. Right-drag or modified drag pans. On touch screens, one finger orbits and two fingers pan/pinch to zoom. Controls zoom, fit the room, or return to the portrait. With the scene focused, arrow keys pan, `+` and `-` zoom, and `0` fits the desk.
- **Pick something up:** raycasting selects the actual meshes, while projected native buttons provide keyboard access. Picking a folder moves the camera and rotates its modeled cover around a hinge, then opens the readable portfolio file. The desk index and map provide direct access to all eight topics. Escape cancels a dive; putting a file back restores the camera and closes the 3D cover.
- **Change the view:** the camera control cycles between the portrait, an overhead desk view, and an oblique room view. Dragging reveals the modeled sides and backs of the objects. Sound is optional and off by default: layered paper rustles, wooden taps, mechanical switches, quiet camera movement, and rain outside the room. Turning sound off fades and suspends the audio graph; hidden tabs also pause it.
- **Read comfortably:** native modal dialogs trap focus, support Escape, and return focus on close. Long files scroll within the folder. Escape also cancels a pending camera dive. Reduced-motion preferences keep the guided story, jump between views, skip camera dives and transition motion, and freeze ambient animations. The web edition shows its content immediately without animated entrances.

## Structure

- `src/caseData.js`: facts, projects, experience, file labels, board coordinates, and camera stops.
- `src/App.jsx`: edition routing, URL/history handling, page-turn transition and focus return.
- `src/DeskExperience.jsx`: 3D prologue, story chapters, camera controls, opening/closing state, and readable-file navigation.
- `src/StoryWebsite.jsx`: complete inline web edition, chapter navigation, reading progress and scroll motion.
- `src/ExperienceSwitch.jsx`: the shared, visible switch between editions.
- `src/Desk3D.jsx`: lazily loaded React bridge to the WebGL engine.
- `src/deskScene.js`: GLB loading, physical lighting, shadow rendering, OrbitControls, raycasting, 3D hinge animation, camera choreography, projected keyboard controls, and resource cleanup.
- `tools/build_desk.py`: reproducible Blender geometry and GLB export.
- `assets/blender/on-my-desk.blend`: editable Blender source with the photographs and screenshots packed into it.
- `public/models/on-my-desk.glb`: deployed 3D scene; Blender is not required on the deployment server.
- `public/textures/`: optimized CC0 Poly Haven wood, plaster and leather scans, plus source credits. The model embeds WebP derivatives of these maps.
- `src/DeskMap.jsx`: direct navigation through a small desk map.
- `src/CaseFile.jsx`: shared portfolio content, readable 3D files, hinged covers, and native dialog behavior. The web edition reuses the same research, community, education, recognition and contact content inline.
- `src/useDeskAudio.js`: opt-in Web Audio effects; no downloaded audio assets.
- `src/App.css`, `src/Desk.css`, and `src/Scene3D.css`: interface, native reading folders, projected controls, loading/fallback views, and responsive layouts.
- `public/`: the real portrait, actual project screenshots, procedural SVG grain, and the supplied resume.

The scene is rendered in a WebGL canvas, with geometry and materials exported from Blender. It uses the real portrait and project screenshots, with no generated stock artwork. The renderer loads separately from the main interface. Device pixel ratio and shadow resolution are capped on phones, static shadows are reused, and rendering pauses while a readable folder covers a settled scene. If the renderer or GLB cannot load, the app automatically opens the complete web edition, where all topics remain available in native HTML. Fonts are Space Grotesk, Special Elite, Libre Baskerville, Caveat, and IBM Plex Mono, with system fallbacks.

## Rebuild the 3D model

Open `assets/blender/on-my-desk.blend` in Blender to edit the source, or regenerate it with:

```sh
blender --background --factory-startup --python tools/build_desk.py
```

The script writes both the packed `.blend` source and the runtime `.glb`. The Blender source includes a Cycles lighting rig and camera. The portrait is a smaller smoked-walnut frame with four rails, recessed print and mat, felt backing, brass hinge, and an easel support whose foot rests on the desk. The whole frame leans back 12 degrees and turns 14 degrees on the desk. Named `item_*` objects carry `evidenceId` and `fileId` extras; named `hinge_*` nodes provide cover pivots. GLB export converts Blender’s Z-up coordinates to Three.js Y-up coordinates. No model export runs during the Vercel build.

The browser lighting uses a warm shadow-casting ceiling spotlight, a local desk lamp, and cool shadow-casting window light passing through physical Venetian blinds. The room has window trim, lit city windows, a radiator, and surface wear from scanned normal/roughness maps. Ray-integrated scattering and sparse dust reveal the spotlight's cone. Desktop rendering adds contact ambient occlusion and subtle highlight bloom; these heavier passes are disabled on phones. Anti-aliasing, a restrained vignette and fine film grain finish the canvas without affecting the readable HTML interface. Reduced motion freezes grain and dust.

## Content updates

The content follows `Shreyas_Boddani_Resume_2026.pdf`, supplied October 8, 2026, including the corrected organization name **Cloud Supply Chain Solutions**. Replace `public/shreyas-resume.pdf` and bump the `RESUME` version query in `caseData.js` when updating it. The supplied PDF is preserved byte for byte.

Before shipping, verify GLB loading, actual mesh picking, orbit/zoom/pinch gestures, portrait framing, all six camera stops, all three angles, camera dives and cancellation, physical hinge opening/closing, all eight readable files, focus return, clipboard copying, the resume endpoint, reduced motion, fallback access, and accessibility contrast.
