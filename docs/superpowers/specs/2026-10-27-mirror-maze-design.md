# Thiết kế thí nghiệm mê cung gương

Ngày: 2026-10-27  
Trạng thái: Đã duyệt

## Ý định

Thêm một thí nghiệm quang học dạng sandbox để người xem tự đặt nguồn sáng và gương, sau đó quan sát, đo và giải thích đường đi của tia sáng. Trải nghiệm ưu tiên khám phá tự do, không có màn chơi hoặc một cấu hình lời giải bắt buộc.

## Mục tiêu và ngoài phạm vi

- Tạo cảm giác tương tác trực tiếp: kéo và xoay gương trên bàn thí nghiệm; thay đổi hướng nguồn sáng; đường tia đổi ngay khi đèn đang bật.
- Dùng mô hình hình học 2D có thể kiểm chứng để tính giao điểm tia với gương, phản xạ và góc tới/góc phản xạ.
- Giữ kết quả đo, đồ thị/bảng và giải thích trong trang báo cáo riêng theo quy tắc chung của dự án.
- Không mô phỏng khúc xạ, bước sóng, độ sáng, vật liệu gương thực, nhiễu xạ hay tán xạ; không thêm engine vật lý tổng quát hoặc lưu tiến trình.

## Cách tiếp cận

1. **Dò tia hình học (đề xuất và đã chọn):** tính toàn bộ các đoạn tia và điểm phản xạ từ vị trí nguồn, hướng chiếu và các gương. Hoạt ảnh chỉ lần lượt vẽ kết quả mô hình. Cách này phản hồi chính xác khi thay đổi bố cục và cho phép báo cáo góc ở từng lần phản xạ.
2. **Tia chuyển động và dò va chạm theo từng bước:** cập nhật vị trí tia trong mỗi khung hình rồi xử lý gương khi va chạm. Cách này thể hiện thời gian truyền, nhưng không có ý nghĩa vật lý hữu ích ở tỷ lệ bàn thí nghiệm và làm trạng thái chạy/phản xạ khó đồng bộ hơn.

Tiếp tục dùng React + TypeScript + PixiJS; mô hình tia thuần TypeScript tách khỏi kết xuất. `ExperimentFrame` quản lý bật tia, tắt tia, đặt lại và thoát.

## Mô hình và điều kiện hoàn tất

- Tia là một đường thẳng trong mặt phẳng 2D; gương là đoạn thẳng có độ dài hữu hạn. Tại giao điểm gần nhất, tia phản xạ theo định luật góc tới bằng góc phản xạ, đo so với pháp tuyến.
- Nguồn sáng có vị trí và góc chiếu điều chỉnh được. Người xem có thể thêm, kéo, xoay và xóa gương trong giới hạn giao diện, kể cả khi đèn đang bật.
- Màn hứng gồm bốn cạnh cố định trong tọa độ logic của cảnh, độc lập với kích thước màn hình. Khi bấm Play, mô hình tính đường đi và cảnh vẽ tia lan dọc theo các đoạn đã tính. Đường tia kết thúc khi chạm màn hứng hoặc đạt giới hạn phản xạ; nguồn vẫn sáng và đường tia vẫn hiện cho tới khi người xem tắt hoặc đặt lại.
- Điều kiện hoàn tất là đường tia đã được vẽ tới điểm kết thúc của mô hình. Bấm Play hoặc tắt tia trước thời điểm đó chưa phải hoàn tất. Đặt lại hoặc chỉnh nguồn/gương khi đèn tắt xóa kết quả và ẩn nút báo cáo cho lần thử mới.
- Khi đèn đang bật, kéo/xoay gương hoặc đổi nguồn sẽ tính và hiển thị đường tia mới ngay, không cần bấm Play lại; kết quả cũ được thay bằng kết quả của bố cục mới sau khi tia mới tới điểm kết thúc. Tắt tia ẩn tia nhưng giữ báo cáo nếu lượt đã hoàn tất. Giao điểm dùng dung sai hình học để tránh tia vừa phản xạ bị tính là va chạm lặp với cùng gương.
- Báo cáo hiển thị số lần phản xạ, tổng độ dài đường đi, độ dài từng đoạn, góc tới/góc phản xạ ở mỗi gương và giải thích định luật phản xạ. Nếu đạt giới hạn phản xạ, báo cáo nêu rõ tia chưa tới màn hứng.
- Mở trực tiếp đường dẫn báo cáo khi không có dữ liệu lần thử hoàn tất sẽ hiển thị trạng thái chưa có kết quả cùng đường quay về thí nghiệm. Quay lại từ báo cáo giữ nguyên lần thử đã hoàn tất.

## Trải nghiệm và tích hợp

- Thêm mục vào danh mục Vật lý, chủ đề Quang học, với câu hỏi về cách gương đổi hướng tia sáng.
- Màn hình mô phỏng dùng toàn màn hình `ExperimentFrame`, chỉ gồm cảnh, thiết lập và điều khiển. Không hiện số đo/bảng/đồ thị trước khi hoàn tất.
- Điều khiển trực tiếp trên cảnh hỗ trợ chuột và cảm ứng. Thiết lập HTML cung cấp lựa chọn nguồn sáng, hướng chiếu và thao tác thêm/xóa gương; các thao tác chính cần có phương án dùng bàn phím.
- Trang báo cáo dùng `SiteShell` thông thường. Đường dẫn thí nghiệm và báo cáo tuân theo quy ước định tuyến hiện có.
- Cảnh PixiJS dùng `resizeExperimentScene` từ `src/experiments/shared/resizeScene.ts` trong bộ quan sát thay đổi kích thước; không tự viết lại xử lý độ phân giải hoặc cỡ chữ.
- Giao diện theo `docs/design-system.md`: nền giấy, nét viền đậm, màu phân biệt nguồn/tia/gương, tương phản rõ, bố cục không cuộn ngang trên màn hình 390px.

## Tiêu chí chấp nhận

- Tia gặp gương hữu hạn theo đúng giao điểm gần nhất; tia song song hoặc không giao gương tiếp tục tới mép bàn.
- Với từng va chạm, góc tới và góc phản xạ bằng nhau trong sai số số học; phép tính không phụ thuộc tốc độ hoạt ảnh.
- Bật tia, tắt tia, bật lại, đặt lại, chỉnh bố cục khi đèn sáng, hoàn tất, mở báo cáo và quay lại hoạt động đúng theo quy tắc dự án.
- Báo cáo không xuất hiện trước khi tia kết thúc; thay đổi cấu hình sau hoàn tất ẩn báo cáo cho đến khi lượt mới kết thúc.
- Dùng được trên desktop và màn hình hẹp với chuột, cảm ứng và bàn phím cho thao tác thiết yếu.

## Quyết định để người triển khai

Chốt giới hạn số gương và số lần phản xạ, cách chọn/điều khiển gương bằng bàn phím, đơn vị quy đổi từ tọa độ màn hình sang đơn vị mô hình, dung sai hình học và cách biểu diễn đồ thị hoặc sơ đồ đường tia trong báo cáo. Các con số mặc định cần được xác định trong kế hoạch triển khai sau khi kiểm tra bố cục ở desktop và điện thoại.
