# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server (Vite)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint (0 warnings allowed)
npm run deploy     # Build + push to gh-pages branch
```

There are no tests configured.

## Architecture

**React 18 SPA** built with Vite, deployed to GitHub Pages at the `/portfolio/` base path (set in `vite.config.js`). Routing is handled by React Router v6 with `HashRouter` (required for GitHub Pages).

### Key directories

- `src/routes/AppRouter.jsx` — all route definitions; unknown paths redirect to `/`
- `src/Pages/` — one directory per route (`Home`, `Work`, `About`, `Contact`)
- `src/components/` — shared components: `Canvas3D` (Three.js globe), `CursorPro` (custom cursor), `Navbar`, `Layout`
- `src/context/CursorContext.jsx` — the only global state; tracks cursor hover events and derives the selected link from the current route
- `src/hooks/` — `useCursorEvents.js` wraps `CursorContext`
- `src/constants/` — menu paths and external URLs

### Layout pattern

Every page renders inside `Layout`, which mounts the `Navbar`, the `Canvas3D` globe (Three.js / react-three-fiber), and the `CursorPro` overlay. The 3D canvas sits behind page content.

`Layout` is a bordered CSS grid. Each page's root element positions itself inside the `main` area with `align-self`/`justify-self` (no absolute positioning). On phones and short landscape screens (`(max-width: 600px), (max-height: 500px) and (orientation: landscape)`, repeated in each CSS file) the Navbar moves to its own centered row at the bottom.

Page transitions: `AppRouter` renders `<Routes location={displayedLocation}>` and passes a `transitionPhase` (`idle` | `leaving` | `entering`) to `Layout`, which puts it as a class on `<main>`. On navigation the old page fades out (250 ms), then the new one is rendered and fades in while the camera finishes its move (CSS in `Layout/styles/index.css`). With `prefers-reduced-motion` the switch is immediate. `Layout` passes the current page (`selected` from `CursorContext`, i.e. the real route) to `Canvas3D`, so the camera starts moving right away.

### Styling

Mixed approach: MUI v5 components (`Box`, `Typography`, etc.), styled-components v6 for custom elements, and per-component `index.css` files. Layout/positioning styles belong in the CSS files (inline `style={}` objects can't use media queries). Dark theme with `#0C0C0C` background. Custom font (PP Neue Montreal) loaded via `@font-face` in `src/font/`.

### 3D / shaders

`Canvas3D` imports `.glsl` files via `vite-plugin-string`. Changes to shaders require no extra tooling — Vite handles the import.

The camera is a perspective camera driven by `Canvas3D/CameraRig/CameraRig.jsx`. Everything about the scene layout lives in `Canvas3D/scene.js`: the earth at the origin (`EARTH_RADIUS`), the light direction `SUN_DIR` (world space, deliberately independent from where the sun is drawn so the home view keeps its half-lit globe), `SUN_POSITION`, and `CAMERA_POSES` — one fixed pose per page (`home`, `work`, `about`, `contact`), each with a `landscape` and a `portrait` (aspect < 1) variant. A pose is `{ azimuth, elevation, distance }` (orbit around the earth) + `{ yaw, pitch }` (turn away from looking straight at it) + optional `zoom`; the earth's place on screen depends only on distance / yaw / pitch / zoom, while azimuth / elevation pick which side of it faces the camera and where the sun lands. Transitions ease (1.6 s, ease-in-out) between those numbers, so the camera always travels on an arc; a new page mid-move starts from the current pose; reduced motion jumps. `getFov` widens the vertical FOV on narrower screens (35°–55°) to keep the desktop's horizontal framing. All objects are in world space, so shaders use world normals + `cameraPosition` (not view-space tricks).

The sun is its own component (`Canvas3D/Sun/Sun.jsx`) at `SUN_POSITION`: a plasma core (`sunCore*.glsl`) plus an additive corona plane with rays (`sunCorona*.glsl`) that turns to face the camera every frame; it stops animating with `prefers-reduced-motion`.

The Earth is also its own component (`Canvas3D/Earth/Earth.jsx`): a surface (`earth*.glsl`: day map, night/city lights, cloud shadows, warm terminator), a cloud layer (`cloudsFragment.glsl`) and a sunlit atmosphere rim (`atmosphere*.glsl`), all lit by one `SUN_DIR` (light from the upper right, slightly behind the planet). Textures are in `public/` (`2k_earth_daymap.jpg`, `earth_lights_2048.webp`, `earth_clouds_1024.webp`; the clouds WebP stores density in the RGB channels). Rotation uses `delta` and stops with `prefers-reduced-motion`.

The sky is `Canvas3D/Starfield/Starfield.jsx` (6,500 seeded points on a 600-unit sphere around the scene, temperature colors, individual twinkle and cross spikes on the brightest; `stars*.glsl`) plus `Canvas3D/ShootingStars/ShootingStars.jsx` (one reused streak every 6–14 s in camera space, so it crosses the screen the same way in every pose; state in a ref; `shootingStar*.glsl`). `CameraRig` is the first child of the `<Canvas>`, so the camera is updated before the sun and shooting stars copy its rotation. Both stop with `prefers-reduced-motion`. drei is no longer imported anywhere.

The spaceship (`Canvas3D/Spaceship/`) is built in code: `loft.js` joins cross-sections (`HEXAGON` / `OCTAGON` profiles) into faceted hulls, and `SpaceshipModel.jsx` builds the ship from them plus boxes, tubes and extruded fins (multi-pane canopy, spine, side chines, ringed engine nacelles with vents and a billboard glow from `engineGlow*.glsl`, tail and ventral fins, cannons, blinking nav lights). `materials.js` creates the materials: the hull and burgundy (`#6a1426`) accents get procedural panel lines via `onBeforeCompile`, and all of them reflect a `RoomEnvironment` map generated at runtime (no image file). `useShipMaterials` creates that map + the materials for a canvas.

To inspect the ship, run `npm start` and open `#/hangar` (`src/Pages/Hangar/`): the ship alone on a grid with orbit controls, preset views, turntable, wireframe and PNG download. It is lazy-loaded behind `import.meta.env.DEV` in `AppRouter`, so production builds don't include it. It is the only object with lit (`MeshStandardMaterial`) materials, so the lights in `Spaceship.jsx` (sun from `SUN_DIR`, a fill from the camera side, ambient) don't affect the shader-based earth / sun / stars. Its world position comes from the home camera pose: `SHIP_PLACEMENT` in `scene.js` gives a screen spot + distance per variant, and `getShipTransform` converts it. For now it only shows on home: it fades out when leaving and fades back in (after a delay) when the camera returns; it floats and its engines throb, all frozen with `prefers-reduced-motion`.

### State management

No Redux or Zustand. The `store/` directory is an empty remnant. Use `CursorContext` for anything that needs to cross component boundaries; otherwise keep state local.
