# Interactive Science Lab — foundation design

Date: 2026-10-26  
Status: Draft for approval

## Tóm tắt để duyệt

Website là phòng thí nghiệm khoa học 2D cho người tò mò ở mọi độ tuổi. Người xem chọn lĩnh vực → chủ đề → thí nghiệm, trực tiếp thay đổi điều kiện, quan sát chuyển động, số đo và lời giải thích. Nền tảng đề xuất: React + TypeScript + Vite cho website, PixiJS cho bàn thí nghiệm 2D, GSAP cho chuyển động giao diện, và mô hình khoa học tách riêng cho từng thí nghiệm. Bản đầu chỉ xây một thí nghiệm hoàn chỉnh: hai vật rơi tự do trong điều kiện bỏ qua lực cản không khí. Hóa học hiện dưới dạng mục giới thiệu “sắp có”. Phong cách hình ảnh theo ảnh tham chiếu người dùng cung cấp: giao diện biên tập giàu số liệu, nền giấy sáng, viền mực đậm, bóng lệch, nhấn vàng/coral và đồ thị rõ nét. Các phần dưới ghi rõ phạm vi, kiến trúc, tài liệu cần có và cách kiểm chứng.

## Intent

Build a visually distinctive, highly interactive 2D website where curious visitors of any age can explore physics and chemistry experiments. Visitors choose a field, topic, and experiment; change conditions directly; observe the result; and inspect measurements and a plain-language explanation. Motion should feel fluid, while the displayed experiment follows an explicit scientific model.

The initial release validates the foundation through one complete gravity experiment. It establishes a repeatable way to add experiments rather than promising a large catalogue immediately.

## What the visitor experiences

1. The home page invites exploration and shows the fields **Physics** and **Chemistry**. In the first release, Chemistry is a clearly labeled preview with example future topics and no empty experiment route; this is the builder's proposed scope decision.
2. A field opens topics, such as **Physics → Gravity**. Each topic lists experiments with a short question, illustration, and estimated interaction time.
3. An experiment opens a 2D workbench. The visitor manipulates an object or input control, starts or pauses time, resets the setup, and compares outcomes.
4. Measurements, a simple graph where useful, and a short explanation connect the visible behavior to its governing model. Assumptions and units are visible without requiring visitors to know formulas first.

