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

`Layout` is a bordered CSS grid. Each page's root element positions itself inside the `main` area with `align-self`/`justify-self` (no absolute positioning). On phones and short landscape screens (`(max-width: 600px), (max-height: 500px) and (orientation: landscape)`, repeated in each CSS file) the Navbar moves to its own centered row at the bottom. The Earth's position and size are computed from the R3F viewport in `Canvas3D`, so it stays visible on narrow screens.

### Styling

Mixed approach: MUI v5 components (`Box`, `Typography`, etc.), styled-components v6 for custom elements, and per-component `index.css` files. Layout/positioning styles belong in the CSS files (inline `style={}` objects can't use media queries). Dark theme with `#0C0C0C` background. Custom font (PP Neue Montreal) loaded via `@font-face` in `src/font/`.

### 3D / shaders

`Canvas3D` imports `.glsl` files via `vite-plugin-string`. Earth textures live in `src/assets/`. Changes to shaders require no extra tooling — Vite handles the import.

The sun is its own component (`Canvas3D/Sun/Sun.jsx`): a plasma core (`sunCore*.glsl`) plus an additive corona plane with rays (`sunCorona*.glsl`), sharing one `uTime` uniform. On the phone breakpoint it moves to the top-right corner, and it stops animating with `prefers-reduced-motion`.

The Earth is also its own component (`Canvas3D/Earth/Earth.jsx`): a surface (`earth*.glsl`: day map, night/city lights, cloud shadows, warm terminator), a cloud layer (`cloudsFragment.glsl`) and a sunlit atmosphere rim (`atmosphere*.glsl`), all lit by one `SUN_DIR` (light from the upper right, slightly behind the planet). Textures are in `public/` (`2k_earth_daymap.jpg`, `earth_lights_2048.webp`, `earth_clouds_1024.webp`; the clouds WebP stores density in the RGB channels). Rotation uses `delta` and stops with `prefers-reduced-motion`.

### State management

No Redux or Zustand. The `store/` directory is an empty remnant. Use `CursorContext` for anything that needs to cross component boundaries; otherwise keep state local.
