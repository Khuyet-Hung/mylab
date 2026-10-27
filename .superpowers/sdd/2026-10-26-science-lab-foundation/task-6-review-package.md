# Task 6 scoped files (no Git diff available)

## src/styles/tokens.css

   1: :root {
   2:   --paper: #f4f2ec;
   3:   --ink: #1e1e1b;
   4:   --muted: #55554e;
   5:   --yellow: #ffd83d;
   6:   --coral: #ff927a;
   7:   --blue: #4f78e8;
   8:   --blue-ink: #244fb9;
   9:   --panel: #fffdf6;
  10:   --outline: 2px solid var(--ink);
  11:   --shadow: 5px 5px 0 var(--ink);
  12:   --radius: 20px;
  13:   --mono: "Cascadia Code", Consolas, monospace;
  14:   --sans: "Be Vietnam Pro", Arial, sans-serif;
  15:   --space: 8px;
  16:   --focus: 3px solid var(--blue-ink);
  17:   --motion-short: 150ms;
  18: }

## src/styles/global.css

   1: @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap");
   2: @import "./tokens.css";
   3: 
   4: * {
   5:   box-sizing: border-box;
   6: }
   7: :root {
   8:   font-family: var(--sans);
   9:   color: var(--ink);
  10:   background: var(--paper);
  11:   font-synthesis: none;
  12:   line-height: 1.65;
  13:   font-size: 15px;
  14: }
  15: body {
  16:   margin: 0;
  17: }
  18: a {
  19:   color: inherit;
  20:   text-decoration: none;
  21: }
  22: button,
  23: input {
  24:   font: inherit;
  25: }
  26: button,
  27: a {
  28:   -webkit-tap-highlight-color: transparent;
  29: }
  30: :is(a, button, input, summary):focus-visible {
  31:   outline: var(--focus);
  32:   outline-offset: 5px;
  33: }
  34: main:focus {
  35:   outline: none;
  36: }
  37: .site-shell {
  38:   max-width: 1480px;
  39:   margin: auto;
  40:   padding: 0 5%;
  41: }
  42: .site-header {
  43:   min-height: 112px;
  44:   display: flex;
  45:   justify-content: space-between;
  46:   align-items: center;
  47:   border-bottom: var(--outline);
  48:   gap: 24px;
  49: }
  50: .brand {
  51:   display: flex;
  52:   align-items: center;
  53:   gap: 12px;
  54:   font-size: 18px;
  55:   font-weight: 800;
  56:   letter-spacing: -0.7px;
  57: }
  58: .brand-symbol {
  59:   display: grid;
  60:   place-items: center;
  61:   width: 49px;
  62:   height: 49px;
  63:   border: var(--outline);
  64:   border-radius: 50%;
  65:   background: var(--yellow);
  66:   font-size: 39px;
  67:   line-height: 1;
  68: }
  69: .brand-caption {
  70:   display: block;
  71:   font: 10px var(--mono);
  72:   letter-spacing: 2px;
  73:   margin-top: 5px;
  74: }
  75: .site-header nav {
  76:   display: flex;
  77:   gap: 5px;
  78:   padding: 5px;
  79:   border: var(--outline);
  80:   border-radius: 999px;
  81:   background: var(--panel);
  82: }
  83: .site-header nav a {
  84:   padding: 8px 17px;
  85:   border: 2px solid transparent;
  86:   border-radius: 999px;
  87:   font-size: 12px;
  88:   font-weight: 700;
  89: }
  90: .site-header nav a.active {
  91:   background: var(--yellow);
  92:   border-color: var(--ink);
  93: }
  94: .nav-dot,
  95: .status-dot {
  96:   display: inline-block;
  97:   width: 7px;
  98:   height: 7px;
  99:   border-radius: 50%;
 100:   background: var(--ink);
 101:   margin-left: 4px;
 102: }
 103: .status-dot {
 104:   margin: 0 8px 1px 0;
 105: }
 106: .skip-link {
 107:   position: fixed;
 108:   top: 8px;
 109:   left: 8px;
 110:   padding: 12px;
 111:   background: var(--yellow);
 112:   border: var(--outline);
 113:   z-index: 10;
 114:   transform: translateY(-160%);
 115: }
 116: .skip-link:focus {
 117:   transform: none;
 118: }
 119: .home-hero {
 120:   display: grid;
 121:   grid-template-columns: 1.3fr 1fr;
 122:   align-items: center;
 123:   gap: 42px;
 124:   padding: 60px 0 50px;
 125: }
 126: .eyebrow,
 127: .badge,
 128: .section-heading > span,
 129: .art-label {
 130:   font: 11px var(--mono);
 131:   letter-spacing: 1px;
 132: }
 133: .eyebrow {
 134:   margin: 0 0 24px;
 135: }
 136: h1 {
 137:   font-size: clamp(36px, 4.6vw, 66px);
 138:   line-height: 1.15;
 139:   font-weight: 900;
 140:   letter-spacing: -2.8px;
 141:   margin: 0 0 25px;
 142:   white-space: pre-line;
 143: }
 144: h1 em {
 145:   font: inherit;
 146:   font-style: normal;
 147:   background: var(--yellow);
 148:   padding: 0 6px;
 149: }
 150: .intro {
 151:   color: var(--muted);
 152:   font-size: 14px;
 153:   max-width: 650px;
 154:   margin: 0;
 155: }
 156: .hero-art {
 157:   height: 285px;
 158:   position: relative;
 159:   overflow: hidden;
 160:   border: var(--outline);
 161:   border-radius: var(--radius);
 162:   box-shadow: var(--shadow);
 163:   background: var(--blue);
 164:   background-image:
 165:     linear-gradient(#ffffff22 1px, transparent 1px),
 166:     linear-gradient(90deg, #ffffff22 1px, transparent 1px);
 167:   background-size: 28px 28px;
 168: }
 169: .orbit {
 170:   position: absolute;
 171:   left: 10%;
 172:   top: 27%;
 173:   width: 80%;
 174:   height: 43%;
 175:   border: 3px solid var(--ink);
 176:   border-radius: 50%;
 177:   transform: rotate(-25deg);
 178: }
 179: .orbit-two {
 180:   transform: rotate(34deg);
 181: }
 182: .art-ball {
 183:   position: absolute;
 184:   width: 112px;
 185:   height: 112px;
 186:   left: 39%;
 187:   top: 24%;
 188:   border-radius: 50%;
 189:   background: var(--yellow);
 190:   border: 3px solid var(--ink);
 191:   box-shadow: 6px 6px 0 var(--ink);
 192: }
 193: .art-label {
 194:   position: absolute;
 195:   bottom: 15px;
 196:   left: 15px;
 197:   right: 15px;
 198:   text-align: center;
 199:   background: var(--paper);
 200:   border: var(--outline);
 201:   border-radius: 999px;
 202:   padding: 10px 5px;
 203:   font-size: 9px;
 204:   letter-spacing: 0;
 205: }
 206: .art-cross {
 207:   position: absolute;
 208:   right: 18px;
 209:   top: 0;
 210:   font-size: 42px;
 211:   font-weight: 800;
 212: }
 213: .section-heading {
 214:   display: flex;
 215:   align-items: center;
 216:   justify-content: space-between;
 217:   gap: 20px;
 218:   margin-bottom: 22px;
 219: }
 220: h2 {
 221:   font-size: 22px;
 222:   line-height: 1.4;
 223:   letter-spacing: -0.8px;
 224:   margin: 0 0 20px;
 225:   font-weight: 800;
 226: }
 227: .section-heading h2 {
 228:   margin: 0;
 229: }
 230: .field-grid,
 231: .catalog-grid {
 232:   display: grid;
 233:   grid-template-columns: 1fr 1fr;
 234:   gap: 25px;
 235: }
 236: .field-card,
 237: .catalog-card,
 238: .preview-panel {
 239:   position: relative;
 240:   border: var(--outline);
 241:   border-radius: var(--radius);
 242:   box-shadow: var(--shadow);
 243:   background: var(--yellow);
 244:   padding: 26px 30px 0;
 245: }
 246: .chemistry-card,
 247: .preview-panel {
 248:   background: var(--coral);
 249: }
 250: .card-top {
 251:   display: flex;
 252:   justify-content: space-between;
 253:   align-items: center;
 254:   gap: 8px;
 255: }
 256: .card-top .eyebrow {
 257:   margin: 0;
 258: }
 259: .badge {
 260:   border: var(--outline);
 261:   border-radius: 999px;
 262:   padding: 5px 10px;
 263:   background: var(--panel);
 264:   font-size: 10px;
 265:   white-space: nowrap;
 266:   letter-spacing: 0;
 267: }
 268: .field-card h3 {
 269:   font-size: 40px;
 270:   line-height: 1.2;
 271:   letter-spacing: -1.5px;
 272:   font-weight: 900;
 273:   margin: 35px 0 14px;
 274: }
 275: .field-card p {
 276:   font-size: 13px;
 277:   margin: 0 0 28px;
 278: }
 279: .field-symbol {
 280:   position: absolute;
 281:   right: 35px;
 282:   top: 63px;
 283:   font-size: 95px;
 284:   line-height: 1;
 285:   font-weight: 900;
 286: }
 287: .chemistry-symbol {
 288:   font-size: 85px;
 289: }
 290: .card-bottom {
 291:   border-top: var(--outline);
 292:   padding: 17px 0;
 293:   display: flex;
 294:   justify-content: space-between;
 295:   font-size: 12px;
 296:   font-weight: 700;
 297: }
 298: .card-bottom span {
 299:   font-size: 23px;
 300:   line-height: 1;
 301: }
 302: .home-note {
 303:   text-align: center;
 304:   font: 11px var(--mono);
 305:   margin: 38px 0;
 306: }
 307: .home-note span {
 308:   margin-right: 8px;
 309: }
 310: .site-footer {
 311:   border-top: var(--outline);
 312:   padding: 23px 0;
 313:   display: flex;
 314:   justify-content: space-between;
 315:   font: 10px var(--mono);
 316:   color: var(--muted);
 317:   gap: 20px;
 318: }
 319: .page-section {
 320:   padding: 32px 0 64px;
 321:   min-height: calc(100vh - 180px);
 322: }
 323: .back-link {
 324:   display: inline-block;
 325:   font: 11px var(--mono);
 326:   margin-bottom: 32px;
 327:   padding: 10px 15px;
 328:   border: var(--outline);
 329:   border-radius: 999px;
 330:   background: var(--panel);
 331: }
 332: .page-section .eyebrow .badge {
 333:   margin-left: 12px;
 334: }
 335: .catalog-grid {
 336:   margin-top: 36px;
 337: }
 338: .catalog-card,
 339: .preview-panel {
 340:   padding: 28px;
 341: }
 342: .catalog-card h2,
 343: .preview-panel h2 {
 344:   font-size: 28px;
 345:   margin: 22px 0 12px;
 346: }
 347: .catalog-card p,
 348: .preview-panel p {
 349:   font-size: 14px;
 350: }
 351: .text-link {
 352:   display: inline-block;
 353:   font-size: 12px;
 354:   font-weight: 800;
 355:   margin-top: 12px;
 356:   padding: 10px 0;
 357:   text-decoration: underline;
 358:   text-underline-offset: 5px;
 359: }
 360: .fall-illustration {
 361:   height: 110px;
 362:   margin-top: 20px;
 363:   position: relative;
 364:   border-bottom: 3px solid var(--ink);
 365:   background: repeating-linear-gradient(
 366:     transparent,
 367:     transparent 24px,
 368:     #1e1e1b22 25px
 369:   );
 370: }
 371: .fall-illustration span {
 372:   position: absolute;
 373:   bottom: 12px;
 374:   left: 34%;
 375:   width: 30px;
 376:   height: 30px;
 377:   background: var(--coral);
 378:   border: var(--outline);
 379:   box-shadow: 3px 3px 0 var(--ink);
 380:   border-radius: 50%;
 381: }
 382: .fall-illustration span + span {
 383:   left: 58%;
 384:   width: 48px;
 385:   height: 48px;
 386:   background: var(--blue);
 387: }
 388: .preview-panel {
 389:   margin-top: 36px;
 390:   max-width: 800px;
 391: }
 392: .gravity-page > h1 {
 393:   font-size: clamp(36px, 4vw, 56px);
 394: }
 395: .gravity-page > .eyebrow {
 396:   margin-bottom: 12px;
 397: }
 398: .experiment-layout {
 399:   display: grid;
 400:   grid-template-columns: minmax(0, 1.9fr) minmax(285px, 1fr);
 401:   gap: 24px;
 402:   margin: 30px 0;
 403:   align-items: start;
 404: }
 405: .experiment-workbench,
 406: .experiment-controls,
 407: .experiment-measurements,
 408: .height-graph,
 409: .experiment-explanation {
 410:   border: var(--outline);
 411:   border-radius: var(--radius);
 412:   background: var(--panel);
 413:   box-shadow: var(--shadow);
 414:   overflow: hidden;
 415: }
 416: .experiment-workbench > p {
 417:   margin: 0;
 418:   border-top: var(--outline);
 419:   padding: 17px 22px;
 420:   font-size: 12px;
 421: }
 422: .workbench-heading {
 423:   display: flex;
 424:   justify-content: space-between;
 425:   gap: 12px;
 426:   padding: 14px 20px;
 427:   border-bottom: var(--outline);
 428:   font: 11px var(--mono);
 429:   background: var(--yellow);
 430: }
 431: .gravity-canvas {
 432:   min-width: 0;
 433: }
 434: .experiment-controls {
 435:   padding: 24px;
 436: }
 437: .experiment-controls h2 {
 438:   font-size: 20px;
 439: }
 440: .experiment-control {
 441:   margin: 17px 0;
 442: }
 443: .experiment-control label {
 444:   display: block;
 445:   font-size: 12px;
 446: }
 447: .experiment-control strong {
 448:   font: 700 16px var(--mono);
 449: }
 450: input[type="range"] {
 451:   width: 100%;
 452:   height: 36px;
 453:   accent-color: var(--blue-ink);
 454:   cursor: pointer;
 455: }
 456: .experiment-controls p {
 457:   font-size: 12px;
 458: }
 459: .experiment-actions {
 460:   display: flex;
 461:   flex-wrap: wrap;
 462:   gap: 8px;
 463: }
 464: button {
 465:   min-height: 44px;
 466:   border: var(--outline);
 467:   border-radius: 999px;
 468:   background: var(--paper);
 469:   padding: 9px 13px;
 470:   font-size: 12px;
 471:   font-weight: 700;
 472:   cursor: pointer;
 473: }
 474: button:first-child {
 475:   background: var(--yellow);
 476: }
 477: button:disabled {
 478:   color: #65655e;
 479:   background: #e9e6dd;
 480:   cursor: default;
 481: }
 482: .experiment-controls [role="status"] {
 483:   background: var(--paper);
 484:   padding: 12px;
 485:   border-radius: 10px;
 486:   margin-bottom: 0;
 487: }
 488: .experiment-measurements,
 489: .height-graph,
 490: .experiment-explanation {
 491:   padding: 26px;
 492:   margin-top: 28px;
 493: }
 494: .measurement-tiles {
 495:   display: grid;
 496:   grid-template-columns: 1fr 1fr;
 497:   gap: 18px;
 498:   margin: 20px 0;
 499: }
 500: .measurement-tile {
 501:   border: var(--outline);
 502:   border-radius: 14px;
 503:   padding: 15px 20px;
 504:   background: var(--paper);
 505: }
 506: .measurement-tile:last-child {
 507:   background: var(--yellow);
 508: }
 509: .measurement-tile > span {
 510:   display: block;
 511:   font: 11px var(--mono);
 512: }
 513: .measurement-tile strong {
 514:   font-size: 42px;
 515:   font-weight: 900;
 516:   letter-spacing: -2px;
 517: }
 518: .measurement-tile small {
 519:   font: 14px var(--mono);
 520: }
 521: table {
 522:   border-collapse: collapse;
 523:   width: 100%;
 524:   font-size: 13px;
 525: }
 526: caption {
 527:   text-align: left;
 528:   color: var(--muted);
 529:   font-size: 11px;
 530:   padding: 0 0 14px;
 531: }
 532: th,
 533: td {
 534:   text-align: left;
 535:   padding: 13px 10px;
 536:   border-bottom: 1px solid #c4c1b6;
 537: }
 538: thead th {
 539:   font: 11px var(--mono);
 540: }
 541: tbody th {
 542:   width: 60px;
 543:   font-size: 20px;
 544: }
 545: tbody tr:first-child {
 546:   background: #ffe0d6;
 547: }
 548: tbody tr:last-child {
 549:   background: #e2e9ff;
 550: }
 551: .height-graph svg {
 552:   display: block;
 553:   margin: auto;
 554: }
 555: .height-graph p,
 556: .experiment-explanation p {
 557:   font-size: 14px;
 558: }
 559: .experiment-explanation {
 560:   background: var(--yellow);
 561: }
 562: .experiment-explanation a {
 563:   text-decoration: underline;
 564:   text-underline-offset: 3px;
 565: }
 566: summary {
 567:   cursor: pointer;
 568:   padding: 12px 0;
 569:   font-weight: 700;
 570: }
 571: @media (prefers-reduced-motion: no-preference) {
 572:   .field-card,
 573:   .catalog-card,
 574:   button {
 575:     transition:
 576:       transform var(--motion-short),
 577:       box-shadow var(--motion-short);
 578:   }
 579:   .field-card:hover,
 580:   .catalog-card:hover {
 581:     transform: translate(-2px, -2px);
 582:     box-shadow: 7px 7px 0 var(--ink);
 583:   }
 584:   button:active:not(:disabled) {
 585:     transform: translateY(2px);
 586:   }
 587: }
 588: @media (max-width: 900px) {
 589:   .experiment-layout {
 590:     grid-template-columns: 1fr;
 591:   }
 592:   .experiment-controls {
 593:     padding: 22px;
 594:   }
 595: }
 596: @media (max-width: 700px) {
 597:   :root {
 598:     --shadow: 3px 3px 0 var(--ink);
 599:     --radius: 16px;
 600:   }
 601:   .site-shell {
 602:     padding: 0 5%;
 603:   }
 604:   .site-header {
 605:     flex-wrap: wrap;
 606:     padding: 20px 0;
 607:     gap: 20px;
 608:   }
 609:   .brand {
 610:     font-size: 16px;
 611:   }
 612:   .site-header nav {
 613:     width: 100%;
 614:     justify-content: space-between;
 615:   }
 616:   .site-header nav a {
 617:     padding: 8px 12px;
 618:   }
 619:   .home-hero {
 620:     grid-template-columns: 1fr;
 621:     gap: 30px;
 622:     padding: 36px 0;
 623:   }
 624:   h1 {
 625:     font-size: 43px;
 626:     letter-spacing: -2px;
 627:   }
 628:   .hero-art {
 629:     height: 230px;
 630:   }
 631:   .art-ball {
 632:     width: 90px;
 633:     height: 90px;
 634:   }
 635:   .field-grid,
 636:   .catalog-grid {
 637:     grid-template-columns: 1fr;
 638:   }
 639:   .section-heading > span {
 640:     display: none;
 641:   }
 642:   .section-heading h2 {
 643:     font-size: 18px;
 644:   }
 645:   .field-card {
 646:     padding: 24px 24px 0;
 647:   }
 648:   .site-footer {
 649:     flex-direction: column;
 650:     gap: 8px;
 651:     line-height: 1.6;
 652:   }
 653:   .back-link {
 654:     margin-bottom: 26px;
 655:   }
 656:   .intro br {
 657:     display: none;
 658:   }
 659:   .experiment-measurements,
 660:   .height-graph,
 661:   .experiment-explanation {
 662:     padding: 20px 14px;
 663:   }
 664:   .measurement-tiles {
 665:     gap: 10px;
 666:   }
 667:   .measurement-tile {
 668:     padding: 12px;
 669:   }
 670:   .measurement-tile strong {
 671:     font-size: 34px;
 672:   }
 673:   .measurement-tile > span {
 674:     font-size: 10px;
 675:     line-height: 1.6;
 676:   }
 677:   th,
 678:   td {
 679:     padding: 12px 5px;
 680:     font-size: 11px;
 681:   }
 682:   thead th {
 683:     font-size: 10px;
 684:   }
 685:   .workbench-heading {
 686:     padding: 12px;
 687:     font-size: 9px;
 688:   }
 689: }

## src/App.tsx

   1: import { BrowserRouter, Link, Route, Routes } from "react-router";
   2: import { SiteShell } from "./components/SiteShell";
   3: import { CatalogPage } from "./catalog/CatalogPage";
   4: import { GravityPage } from "./experiments/gravity/GravityPage";
   5: 
   6: function HomePage() {
   7:   return (
   8:     <>
   9:       <section className="home-hero">
  10:         <div>
  11:           <p className="eyebrow">
  12:             <span className="status-dot" /> MỞ CỬA CHO SỰ TÒ MÒ
  13:           </p>
  14:           <h1>
  15:             Thử một chút.
  16:             <br />
  17:             Hiểu <em>nhiều hơn.</em>
  18:           </h1>
  19:           <p className="intro">
  20:             Một phòng thí nghiệm nhỏ cho những câu hỏi lớn.
  21:             <br />
  22:             Khám phá khoa học bằng chính những lần thử của bạn.
  23:           </p>
  24:         </div>
  25:         <div className="hero-art" aria-hidden="true">
  26:           <span className="orbit orbit-one" />
  27:           <span className="orbit orbit-two" />
  28:           <span className="art-ball" />
  29:           <span className="art-label">QUAN SÁT → ĐẶT CÂU HỎI → KHÁM PHÁ</span>
  30:           <span className="art-cross">+</span>
  31:         </div>
  32:       </section>
  33:       <section className="fields-section" aria-labelledby="fields-title">
  34:         <div className="section-heading">
  35:           <h2 id="fields-title">Hôm nay, bạn tò mò về điều gì?</h2>
  36:           <span>CHỌN MỘT LĨNH VỰC ↓</span>
  37:         </div>
  38:         <div className="field-grid">
  39:           <Link className="field-card physics-card" to="/physics">
  40:             <div className="card-top">
  41:               <span className="eyebrow">01 / VẬT LÝ</span>
  42:               <span className="badge">1 thí nghiệm</span>
  43:             </div>
  44:             <span className="field-symbol" aria-hidden="true">
  45:               ↘
  46:             </span>
  47:             <h3>Vật lý</h3>
  48:             <p>
  49:               Từ một vật rơi đến những quy luật
  50:               <br />
  51:               chuyển động của thế giới.
  52:             </p>
  53:             <span className="card-bottom">
  54:               Bắt đầu khám phá <span aria-hidden="true">↗</span>
  55:             </span>
  56:           </Link>
  57:           <Link className="field-card chemistry-card" to="/chemistry">
  58:             <div className="card-top">
  59:               <span className="eyebrow">02 / HÓA HỌC</span>
  60:               <span className="badge">Sắp có</span>
  61:             </div>
  62:             <span className="field-symbol chemistry-symbol" aria-hidden="true">
  63:               ⚗
  64:             </span>
  65:             <h3>Hóa học</h3>
  66:             <p>
  67:               Gặp gỡ vật chất và những
  68:               <br />
  69:               biến đổi đầy bất ngờ.
  70:             </p>
  71:             <span className="card-bottom">
  72:               Xem trước chủ đề <span aria-hidden="true">↗</span>
  73:             </span>
  74:           </Link>
  75:         </div>
  76:       </section>
  77:       <p className="home-note">
  78:         <span aria-hidden="true">✳</span> Không cần áo blouse. Chỉ cần một chút
  79:         tò mò.
  80:       </p>
  81:     </>
  82:   );
  83: }
  84: 
  85: function NotFoundPage() {
  86:   return (
  87:     <section className="page-section">
  88:       <p className="eyebrow">404 / CHƯA TÌM THẤY</p>
  89:       <h1>Có lẽ bạn đã đi hơi xa.</h1>
  90:       <p className="intro">
  91:         Trang này không tồn tại. Một khám phá mới vẫn đang chờ ở phòng thí
  92:         nghiệm.
  93:       </p>
  94:       <Link className="text-link" to="/">
  95:         Về trang khám phá ↗
  96:       </Link>
  97:     </section>
  98:   );
  99: }
 100: 
 101: export default function App() {
 102:   return (
 103:     <BrowserRouter>
 104:       <SiteShell>
 105:         <Routes>
 106:           <Route path="/" element={<HomePage />} />
 107:           <Route path="/physics" element={<CatalogPage field="physics" />} />
 108:           <Route
 109:             path="/physics/gravity"
 110:             element={<CatalogPage field="physics" topic="Trọng lực" />}
 111:           />
 112:           <Route path="/physics/gravity/free-fall" element={<GravityPage />} />
 113:           <Route
 114:             path="/chemistry"
 115:             element={<CatalogPage field="chemistry" />}
 116:           />
 117:           <Route path="*" element={<NotFoundPage />} />
 118:         </Routes>
 119:       </SiteShell>
 120:     </BrowserRouter>
 121:   );
 122: }

## src/components/SiteShell.tsx

   1: import { useEffect, useRef } from "react";
   2: import { gsap } from "gsap";
   3: import type { ReactNode } from "react";
   4: import { Link, NavLink, useLocation } from "react-router";
   5: 
   6: export function SiteShell({ children }: { children: ReactNode }) {
   7:   const { pathname } = useLocation();
   8:   const main = useRef<HTMLElement>(null);
   9:   const previousPath = useRef(pathname);
  10: 
  11:   useEffect(() => {
  12:     if (previousPath.current !== pathname) {
  13:       main.current?.focus();
  14:       window.scrollTo(0, 0);
  15:       previousPath.current = pathname;
  16:     }
  17:   }, [pathname]);
  18: 
  19:   useEffect(() => {
  20:     const context = gsap.context(() => {
  21:       const media = gsap.matchMedia();
  22:       const previewReduced =
  23:         import.meta.env.DEV &&
  24:         new URLSearchParams(window.location.search).get("reduce") === "1";
  25:       media.add(
  26:         {
  27:           normal: previewReduced
  28:             ? "not all"
  29:             : "(prefers-reduced-motion: no-preference)",
  30:           reduced: previewReduced ? "all" : "(prefers-reduced-motion: reduce)",
  31:         },
  32:         (match) => {
  33:           const reduced = match.conditions?.reduced;
  34:           const targets =
  35:             pathname === "/"
  36:               ? ".home-hero > div, .section-heading, .field-card"
  37:               : ".back-link, .page-section > .eyebrow, .page-section > h1, .page-section > .intro";
  38:           gsap.timeline().from(targets, {
  39:             y: reduced ? 0 : 12,
  40:             opacity: reduced ? 0.7 : 0,
  41:             duration: reduced ? 0.15 : 0.42,
  42:             stagger: reduced ? 0 : 0.06,
  43:             ease: "power2.out",
  44:             clearProps: "transform,opacity",
  45:           });
  46:         },
  47:       );
  48:       return () => media.revert();
  49:     }, main);
  50:     return () => context.revert();
  51:   }, [pathname]);
  52: 
  53:   return (
  54:     <div className="site-shell">
  55:       <a className="skip-link" href="#main-content">
  56:         Đến nội dung chính
  57:       </a>
  58:       <header className="site-header">
  59:         <Link
  60:           to="/"
  61:           className="brand"
  62:           aria-label="Phòng thí nghiệm — Trang chủ"
  63:         >
  64:           <span className="brand-symbol" aria-hidden="true">
  65:             ✳
  66:           </span>
  67:           <span>
  68:             phòng thí nghiệm<span className="brand-caption">KHOA HỌC / 2D</span>
  69:           </span>
  70:         </Link>
  71:         <nav aria-label="Điều hướng chính">
  72:           <NavLink to="/" end>
  73:             Khám phá
  74:           </NavLink>
  75:           <NavLink to="/physics">Vật lý</NavLink>
  76:           <NavLink to="/chemistry">
  77:             Hóa học <span className="nav-dot" aria-hidden="true" />
  78:           </NavLink>
  79:         </nav>
  80:       </header>
  81:       <main id="main-content" ref={main} tabIndex={-1}>
  82:         {children}
  83:       </main>
  84:       <footer className="site-footer">
  85:         <span>Một câu hỏi nhỏ. Một khám phá mới.</span>
  86:         <span>Khoa học dành cho mọi người ↗</span>
  87:       </footer>
  88:     </div>
  89:   );
  90: }

## src/catalog/CatalogPage.tsx

   1: import { Link } from "react-router";
   2: import { experiments } from "./experiments";
   3: import type { ExperimentCard } from "./experiments";
   4: 
   5: export function CatalogPage({
   6:   field,
   7:   topic,
   8: }: {
   9:   field: ExperimentCard["field"];
  10:   topic?: string;
  11: }) {
  12:   if (field === "chemistry") {
  13:     const preview = experiments.find(
  14:       (experiment) => experiment.field === "chemistry",
  15:     );
  16:     return (
  17:       <section className="page-section">
  18:         <Link className="back-link" to="/">
  19:           ← Tất cả lĩnh vực
  20:         </Link>
  21:         <p className="eyebrow">
  22:           02 / HÓA HỌC <span className="badge">Sắp có</span>
  23:         </p>
  24:         <h1>
  25:           Những thay đổi nhỏ.
  26:           <br />
  27:           Thế giới khác biệt.
  28:         </h1>
  29:         <p className="intro">
  30:           {preview?.question} Chúng mình đang chuẩn bị những thí nghiệm để bạn
  31:           khám phá câu trả lời.
  32:         </p>
  33:         <div className="preview-panel">
  34:           <h2>Một góc nhìn trước</h2>
  35:           <p>
  36:             Các chủ đề dự kiến: trạng thái của vật chất, dung dịch và sự biến
  37:             đổi màu sắc.
  38:           </p>
  39:           <p>
  40:             Thí nghiệm Hóa học chưa mở trong phiên bản này. Trong lúc chờ đợi,
  41:             hãy bắt đầu với trọng lực.
  42:           </p>
  43:           <Link className="text-link" to="/physics/gravity">
  44:             Khám phá Vật lý <span aria-hidden="true">↗</span>
  45:           </Link>
  46:         </div>
  47:       </section>
  48:     );
  49:   }
  50: 
  51:   const available = experiments.filter(
  52:     (experiment) =>
  53:       experiment.field === field &&
  54:       experiment.status === "available" &&
  55:       (!topic || experiment.topic === topic),
  56:   );
  57:   return (
  58:     <section className="page-section">
  59:       <Link className="back-link" to={topic ? "/physics" : "/"}>
  60:         ← {topic ? "Vật lý" : "Tất cả lĩnh vực"}
  61:       </Link>
  62:       <p className="eyebrow">01 / VẬT LÝ{topic ? " / TRỌNG LỰC" : ""}</p>
  63:       <h1>
  64:         {topic
  65:           ? "Điều gì kéo mọi thứ xuống?"
  66:           : "Hiểu những quy luật\nqua từng lần thử."}
  67:       </h1>
  68:       <p className="intro">
  69:         {topic
  70:           ? "Cùng quan sát chuyển động quen thuộc và tìm lời giải cho một câu hỏi tưởng chừng đơn giản."
  71:           : "Bắt đầu từ một hiện tượng quen thuộc. Đặt câu hỏi và tự mình khám phá."}
  72:       </p>
  73:       <div className="catalog-grid">
  74:         {topic ? (
  75:           available.map((experiment) => (
  76:             <Link
  77:               className="catalog-card"
  78:               key={experiment.id}
  79:               to={experiment.href}
  80:             >
  81:               <span className="eyebrow">THÍ NGHIỆM / 01</span>
  82:               <div className="fall-illustration" aria-hidden="true">
  83:                 <span />
  84:                 <span />
  85:               </div>
  86:               <h2>{experiment.title}</h2>
  87:               <p>{experiment.question}</p>
  88:               <span className="text-link">Mở thí nghiệm ↗</span>
  89:             </Link>
  90:           ))
  91:         ) : (
  92:           <Link className="catalog-card" to="/physics/gravity">
  93:             <span className="eyebrow">CHỦ ĐỀ / 01</span>
  94:             <div className="fall-illustration" aria-hidden="true">
  95:               <span />
  96:               <span />
  97:             </div>
  98:             <h2>Trọng lực</h2>
  99:             <p>
 100:               Vì sao mọi vật rơi xuống? Khám phá chuyển động dưới tác dụng của
 101:               trọng lực.
 102:             </p>
 103:             <span className="text-link">{available.length} thí nghiệm ↗</span>
 104:           </Link>
 105:         )}
 106:       </div>
 107:     </section>
 108:   );
 109: }

## src/experiments/gravity/GravityPage.tsx

   1: import { useEffect, useRef, useState } from "react";
   2: import { Link } from "react-router";
   3: import { gsap } from "gsap";
   4: import { createLabClock, type LabClock } from "./clock";
   5: import { createGravityScene, type GravityScene } from "./scene";
   6: import { fallTimeS, sampleGravity } from "./model";
   7: import { HeightGraph } from "./HeightGraph";
   8: 
   9: type Inputs = { heightM: number; leftMassKg: number; rightMassKg: number };
  10: const defaults: Inputs = { heightM: 12, leftMassKg: 1, rightMassKg: 5 };
  11: const samples = (inputs: Inputs, timeS: number) => ({
  12:   left: sampleGravity(
  13:     { heightM: inputs.heightM, massKg: inputs.leftMassKg, gravityMps2: 9.8 },
  14:     timeS,
  15:   ),
  16:   right: sampleGravity(
  17:     { heightM: inputs.heightM, massKg: inputs.rightMassKg, gravityMps2: 9.8 },
  18:     timeS,
  19:   ),
  20: });
  21: 
  22: export function GravityPage() {
  23:   const [inputs, setInputs] = useState(defaults);
  24:   const inputsRef = useRef(inputs);
  25:   const [display, setDisplay] = useState(() => samples(defaults, 0));
  26:   const [running, setRunning] = useState(false);
  27:   const [sceneError, setSceneError] = useState(false);
  28:   const resultRef = useRef<HTMLDivElement>(null);
  29:   const hostRef = useRef<HTMLDivElement>(null);
  30:   const sceneRef = useRef<GravityScene | null>(null);
  31:   const clockRef = useRef<LabClock | null>(null);
  32:   const lastPublishedRef = useRef(0);
  33: 
  34:   function snapshotAt(timeS: number) {
  35:     const next = samples(inputsRef.current, timeS);
  36:     sceneRef.current?.update(next.left, next.right);
  37:     if (
  38:       timeS === 0 ||
  39:       next.left.landed ||
  40:       timeS - lastPublishedRef.current >= 0.1
  41:     ) {
  42:       setDisplay(next);
  43:       lastPublishedRef.current = timeS;
  44:     }
  45:     if (next.left.landed) {
  46:       clockRef.current?.pause();
  47:       setRunning(false);
  48:     }
  49:   }
  50: 
  51:   function changeInput(key: keyof Inputs, value: number) {
  52:     const next = { ...inputsRef.current, [key]: value };
  53:     inputsRef.current = next;
  54:     setInputs(next);
  55:     setRunning(false);
  56:     sceneRef.current?.setHeight(next.heightM);
  57:     clockRef.current?.reset();
  58:   }
  59: 
  60:   useEffect(() => {
  61:     let cancelled = false;
  62:     let ownedScene: GravityScene | null = null;
  63:     const clock = createLabClock(snapshotAt);
  64:     clockRef.current = clock;
  65:     clock.reset();
  66:     void createGravityScene(hostRef.current!, {
  67:       onHeightChange: (heightM) => {
  68:         if (!cancelled) changeInput("heightM", heightM);
  69:       },
  70:     })
  71:       .then((scene) => {
  72:         if (cancelled) {
  73:           scene.destroy();
  74:           return;
  75:         }
  76:         ownedScene = scene;
  77:         sceneRef.current = scene;
  78:         scene.setHeight(inputsRef.current.heightM);
  79:         snapshotAt(clock.getTime());
  80:       })
  81:       .catch(() => {
  82:         if (!cancelled) setSceneError(true);
  83:       });
  84:     return () => {
  85:       cancelled = true;
  86:       clock.dispose();
  87:       ownedScene?.destroy();
  88:       if (sceneRef.current === ownedScene) sceneRef.current = null;
  89:       if (clockRef.current === clock) clockRef.current = null;
  90:     };
  91:   }, []);
  92: 
  93:   useEffect(() => {
  94:     if (!display.left.landed) return;
  95:     const context = gsap.context(() => {
  96:       const media = gsap.matchMedia();
  97:       const previewReduced =
  98:         import.meta.env.DEV &&
  99:         new URLSearchParams(window.location.search).get("reduce") === "1";
 100:       media.add(
 101:         {
 102:           normal: previewReduced
 103:             ? "not all"
 104:             : "(prefers-reduced-motion: no-preference)",
 105:           reduced: previewReduced ? "all" : "(prefers-reduced-motion: reduce)",
 106:         },
 107:         (match) => {
 108:           gsap
 109:             .timeline()
 110:             .fromTo(
 111:               resultRef.current,
 112:               { backgroundColor: "#fffdf6" },
 113:               {
 114:                 backgroundColor: "#ffd83d",
 115:                 duration: match.conditions?.reduced ? 0.15 : 0.5,
 116:                 ease: "power2.out",
 117:                 clearProps: "backgroundColor",
 118:               },
 119:             );
 120:         },
 121:       );
 122:       return () => media.revert();
 123:     }, resultRef);
 124:     return () => context.revert();
 125:   }, [display.left.landed]);
 126: 
 127:   const graphInput = {
 128:     heightM: inputs.heightM,
 129:     massKg: inputs.leftMassKg,
 130:     gravityMps2: 9.8,
 131:   };
 132:   return (
 133:     <section className="page-section gravity-page">
 134:       <Link className="back-link" to="/physics/gravity">
 135:         ← Trọng lực
 136:       </Link>
 137:       <p className="eyebrow">THÍ NGHIỆM / 01</p>
 138:       <h1>Hai vật rơi tự do</h1>
 139:       <p className="intro">
 140:         Vật nặng có rơi nhanh hơn không? Thay đổi khối lượng, rồi cùng quan sát.
 141:       </p>
 142:       <div className="experiment-layout">
 143:         <section className="experiment-workbench" aria-label="Bàn thí nghiệm">
 144:           <div className="workbench-heading">
 145:             <span>01 / BÀN THÍ NGHIỆM</span>
 146:             <span>BỎ QUA LỰC CẢN</span>
 147:           </div>
 148:           <div ref={hostRef} className="gravity-canvas" />
 149:           {sceneError && (
 150:             <p role="status">
 151:               Không thể mở hình mô phỏng. Bạn vẫn có thể chạy thí nghiệm bằng
 152:               các nút và đọc số liệu bên dưới.
 153:             </p>
 154:           )}
 155:           <p>
 156:             Kéo vật để đổi độ cao, hoặc dùng thanh trượt bên dưới. Cả hai vật
 157:             được thả cùng lúc từ trạng thái đứng yên.
 158:           </p>
 159:         </section>
 160:         <section
 161:           className="experiment-controls"
 162:           aria-labelledby="controls-title"
 163:         >
 164:           <h2 id="controls-title">Thiết lập lần thả</h2>
 165:           {(
 166:             [
 167:               ["heightM", "release-height", "Độ cao thả", 2, 20, "m"],
 168:               ["leftMassKg", "left-mass", "Khối lượng vật A", 0.1, 10, "kg"],
 169:               ["rightMassKg", "right-mass", "Khối lượng vật B", 0.1, 10, "kg"],
 170:             ] as const
 171:           ).map(([key, id, label, min, max, unit]) => (
 172:             <div className="experiment-control" key={key}>
 173:               <label htmlFor={id}>
 174:                 {label}:{" "}
 175:                 <strong>
 176:                   {inputs[key].toFixed(1)} {unit}
 177:                 </strong>
 178:               </label>
 179:               <input
 180:                 id={id}
 181:                 type="range"
 182:                 min={min}
 183:                 max={max}
 184:                 step="0.1"
 185:                 value={inputs[key]}
 186:                 onChange={(event) =>
 187:                   changeInput(key, Number(event.target.value))
 188:                 }
 189:               />
 190:             </div>
 191:           ))}
 192:           <p>
 193:             Gia tốc trọng trường: <strong>g = 9.8 m/s²</strong>
 194:           </p>
 195:           <div className="experiment-actions">
 196:             <button
 197:               type="button"
 198:               disabled={running}
 199:               onClick={() => {
 200:                 if (display.left.landed) clockRef.current?.reset();
 201:                 clockRef.current?.play();
 202:                 setRunning(true);
 203:               }}
 204:             >
 205:               Bắt đầu
 206:             </button>
 207:             <button
 208:               type="button"
 209:               disabled={!running}
 210:               onClick={() => {
 211:                 clockRef.current?.pause();
 212:                 setRunning(false);
 213:               }}
 214:             >
 215:               Tạm dừng
 216:             </button>
 217:             <button
 218:               type="button"
 219:               onClick={() => {
 220:                 clockRef.current?.reset();
 221:                 setRunning(false);
 222:               }}
 223:             >
 224:               Đặt lại
 225:             </button>
 226:           </div>
 227:           <p role="status">
 228:             {display.left.landed
 229:               ? "Cả hai vật đã chạm đất cùng lúc."
 230:               : running
 231:                 ? "Đang rơi…"
 232:                 : display.left.timeS > 0
 233:                   ? "Đã tạm dừng."
 234:                   : "Sẵn sàng thả."}
 235:           </p>
 236:         </section>
 237:       </div>
 238:       <section
 239:         className="experiment-measurements"
 240:         aria-labelledby="measurements-title"
 241:       >
 242:         <h2 id="measurements-title">Quan sát bằng con số</h2>
 243:         <div className="measurement-tiles">
 244:           <div className="measurement-tile">
 245:             <span>THỜI GIAN ĐÃ TRÔI</span>
 246:             <strong>
 247:               <span data-testid="elapsed-seconds">
 248:                 {display.left.timeS.toFixed(2)}
 249:               </span>{" "}
 250:               <small>s</small>
 251:             </strong>
 252:           </div>
 253:           <div className="measurement-tile" ref={resultRef}>
 254:             <span>CHẠM ĐẤT · CẢ A &amp; B</span>
 255:             <strong>
 256:               {fallTimeS(graphInput).toFixed(2)} <small>s</small>
 257:             </strong>
 258:           </div>
 259:         </div>
 260:         <table>
 261:           <caption>
 262:             Vận tốc hướng xuống; số liệu dừng tại lần chạm đất đầu tiên.
 263:           </caption>
 264:           <thead>
 265:             <tr>
 266:               <th scope="col">Vật</th>
 267:               <th scope="col">Độ cao</th>
 268:               <th scope="col">Quãng đường rơi</th>
 269:               <th scope="col">Vận tốc</th>
 270:             </tr>
 271:           </thead>
 272:           <tbody>
 273:             {(
 274:               [
 275:                 ["A", display.left],
 276:                 ["B", display.right],
 277:               ] as const
 278:             ).map(([name, snapshot]) => (
 279:               <tr key={name}>
 280:                 <th scope="row">{name}</th>
 281:                 <td>{snapshot.heightM.toFixed(2)} m</td>
 282:                 <td>{snapshot.distanceM.toFixed(2)} m</td>
 283:                 <td>{snapshot.velocityMps.toFixed(2)} m/s</td>
 284:               </tr>
 285:             ))}
 286:           </tbody>
 287:         </table>
 288:       </section>
 289:       <HeightGraph input={graphInput} currentTimeS={display.left.timeS} />
 290:       <section className="experiment-explanation">
 291:         <h2>Khác khối lượng, cùng thời gian rơi</h2>
 292:         <p>
 293:           Trong mô hình này, hai vật cùng chịu một gia tốc trọng trường. Khi thả
 294:           từ cùng độ cao và bỏ qua lực cản không khí, chúng luôn ở cùng độ cao
 295:           và chạm đất cùng lúc. Ngoài đời, hình dạng và lực cản không khí có thể
 296:           làm kết quả khác đi.
 297:         </p>
 298:         <p>
 299:           Giả định: trọng trường đều, g = 9.8 m/s², vận tốc ban đầu bằng 0,
 300:           không có lực cản không khí.{" "}
 301:           <a href="https://openstax.org/books/college-physics-2e/pages/2-7-falling-objects">
 302:             Tìm hiểu về vật rơi tự do — OpenStax
 303:           </a>
 304:           .
 305:         </p>
 306:         <details>
 307:           <summary>Xem công thức</summary>
 308:           <p>
 309:             Quãng đường rơi: d = ½gt². Độ cao: h = h₀ − ½gt². Vận tốc hướng
 310:             xuống: v = gt. Thời gian chạm đất: t = √(2h₀/g).
 311:           </p>
 312:           <p>
 313:             h₀ và d tính bằng m; t bằng s; v bằng m/s. Khối lượng không xuất
 314:             hiện trong các công thức này.
 315:           </p>
 316:         </details>
 317:       </section>
 318:     </section>
 319:   );
 320: }

## src/experiments/gravity/HeightGraph.tsx

   1: import { useId } from "react";
   2: import { fallTimeS, sampleGravity, type GravityInput } from "./model";
   3: 
   4: export function HeightGraph({
   5:   input,
   6:   currentTimeS,
   7: }: {
   8:   input: GravityInput;
   9:   currentTimeS: number;
  10: }) {
  11:   const descriptionId = useId();
  12:   const duration = fallTimeS(input);
  13:   const current = sampleGravity(input, currentTimeS);
  14:   const points = Array.from({ length: 41 }, (_, i) => {
  15:     const snapshot = sampleGravity(input, (i / 40) * duration);
  16:     return `${(i / 40) * 320},${160 - (snapshot.heightM / input.heightM) * 160}`;
  17:   }).join(" ");
  18:   return (
  19:     <section
  20:       className="height-graph"
  21:       aria-labelledby={`${descriptionId}-title`}
  22:     >
  23:       <h2 id={`${descriptionId}-title`}>Độ cao theo thời gian</h2>
  24:       <svg
  25:         viewBox="0 0 390 220"
  26:         role="img"
  27:         aria-label="Đồ thị độ cao của hai vật"
  28:         aria-describedby={descriptionId}
  29:         style={{ width: "100%", maxWidth: 620 }}
  30:       >
  31:         <g transform="translate(45 20)">
  32:           <path
  33:             d="M0 0V160H320"
  34:             fill="none"
  35:             stroke="currentColor"
  36:             strokeWidth="2"
  37:           />
  38:           {[0.25, 0.5, 0.75].map((fraction) => (
  39:             <g key={fraction}>
  40:               <line
  41:                 x1={fraction * 320}
  42:                 x2={fraction * 320}
  43:                 y1="0"
  44:                 y2="160"
  45:                 stroke="var(--ink)"
  46:                 strokeOpacity="0.15"
  47:               />
  48:               <circle
  49:                 cx={fraction * 320}
  50:                 cy={160 * fraction * fraction}
  51:                 r="4"
  52:                 fill="var(--paper)"
  53:                 stroke="var(--blue-ink)"
  54:                 strokeWidth="2"
  55:               />
  56:               <text
  57:                 x={fraction * 320}
  58:                 y="200"
  59:                 textAnchor="middle"
  60:                 fontSize="10"
  61:               >
  62:                 {(fraction * duration).toFixed(2)} s
  63:               </text>
  64:             </g>
  65:           ))}
  66:           <polyline
  67:             points={points}
  68:             fill="none"
  69:             stroke="var(--blue-ink)"
  70:             strokeWidth="5"
  71:           />
  72:           <line
  73:             x1={(current.timeS / duration) * 320}
  74:             x2={(current.timeS / duration) * 320}
  75:             y1="0"
  76:             y2="160"
  77:             stroke="var(--ink)"
  78:             strokeDasharray="4 4"
  79:           />
  80:           <circle
  81:             cx={(current.timeS / duration) * 320}
  82:             cy={160 - (current.heightM / input.heightM) * 160}
  83:             r="6"
  84:             fill="var(--coral)"
  85:             stroke="var(--ink)"
  86:             strokeWidth="2"
  87:           />
  88:           <text x="-8" y="4" textAnchor="end" fontSize="12">
  89:             {input.heightM} m
  90:           </text>
  91:           <text x="-8" y="164" textAnchor="end" fontSize="12">
  92:             0 m
  93:           </text>
  94:           <text x="0" y="182" fontSize="12">
  95:             0 s
  96:           </text>
  97:           <text x="320" y="182" textAnchor="end" fontSize="12">
  98:             {duration.toFixed(2)} s
  99:           </text>
 100:         </g>
 101:       </svg>
 102:       <p id={descriptionId}>
 103:         Hai vật dùng chung một đường cong: khối lượng không làm thay đổi độ cao
 104:         theo thời gian khi bỏ qua lực cản không khí. Ở{" "}
 105:         {current.timeS.toFixed(2)} s, cả hai cao {current.heightM.toFixed(2)} m.
 106:       </p>
 107:     </section>
 108:   );
 109: }

## src/experiments/gravity/scene.ts

   1: import { Application, Container, Graphics, Rectangle, Text } from "pixi.js";
   2: import type { FederatedPointerEvent } from "pixi.js";
   3: import type { GravitySnapshot } from "./model";
   4: 
   5: export interface GravityScene {
   6:   update(left: GravitySnapshot, right: GravitySnapshot): void;
   7:   /** Moves the release-height guide; object positions always come from update(). */
   8:   setHeight(heightM: number): void;
   9:   destroy(): void;
  10: }
  11: 
  12: const WIDTH = 900;
  13: const HEIGHT = 520;
  14: const GROUND_Y = 444;
  15: const SPAN = 350;
  16: const INK = 0x1e1e1b;
  17: const PAPER = 0xf4f2ec;
  18: const toY = (heightM: number) => GROUND_Y - (heightM / 20) * SPAN;
  19: const clampHeight = (heightM: number) => Math.min(20, Math.max(2, heightM));
  20: 
  21: /** A view of the gravity model. No ticker, elapsed-time calculation, or integration. */
  22: export async function createGravityScene(
  23:   host: HTMLElement,
  24:   options: { onHeightChange(heightM: number): void },
  25: ): Promise<GravityScene> {
  26:   const app = new Application();
  27:   await app.init({
  28:     width: WIDTH,
  29:     height: HEIGHT,
  30:     background: PAPER,
  31:     preference: "webgl",
  32:     autoStart: false,
  33:     sharedTicker: false,
  34:     antialias: true,
  35:     resolution: Math.min(window.devicePixelRatio || 1, 2),
  36:     autoDensity: true,
  37:   });
  38:   // Even rendering is explicit: the clock in clock.ts owns all simulation time.
  39:   app.stop();
  40:   const canvas = app.canvas;
  41:   canvas.style.display = "block";
  42:   canvas.style.width = "100%";
  43:   canvas.style.height = "auto";
  44:   canvas.style.touchAction = "none";
  45:   canvas.setAttribute("aria-hidden", "true");
  46:   host.appendChild(canvas);
  47:   const world = new Container();
  48:   app.stage.addChild(world);
  49:   const art = new Graphics();
  50:   world.addChild(art);
  51:   const label = (text: string, x: number, y: number, size = 13) => {
  52:     const item = new Text({
  53:       text,
  54:       style: {
  55:         fontFamily: "monospace",
  56:         fontSize: size,
  57:         fontWeight: "bold",
  58:         fill: INK,
  59:       },
  60:     });
  61:     item.position.set(x, y);
  62:     world.addChild(item);
  63:     return item;
  64:   };
  65:   // Offset silhouettes, solid ink outlines, and sparse paper-grid construction.
  66:   for (const x of [158, 502]) {
  67:     art.roundRect(x + 6, 53, 280, 411, 20).fill(INK);
  68:     art
  69:       .roundRect(x, 47, 280, 411, 20)
  70:       .fill(x === 158 ? 0xffe9df : 0xe5ecff)
  71:       .stroke({ color: INK, width: 3 });
  72:     for (let y = 110; y < GROUND_Y; y += 35) {
  73:       art
  74:         .moveTo(x + 15, y)
  75:         .lineTo(x + 265, y)
  76:         .stroke({ color: INK, alpha: 0.1, width: 1 });
  77:     }
  78:   }
  79:   label("VẬT A", 180, 61);
  80:   label("VẬT B", 524, 61);
  81:   label("ĐỘ CAO / m", 23, 28);
  82:   for (let metres = 0; metres <= 20; metres += 2) {
  83:     const y = toY(metres);
  84:     art
  85:       .moveTo(104, y)
  86:       .lineTo(metres % 10 === 0 ? 141 : 127, y)
  87:       .stroke({ color: INK, width: 2 });
  88:     label(String(metres).padStart(2, "0"), 65, y - 8);
  89:   }
  90:   art
  91:     .moveTo(104, toY(20))
  92:     .lineTo(104, GROUND_Y)
  93:     .stroke({ color: INK, width: 3 });
  94:   art
  95:     .roundRect(147, GROUND_Y, 649, 22, 5)
  96:     .fill(0xffd83d)
  97:     .stroke({ color: INK, width: 3 });
  98:   for (let x = 158; x < 780; x += 26) {
  99:     art
 100:       .moveTo(x, GROUND_Y + 20)
 101:       .lineTo(x + 14, GROUND_Y + 3)
 102:       .stroke({ color: INK, width: 2 });
 103:   }
 104:   label("MẶT ĐẤT / 0 m", 625, 482);
 105:   label("KÉO VẬT ĐỂ ĐỔI ĐỘ CAO", 160, 482, 12);
 106: 
 107:   const guide = new Graphics();
 108:   world.addChild(guide);
 109:   const guideLabel = label("", 797, 0, 12);
 110:   const makeBall = (x: number, color: number, letter: string) => {
 111:     const ball = new Container();
 112:     ball.position.set(x, toY(10));
 113:     ball.addChild(new Graphics().circle(5, 5, 23).fill(INK));
 114:     ball.addChild(
 115:       new Graphics()
 116:         .circle(0, 0, 23)
 117:         .fill(color)
 118:         .stroke({ color: INK, width: 3 }),
 119:     );
 120:     ball.addChild(
 121:       new Graphics().circle(-7, -8, 5).fill({ color: 0xffffff, alpha: 0.65 }),
 122:     );
 123:     const text = new Text({
 124:       text: letter,
 125:       style: {
 126:         fontFamily: "monospace",
 127:         fontSize: 19,
 128:         fontWeight: "bold",
 129:         fill: INK,
 130:       },
 131:     });
 132:     text.anchor.set(0.5);
 133:     ball.addChild(text);
 134:     ball.eventMode = "static";
 135:     ball.cursor = "grab";
 136:     ball.hitArea = new Rectangle(-34, -34, 68, 68);
 137:     world.addChild(ball);
 138:     return ball;
 139:   };
 140:   const leftBall = makeBall(298, 0xff927a, "A");
 141:   const rightBall = makeBall(642, 0x6f96ff, "B");
 142:   let destroyed = false;
 143:   let pointerId: number | null = null;
 144:   const render = () => {
 145:     if (!destroyed) app.renderer.render(app.stage);
 146:   };
 147:   const setHeight = (heightM: number) => {
 148:     if (destroyed || !Number.isFinite(heightM)) return;
 149:     const height = clampHeight(heightM);
 150:     const y = toY(height);
 151:     guide.clear();
 152:     for (let x = 150; x < 791; x += 18) {
 153:       guide
 154:         .moveTo(x, y)
 155:         .lineTo(x + 9, y)
 156:         .stroke({ color: INK, width: 2, alpha: 0.5 });
 157:     }
 158:     guideLabel.text = `${height.toFixed(1)} m`;
 159:     guideLabel.position.y = y - 8;
 160:     render();
 161:   };
 162:   const move = (event: FederatedPointerEvent) => {
 163:     if (pointerId !== event.pointerId || destroyed) return;
 164:     const y = world.toLocal(event.global).y;
 165:     const height =
 166:       Math.round(clampHeight(((GROUND_Y - y) / SPAN) * 20) * 10) / 10;
 167:     options.onHeightChange(height);
 168:   };
 169:   const down = (event: FederatedPointerEvent) => {
 170:     if (pointerId !== null || event.button !== 0) return;
 171:     pointerId = event.pointerId;
 172:     leftBall.cursor = rightBall.cursor = "grabbing";
 173:   };
 174:   const end = (event: Pick<PointerEvent, "pointerId">) => {
 175:     if (pointerId !== event.pointerId) return;
 176:     pointerId = null;
 177:     leftBall.cursor = rightBall.cursor = "grab";
 178:   };
 179:   // Pixi 8 does not forward native cancellation through its event boundary.
 180:   // OS touch/pen interruption must release our drag lock as well.
 181:   canvas.addEventListener("pointercancel", end);
 182:   world.eventMode = "static";
 183:   world.hitArea = new Rectangle(0, 0, WIDTH, HEIGHT);
 184:   for (const ball of [leftBall, rightBall]) {
 185:     ball.on("pointerdown", down);
 186:     ball.on("pointerupoutside", end);
 187:     ball.on("pointercancel", end);
 188:   }
 189:   world.on("globalpointermove", move);
 190:   world.on("pointerup", end);
 191:   world.on("pointerupoutside", end);
 192:   world.on("pointercancel", end);
 193:   const resize = () => {
 194:     if (destroyed) return;
 195:     const width = Math.max(1, host.clientWidth || WIDTH);
 196:     const height = (width * HEIGHT) / WIDTH;
 197:     app.renderer.resize(width, height);
 198:     world.scale.set(width / WIDTH);
 199:     render();
 200:   };
 201:   const observer = new ResizeObserver(resize);
 202:   observer.observe(host);
 203:   setHeight(10);
 204:   resize();
 205:   return {
 206:     update(left, right) {
 207:       if (destroyed) return;
 208:       leftBall.position.set(298, toY(left.heightM));
 209:       rightBall.position.set(642, toY(right.heightM));
 210:       render();
 211:     },
 212:     setHeight,
 213:     destroy() {
 214:       if (destroyed) return;
 215:       destroyed = true;
 216:       pointerId = null;
 217:       observer.disconnect();
 218:       canvas.removeEventListener("pointercancel", end);
 219:       world.removeAllListeners();
 220:       leftBall.removeAllListeners();
 221:       rightBall.removeAllListeners();
 222:       app.destroy(true, { children: true });
 223:     },
 224:   };
 225: }

## docs/design-system.md

   1: # Science studio visual system
   2: 
   3: ## Thesis
   4: A tactile editorial lab: warm paper, near-black ink, heavy numbers, outlined instruments and short hard shadows. Original Vietnamese science content uses the reference's visual grammar without its branding or copy. The workbench is the dominant surface; controls and measured evidence remain directly accessible.
   5: 
   6: ## Tokens and roles
   7: `src/styles/tokens.css` defines paper #F4F2EC, ink #1E1E1B, yellow #FFD83D for selection/results, coral #FF927A for object A/chemistry, blue #4F78E8 for illustration, and darker blue #244FB9 for graph/focus/controls. Small text uses ink or muted #55554E on light surfaces, never white on yellow/coral/blue. Panels use #FFFDF6, 2px outlines, 5px hard shadows (3px mobile), and 16–20px corner radii. Font fallback preserves layout if Google Fonts is unavailable.
   8: 
   9: Be Vietnam Pro heavy sans headings and 34–42px measurement figures pair with compact monospace labels. Labels remain explicit; A/B letters, shared-curve explanation, axes and time milestones convey information independently of color. Interactive focus uses a 3px dark-blue outline with 5px offset.
  10: 
  11: ## Composition
  12: Home combines an editorial headline with a code-native orbital diagram and two tactile field cards. Navigation and breadcrumbs use pills. Chemistry is explicitly a preview. The experiment uses a wide scene beside a narrower control instrument at desktop widths; below 900px the workbench precedes controls. Measurement tiles, the table, thick shared blue graph, and yellow explanation follow. No horizontal scrolling is required at 390px.
  13: 
  14: ## Motion contract
  15: SiteShell owns a scoped GSAP introduction: 12px movement, 420ms power2.out, 60ms stagger. The experiment animates only introductory text, so controls and scientific results are available immediately. Landing highlights the shared impact-time tile with a single 500ms color transition. Neither animation reads or writes simulation position, time, or model state.
  16: 
  17: Each effect owns gsap.context and gsap.matchMedia cleanup. Reduced motion replaces the introduction with a 150ms opacity fade without translation/stagger, and shortens result feedback to 150ms. CSS hover translation is enabled only for no-preference. Scientific motion remains explicitly controlled by Play/Pause/Reset. A development-only `?reduce=1` harness selects the reduced GSAP branch for browser QA; production follows the OS media query. The harness does not emulate the OS CSS preference.
  18: 
  19: ## Verification boundaries
  20: Browser QA includes desktop and 390×844 layouts, controls, focus, reduced GSAP branch, and landing equality. Real touch hardware and OS-level media emulation remain separate release checks. Canvas labels necessarily shrink on phones; adjacent HTML controls and measurements provide readable equivalents.

## package.json

   1: {
   2:     "name": "animationweb",
   3:     "version": "1.0.0",
   4:     "description": "",
   5:     "scripts": {
   6:         "test": "vitest run",
   7:         "dev": "vite",
   8:         "build": "tsc -b && vite build",
   9:         "preview": "vite preview",
  10:         "test:e2e": "playwright test"
  11:     },
  12:     "keywords": [],
  13:     "author": "",
  14:     "license": "ISC",
  15:     "type": "module",
  16:     "dependencies": {
  17:         "gsap": "^3.15.0",
  18:         "pixi.js": "^8.22.0",
  19:         "react": "^19.3.1",
  20:         "react-dom": "^19.3.1",
  21:         "react-router": "^8.5.0"
  22:     },
  23:     "devDependencies": {
  24:         "@types/react": "^19.3.0",
  25:         "@types/react-dom": "^19.3.0",
  26:         "@vitejs/plugin-react": "^6.1.2",
  27:         "typescript": "^7.0.2",
  28:         "vite": "^8.3.5",
  29:         "vitest": "^5.0.5"
  30:     },
  31:     "private": true
  32: }
