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
### Task 6: Visual system and meaningful motion

**Files:** Create `src/styles/tokens.css`, `docs/design-system.md`; modify `src/styles/global.css`, page components; install `gsap`.

**Interfaces:** CSS tokens govern color, type, spacing, focus, and motion; GSAP timelines animate only route/section presentation, hints, and result feedback.

- [ ] **Step 1: Record the visual thesis.** Follow the screenshot's editorial data aesthetic with original lab composition: paper `#F4F2EC`, ink `#1E1E1B`, yellow `#FFD83D`, coral `#FF927A`, blue `#4F78E8` as initial values. Use 2–3 px borders, 4–6 px hard offset shadows, bold large sans-serif numbers, and compact monospaced supporting labels. Tune tokens for contrast and document their semantic roles in `docs/design-system.md`.
- [ ] **Step 2: Style catalogue cards, breadcrumb, pill controls, measurement tiles, workbench frame, graph, and explanation for desktop and mobile.** Ensure the workbench remains dominant and controls are large enough for touch. Make the graph line thick and high contrast, with measurement milestones. Use the same visual language in the Chemistry preview. Keep the screenshot's visual grammar while creating original lab-specific layouts and copy.
- [ ] **Step 3: Add a few authored GSAP sequences.** Animate landing-page introduction, transition into the experiment, and a short highlight on the equal landing times. Keep physical object positions entirely controlled by the model. Use `gsap.context()` with cleanup and `gsap.matchMedia()` for reduced motion. A page introduction can use:

```ts
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const ctx = gsap.context(() => {
    gsap.from('.intro-item', { y: 16, opacity: 0, stagger: 0.08,
      duration: 0.45, ease: 'power2.out' });
  }, rootRef);
  return () => ctx.revert();
});
return () => mm.revert();
```

Refer to [GSAP core](https://gsap.com/docs/v3/GSAP/) and the project GSAP skills.
- [ ] **Step 4: Verify keyboard focus, text contrast, reduced-motion mode, and pointer responsiveness in a browser.** Remove motion that delays controls or obscures scientific results. Commit `feat: apply science studio design system`.


