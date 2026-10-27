# Quy tắc dự án: trải nghiệm thí nghiệm

Áp dụng cho **mọi thí nghiệm hiện tại và thêm sau này**.

1. Khi chọn một thí nghiệm từ danh mục, mở trang mô phỏng toàn màn hình bằng `ExperimentFrame`. Trang này chỉ hiển thị cảnh mô phỏng, thông số thiết lập và điều khiển chạy/tạm dừng/đặt lại/thoát.
2. Định nghĩa điều kiện **hoàn tất** rõ ràng cho từng thí nghiệm dựa trên mô hình: ví dụ hai vật đã chạm đất, hoặc cả hai con lắc đã đo đủ một chu kỳ. Bắt đầu hoặc tạm dừng chưa phải hoàn tất.
3. Nút **Xem báo cáo** chỉ xuất hiện khi điều kiện hoàn tất đã đạt. Đặt lại hoặc đổi thông số cho lần thử mới phải ẩn nút này cho đến khi lần thử mới hoàn tất.
4. Kết quả đo, bảng, đồ thị và giải thích kết quả thuộc trang báo cáo riêng. Không hiển thị các kết quả này trong màn hình mô phỏng trước khi hoàn tất. Trang báo cáo mở trực tiếp mà không có dữ liệu của lần thử hoàn tất phải hiển thị trạng thái chưa có kết quả và đường dẫn quay về thí nghiệm.
5. Trang báo cáo dùng `SiteShell` thông thường; chỉ trang mô phỏng dùng giao diện toàn màn hình. Khi quay lại từ báo cáo, giữ dữ liệu lần thử đã hoàn tất để người xem có thể mở lại báo cáo hoặc bắt đầu lần thử mới.
6. Mọi cảnh PixiJS phải dùng `resizeExperimentScene` ở `src/experiments/shared/resizeScene.ts` khi đổi kích thước. Helper này chỉnh canvas, tỷ lệ cảnh, độ phân giải texture chữ và cỡ chữ tối thiểu trên màn hình hẹp cho toàn bộ `Text` lồng trong cảnh; không tự viết lại phần xử lý chữ ở từng thí nghiệm.

Thiết kế giao diện chi tiết ở `docs/design-system.md`; quy tắc này do người dùng chốt ngày 2026-10-27 và có ưu tiên cho các thí nghiệm về sau.
