# Task 1 files (new workspace, no Git diff available)

## package.json

   1: {
   2:     "name":  "animationweb",
   3:     "version":  "1.0.0",
   4:     "description":  "",
   5:     "scripts":  {
   6:                     "test":  "vitest run",
   7:                     "dev":  "vite",
   8:                     "build":  "tsc -b \u0026\u0026 vite build",
   9:                     "preview":  "vite preview",
  10:                     "test:e2e":  "playwright test"
  11:                 },
  12:     "keywords":  [
  13: 
  14:                  ],
  15:     "author":  "",
  16:     "license":  "ISC",
  17:     "type":  "module",
  18:     "dependencies":  {
  19:                          "react":  "^19.3.1",
  20:                          "react-dom":  "^19.3.1",
  21:                          "react-router":  "^8.5.0"
  22:                      },
  23:     "devDependencies":  {
  24:                             "@types/react":  "^19.3.0",
  25:                             "@types/react-dom":  "^19.3.0",
  26:                             "@vitejs/plugin-react":  "^6.1.2",
  27:                             "typescript":  "^7.0.2",
  28:                             "vite":  "^8.3.5",
  29:                             "vitest":  "^5.0.5"
  30:                         },
  31:     "private":  true
  32: }

## index.html

   1: <!doctype html>
   2: <html lang="vi">
   3:   <head>
   4:     <meta charset="UTF-8" />
   5:     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   6:     <meta name="theme-color" content="#f5f4ee" />
   7:     <meta name="description" content="Phòng thí nghiệm khoa học 2D: đặt câu hỏi, khám phá và hiểu thế giới quanh bạn." />
   8:     <title>Phòng thí nghiệm · Khoa học 2D</title>
   9:   </head>
  10:   <body>
  11:     <div id="root"></div>
  12:     <script type="module" src="/src/main.tsx"></script>
  13:   </body>
  14: </html>

## vite.config.ts

   1: import { defineConfig } from 'vite';
   2: import react from '@vitejs/plugin-react';
   3: 
   4: export default defineConfig({ plugins: [react()] });

## tsconfig.json

   1: {
   2:   "files": [],
   3:   "references": [{ "path": "./tsconfig.app.json" }]
   4: }

## tsconfig.app.json

   1: {
   2:   "compilerOptions": {
   3:     "target": "ES2022",
   4:     "lib": ["ES2022", "DOM", "DOM.Iterable"],
   5:     "module": "ESNext",
   6:     "moduleResolution": "bundler",
   7:     "skipLibCheck": true,
   8:     "allowImportingTsExtensions": true,
   9:     "resolveJsonModule": true,
  10:     "isolatedModules": true,
  11:     "verbatimModuleSyntax": true,
  12:     "moduleDetection": "force",
  13:     "noEmit": true,
  14:     "jsx": "react-jsx",
  15:     "strict": true,
  16:     "noUnusedLocals": true,
  17:     "noUnusedParameters": true,
  18:     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo"
  19:   },
  20:   "include": ["src"]
  21: }

## src/vite-env.d.ts

   1: /// <reference types="vite/client" />

## src/main.tsx

   1: import { StrictMode } from 'react';
   2: import { createRoot } from 'react-dom/client';
   3: import App from './App';
   4: import './styles/global.css';
   5: 
   6: createRoot(document.getElementById('root')!).render(
   7:   <StrictMode><App /></StrictMode>,
   8: );

