# Thiết kế thí nghiệm con lắc đơn

Ngày: 2026-10-27  
Trạng thái: Đã duyệt

## Ý định

Thêm một thí nghiệm Vật lý giúp người học khám phá độ dài dây ảnh hưởng thế nào đến chu kỳ dao động con lắc đơn. Người học chỉnh thông số, chạy mô phỏng, đo chu kỳ và so sánh hai cấu hình để nhận ra xu hướng.

## Mục tiêu và ngoài phạm vi

- Hiển thị hai con lắc dao động cùng các giá trị đầu vào trên màn hình mô phỏng toàn màn hình.
- Cho phép cấu hình hai lần thử để so sánh trực tiếp.
- Có đồ thị chu kỳ theo độ dài, đối chiếu phép đo mô phỏng với công thức góc nhỏ.
- Giải thích các giả định và giới hạn của công thức.
- Chưa mô phỏng lực cản, ma sát, chuyển động ba chiều, dây có khối lượng, hay vật treo có kích thước đáng kể; không thêm lưu tiến trình hoặc engine vật lý tổng quát.

## Hướng tiếp cận

1. **Mô phỏng gọn:** một cấu hình, con lắc kéo/thả được, chỉnh độ dài và góc ban đầu, đo chu kỳ. Dễ làm và ít thành phần, nhưng người học phải tự ghi nhớ kết quả giữa các lần thử.
2. **Bàn thí nghiệm so sánh — đề xuất:** hai bộ thông số có thể chạy và so sánh, kèm đồ thị chu kỳ theo độ dài. Có thêm giao diện và trạng thái cần quản lý, nhưng trực tiếp hỗ trợ mục tiêu nhận ra quy luật qua nhiều lần thử.

Chọn hướng 2 theo lựa chọn của người dùng. Tiếp tục dùng React + TypeScript + PixiJS và mô hình khoa học thuần tách khỏi kết xuất, phù hợp với thí nghiệm rơi tự do hiện có.

## Mô hình khoa học dự kiến

- Dùng con lắc lý tưởng: vật điểm, dây nhẹ không giãn, gia tốc trọng trường không đổi `g = 9.8 m/s²`, bỏ qua lực cản và ma sát.
- Mô hình chuyển động phải hỗ trợ góc ban đầu hữu hạn; phép đo chu kỳ lấy từ các lần qua vị trí cân bằng cùng chiều liên tiếp.
- Đường dự đoán dùng công thức góc nhỏ `T₀ = 2π√(L/g)` và cần ghi rõ là xấp xỉ; đồ thị phải phân biệt dự đoán với phép đo mô phỏng khi góc đủ lớn để sai khác nhận thấy được.
- Phạm vi thông số, giá trị mặc định, và dung sai số sẽ được xác định trong kế hoạch triển khai dựa trên kiểm tra mô hình.

## Trải nghiệm và tích hợp

- Thêm thí nghiệm vào catalogue Vật lý với câu hỏi ngắn về độ dài dây và chu kỳ.
- Tạo trang mô phỏng toàn màn hình theo mẫu `ExperimentFrame` hiện tại, với điều khiển chạy/tạm dừng/đặt lại và phần cài đặt có thể mở rộng. Không hiển thị số đo, bảng, đồ thị hoặc giải thích kết quả trên màn hình này.
- Hai cấu hình phải có nhãn và phân biệt rõ; khi so sánh độ dài, dùng cùng góc ban đầu để cô lập tác động của độ dài. Hiển thị góc dùng trong so sánh và việc đổi cấu hình không làm nhiễu phép đo đang quan sát.
- Khi cả hai cấu hình đã đo đủ một chu kỳ, mô phỏng tự dừng và nút xem báo cáo xuất hiện. Bắt đầu hoặc tạm dừng trước thời điểm đó chưa mở báo cáo; đặt lại hay đổi thông số ẩn nút báo cáo.
- Trang báo cáo riêng hiển thị chu kỳ đo được, độ dài, góc ban đầu, đồ thị và giải thích quan sát bằng ngôn ngữ phổ thông, ghi đơn vị SI. Mở trực tiếp trang báo cáo khi chưa có lần thử hoàn tất sẽ hiện trạng thái chưa có kết quả.
- Hỗ trợ chuột, cảm ứng và bàn phím cho các điều khiển cốt yếu; giữ bố cục dùng được trên màn hình nhỏ và tôn trọng thiết lập giảm chuyển động cho chuyển động giao diện.

## Ràng buộc và tiêu chí chấp nhận

- Không thêm thư viện nếu các phụ thuộc hiện có đáp ứng được.
- Kết quả số và đồ thị lấy từ cùng mô hình; PixiJS chỉ hiển thị trạng thái mô hình.
- Với góc nhỏ, chu kỳ đo phải khớp công thức `T₀` trong dung sai được chốt ở kế hoạch; tăng độ dài phải làm tăng chu kỳ.
- Với góc lớn hơn, phép đo phải cho thấy sai khác phù hợp với mô hình phi tuyến, trong khi đường góc nhỏ vẫn được gắn nhãn xấp xỉ.
- Thí nghiệm mở được từ catalogue, có thể chạy, tạm dừng, đặt lại và so sánh hai cấu hình trên desktop lẫn màn hình hẹp.
- Quy tắc toàn màn hình → hoàn tất → báo cáo được lưu trong `AGENTS.md` và áp dụng cho tất cả thí nghiệm.

## Để người triển khai quyết định

Chi tiết hình học và thao tác kéo con lắc; lựa chọn bộ giải số và bước thời gian sau khi đặt tiêu chí sai số; giới hạn cụ thể của độ dài/góc; giao diện đồ thị dựa trên thành phần sẵn có hay SVG/HTML; cách biểu diễn và lưu hai cấu hình trong phiên; cách kiểm tra giảm chuyển động mà không làm mất khả năng quan sát dao động khoa học.
