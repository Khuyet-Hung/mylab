# Mê cung gương — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm thí nghiệm quang học dạng sandbox, nơi người xem tự bố trí gương, bật tia sáng liên tục, thay đổi đường tia trực tiếp và xem kết quả trong báo cáo riêng.

**Architecture:** Mô hình TypeScript thuần tính đường đi của tia trong một bàn thí nghiệm cố định 9 × 5,2 m. Cảnh PixiJS hiển thị nguồn, gương, màn hứng và hoạt ảnh vẽ đường đi; trang React quản lý thiết lập, trạng thái lượt thử, điều khiển `ExperimentFrame` và dữ liệu báo cáo. Danh mục và báo cáo tích hợp theo cấu trúc thí nghiệm con lắc hiện có.

**Tech Stack:** React 19, TypeScript, PixiJS 8, React Router 8, Vitest 5; không thêm thư viện.

**Spec:** `docs/superpowers/specs/2026-10-27-mirror-maze-design.md`

## Global Constraints

- Dùng `ExperimentFrame` cho trang mô phỏng toàn màn hình; trang này chỉ hiện cảnh, thiết lập và điều khiển chạy/tạm dừng/đặt lại/thoát.
- Điều kiện hoàn tất là mô hình kết thúc tia tại màn hứng trong tọa độ logic hoặc dừng ở giới hạn phản xạ; bắt đầu hay tạm dừng chưa phải hoàn tất.
- Chỉ hiện hành động xem báo cáo sau khi hoàn tất; đặt lại xóa kết quả, còn chỉnh nguồn/gương khi đèn sáng tính và hiển thị ngay đường tia mới cùng báo cáo tương ứng.
- Báo cáo dùng `SiteShell` thông thường; thiếu dữ liệu hoàn tất thì hiện trạng thái chưa có kết quả và đường quay về thí nghiệm; quay lại phải giữ lần thử đã hoàn tất.
- Mọi cảnh PixiJS gọi `resizeExperimentScene` trong resize observer; không tự xử lý lại độ phân giải/cỡ chữ PixiJS.
- Mô hình tia tách khỏi kết xuất; không thêm thư viện; bố cục dùng được ở 390 × 844 mà không cuộn ngang.
- Không hiển thị kết quả đo, bảng, đồ thị hoặc giải thích kết quả trong màn mô phỏng trước khi hoàn tất.

## Review Focus

- Tia song song/trùng phương, chạm đầu mút, gương nằm sau nguồn hoặc đầu vào không hợp lệ: kiểm thử giao điểm hữu hạn, chọn va chạm hợp lệ gần nhất và báo lỗi trong `tests/optics/model.test.ts`.
- Tia vừa phản xạ có thể bị tính đụng lại chính gương đó do sai số số học: kiểm thử bỏ qua giao điểm có khoảng cách nhỏ hơn `1e-5 m` trong cùng bộ kiểm thử mô hình.
- Tia phản xạ nhiều lần hoặc kết thúc ở màn hứng: kiểm thử số lần phản xạ, trạng thái kết thúc và đoạn tia cuối trong cùng bộ kiểm thử mô hình.
- Chỉnh nguồn/gương khi đèn đang bật: kiểm tra đường tia cập nhật ngay và đèn vẫn sáng; tắt trước khi tia tới màn hứng không tạo báo cáo; đặt lại xóa báo cáo trong Task 3.
- Kích thước màn hình và nhập liệu bàn phím/cảm ứng có thể làm sai tọa độ kéo hoặc khiến không thể chỉnh gương: kiểm tra ở desktop và 390 × 844 trong Task 2.

## Bản đồ tệp