## src/App.tsx

   1: import { BrowserRouter, Link, Route, Routes } from 'react-router';
   2: import { SiteShell } from './components/SiteShell';
   3: import { CatalogPage } from './catalog/CatalogPage';
   4: 
   5: function HomePage() {
   6:   return <>
   7:     <section className="home-hero"><div><p className="eyebrow"><span className="status-dot" /> MỞ CỬA CHO SỰ TÒ MÒ</p><h1>Thử một chút.<br />Hiểu <em>nhiều hơn.</em></h1><p className="intro">Một phòng thí nghiệm nhỏ cho những câu hỏi lớn.<br />Khám phá khoa học bằng chính những lần thử của bạn.</p></div><div className="hero-art" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="art-ball" /><span className="art-label">QUAN SÁT → ĐẶT CÂU HỎI → KHÁM PHÁ</span><span className="art-cross">+</span></div></section>
   8:     <section className="fields-section" aria-labelledby="fields-title"><div className="section-heading"><h2 id="fields-title">Hôm nay, bạn tò mò về điều gì?</h2><span>CHỌN MỘT LĨNH VỰC ↓</span></div><div className="field-grid"><Link className="field-card physics-card" to="/physics"><div className="card-top"><span className="eyebrow">01 / PHYSICS</span><span className="badge">1 thí nghiệm</span></div><span className="field-symbol" aria-hidden="true">↘</span><h3>Vật lý</h3><p>Từ một vật rơi đến những quy luật<br />chuyển động của thế giới.</p><span className="card-bottom">Bắt đầu khám phá <span aria-hidden="true">↗</span></span></Link><Link className="field-card chemistry-card" to="/chemistry"><div className="card-top"><span className="eyebrow">02 / CHEMISTRY</span><span className="badge">Sắp có</span></div><span className="field-symbol chemistry-symbol" aria-hidden="true">⚗</span><h3>Hóa học</h3><p>Gặp gỡ vật chất và những<br />biến đổi đầy bất ngờ.</p><span className="card-bottom">Xem trước chủ đề <span aria-hidden="true">↗</span></span></Link></div></section>
   9:     <p className="home-note"><span aria-hidden="true">✳</span> Không cần áo blouse. Chỉ cần một chút tò mò.</p>
  10:   </>;
  11: }
  12: 
  13: function NotFoundPage() {
  14:   return <section className="page-section"><p className="eyebrow">404 / CHƯA TÌM THẤY</p><h1>Có lẽ bạn đã đi hơi xa.</h1><p className="intro">Trang này không tồn tại. Một khám phá mới vẫn đang chờ ở phòng thí nghiệm.</p><Link className="text-link" to="/">Về trang khám phá ↗</Link></section>;
  15: }
  16: 
  17: export default function App() {
  18:   return <BrowserRouter><SiteShell><Routes>
  19:     <Route path="/" element={<HomePage />} />
  20:     <Route path="/physics" element={<CatalogPage field="physics" />} />
  21:     <Route path="/physics/gravity" element={<CatalogPage field="physics" topic="Trọng lực" />} />
  22:     <Route path="/physics/gravity/free-fall" element={<section className="page-section"><Link className="back-link" to="/physics/gravity">← Trọng lực</Link><p className="eyebrow">THÍ NGHIỆM / 01</p><h1>Hai vật rơi tự do</h1><p className="intro">Vật nặng có rơi nhanh hơn không?</p><p>Bàn thí nghiệm đang được chuẩn bị.</p></section>} />
  23:     <Route path="/chemistry" element={<CatalogPage field="chemistry" />} />
  24:     <Route path="*" element={<NotFoundPage />} />
  25:   </Routes></SiteShell></BrowserRouter>;
  26: }

## src/components/SiteShell.tsx

   1: import { useEffect, useRef } from 'react';
   2: import type { ReactNode } from 'react';
   3: import { Link, NavLink, useLocation } from 'react-router';
   4: 
   5: export function SiteShell({ children }: { children: ReactNode }) {
   6:   const { pathname } = useLocation();
   7:   const main = useRef<HTMLElement>(null);
   8:   const previousPath = useRef(pathname);
   9: 
  10:   useEffect(() => {
  11:     if (previousPath.current !== pathname) {
  12:       main.current?.focus();
  13:       window.scrollTo(0, 0);
  14:       previousPath.current = pathname;
  15:     }
  16:   }, [pathname]);
  17: 
  18:   return (
  19:     <div className="site-shell">
  20:       <a className="skip-link" href="#main-content">Đến nội dung chính</a>
  21:       <header className="site-header">
  22:         <Link to="/" className="brand" aria-label="Phòng thí nghiệm — Trang chủ">
  23:           <span className="brand-symbol" aria-hidden="true">✳</span>
  24:           <span>phòng thí nghiệm<span className="brand-caption">KHOA HỌC / 2D</span></span>
  25:         </Link>
  26:         <nav aria-label="Điều hướng chính">
  27:           <NavLink to="/" end>Khám phá</NavLink>
  28:           <NavLink to="/physics">Vật lý</NavLink>
  29:           <NavLink to="/chemistry">Hóa học <span className="nav-dot" aria-hidden="true" /></NavLink>
  30:         </nav>
  31:       </header>
  32:       <main id="main-content" ref={main} tabIndex={-1}>{children}</main>
  33:       <footer className="site-footer"><span>Một câu hỏi nhỏ. Một khám phá mới.</span><span>Khoa học dành cho mọi người ↗</span></footer>
  34:     </div>
  35:   );
  36: }

