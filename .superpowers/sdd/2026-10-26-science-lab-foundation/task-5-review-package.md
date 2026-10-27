# Task 5 scoped files (no Git diff available)

## src/App.tsx

   1: import { BrowserRouter, Link, Route, Routes } from 'react-router';
   2: import { SiteShell } from './components/SiteShell';
   3: import { CatalogPage } from './catalog/CatalogPage';
   4: import { GravityPage } from './experiments/gravity/GravityPage';
   5: 
   6: function HomePage() {
   7:   return <>
   8:     <section className="home-hero"><div><p className="eyebrow"><span className="status-dot" /> MỞ CỬA CHO SỰ TÒ MÒ</p><h1>Thử một chút.<br />Hiểu <em>nhiều hơn.</em></h1><p className="intro">Một phòng thí nghiệm nhỏ cho những câu hỏi lớn.<br />Khám phá khoa học bằng chính những lần thử của bạn.</p></div><div className="hero-art" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="art-ball" /><span className="art-label">QUAN SÁT → ĐẶT CÂU HỎI → KHÁM PHÁ</span><span className="art-cross">+</span></div></section>
   9:     <section className="fields-section" aria-labelledby="fields-title"><div className="section-heading"><h2 id="fields-title">Hôm nay, bạn tò mò về điều gì?</h2><span>CHỌN MỘT LĨNH VỰC ↓</span></div><div className="field-grid"><Link className="field-card physics-card" to="/physics"><div className="card-top"><span className="eyebrow">01 / PHYSICS</span><span className="badge">1 thí nghiệm</span></div><span className="field-symbol" aria-hidden="true">↘</span><h3>Vật lý</h3><p>Từ một vật rơi đến những quy luật<br />chuyển động của thế giới.</p><span className="card-bottom">Bắt đầu khám phá <span aria-hidden="true">↗</span></span></Link><Link className="field-card chemistry-card" to="/chemistry"><div className="card-top"><span className="eyebrow">02 / CHEMISTRY</span><span className="badge">Sắp có</span></div><span className="field-symbol chemistry-symbol" aria-hidden="true">⚗</span><h3>Hóa học</h3><p>Gặp gỡ vật chất và những<br />biến đổi đầy bất ngờ.</p><span className="card-bottom">Xem trước chủ đề <span aria-hidden="true">↗</span></span></Link></div></section>
  10:     <p className="home-note"><span aria-hidden="true">✳</span> Không cần áo blouse. Chỉ cần một chút tò mò.</p>
  11:   </>;
  12: }
  13: 
  14: function NotFoundPage() {
  15:   return <section className="page-section"><p className="eyebrow">404 / CHƯA TÌM THẤY</p><h1>Có lẽ bạn đã đi hơi xa.</h1><p className="intro">Trang này không tồn tại. Một khám phá mới vẫn đang chờ ở phòng thí nghiệm.</p><Link className="text-link" to="/">Về trang khám phá ↗</Link></section>;
  16: }
  17: 
  18: export default function App() {
  19:   return <BrowserRouter><SiteShell><Routes>
  20:     <Route path="/" element={<HomePage />} />
  21:     <Route path="/physics" element={<CatalogPage field="physics" />} />
  22:     <Route path="/physics/gravity" element={<CatalogPage field="physics" topic="Trọng lực" />} />
  23:     <Route path="/physics/gravity/free-fall" element={<GravityPage />} />
  24:     <Route path="/chemistry" element={<CatalogPage field="chemistry" />} />
  25:     <Route path="*" element={<NotFoundPage />} />
  26:   </Routes></SiteShell></BrowserRouter>;
  27: }
  28: 

