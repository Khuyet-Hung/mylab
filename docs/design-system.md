# Science studio visual system

## Thesis
A tactile editorial lab: warm paper, near-black ink, heavy numbers, outlined instruments and short hard shadows. Original Vietnamese science content uses the reference's visual grammar without its branding or copy. The workbench is the dominant surface; controls and measured evidence remain directly accessible.

## Tokens and roles
`src/styles/tokens.css` defines paper #F4F2EC, ink #1E1E1B, yellow #FFD83D for selection/results, coral #FF927A for object A/chemistry, blue #4F78E8 for illustration, and darker blue #244FB9 for graph/focus/controls. Small text uses ink or muted #55554E on light surfaces, never white on yellow/coral/blue. Panels use #FFFDF6, 2px outlines, 5px hard shadows (3px mobile), and 16–20px corner radii. Font fallback preserves layout if Google Fonts is unavailable.

Be Vietnam Pro heavy sans headings and 34–42px measurement figures pair with compact monospace labels. Labels remain explicit; A/B letters, shared-curve explanation, axes and time milestones convey information independently of color. Interactive focus uses a 3px dark-blue outline with 5px offset.

## Composition
Home combines an editorial headline with a code-native orbital diagram and two tactile field cards. Navigation and breadcrumbs use pills. Chemistry is explicitly a preview. The experiment uses a full-screen scene with a floating control toolbar and expandable settings; on narrow screens the toolbar moves below the scene. The separate report holds measurement tiles, tables, graphs, and the yellow explanation. No horizontal scrolling is required at 390px.

## Shared experiment flow
Every experiment opens its simulation in the full-screen `ExperimentFrame`. The simulation view contains the scene, input settings, and play/pause/reset/exit controls. Each experiment declares a scientific completion condition. The report action appears only after that condition is met, then opens a separate page with measured results, tables, graphs, and explanation. Resetting or changing inputs starts a new trial and hides the report action until that trial is complete. Opening a report route without a completed trial shows a no-results state and a return link. This rule applies to new experiments as well as the gravity and pendulum experiments.

## Motion contract
SiteShell owns a scoped GSAP introduction: 12px movement, 420ms power2.out, 60ms stagger. The experiment animates only introductory text, so controls and scientific results are available immediately. Landing highlights the shared impact-time tile with a single 500ms color transition. Neither animation reads or writes simulation position, time, or model state.

Each effect owns gsap.context and gsap.matchMedia cleanup. Reduced motion replaces the introduction with a 150ms opacity fade without translation/stagger, and shortens result feedback to 150ms. CSS hover translation is enabled only for no-preference. Scientific motion remains explicitly controlled by Play/Pause/Reset. A development-only `?reduce=1` harness selects the reduced GSAP branch for browser QA; production follows the OS media query. The harness does not emulate the OS CSS preference.

## Verification boundaries
Browser QA includes desktop and 390×844 layouts, controls, focus, reduced GSAP branch, and landing equality. Real touch hardware and OS-level media emulation remain separate release checks. Canvas labels necessarily shrink on phones; adjacent HTML controls and measurements provide readable equivalents.
