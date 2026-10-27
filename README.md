# Phòng thí nghiệm khoa học 2D

React + TypeScript + Vite catalogue foundation. The free-fall workbench is a placeholder until the experiment implementation task.

## Local development

```sh
npm install
npm run dev
npm run build
npm run preview
```

On Windows where PowerShell blocks `npm.ps1`, use `npm.cmd`.

## Hosting

Publish `dist/` after building. Configure the host to serve `index.html` for application URLs that do not match a static file, including `/physics/gravity/free-fall`. This is required by `BrowserRouter`. Vite development and preview servers provide the local SPA fallback. No production host has been selected yet.

`npm test` is reserved for the model tests added in later tasks. `npm run test:e2e` is reserved for the later Playwright setup; Playwright is not installed by this foundation task.