## src/experiments/gravity/GravityPage.tsx

   1: import { useEffect, useRef, useState } from 'react';
   2: import { Link } from 'react-router';
   3: import { createLabClock, type LabClock } from './clock';
   4: import { createGravityScene, type GravityScene } from './scene';
   5: import { fallTimeS, sampleGravity } from './model';
   6: import { HeightGraph } from './HeightGraph';
   7: 
   8: type Inputs = { heightM: number; leftMassKg: number; rightMassKg: number };
   9: const defaults: Inputs = { heightM: 12, leftMassKg: 1, rightMassKg: 5 };
  10: const samples = (inputs: Inputs, timeS: number) => ({
  11:   left: sampleGravity({ heightM: inputs.heightM, massKg: inputs.leftMassKg, gravityMps2: 9.8 }, timeS),
  12:   right: sampleGravity({ heightM: inputs.heightM, massKg: inputs.rightMassKg, gravityMps2: 9.8 }, timeS),
  13: });
  14: 
  15: export function GravityPage() {
  16:   const [inputs, setInputs] = useState(defaults);
  17:   const inputsRef = useRef(inputs);
  18:   const [display, setDisplay] = useState(() => samples(defaults, 0));
  19:   const [running, setRunning] = useState(false);
  20:   const [sceneError, setSceneError] = useState(false);
  21:   const hostRef = useRef<HTMLDivElement>(null);
  22:   const sceneRef = useRef<GravityScene | null>(null);
  23:   const clockRef = useRef<LabClock | null>(null);
  24:   const lastPublishedRef = useRef(0);
  25: 
  26:   function snapshotAt(timeS: number) {
  27:     const next = samples(inputsRef.current, timeS);
  28:     sceneRef.current?.update(next.left, next.right);
  29:     if (timeS === 0 || next.left.landed || timeS - lastPublishedRef.current >= 0.1) {
  30:       setDisplay(next);
  31:       lastPublishedRef.current = timeS;
  32:     }
  33:     if (next.left.landed) {
  34:       clockRef.current?.pause();
  35:       setRunning(false);
  36:     }
  37:   }
  38: 
  39:   function changeInput(key: keyof Inputs, value: number) {
  40:     const next = { ...inputsRef.current, [key]: value };
  41:     inputsRef.current = next;
  42:     setInputs(next);
  43:     setRunning(false);
  44:     sceneRef.current?.setHeight(next.heightM);
  45:     clockRef.current?.reset();
  46:   }
  47: 
  48:   useEffect(() => {
  49:     let cancelled = false;
  50:     let ownedScene: GravityScene | null = null;
  51:     const clock = createLabClock(snapshotAt);
  52:     clockRef.current = clock;
  53:     clock.reset();
  54:     void createGravityScene(hostRef.current!, { onHeightChange: heightM => {
  55:       if (!cancelled) changeInput('heightM', heightM);
  56:     } }).then(scene => {
  57:       if (cancelled) { scene.destroy(); return; }
  58:       ownedScene = scene;
  59:       sceneRef.current = scene;
  60:       scene.setHeight(inputsRef.current.heightM);
  61:       snapshotAt(clock.getTime());
  62:     }).catch(() => { if (!cancelled) setSceneError(true); });
  63:     return () => {
  64:       cancelled = true;
  65:       clock.dispose();
  66:       ownedScene?.destroy();
  67:       if (sceneRef.current === ownedScene) sceneRef.current = null;
  68:       if (clockRef.current === clock) clockRef.current = null;
  69:     };
  70:   }, []);
  71: 
  72:   const graphInput = { heightM: inputs.heightM, massKg: inputs.leftMassKg, gravityMps2: 9.8 };
  73:   return <section className="page-section gravity-page">
  74:     <Link className="back-link" to="/physics/gravity">← Trọng lực</Link>
  75:     <p className="eyebrow">THÍ NGHIỆM / 01</p>
  76:     <h1>Hai vật rơi tự do</h1>
  77:     <p className="intro">Vật nặng có rơi nhanh hơn không? Thay đổi khối lượng, rồi cùng quan sát.</p>
  78:     <div className="experiment-layout">
  79:       <section className="experiment-workbench" aria-label="Bàn thí nghiệm">
  80:         <div ref={hostRef} className="gravity-canvas" />
  81:         {sceneError && <p role="status">Không thể mở hình mô phỏng. Bạn vẫn có thể chạy thí nghiệm bằng các nút và đọc số liệu bên dưới.</p>}
  82:         <p>Kéo vật để đổi độ cao, hoặc dùng thanh trượt bên dưới. Cả hai vật được thả cùng lúc từ trạng thái đứng yên.</p>
  83:       </section>
  84:       <section className="experiment-controls" aria-labelledby="controls-title">
  85:         <h2 id="controls-title">Thiết lập lần thả</h2>
  86:         {([
  87:           ['heightM', 'release-height', 'Độ cao thả', 2, 20, 'm'],
  88:           ['leftMassKg', 'left-mass', 'Khối lượng vật A', 0.1, 10, 'kg'],
  89:           ['rightMassKg', 'right-mass', 'Khối lượng vật B', 0.1, 10, 'kg'],
  90:         ] as const).map(([key, id, label, min, max, unit]) => <div className="experiment-control" key={key}>
  91:           <label htmlFor={id}>{label}: <strong>{inputs[key].toFixed(1)} {unit}</strong></label>
  92:           <input id={id} type="range" min={min} max={max} step="0.1" value={inputs[key]} onChange={event => changeInput(key, Number(event.target.value))} />
  93:         </div>)}
  94:         <p>Gia tốc trọng trường: <strong>g = 9.8 m/s²</strong></p>
  95:         <div className="experiment-actions">
  96:           <button type="button" disabled={running} onClick={() => { if (display.left.landed) clockRef.current?.reset(); clockRef.current?.play(); setRunning(true); }}>Bắt đầu</button>
  97:           <button type="button" disabled={!running} onClick={() => { clockRef.current?.pause(); setRunning(false); }}>Tạm dừng</button>
  98:           <button type="button" onClick={() => { clockRef.current?.reset(); setRunning(false); }}>Đặt lại</button>
  99:         </div>
 100:         <p role="status">{display.left.landed ? 'Cả hai vật đã chạm đất cùng lúc.' : running ? 'Đang rơi…' : display.left.timeS > 0 ? 'Đã tạm dừng.' : 'Sẵn sàng thả.'}</p>
 101:       </section>
 102:     </div>
 103:     <section className="experiment-measurements" aria-labelledby="measurements-title">
 104:       <h2 id="measurements-title">Quan sát bằng con số</h2>
 105:       <p>Thời gian đã trôi: <strong><span data-testid="elapsed-seconds">{display.left.timeS.toFixed(2)}</span> s</strong> · Thời gian chạm đất: <strong>{fallTimeS(graphInput).toFixed(2)} s</strong></p>
 106:       <table><caption>Vận tốc hướng xuống; số liệu dừng tại lần chạm đất đầu tiên.</caption><thead><tr><th scope="col">Vật</th><th scope="col">Độ cao</th><th scope="col">Quãng đường rơi</th><th scope="col">Vận tốc</th></tr></thead><tbody>
 107:         {([['A', display.left], ['B', display.right]] as const).map(([name, snapshot]) => <tr key={name}><th scope="row">{name}</th><td>{snapshot.heightM.toFixed(2)} m</td><td>{snapshot.distanceM.toFixed(2)} m</td><td>{snapshot.velocityMps.toFixed(2)} m/s</td></tr>)}
 108:       </tbody></table>
 109:     </section>
 110:     <HeightGraph input={graphInput} currentTimeS={display.left.timeS} />
 111:     <section className="experiment-explanation"><h2>Khác khối lượng, cùng thời gian rơi</h2><p>Trong mô hình này, hai vật cùng chịu một gia tốc trọng trường. Khi thả từ cùng độ cao và bỏ qua lực cản không khí, chúng luôn ở cùng độ cao và chạm đất cùng lúc. Ngoài đời, hình dạng và lực cản không khí có thể làm kết quả khác đi.</p>
 112:       <p>Giả định: trọng trường đều, g = 9.8 m/s², vận tốc ban đầu bằng 0, không có lực cản không khí. <a href="https://openstax.org/books/college-physics-2e/pages/2-7-falling-objects">Tìm hiểu về vật rơi tự do — OpenStax</a>.</p>
 113:       <details><summary>Xem công thức</summary><p>Quãng đường rơi: d = ½gt². Độ cao: h = h₀ − ½gt². Vận tốc hướng xuống: v = gt. Thời gian chạm đất: t = √(2h₀/g).</p><p>h₀ và d tính bằng m; t bằng s; v bằng m/s. Khối lượng không xuất hiện trong các công thức này.</p></details>
 114:     </section>
 115:   </section>;
 116: }

