## Global Constraints

- Audience: curious visitors of any age; explain results in plain language before formulas.
- 2D only. Chemistry appears as a clearly labeled preview in this release; no empty Chemistry experiment route.
- First experiment: compare two falling objects under uniform gravity, with air resistance neglected.
- Model values use SI units; rendering uses a separately defined metres-to-pixels mapping.
- PixiJS scene and numerical UI read the same model snapshot; GSAP does not mutate scientific state.
- Mouse, touch, and keyboard must operate essential controls; respect reduced-motion preferences.
- No backend, accounts, or general-purpose physics/chemistry engine in this release.
- Current workspace has no Git repository. Initialize Git at execution time if permitted; commit each completed task. If Git initialization is unavailable, preserve the working files and record the limitation.


---
### Task 1: Working website shell and navigable catalogue

**Files:** Create `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `src/main.tsx`, `src/App.tsx`, `src/components/SiteShell.tsx`, `src/catalog/experiments.ts`, `src/catalog/CatalogPage.tsx`, `src/styles/global.css`.

**Interfaces:** Produces `ExperimentCard { id, field, topic, title, question, href, status }`, `experiments: ExperimentCard[]`, and routes `/`, `/physics`, `/physics/gravity`, `/physics/gravity/free-fall`, `/chemistry`.

- [ ] **Step 1: Set up the repository and app dependencies.** From the workspace root, run `git init` if no Git repository exists. Create the Vite app files directly in the existing directory so `docs/` and `.agents/` remain intact. Run `npm init -y`, `npm install react react-dom react-router`, and `npm install -D vite typescript @vitejs/plugin-react @types/react @types/react-dom vitest`. Use these `package.json` scripts: `"dev": "vite"`, `"build": "tsc -b && vite build"`, `"preview": "vite preview"`, `"test": "vitest run"`, `"test:e2e": "playwright test"`. Set `index.html` to contain `<div id="root"></div>` and `<script type="module" src="/src/main.tsx"></script>`; `vite.config.ts` exports `defineConfig({ plugins: [react()] })`. Set TypeScript `strict: true`, `jsx: "react-jsx"`, and `noEmit: true` in the app configuration. Use the [Vite React TypeScript template](https://vite.dev/guide/) as the source for remaining minimal config fields.
- [ ] **Step 2: Create the route map and catalogue data.** Use declarative React Router per [official routing guide](https://reactrouter.com/start/declarative/routing). The initial data includes the free-fall experiment and a Chemistry preview, for example:

```ts
export type ExperimentCard = {
  id: string;
  field: 'physics' | 'chemistry';
  topic: string;
  title: string;
  question: string;
  href: string;
  status: 'available' | 'preview';
};

export const experiments: ExperimentCard[] = [{
  id: 'free-fall', field: 'physics', topic: 'Trọng lực',
  title: 'Hai vật rơi tự do', question: 'Vật nặng có rơi nhanh hơn không?',
  href: '/physics/gravity/free-fall', status: 'available',
}];
```

- [ ] **Step 3: Implement the pages.** `SiteShell` includes skip link, header, main landmark, and footer. `/` offers Physics and Chemistry; `/physics` lists Gravity; `/physics/gravity` links to the free-fall page; `/chemistry` explains that experiments are forthcoming with example topics, without dead cards. The experiment route displays `Hai vật rơi tự do` until Task 5 replaces it. Unknown routes show a useful return link. Route declaration:

```tsx
<BrowserRouter>
  <SiteShell><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/physics" element={<CatalogPage field="physics" />} />
    <Route path="/physics/gravity" element={<CatalogPage field="physics" topic="Trọng lực" />} />
    <Route path="/physics/gravity/free-fall" element={<h1>Hai vật rơi tự do</h1>} />
    <Route path="/chemistry" element={<CatalogPage field="chemistry" />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></SiteShell>
</BrowserRouter>
```
- [ ] **Step 4: Run `npm run build`; check `/`, `/physics`, `/physics/gravity`, and `/chemistry` in a browser.** Confirm keyboard navigation and direct URL loading with the intended host's SPA fallback. Commit `feat: create science lab shell` when Git is available.


