# Task 6 report — visual system and meaningful motion

Status: complete, with OS-level reduced-motion emulation and physical touch testing noted as release-verification limits. No Git commands, subagents, or reviewers used.

## Delivered

- Added `src/styles/tokens.css` and `docs/design-system.md`. Warm #F4F2EC paper, #1E1E1B ink, yellow/coral/blue accents, 2px outlines, rounded panels, 5px hard shadows (3px mobile), heavy Vietnamese sans headings/numerals, and compact monospace labels now govern the UI.
- Replaced the former green/serif visual treatment with an original editorial science composition: outlined orbital illustration, bright field cards, pill navigation/breadcrumbs, dominant workbench, instrument controls, large measurement tiles, thick dark-blue graph with quarter-time milestones, and yellow explanation. Chemistry remains an explicit coral preview.
- Workbench occupies approximately two-thirds of the desktop experiment row; controls stack after it below 900px. Tables, graph, tiles, and labels fit phone widths without horizontal scrolling.
- Localized home field labels and canvas scene labels to Vietnamese. Fixed encoding damage encountered during a Windows native-pipe edit before final checks.
- Installed GSAP after required network escalation. SiteShell adds a scoped timeline entrance on home and route introduction text. GravityPage adds one brief background-color highlight to the shared impact-time tile on landing. Physical positions and numerical values remain exclusively model/clock controlled; no model or clock logic changed.
- Each effect owns gsap.context and gsap.matchMedia teardown. No-preference introductions use 12px movement/420ms/60ms stagger; reduced uses a 150ms fade without translation or stagger. Landing feedback shortens from 500ms to 150ms. CSS hover displacement exists only under no-preference.
- Added a development-only `?reduce=1` harness for selecting the GSAP reduced branch. Production follows OS preference. The harness does not emulate CSS media preferences.
- Formatted touched TSX, scene TS, and CSS using Prettier, including previously compressed App/Catalog markup.

## Verification

- Final `npm.cmd run build`: passed TypeScript and Vite production build. Existing chunk-size advisory persists: main bundle ~630 kB / 199 kB gzip after GSAP.
- Final `npm.cmd test`: passed all 3 files / 36 model, clock and scene tests.
- Real Chrome desktop screenshot review: strong dark headings, outlined workbench/controls, consistent navigation, graph/table/result panels, Chemistry preview, and original home composition.
- Real Chrome 390×844 viewport review: workbench first, controls following, clear blue keyboard focus ring, wrapping controls, readable measurement tiles, table and graph; document clientWidth and scrollWidth both 375px (scrollbar-adjusted).
- Keyboard ArrowRight changed height 12.0→12.1 m and reset model/graph/elapsed values. Start button responded immediately. The 12m release in reduced mode reached elapsed/impact 1.56 s, both 0.00 m height, 12.00 m fallen and 15.34 m/s downward speed.
- Normal and reduced GSAP branches visually reviewed. Reduced mode keeps the content visible, removes entrance displacement, and preserves explicit scientific play and landing result. Navigation through home, experiment and Chemistry repeatedly worked.
- Browser console contained early hot-update warnings from the interval before the result tile had been mounted; those were resolved. No new warnings/errors appeared in subsequent navigation/landing checks.
- Verified small text uses ink or muted dark gray on light backgrounds; darker #244FB9 is used for graph/focus controls rather than low-contrast white-on-bright accents. Color-independent A/B labels, shared-curve copy and numeric evidence remain.

## Evidence

Saved `task-6-home.png`, `task-6-desktop.png`, `task-6-mobile.png`, and `task-6-reduced.png` in this report directory. Screenshots were also reviewed interactively in the browser tool. The browser full-page capture temporarily rendered an unusual scaled viewport in a later capture; rely on the interactive 390×844 screenshots and explicit width measurement for mobile QA, and independently reopen the page for final visual review. Viewport override was reset.

## Remaining verification limits

- Browser tooling advertises viewport control but no OS prefers-reduced-motion emulation. The actual reduced GSAP branch was tested through the documented dev harness; live OS switching and CSS reduced-media behavior should still be covered in Task 7.
- Real touch hardware was unavailable. Native keyboard controls and browser pointer activation were checked; previous scene pointer tests remain green.
- Canvas annotations become small on phone screens because the stable logical scene is scaled. Readable adjacent HTML instructions, controls, and measurements duplicate essential information.
- Google Fonts is an existing external dependency; sans/monospace fallback is retained.
- No commit made, per explicit no-Git instruction.