The proposed first experiment asks: **“Does a heavier object fall faster?”** Two objects can be set to different masses and released from the same height. The first model assumes uniform gravity and negligible air resistance. It shows that equal starting conditions produce the same acceleration and fall time, regardless of mass. A later variant may introduce air resistance as a separate, explicitly documented model. [OpenStax reference](https://openstax.org/books/college-physics-2e/pages/2-7-falling-objects).

The workbench should prioritize direct manipulation, immediate feedback, and multiple representations of the result (motion, numbers, and graph). These are established design principles in [PhET's description of interactive simulations](https://phet.colorado.edu/en/about).

## Goals

- Smooth and responsive 2D interaction on current desktop and mobile browsers.
- A memorable visual language without obscuring controls or scientific results.
- Every experiment declares its variables, units, assumptions, model, reference, and meaningful edge cases.
- The model owns scientific state; rendering and decorative animation never determine numerical results.
- Experiment modules can be added without rewriting the catalogue, workbench controls, or renderer lifecycle.
- Visitors can restart and reproduce a setup using the same parameters.

## Non-goals for the first release

- A complete physics or chemistry curriculum.
- A general-purpose engine that can simulate any physical or chemical process.
- User accounts, saved progress, multiplayer, or a server database.
- Fully realistic fluid, particle, or chemical reaction simulation.
- 3D experiments.

## Anti-goals

- An animation that looks plausible but produces values inconsistent with the stated model.
- Using a game physics engine as a substitute for scientific validation.
- Heavy visual effects that delay input feedback or hide measurement and controls.
- Treating hazardous real-world chemistry procedures as instructions to perform them outside the simulation.

## Approaches considered

| Approach | Advantage | Tradeoff |
| --- | --- | --- |
| SVG/DOM + GSAP | Fast to author precise vector scenes and early experiments | Harder to manage a growing number of continuously moving objects |
| **React + TypeScript + PixiJS + GSAP + independent scientific models** | Clear separation of site UI, 2D scene, motion, and science; scales across varied experiments | Requires explicit scene lifecycle, coordinate conversion, and one coordinated clock |
| Phaser with a rigid-body engine | Convenient for collision-heavy, game-like scenes | Encourages game scene assumptions and does not provide scientific validity for general experiments |

The user selected the second approach. The selection does **not** imply that every experiment needs a rigid-body engine. Add a specialized engine only when its behavior is required and its results have been validated for that experiment.

## Technical foundation

- **Vite:** local development and production bundling. Start from the React + TypeScript template. [Vite guide](https://vite.dev/guide/).
- **React + TypeScript:** catalogue, routing, experiment chrome, controls, explanations, and accessible HTML. Keep high-frequency simulation state out of React rerender loops. [React TypeScript guide](https://react.dev/learn/typescript).
- **PixiJS:** render and interact with the 2D workbench. Prefer its stable WebGL renderer for production; treat WebGPU and Canvas fallback as capabilities to verify rather than assumptions. [PixiJS application guide](https://pixijs.com/8.x/guides/components/application), [renderer guide](https://pixijs.com/guides/components/renderers/).
- **GSAP:** page transitions, control feedback, guided introductions, and other authored UI motion. GSAP does not advance the scientific model. [GSAP documentation](https://gsap.com/docs/v3/GSAP/).
- **Model modules:** pure TypeScript functions or small stateful modules, selected per experiment. For the first gravity model use SI units and an analytical constant-acceleration reference. A fixed simulation timestep and render interpolation can be introduced when a numerical model needs them. If a rigid-body engine is added later, control its stepping explicitly; [Matter.js distinguishes direct Engine.update from its browser Runner](https://brm.io/matter-js/docs/classes/Runner.html).

One application-level experiment clock controls play, pause, speed, reset, and elapsed model time. The renderer reads model snapshots and converts metres to screen coordinates. GSAP can animate overlays and decorative responses, but must not write position or velocity values used by the model. Control changes are recorded as input events and applied to the model; outputs are then displayed consistently in scene, numbers, and graph.

### Proposed module contract

Each experiment describes:

- identity: field, topic, title, question, short summary;
- inputs: key, unit, range, default, validation, and plain-language label;
- model: equations or algorithm, assumptions, initial state, update or evaluate function;
- outputs: observable state, measurements, graph series, and explanatory text;
- references: primary educational or scientific source and a version note;
- presentation: scene assets and mappings from model units to pixels;
- verification: reference cases, invariants, tolerances, and known limitations.

The catalogue and workbench consume this contract. Chemistry experiments will define their own models and permissible parameter ranges; the design does not imply arbitrary mixing of any chemicals.

## Visual and interaction direction

Art direction chosen from the user's supplied Model Pulse screenshot: an editorial, data-rich 2D interface with a warm paper-like background, strong near-black outlines, rounded panels and pill controls, hard offset shadows, oversized bold sans-serif figures, compact monospaced labels, and a restrained yellow/coral/blue accent palette. Use an original science-lab composition and copy; the screenshot guides visual grammar rather than page content. The workbench receives the visual emphasis, and instrument numbers and graphs should look like part of the lab. Create vector or code-native assets first so illustrations remain crisp at different sizes.

Apply the reference consistently: home page field cards resemble tactile outlined panels; field/topic selectors resemble pill controls; the experiment page uses a large bordered workbench, segmented controls, bold measurement tiles, and a thick high-contrast graph line. Set initial tokens around warm off-white `#F4F2EC`, ink `#1E1E1B`, yellow `#FFD83D`, coral `#FF927A`, and blue `#4F78E8`; tune exact values while checking contrast. Use 2–3 px outlines and short 4–6 px offset shadows at desktop scale, with tighter offsets on mobile. Graphs and labels must remain readable without relying on color alone.

Desktop layout: workbench as the dominant area, controls and live measurements nearby, explanation and graph reachable without leaving the experiment. Mobile layout: workbench first, compact controls below or in a drawer, large touch targets, and no essential hover interaction. The workbench should retain a stable logical coordinate system as the viewport changes.

Motion follows meaning: a release causes physical motion from the model; selection and panel changes use GSAP; a result highlight points to the relevant measurement. Controls can compress their offset shadow on press; cards and panels may shift a few pixels, while graph markers follow model snapshots. Avoid gratuitous floating or parallax that would undermine the crisp, instrument-like aesthetic. Respect reduced-motion preferences while keeping the scientific motion needed to understand the experiment available under visitor control.

## Documentation to keep with the project

1. **Product brief:** audience, goals, navigation, initial catalogue, and release scope.
2. **Architecture decision record:** why React, PixiJS, GSAP, and model isolation were chosen; module boundaries and clock ownership.
3. **Experiment specification template:** question, assumptions, units, inputs, equations, references, expected observations, limitations, and test cases.
4. **Design system:** typography, color, spacing, workbench controls, motion tokens, responsive behavior, and accessibility rules.
5. **Validation guide:** how reference cases, interaction behavior, browser compatibility, and performance are checked before an experiment is published.

This design document is the initial product and architecture brief. The first experiment specification and design system should be written before implementing their respective surfaces.

## Verification and release criteria

- For the first gravity experiment, compare model outputs at representative times and heights with the analytical equations from OpenStax; verify equal fall time for different masses under the stated no-drag assumption.
- Check units and boundary inputs (zero/maximum height, mass bounds, pause/resume, reset, repeated runs).
- Verify scene position, displayed numbers, and graph derive from the same model snapshot.
- Test mouse, touch, and keyboard alternatives for essential controls; check readable labels and reduced-motion behavior.
- Measure input response and frame pacing on a representative desktop and mid-range phone. Set numerical performance budgets after the first scene is profiled, then use them as a gate for subsequent experiments.
- Verify cleanup when leaving an experiment: stop its clock and release ticker callbacks, GSAP timelines, and GPU assets owned by the scene.

## Sequence

1. Approve this foundation design.
2. Write the implementation plan and the detailed first gravity experiment specification.
3. Build the catalogue shell and reusable workbench boundary.
4. Build and validate the gravity experiment end to end.
5. Refine visual language, mobile interaction, and measured performance.
6. Add further physics and chemistry experiments one at a time using the same contract and validation gate.

## Decisions left to the builder

Choose the routing, lightweight state management, graphing, and test libraries based on the requirements of the first implemented experiment. Keep these replaceable and avoid adding a backend until a concrete feature requires one. Define numeric accuracy tolerances and screen performance budgets from the first model and representative device measurements.

## Open choice for the user

The user approved the gravity/no-air-resistance first experiment and then supplied a Model Pulse screenshot as the visual reference. The visual direction above incorporates that request; exact token tuning and original artwork remain builder decisions.
