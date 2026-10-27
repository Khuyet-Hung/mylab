# CSS and UI organization implementation plan

1. [x] Split the existing global rules into base, shell/layout, shared UI, home, catalog, gravity, and responsive stylesheets. Keep `global.css` as the ordered entry point and `tokens.css` as the token source.
2. [x] Add reusable `Eyebrow` and `Badge` components under `src/components/ui`, preserving their existing class names and allowing the existing paragraph/span eyebrow semantics.
3. [x] Replace repeated markup with those components; leave one-off cards, hero art, and experiment panels feature-owned.
4. [x] Run the production build to catch import and TypeScript errors. Do not add tests or dependencies.

5. [x] Add the requested Button UI component and match its hover feedback to cards, gated by reduced-motion preference.
