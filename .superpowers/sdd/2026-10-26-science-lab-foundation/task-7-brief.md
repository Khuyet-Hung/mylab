## Global Constraints

- Audience: curious visitors of any age; explain results in plain language before formulas.
- 2D only. Chemistry appears as a clearly labeled preview in this release; no empty Chemistry experiment route.
- First experiment: compare two falling objects under uniform gravity, with air resistance neglected.
- Model values use SI units; rendering uses a separately defined metres-to-pixels mapping.
- PixiJS scene and numerical UI read the same model snapshot; GSAP does not mutate scientific state.
- Mouse, touch, and keyboard must operate essential controls; respect reduced-motion preferences.
- No backend, accounts, or general-purpose physics/chemistry engine in this release.
- Visual direction follows the user-supplied screenshot: warm paper background, dark outlined rounded panels and pill controls, short hard offset shadows, bold numeric typography, monospaced labels, yellow/coral/blue accents, and a high-contrast graph. Use original science-lab layout and copy.
- Current workspace has no Git repository. Initialize Git at execution time if permitted; commit each completed task. If Git initialization is unavailable, preserve the working files and record the limitation.


---
### Task 7: Browser journey and scientific validation gate

**Files:** Create `e2e/lab.spec.ts`, `playwright.config.ts`, `docs/validation.md`, `docs/architecture.md`; add `@playwright/test` to development dependencies in `package.json`.

**Interfaces:** The validation guide becomes the release gate for later experiments. Architecture documentation records clock ownership, module boundaries, lifecycle cleanup, and a template for new experiment contracts.

- [ ] **Step 1: Install Playwright and its browser binaries.** Configure a Vite web server and desktop Chromium project plus a touch-sized viewport. Add one end-to-end test of the real user journey:

```ts
import { test, expect } from '@playwright/test';
test('visitor runs the free-fall experiment', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /vật lý/i }).click();
  await page.getByRole('link', { name: /trọng lực/i }).click();
  await page.getByRole('link', { name: /hai vật rơi tự do/i }).click();
  await expect(page.getByRole('heading', { name: /vật nặng có rơi nhanh hơn/i })).toBeVisible();
  await page.getByRole('button', { name: /bắt đầu/i }).click();
  await expect.poll(async () => Number(await page.getByTestId('elapsed-seconds').textContent()))
    .toBeGreaterThan(0);
});
```

- [ ] **Step 2: Add a responsive/touch check for slider operation and workbench layout.** Set a `390×844` touch viewport, focus `getByRole('slider', { name: /độ cao thả/i })`, press `End`, assert the visible height label becomes `20.0 m`, and assert `document.documentElement.scrollWidth <= window.innerWidth`. Test a touch drag on the workbench separately. Use accessible names rather than CSS classes.
- [ ] **Step 3: Write `docs/architecture.md`.** Include a data-flow diagram (`input → model → snapshot → scene + measurements + graph`), one clock owner, units, scene cleanup, and the metadata contract. Write `docs/validation.md` with the 19.6 m/2 s reference, mass-invariance, boundary and pause/reset checks, accessibility review, and representative device profiling method. See the design specification for scope.
- [ ] **Step 4: Run `npm test`, `npm run build`, and `npm run test:e2e`; inspect the final site on desktop and mobile.** Record observed frame pacing and input delay on a representative desktop and mid-range phone, then set concrete budgets based on those measurements. Fix failures before release. Commit `test: validate first lab journey and architecture`.