## src/catalog/experiments.ts

   1: export type ExperimentCard = {
   2:   id: string;
   3:   field: 'physics' | 'chemistry';
   4:   topic: string;
   5:   title: string;
   6:   question: string;
   7:   href: string;
   8:   status: 'available' | 'preview';
   9: };
  10: 
  11: export const experiments: ExperimentCard[] = [
  12:   {
  13:     id: 'free-fall', field: 'physics', topic: 'Trọng lực',
  14:     title: 'Hai vật rơi tự do', question: 'Vật nặng có rơi nhanh hơn không?',
  15:     href: '/physics/gravity/free-fall', status: 'available',
  16:   },
  17:   {
  18:     id: 'chemistry-preview', field: 'chemistry', topic: 'Khám phá vật chất',
  19:     title: 'Hóa học đang đến', question: 'Điều gì xảy ra khi vật chất thay đổi?',
  20:     href: '/chemistry', status: 'preview',
  21:   },
  22: ];

## src/catalog/CatalogPage.tsx

   1: import { Link } from 'react-router';
   2: import { experiments } from './experiments';
   3: import type { ExperimentCard } from './experiments';
   4: 
   5: export function CatalogPage({ field, topic }: { field: ExperimentCard['field']; topic?: string }) {
   6:   if (field === 'chemistry') {
   7:     const preview = experiments.find((experiment) => experiment.field === 'chemistry');
   8:     return <section className="page-section">
   9:       <Link className="back-link" to="/">← Tất cả lĩnh vực</Link>
  10:       <p className="eyebrow">02 / HÓA HỌC <span className="badge">Sắp có</span></p>
  11:       <h1>Những thay đổi nhỏ.<br />Thế giới khác biệt.</h1>
  12:       <p className="intro">{preview?.question} Chúng mình đang chuẩn bị những thí nghiệm để bạn khám phá câu trả lời.</p>
  13:       <div className="preview-panel"><h2>Một góc nhìn trước</h2><p>Các chủ đề dự kiến: trạng thái của vật chất, dung dịch và sự biến đổi màu sắc.</p><p>Thí nghiệm Hóa học chưa mở trong phiên bản này. Trong lúc chờ đợi, hãy bắt đầu với trọng lực.</p><Link className="text-link" to="/physics/gravity">Khám phá Vật lý <span aria-hidden="true">↗</span></Link></div>
  14:     </section>;
  15:   }
  16: 
  17:   const available = experiments.filter((experiment) => experiment.field === field && experiment.status === 'available' && (!topic || experiment.topic === topic));
  18:   return <section className="page-section">
  19:     <Link className="back-link" to={topic ? '/physics' : '/'}>← {topic ? 'Vật lý' : 'Tất cả lĩnh vực'}</Link>
  20:     <p className="eyebrow">01 / VẬT LÝ{topic ? ' / TRỌNG LỰC' : ''}</p>
  21:     <h1>{topic ? 'Điều gì kéo mọi thứ xuống?' : 'Hiểu những quy luật\nqua từng lần thử.'}</h1>
  22:     <p className="intro">{topic ? 'Cùng quan sát chuyển động quen thuộc và tìm lời giải cho một câu hỏi tưởng chừng đơn giản.' : 'Bắt đầu từ một hiện tượng quen thuộc. Đặt câu hỏi và tự mình khám phá.'}</p>
  23:     <div className="catalog-grid">
  24:       {topic ? available.map((experiment) => <Link className="catalog-card" key={experiment.id} to={experiment.href}><span className="eyebrow">THÍ NGHIỆM / 01</span><div className="fall-illustration" aria-hidden="true"><span /><span /></div><h2>{experiment.title}</h2><p>{experiment.question}</p><span className="text-link">Mở thí nghiệm ↗</span></Link>) : <Link className="catalog-card" to="/physics/gravity"><span className="eyebrow">CHỦ ĐỀ / 01</span><div className="fall-illustration" aria-hidden="true"><span /><span /></div><h2>Trọng lực</h2><p>Vì sao mọi vật rơi xuống? Khám phá chuyển động dưới tác dụng của trọng lực.</p><span className="text-link">{available.length} thí nghiệm ↗</span></Link>}
  25:     </div>
  26:   </section>;
  27: }

