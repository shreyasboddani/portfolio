# Shreyas Boddani

A personal portfolio about building software, exploring machine learning, and bringing people along. Built with React, Vite, Framer Motion, and Three.js.

[Visit the portfolio](https://shreyasboddani.vercel.app/).

## Run locally

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run build
npm run preview
```

The production build is written to `dist/`. Deploy it as a static Vite site with `npm run build` as the build command and `dist` as the output directory.

## The design

- Warm paper, forest green, and a lime accent; DM Sans, Instrument Serif, and IBM Plex Mono.
- An original procedural 3D loop connects building, learning, and people. Drag to rotate; use the pause button to stop movement.
- Selected project previews lead into a three-chapter scroll story with a sticky chapter guide.
- A real portrait, current experience, education, and recognition keep the content personal.
- Reduced-motion preferences disable animation. A CSS sculpture is shown when WebGL is unavailable. The renderer pauses outside the viewport and when the tab is hidden, caps pixel density, and disposes GPU resources when unmounted.

Design research: [Bruno Simon](https://bruno-simon.com/) for playful dimensional interaction, [Rauno Freiberg](https://raunofreiberg.com/) for careful detail, and [Brittany Chiang](https://britchiang.com/) for a readable presentation of work. The implementation, artwork, and layout are original.

## Update content

Project, experience, and story data live at the top of `src/App.jsx`. Styles live in `src/App.css` and `src/index.css`; the sculpture is in `src/Sculpture.jsx`. Public assets live in `public/`.

Replace `public/shreyas-resume.pdf` with the supplied resume and update the `RESUME` version query in `src/App.jsx` to avoid stale browser caches. The October 2026 update preserves the supplied PDF byte for byte and updates the site from its contents.

Before shipping, check the mobile menu, chapter anchors, resume link, project links, experience expansion, email copying, reduced-motion mode, and no-WebGL fallback. Verify responsive layouts from 320px upward and check browser errors and accessibility contrast.
