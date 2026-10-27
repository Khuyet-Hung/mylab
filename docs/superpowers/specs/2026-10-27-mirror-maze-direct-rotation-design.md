# Xoay trực tiếp nguồn sáng và gương

Ngày: 2026-10-27  
Trạng thái: Đã duyệt

## Ý định

Người xem đổi hướng tia và góc gương ngay trên bàn quang học bằng chuột hoặc cảm ứng. Khi đèn sáng, đường tia đổi theo từng lần kéo. Các thanh góc vẫn dùng được để chỉnh chính xác và thao tác bằng bàn phím.

## Cách tương tác

Hai cách đã cân nhắc: (1) kéo tay nắm trên vật thể để xoay, còn kéo thân để di chuyển; (2) chọn chế độ Di chuyển/Xoay rồi kéo vật thể. Người dùng chọn cách 1 vì thao tác trực tiếp và ít bước hơn.

- Nguồn sáng có tay nắm tròn ở đầu mũi chỉ hướng, nằm ngoài thân nguồn. Kéo tay nắm quanh tâm nguồn để đổi góc phát tia; kéo thân nguồn để đổi vị trí. Tay nắm được ưu tiên nhận chạm khi vùng chạm giao với thân.
- Mỗi đầu gương có tay nắm rõ ràng. Kéo một đầu làm gương xoay quanh tâm, giữ nguyên chiều dài; kéo đoạn giữa để di chuyển cả gương. Các vùng chạm đầu mút được ưu tiên trước thân gương.
- Góc và vị trí được cập nhật liên tục khi kéo. Gương không được ra ngoài bàn; nếu hướng kéo vượt biên, góc dừng tại vị trí hợp lệ gần nhất. Kéo ra khỏi canvas vẫn tiếp tục nhờ pointer capture, thả hoặc hủy chạm sẽ kết thúc thao tác.
- Khi tia đang bật, mỗi thay đổi dùng mô hình dò tia hiện có để vẽ lại đường đi ngay và cập nhật dữ liệu báo cáo. Khi tia tắt, thao tác chỉ chỉnh bố trí và xóa kết quả lượt cũ.
- Cảnh vẫn gọi `resizeExperimentScene`; hit area tính theo kích thước hiển thị để tay nắm dùng được trên điện thoại. Thanh góc và điều khiển bằng bàn phím tiếp tục hoạt động.

## Tiêu chí chấp nhận

- Kéo đầu chỉ hướng xoay nguồn mà không làm nguồn dịch vị trí; kéo thân nguồn chỉ di chuyển nguồn.
- Kéo đầu gương xoay gương quanh tâm mà không đổi chiều dài; kéo giữa gương chỉ di chuyển gương.
- Trên điện thoại có thể chạm đúng tay nắm; đang bật tia thì đường tia đổi hướng trong khi kéo.
- Không có góc nào làm gương vượt biên bàn; hành vi hoàn tất, bật/tắt tia và báo cáo vẫn đúng quy tắc dự án.