## src/styles/global.css

   1: @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
   2: 
   3: :root{font-family:'Be Vietnam Pro',system-ui,sans-serif;color:#243b35;background:#f5f4ee;font-synthesis:none;text-rendering:optimizeLegibility;font-weight:400;line-height:1.65;font-size:15px}*{box-sizing:border-box}body{margin:0}a{color:inherit;text-decoration:none}button,a{-webkit-tap-highlight-color:transparent}a:focus-visible{outline:3px solid #146a58;outline-offset:6px;border-radius:3px}main:focus{outline:none}.site-shell{max-width:1440px;margin:auto;padding:0 6.25%}.site-header{min-height:112px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d7ddd3;gap:32px}.brand{display:flex;align-items:center;gap:12px;font-size:18px;font-weight:700;letter-spacing:-.5px}.brand-symbol{font-size:45px;font-weight:400;line-height:1;color:#20624d}.brand-caption{display:block;font-size:9px;letter-spacing:2.6px;font-weight:500;margin-top:3px}.site-header nav{display:flex;align-items:center;gap:34px;font-size:13px;font-weight:500}.site-header nav a{padding:12px 0;position:relative}.site-header nav a.active:after{content:'';position:absolute;bottom:4px;left:0;width:18px;height:2px;background:#28694f}.nav-dot,.status-dot{display:inline-block;background:#a6b788;width:6px;height:6px;border-radius:50%;vertical-align:middle;margin-left:4px}.skip-link{position:fixed;top:8px;left:8px;padding:12px;background:#fff;z-index:10;transform:translateY(-150%)}.skip-link:focus{transform:none}.home-hero{display:grid;grid-template-columns:1.2fr 1fr;align-items:center;min-height:390px;gap:40px;padding:54px 0 42px}.eyebrow{font-size:10px;font-weight:600;letter-spacing:1.8px;margin:0 0 23px}.status-dot{margin:0 8px 2px 0;background:#357a58}h1{font-size:clamp(36px,4.3vw,62px);line-height:1.19;font-weight:500;letter-spacing:-2.6px;margin:0 0 25px;white-space:pre-line}h1 em{font-family:Georgia,serif;font-weight:400;color:#608663}.intro{color:#65716a;font-size:14px;line-height:1.9;margin:0;max-width:610px}.hero-art{height:270px;position:relative;overflow:hidden;background-image:radial-gradient(#ccd2c6 .8px,transparent .8px);background-size:17px 17px;border-radius:50%}.orbit{position:absolute;left:10%;top:26%;width:80%;height:43%;border:1px solid #b0bca8;border-radius:50%;transform:rotate(-25deg)}.orbit-two{transform:rotate(34deg);top:25%}.art-ball{position:absolute;width:112px;height:112px;left:40%;top:21%;border-radius:50%;background:radial-gradient(circle at 30% 24%,#e1e8a3,#a9bd72 60%,#7c9656);box-shadow:12px 23px 28px #4e64421a}.art-label{position:absolute;bottom:15px;left:20%;font-size:8px;letter-spacing:1.5px;background:#f5f4ee;padding:7px}.art-cross{position:absolute;right:15%;top:14%;font-size:26px;font-weight:400}.section-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:20px}.section-heading h2{font-size:17px;letter-spacing:-.5px;font-weight:500;margin:0}.section-heading>span{font-size:9px;letter-spacing:1.3px;color:#7b847b}.field-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}.field-card{position:relative;border:1px solid #d5ddcb;border-radius:13px;padding:26px 30px 0;overflow:hidden;background:#e9efdf;transition:box-shadow .18s ease, border-color .18s ease}.field-card:hover{box-shadow:0 8px 25px #243b350c;border-color:#9cb58a}.chemistry-card{background:#eeeae2;border-color:#ded8cd}.card-top{display:flex;justify-content:space-between;align-items:center;gap:8px}.card-top .eyebrow{margin:0}.badge{border:1px solid #bdc9ae;border-radius:20px;padding:4px 10px;font-size:9px;letter-spacing:0;font-weight:500;white-space:nowrap}.chemistry-card .badge{border-color:#ccc3b4}.field-card h3{font-size:32px;line-height:1.2;letter-spacing:-1px;font-weight:500;margin:44px 0 14px}.field-card p{font-size:12px;color:#657161;line-height:1.9;margin:0 0 28px}.field-symbol{position:absolute;right:40px;top:64px;font-size:100px;font-family:Georgia,serif;line-height:1;color:#779466}.chemistry-symbol{font-size:84px;color:#aa9f88;right:45px;top:85px}.card-bottom{border-top:1px solid #cfd9c4;padding:17px 0;display:flex;justify-content:space-between;font-size:11px;font-weight:500}.chemistry-card .card-bottom{border-color:#d9d1c5}.card-bottom span{font-size:20px;line-height:1}.home-note{text-align:center;font-size:11px;color:#74806f;margin:33px 0 44px}.home-note span{margin-right:8px;font-size:19px;vertical-align:middle}.site-footer{border-top:1px solid #d7ddd3;padding:23px 0;display:flex;justify-content:space-between;font-size:9px;color:#7d877c;gap:20px}.page-section{padding:40px 0 70px;min-height:calc(100vh - 180px)}.back-link{display:inline-block;font-size:12px;color:#627460;margin-bottom:42px;padding:4px 0}.page-section .eyebrow .badge{margin-left:12px}.page-section h1{max-width:850px}.catalog-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin-top:36px}.catalog-card,.preview-panel{background:#e9efdf;border:1px solid #d5ddcb;border-radius:13px;padding:26px 30px}.catalog-card{display:block}.catalog-card:hover{border-color:#7f9e70}.catalog-card h2,.preview-panel h2{font-size:25px;font-weight:500;margin:14px 0}.catalog-card p,.preview-panel p{font-size:14px;color:#657161}.text-link{display:inline-block;font-size:12px;font-weight:600;margin:12px 0 0;padding:8px 0}.fall-illustration{height:100px;position:relative;border-bottom:1px solid #b3c1a7;background:repeating-linear-gradient(transparent,transparent 24px,#d8e0ce 25px)}.fall-illustration span{display:block;position:absolute;bottom:12px;left:34%;width:30px;height:30px;background:#81a66f;border-radius:50%}.fall-illustration span+span{left:58%;width:48px;height:48px;background:#c3ce88}.preview-panel{margin-top:36px;max-width:750px;background:#eeeae2;border-color:#ded8cd}
   4: @media(max-width:700px){.site-shell{padding:0 6%}.site-header{min-height:115px;gap:15px;flex-wrap:wrap;padding:20px 0 12px}.brand{font-size:16px}.brand-symbol{font-size:34px}.site-header nav{width:100%;gap:27px;font-size:12px}.home-hero{grid-template-columns:1fr;gap:12px;padding-top:38px;min-height:0}h1{font-size:42px;letter-spacing:-1.8px}.hero-art{height:190px;max-width:370px;width:100%;margin:0 auto}.art-ball{width:85px;height:85px}.art-label{bottom:4px;font-size:6px}.field-grid,.catalog-grid{grid-template-columns:1fr}.section-heading{align-items:start}.section-heading>span{display:none}.field-card{padding:24px 25px 0}.field-card h3{margin-top:36px}.site-footer{flex-direction:column;gap:5px}.home-note{font-size:10px}.page-section{padding-top:25px}.back-link{margin-bottom:28px}.page-section h1{font-size:36px}.catalog-card,.preview-panel{padding:24px}.intro br{display:none}}
   5: @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;transition:none!important}}
   6: 
   7: h1 em{font-family:inherit;font-weight:400}

## .gitignore

   1: node_modules/
   2: dist/
   3: *.tsbuildinfo

## README.md

   1: # Phòng thí nghiệm khoa học 2D
   2: 
   3: React + TypeScript + Vite catalogue foundation. The free-fall workbench is a placeholder until the experiment implementation task.
   4: 
   5: ## Local development
   6: 
   7: ```sh
   8: npm install
   9: npm run dev
  10: npm run build
  11: npm run preview
  12: ```
  13: 
  14: On Windows where PowerShell blocks `npm.ps1`, use `npm.cmd`.
  15: 
  16: ## Hosting
  17: 
  18: Publish `dist/` after building. Configure the host to serve `index.html` for application URLs that do not match a static file, including `/physics/gravity/free-fall`. This is required by `BrowserRouter`. Vite development and preview servers provide the local SPA fallback. No production host has been selected yet.
  19: 
  20: `npm test` is reserved for the model tests added in later tasks. `npm run test:e2e` is reserved for the later Playwright setup; Playwright is not installed by this foundation task.
