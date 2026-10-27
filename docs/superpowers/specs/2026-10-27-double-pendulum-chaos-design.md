# Thiết kế thí nghiệm con lắc kép: độ nhạy với điều kiện ban đầu

Ngày: 2026-10-27  
Trạng thái: Đã duyệt

## Ý định

Thêm một thí nghiệm Vật lý có hiệu ứng trình diễn rõ: hai con lắc kép bắt đầu gần như giống hệt nhau, nhưng sai khác rất nhỏ trong góc ban đầu khiến chuyển động tách xa theo thời gian. Người học quan sát hỗn loạn xác định và xem báo cáo định lượng mức độ lệch giữa hai lượt.

## Mục tiêu, ngoài phạm vi và điều kiện thất bại

- Mở từ danh mục vào mô phỏng toàn màn hình bằng `ExperimentFrame`; màn hình mô phỏng chỉ có cảnh, thiết lập và điều khiển chạy/tạm dừng/đặt lại/thoát.
- Hiển thị hai hệ con lắc kép A/B cạnh nhau, đường vệt chuyển động tương phản, và một sai khác điều kiện ban đầu nhỏ, có thể điều chỉnh.
- Chạy hai hệ bằng cùng mô hình xác định và cùng bước thời gian. Báo cáo chỉ xuất hiện sau khi mô phỏng đạt thời lượng quan sát định trước; đặt lại hoặc đổi thiết lập sẽ xóa trạng thái hoàn tất.
- Báo cáo riêng trình bày độ lệch vị trí đầu dưới theo thời gian, giá trị lệch cuối, đồ thị và giải thích giới hạn mô hình.
- Nếu chỉ có hai con lắc giống nhau mà sai khác không thể quan sát, không thể đo độ lệch hoặc báo cáo xuất hiện trước khi chạy đủ thời gian, thí nghiệm thất bại.
- Ngoài phạm vi: mô phỏng va chạm, ma sát/cản, chuyển động 3D, engine vật lý tổng quát, lưu lịch sử giữa các phiên, suy rộng thành thí nghiệm hỗn loạn đa chủ đề.

## Các hướng đã cân nhắc

1. **Hai hệ A/B với sai khác ban đầu nhỏ — đề xuất và được người dùng chọn.** Tác động hỗn loạn hiện ra trực tiếp khi hai quỹ đạo tách nhau; báo cáo đo được mức lệch theo thời gian. Có thêm trạng thái và chi phí tính toán so với một hệ.
2. **Một hệ con lắc kép khám phá tham số.** Ít giao diện hơn, nhưng người học khó thấy độ nhạy nếu không tự ghi nhớ và chạy lại nhiều lần.

Chọn hướng 1 vì ưu tiên hiệu ứng “wow” bằng mắt và việc so sánh trực tiếp.

## Mô hình dự kiến

- Hai vật điểm nối bằng thanh nhẹ, cứng, không giãn; khớp quay không ma sát trong trọng trường đều `g = 9.8 m/s²`; không có lực cản.
- Dùng phương trình Lagrange chuẩn của con lắc kép phẳng với hai góc đo từ phương thẳng đứng; hai hệ có chiều dài và khối lượng tương đương.
- Bắt đầu từ góc chung của hệ A; hệ B chỉ khác góc ban đầu của khớp thứ nhất một lượng `δ`, còn các điều kiện khác giữ nguyên. Vận tốc góc đầu bằng 0.
- Tích phân số bước cố định, bậc bốn; renderer chỉ nhận snapshot trạng thái. Đồ thị sai khác lấy vị trí đầu dưới từ cùng các snapshot, không dùng dữ liệu dựng riêng.
- Hoàn tất khi thời gian mô phỏng đạt thời lượng quan sát định trước, không phải chỉ khi chạy hay tạm dừng. Mặc định đề xuất 20 giây mô phỏng; thời lượng và giới hạn đầu vào sẽ được xác nhận trong kế hoạch sau khi kiểm tra tính ổn định.

## Trải nghiệm và tích hợp

- Thêm mục vào danh mục Vật lý, nhóm chủ đề phù hợp (đề xuất “Dao động và hỗn loạn”).
- Dùng React + TypeScript + PixiJS và cấu trúc thư mục riêng trong `src/experiments`; không thêm dependency nếu công cụ hiện có đáp ứng.
- Mọi cảnh PixiJS dùng `resizeExperimentScene` từ `src/experiments/shared/resizeScene.ts`.
- Màn hình mô phỏng chỉ cho chỉnh sai khác góc và góc ban đầu chung (nếu cần thêm thiết lập); không hiển thị số đo, đồ thị hay giải thích.
- Báo cáo dùng `SiteShell`; điều hướng quay lại giữ snapshot hoàn tất để mở lại báo cáo. Mở thẳng URL báo cáo khi thiếu snapshot phải hiện trạng thái chưa có kết quả và liên kết quay về thí nghiệm.
- Tôn trọng thao tác bàn phím/cảm ứng và thiết lập giảm chuyển động cho chuyển động giao diện; chuyển động khoa học chỉ chạy khi người học bấm chạy.

## Ràng buộc và tiêu chí chấp nhận

- Toàn bộ trạng thái, tích phân, lấy mẫu và phép đo nằm trong mô hình thuần; PixiJS không tự tính vật lý.
- Sai khác đầu vào bằng 0 cho hai quỹ đạo trùng nhau trong sai số số học; sai khác dương tạo hai hệ ban đầu gần nhau và có thể quan sát sự tách biệt trong cấu hình mặc định.
- Mô hình giữ trạng thái hữu hạn, không tăng năng lượng phi vật lý đáng kể trong khoảng quan sát đã chọn; các kiểm tra định lượng sẽ chốt trong kế hoạch.
- Hoàn tất chỉ xảy ra ở ngưỡng thời lượng; reset/đổi thiết lập ẩn nút báo cáo và xóa mẫu cũ.
- Trang mô phỏng toàn màn hình, trang báo cáo riêng, route trực tiếp không kết quả, quay lại giữ kết quả, và cảnh co giãn bằng helper dùng chung.
- Hoạt động trong catalogue và bố cục màn hình hẹp theo hệ thống hiện có.

## Để người triển khai quyết định

Chốt giới hạn chiều dài/khối lượng và góc, cách chuẩn hóa đồ thị độ lệch, hiệu ứng vệt quỹ đạo, bước tích phân và ngưỡng ổn định bằng kiểm tra mô hình. Mặc định ưu tiên cấu hình ban đầu dễ tạo sự phân kỳ trong 20 giây mà vẫn giữ năng lượng hữu hạn.
