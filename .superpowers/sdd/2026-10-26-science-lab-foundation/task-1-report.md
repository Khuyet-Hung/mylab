# Task 1 implementation report

Status: DONE_WITH_CONCERNS

## Delivered

Created the Vite/React/TypeScript shell directly in the existing workspace, retaining docs and agent material. Added the Vietnamese catalogue with the exact ExperimentCard contract, available free-fall entry and Chemistry preview entry. Added all five required routes and a useful unknown-route page. Physics lists the Gravity topic; Gravity lists free fall; Chemistry explains forthcoming topics and links to the working Physics catalogue. Free fall remains the requested placeholder for Task 5.

SiteShell includes a skip link, header navigation, main landmark and footer. Client navigation focuses main and resets scroll; native links support pointer, touch and keyboard use. The stylesheet supplies responsive single-column layouts, visible keyboard focus and reduced-motion handling. Illustrations are code-native decorative CSS. No scientific model or animation library is introduced yet.

## Files changed

- package.json and package-lock.json: runtime/dev dependencies and exact requested scripts; ESM and private package.
- index.html: Vietnamese language, metadata and root/module script.
- vite.config.ts, tsconfig.json, tsconfig.app.json: minimal Vite configuration and strict app TypeScript configuration.
- src/vite-env.d.ts: Vite CSS/module typings required by installed TypeScript.
- src/main.tsx, src/App.tsx: React entry and declarative routes, home and fallback pages.
- src/components/SiteShell.tsx: shared landmarks, skip navigation and route focus handling.
- src/catalog/experiments.ts and src/catalog/CatalogPage.tsx: typed catalogue and field/topic pages.
- src/styles/global.css: bright science studio presentation, responsive rules and reduced motion.
- .gitignore: build, dependency and TypeScript cache artifacts.
- README.md: run commands and production SPA fallback requirement.

## Commands and results

1. `npm init -y` / `npm install ...` initially failed because PowerShell disallows npm.ps1. Used npm.cmd without changing system policy.
2. `npm.cmd init -y`: passed.
3. Initial sandboxed dependency install stalled without output; stopped it, retried with prescribed require_escalated network approval.
4. `npm.cmd install react react-dom react-router`: passed; no vulnerabilities.
5. `npm.cmd install -D vite typescript @vitejs/plugin-react @types/react @types/react-dom vitest`: passed; no vulnerabilities.
6. Added exact requested package scripts using npm.cmd pkg set.
7. First build identified missing CSS module typings; added src/vite-env.d.ts.
8. Final `npm.cmd run build`: passed, TypeScript and Vite production build. Vite 8.3.5, 95 modules; JS 264.81 kB / gzip 83.90 kB; CSS 6.79 kB / gzip 2.30 kB.
9. Development server started at http://127.0.0.1:5173 (session 15527); preview at http://127.0.0.1:4173 (session 84606). Left available for controller review.

## Browser verification

Used connected Chrome through cua_repl. Directly loaded `/`, `/physics`, `/physics/gravity`, `/chemistry`, `/physics/gravity/free-fall`, and `/missing`; all displayed their expected headings and useful links. Chemistry had only valid navigation and clearly stated experiments are not open yet. Home screenshot reviewed at desktop size. Corrected a Vietnamese serif accent rendering issue and reviewed the final production home screenshot.

Keyboard: Tab initially focuses skip link; Enter activates it; next Tab reaches the first field card. Enter on that card navigates to Physics and focus lands on main content. Confirmed visible page state after each step. Production preview direct `/physics/gravity` also rendered successfully, verifying local production SPA fallback.

## Self-review and concerns

- All requested files, interfaces and routes exist. Extra files are limited to necessary typings, lockfile, ignore rules and run/hosting documentation.
- Git init/commit intentionally skipped per controller ruling; no Git repository was created.
- No production host was supplied, so its actual SPA rewrite configuration cannot be verified. README explicitly requires fallback to index.html. Both Vite dev and preview work with direct nested route loads.
- No model tests exist in Task 1; npm test is reserved for subsequent tasks. The required test:e2e script exists but Playwright is intentionally not installed yet, per the listed Task 1 dependencies. Neither test script is claimed as passing.
- Mobile CSS is implemented but a mobile device/viewport was not visually exercised in this task.
- Google Fonts is an optional external font request; system sans-serif fallback remains usable offline.
- Reference configuration/routing checked against the official Vite guide (https://vite.dev/guide/) and React Router declarative routing guide (https://reactrouter.com/start/declarative/routing).
