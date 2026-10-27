# Thiết kế: Trải nghiệm toàn màn hình cho thí nghiệm

Ngày: 2026-10-26

## Ý định

Biến trang thí nghiệm thành không gian tập trung vào canvas. Người học có thể chạy, tạm dừng, đặt lại và mở thiết lập ngay trên canvas; sau khi chạy lần đầu, họ có thể mở trang báo cáo riêng ở dạng bản nháp.

## Mục tiêu và giới hạn

- Tạo khung giao diện thí nghiệm tái sử dụng; áp dụng cho rơi tự do hiện tại và làm điểm mở rộng cho thí nghiệm mới.
- Canvas chiếm màn hình thí nghiệm; ẩn điều hướng, tiêu đề và nội dung giải thích/số liệu khỏi màn hình chơi.
- Hiển thị các action chính bằng icon có nhãn truy cập được; thiết lập nằm trong bảng có thể mở/đóng.
- Chỉ hiện đường dẫn báo cáo sau khi thí nghiệm đã bắt đầu ít nhất một lần trong phiên hiện tại.
- Thêm route báo cáo riêng với nội dung tối thiểu, có thể quay lại thí nghiệm.
- Không triển khai báo cáo phân tích chi tiết hoặc lưu tiến trình qua lần tải lại.

## Các cách đã cân nhắc

1. Chỉnh riêng `GravityPage`: ít cấu trúc mới, nhưng mỗi thí nghiệm sau này phải tự dựng lại trải nghiệm.
2. Tạo khung thí nghiệm dùng chung và chuyển `GravityPage` vào khung: tái sử dụng nhất quán, đổi lại cần tách phần trình bày khỏi logic mô phỏng. **Đã chọn.**

## Hướng triển khai

Tạo component khung nhận canvas, thiết lập, các action và metadata điều hướng. Chuyển phần mô phỏng hiện có vào khung; giữ dữ liệu đo và nội dung giải thích ở trang báo cáo tối giản. Thêm trạng thái “đã chạy” ở cấp trang thí nghiệm; khi hoàn tất một lượt cũng được tính là đã chạy. Trang báo cáo nhận đường quay lại thí nghiệm.

## Giao diện và quyết định còn lại cho người triển khai

Dùng icon inline hiện có trong dự án hoặc ký hiệu SVG/CSS nhỏ, kèm `aria-label` và tooltip; không cần thư viện icon mới. Thiết lập ban đầu vẫn có thể được chỉnh trước khi chạy. Bảng điều khiển được đặt nổi trên canvas và co giãn cho màn hình nhỏ.