## src/experiments/gravity/HeightGraph.tsx

   1: import { useId } from 'react';
   2: import { fallTimeS, sampleGravity, type GravityInput } from './model';
   3: 
   4: export function HeightGraph({ input, currentTimeS }: { input: GravityInput; currentTimeS: number }) {
   5:   const descriptionId = useId();
   6:   const duration = fallTimeS(input);
   7:   const current = sampleGravity(input, currentTimeS);
   8:   const points = Array.from({ length: 41 }, (_, i) => {
   9:     const snapshot = sampleGravity(input, i / 40 * duration);
  10:     return `${i / 40 * 320},${160 - snapshot.heightM / input.heightM * 160}`;
  11:   }).join(' ');
  12:   return <section className="height-graph" aria-labelledby={`${descriptionId}-title`}>
  13:     <h2 id={`${descriptionId}-title`}>Độ cao theo thời gian</h2>
  14:     <svg viewBox="0 0 390 220" role="img" aria-label="Đồ thị độ cao của hai vật" aria-describedby={descriptionId} style={{ width: '100%', maxWidth: 620 }}>
  15:       <g transform="translate(45 20)">
  16:         <path d="M0 0V160H320" fill="none" stroke="currentColor" strokeWidth="2" />
  17:         <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" />
  18:         <line x1={current.timeS / duration * 320} x2={current.timeS / duration * 320} y1="0" y2="160" stroke="#bb402f" strokeDasharray="4 4" />
  19:         <circle cx={current.timeS / duration * 320} cy={160 - current.heightM / input.heightM * 160} r="5" fill="#bb402f" />
  20:         <text x="-8" y="4" textAnchor="end" fontSize="12">{input.heightM} m</text>
  21:         <text x="-8" y="164" textAnchor="end" fontSize="12">0 m</text>
  22:         <text x="0" y="182" fontSize="12">0 s</text>
  23:         <text x="320" y="182" textAnchor="end" fontSize="12">{duration.toFixed(2)} s</text>
  24:       </g>
  25:     </svg>
  26:     <p id={descriptionId}>Hai vật dùng chung một đường cong: khối lượng không làm thay đổi độ cao theo thời gian khi bỏ qua lực cản không khí. Ở {current.timeS.toFixed(2)} s, cả hai cao {current.heightM.toFixed(2)} m.</p>
  27:   </section>;
  28: }