- `src/experiments/optics/model.ts` — kiểu dữ liệu và phép dò tia, giao điểm, góc phản xạ.
- `tests/optics/model.test.ts` — ca kiểm thử khoa học và hình học cho mô hình.
- `src/experiments/optics/scene.ts` — vòng đời PixiJS, bố trí, tương tác kéo và vẽ đường tia.
- `src/experiments/optics/MirrorMazePage.tsx` — cấu hình, điều khiển thời gian vẽ, hoàn tất và lưu trạng thái báo cáo.
- `src/experiments/optics/MirrorMazeReportPage.tsx` — trạng thái rỗng, sơ đồ SVG đường tia, bảng góc và phần giải thích.
- `src/catalog/experiments.ts`, `src/catalog/CatalogPage.tsx`, `src/App.tsx`, `src/components/SiteShell.tsx` — thẻ thí nghiệm, chủ đề Quang học, các route và chế độ toàn màn hình.
- `src/styles/optics.css`, `src/styles/global.css`, `src/styles/responsive.css` — giao diện báo cáo/mô phỏng và bố cục hẹp.

---

### Task 1: Mô hình dò tia hình học

**Files:**
- Create: `src/experiments/optics/model.ts`
- Create: `tests/optics/model.test.ts`

**Interfaces:**
- Produces: `Point2`, `MirrorSegment`, `MirrorMazeSetup`, `RayPathSegment`, `BounceMeasurement`, `RayTraceResult` và `traceMirrorRay(setup: MirrorMazeSetup, bounds: { widthM: number; heightM: number }, maxReflections?: number): RayTraceResult`.
- `MirrorMazeSetup` chứa nguồn `{ origin: Point2; angleDeg: number }` và danh sách gương hữu hạn `{ id: string; start: Point2; end: Point2 }`.
- `RayTraceResult` chứa `segments` (điểm đầu/cuối, độ dài, id gương nếu kết thúc tại gương), `bounces` (id gương, góc tới, góc phản xạ) và `termination: "screen" | "reflection-limit"`.
- Tất cả tọa độ và độ dài mô hình tính bằng mét; góc báo cáo tính bằng độ. Bàn mặc định là hình chữ nhật 9 × 5,2 m và bốn cạnh là màn hứng.

- [ ] **Step 1: Viết kiểm thử mô hình thất bại**

  Thêm các kiểm thử `tracesToScreenWithoutMirrors`, `reflectsAtFortyFiveDegreeMirror`, `choosesNearestForwardMirror`, `acceptsFiniteSegmentEndpointHit`, `ignoresParallelMirror`, `ignoresCollinearMirrorOverlap`, `ignoresMirrorBehindSource`, `doesNotImmediatelyRehitMirror`, `stopsAtReflectionLimit`, và `rejectsInvalidGeometry`. Dùng một tia ngang và gương 45° để xác nhận tia ra vuông góc, góc tới bằng góc phản xạ, điểm cuối cùng thuộc màn hứng, và id gương trong phép đo đúng.

- [ ] **Step 2: Chạy riêng kiểm thử mô hình để xác nhận thất bại ban đầu**

  Run: `npm run test -- tests/optics/model.test.ts`

  Expected: FAIL vì module và `traceMirrorRay` chưa tồn tại.

- [ ] **Step 3: Cài đặt giao điểm và phản xạ trong `model.ts`**

  Dùng giao điểm tia–đoạn thẳng hữu hạn, chọn giao điểm dương gần nhất, phản xạ vector theo pháp tuyến đơn vị và bỏ giao điểm gần hơn `1e-5 m`. Mặc định giới hạn 12 lần phản xạ; nếu tia chạm cạnh bàn trước thì `termination` là `screen`, nếu đủ 12 lần thì dừng tại điểm phản xạ thứ 12 với `reflection-limit`. Từ chối đầu vào không hữu hạn, gương độ dài bằng 0, nguồn/gương ngoài bàn hoặc giới hạn phản xạ không hợp lệ bằng `RangeError`.

- [ ] **Step 4: Chạy kiểm thử mô hình và xác nhận toàn bộ ca qua**

  Run: `npm run test -- tests/optics/model.test.ts`

  Expected: PASS cho mười kiểm thử; các phép đo góc sai lệch không quá `1e-6°` trong ca gương 45°.

### Task 2: Cảnh PixiJS và thao tác bố trí

**Files:**
- Create: `src/experiments/optics/scene.ts`

