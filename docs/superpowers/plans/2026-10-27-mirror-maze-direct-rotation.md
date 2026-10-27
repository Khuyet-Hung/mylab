# Xoay trực tiếp nguồn và gương Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kéo tay nắm của nguồn và hai đầu gương để đổi góc trực tiếp, đồng thời giữ thao tác kéo thân để di chuyển.

**Architecture:** `scene.ts` phân biệt bốn kiểu pointer drag theo vị trí chạm. Hàm hình học thuần tính góc gương quanh tâm với ràng buộc biên bàn; scene phát bố trí mới qua callback hiện có để React cập nhật tia và báo cáo.

**Tech Stack:** TypeScript, PixiJS 8, React 19, Vitest 5.

**Spec:** `docs/superpowers/specs/2026-10-27-mirror-maze-direct-rotation-design.md`

## Global Constraints

- Không thay đổi mô hình dò tia hoặc điều kiện hoàn tất của thí nghiệm.
- Khi đèn bật, đường tia cập nhật trong lúc kéo; khi tắt, chỉnh góc xóa kết quả cũ.
- Giữ thanh góc để thao tác bằng bàn phím.
- Cảnh dùng `resizeExperimentScene`; vùng chạm phải dùng được ở kích thước điện thoại.

## Review Focus

- Chạm gần đầu gương trên điện thoại phải chọn xoay, còn chạm giữa chọn di chuyển.
- Xoay nguồn không làm nguồn đổi vị trí; kéo thân nguồn không đổi góc.
- Xoay gương không đổi chiều dài, không đưa đầu mút ra ngoài bàn.
- Pointer capture giữ thao tác khi ngón tay ra ngoài canvas và kết thúc sau hủy chạm.
- Khi đèn bật, mỗi chuyển động cập nhật đường tia và dữ liệu báo cáo.

---

### Task 1: Hình học xoay gương

**Files:**
- Create: `src/experiments/optics/interaction.ts`
- Create: `tests/optics/interaction.test.ts`

**Interfaces:**
- Produces: `rotateMirrorWithinBounds(mirror: MirrorSegment, endpoint: "start" | "end", pointerStart: Point2, pointerNow: Point2, bounds: {widthM:number;heightM:number}): MirrorSegment`.
- Gương giữ nguyên tâm và chiều dài; góc thay đổi theo góc kéo của đầu được chọn. Nếu chạm biên, trả về góc hợp lệ gần nhất trên cung từ góc ban đầu đến góc yêu cầu.

- [x] **Step 1:** Viết kiểm thử xoay 90°, giữ tâm/chiều dài và dừng tại biên.
- [x] **Step 2:** Chạy `npm run test -- tests/optics/interaction.test.ts`; xác nhận kiểm thử thất bại.
- [x] **Step 3:** Cài đặt `rotateMirrorWithinBounds` và chuẩn hóa góc kéo vào khoảng ±π.
- [x] **Step 4:** Chạy lại kiểm thử; xác nhận tất cả ca qua.

### Task 2: Tay nắm và pointer drag trong PixiJS

**Files:**
- Modify: `src/experiments/optics/scene.ts`
- Modify: `src/experiments/optics/MirrorMazePage.tsx`

**Interfaces:**
- Consumes: `rotateMirrorWithinBounds` từ Task 1; callback `onSetupChange` hiện có.

- [x] **Step 1:** Vẽ tay nắm đầu nguồn và hai đầu gương, cập nhật hướng dẫn ngắn trên màn hình thiết lập.
- [x] **Step 2:** Ưu tiên hit test tay nắm trước thân; thêm drag xoay nguồn và gương, giữ pointer capture và thao tác di chuyển hiện có.
- [x] **Step 3:** Chạy `npm run build`; xác nhận TypeScript và Vite thành công.
- [x] **Step 4:** Kiểm tra trình duyệt ở desktop và điện thoại: nguồn/gương xoay hoặc di chuyển đúng vùng; đường tia đổi ngay khi đèn sáng; reset và báo cáo vẫn đúng.
