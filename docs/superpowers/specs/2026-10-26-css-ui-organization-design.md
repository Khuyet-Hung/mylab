# CSS and UI component organization

Date: 2026-10-26  
Status: Approved

## Intent

Organize the current stylesheet so new pages and experiments can grow without extending one large global file. Reuse UI components only where the current interface has real repetition; avoid extracting one-off page structures.

## Current state

`src/styles/global.css` contains reset/accessibility rules, shared site chrome, home page, catalog, and gravity experiment styles. `tokens.css` already owns design tokens. `SiteShell` is the only shared React component; `Badge` and `Eyebrow` patterns repeat across pages, while cards and experiment panels have distinct content and behavior.

## Approaches

- **Feature styles plus a small shared UI layer (selected):** keep tokens and global foundations separate, split page styles by feature, and add only shared primitives confirmed by repeated use. This aligns styles with existing feature directories and avoids premature abstractions.
- **One stylesheet per component:** maximizes local ownership but creates many small files and import points for the current app size.
- **Large generalized component library:** offers variants for cards and panels, but duplicates one-off structures as abstractions and adds unnecessary API surface.

## Goals and scope

- Keep `tokens.css` as the single source of design tokens.
- Move global reset, typography defaults, focus behavior, and shared shell styles into clear shared stylesheets.
- Separate home, catalog, and gravity page rules into feature stylesheets; keep shared responsive and motion rules near the styles they affect or in a clearly named shared stylesheet.
- Inspect repeated UI before extraction. Create shared components only for repeated UI with a stable API. The current repeated primitives are Eyebrow, Badge, and Button; reuse them across pages as they are added.
- Preserve rendered appearance, responsive behavior, accessibility, and routes.

## Non-goals and constraints

- No new visual design, CSS framework, CSS module migration, or token redesign.
- Do not create components for one-off hero art, catalog cards, gravity controls, or panels unless inspection shows actual reuse.
- Keep the implementation in the existing React, TypeScript, and plain CSS setup.

## Builder decisions

Choose filenames and import locations that fit the repository. Prefer extracting only repeated primitives evidenced by current usage, and leave feature-specific markup/styles in place. Check production build after refactoring; do not expand scope into unrelated cleanup.