**Interfaces:**
- Consumes: Các kiểu `MirrorMazeSetup`, `Point2`, `RayTraceResult` từ Task 1.
- Produces: `createMirrorMazeScene(host: HTMLElement, setup: MirrorMazeSetup, onSetupChange: (setup: MirrorMazeSetup) => void, onSelectMirror: (id: string | null) => void): Promise<MirrorMazeScene>`; `MirrorMazeScene` có `setSetup(setup)`, `setSelectedMirror(id: string | null)`, `revealPath(path, distanceM)`, `destroy()`.
- Cảnh logic 900 × 520 px ứng với 9 × 5,2 m; đổi tọa độ bằng 100 px/m. Màn hứng luôn là biên trong hệ tọa độ này, không lấy cạnh viewport đã co giãn.

- [ ] **Step 1: Tạo cảnh tĩnh và kiểm tra tích hợp kiểu**

  Khởi tạo Pixi `Application` với `autoStart: false`, nền theo design system, hiển thị biên màn hứng, nguồn và các đoạn gương. Thêm `ResizeObserver` gọi `resizeExperimentScene(app, world, host, { width: 900, height: 520 })` và cleanup observer/application trong `destroy()`.

- [ ] **Step 2: Thêm tương tác gương và nguồn**

  Kéo nguồn để đổi `origin`, kéo thân gương để đổi hai đầu mút trong biên bàn, chọn gương bằng chạm/click và đánh dấu gương đang chọn rõ ràng. Phát thiết lập mới qua `onSetupChange`; scene không tự tính kết quả khoa học. Dùng trạng thái chọn gương cho giao diện HTML điều chỉnh góc/đặt lại vị trí bằng bàn phím.

- [ ] **Step 3: Thêm vẽ đường tia theo khoảng cách đã mô phỏng**

  `revealPath(path, distanceM)` vẽ từ đầu tia đến tổng khoảng cách truyền vào, cắt chính xác ở giữa đoạn nếu cần; không thay đổi dữ liệu đầu ra của mô hình. Bảo đảm cập nhật hiển thị sau `setSetup` và `revealPath`.

- [ ] **Step 4: Kiểm tra cảnh desktop và màn hình hẹp**

  Mở scene ở bề rộng 1440 px và 390 px; kéo nguồn/gương ở hai cỡ màn hình và xác nhận điểm mô hình sau khi kéo khớp vị trí nhìn thấy. Kiểm tra nhấn/chạm chọn gương, slider góc bằng bàn phím, resize nhiều lần và cleanup khi rời route.

### Task 3: Trang mô phỏng, trạng thái lượt thử và báo cáo

**Files:**
- Create: `src/experiments/optics/MirrorMazePage.tsx`
- Create: `src/experiments/optics/MirrorMazeReportPage.tsx`
- Modify: `src/experiments/optics/scene.ts`

**Interfaces:**
- Consumes: `traceMirrorRay` từ Task 1 và `MirrorMazeScene` từ Task 2.
- Produces: `MirrorMazeReportState = { setup: MirrorMazeSetup; result: RayTraceResult; completed: true; beamOn: boolean }` truyền qua `Link` state tới `/physics/optics/mirror-maze/report`.
- Thiết lập ban đầu: nguồn `(0.8, 2.6) m`, góc `0°` hướng sang phải; gương A từ `(2.8, 3.1)` đến `(3.8, 2.1) m`, gương B từ `(2.9, 2.2)` đến `(3.7, 1.4) m`. Trục `y` tăng xuống dưới; tia mặc định phản xạ lên trên ở A, sang phải ở B rồi tới màn hứng. Giới hạn tối đa 6 gương trên bàn.

- [ ] **Step 1: Tạo trang `ExperimentFrame` và thiết lập HTML**

  Thêm slider vị trí nguồn `x: 0,1…8,9 m`, `y: 0,1…5,1 m` bước `0,1 m`, góc nguồn `-180°…180°` bước `1°`, nút thêm/xóa gương, danh sách chọn gương và slider góc gương `0°…180°` bước `1°`. Gương mới dài `0,8 m`, đặt cách nhau theo chiều dọc từ tâm `(4,5; 2,4) m` rồi tăng `0,8 m` mỗi gương. Gương chọn được di chuyển bằng phím mũi tên `0,05 m`; `Shift` + mũi tên di chuyển `0,25 m`. Chặn thêm gương khi đủ sáu.

- [ ] **Step 2: Kết nối scene và bộ đếm hoạt ảnh**

  Nút Play gọi `traceMirrorRay` với bounds 9 × 5,2 m và tối đa 12 phản xạ; dùng `requestAnimationFrame` chỉ cho lần vẽ đầu. Khi tia đã vẽ đến điểm kết thúc, đặt `completed: true` và tạo state báo cáo nhưng giữ đèn sáng và đường tia hiện trên cảnh. Chỉnh nguồn/gương khi đèn sáng phải tính/vẽ lại đường mới ngay; tắt tia ẩn đường nhưng giữ báo cáo đã hoàn tất, còn tắt trước khi hoàn tất không tạo báo cáo. Reset tắt tia, xóa kết quả và khôi phục cấu hình mặc định.

- [ ] **Step 3: Tạo trang báo cáo riêng**

  Trong `MirrorMazeReportPage.tsx`, khi thiếu `completed: true` hoặc thiếu dữ liệu đường tia, hiện trạng thái chưa có kết quả và link về thí nghiệm. Khi có kết quả, dùng `SiteShell` để hiển thị tổng số phản xạ, tổng độ dài, SVG đường tia và bảng từng đoạn/góc; giải thích góc tới bằng góc phản xạ. Ghi rõ nếu dừng ở giới hạn phản xạ. Link quay lại truyền nguyên report state.

- [ ] **Step 4: Kiểm tra vòng đời hoàn tất và quay lại**

  Bật tia và xác nhận báo cáo chỉ xuất hiện khi vẽ xong; di chuyển gương khi đèn sáng để xác nhận đường tia đổi ngay. Tắt tia trước khi vẽ xong không tạo báo cáo; tắt tia sau khi hoàn tất giữ báo cáo. Mở báo cáo rồi quay lại xác nhận bố trí, trạng thái đèn và kết quả còn nguyên. Chỉnh nguồn/gương khi đèn tắt phải ẩn báo cáo; mở route báo cáo trực tiếp phải hiện trạng thái rỗng.

### Task 4: Danh mục, định tuyến và giao diện đáp ứng

**Files:**
- Modify: `src/catalog/experiments.ts`
- Modify: `src/catalog/CatalogPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/SiteShell.tsx`
- Create: `src/styles/optics.css`
- Modify: `src/styles/global.css`
- Modify: `src/styles/responsive.css`

**Interfaces:**
- Mục danh mục: id `mirror-maze`, chủ đề `Quang học`, route `/physics/optics/mirror-maze`.
- Route báo cáo: `/physics/optics/mirror-maze/report`.

- [ ] **Step 1: Đăng ký chủ đề và thẻ thí nghiệm**

  Thêm chủ đề Quang học vào trang Vật lý, tiêu đề/copy riêng cho chủ đề này trong `CatalogPage`, minh họa thẻ riêng thay cho hình minh họa rơi, thẻ “Mê cung gương” với câu hỏi về góc phản xạ, cùng các route `/physics/optics`, `/physics/optics/mirror-maze` và `/physics/optics/mirror-maze/report` trong `App.tsx`.

- [ ] **Step 2: Thêm style riêng và breakpoint**

  Import `optics.css` từ `global.css`; dùng token hiện có, viền đậm, bóng lệch và focus nhìn thấy rõ. Ở 390 × 844 px, chuyển panel thiết lập xuống dưới cảnh, giữ nút thao tác cảm ứng tối thiểu 44 × 44 px và không tạo cuộn ngang.

- [ ] **Step 3: Kiểm tra build và các luồng chính**

  Run: `npm run build`

  Expected: TypeScript và Vite build thành công. Kiểm tra bằng trình duyệt luồng danh mục → mô phỏng → hoàn tất → báo cáo → quay lại ở desktop và 390 × 844 px; kiểm tra link báo cáo trực tiếp không có state.

## Thứ tự phụ thuộc

Task 1 → Task 2 → Task 3 → Task 4. Mỗi task có thể review riêng; Task 3 chỉ tích hợp khi API mô hình và scene ổn định.
