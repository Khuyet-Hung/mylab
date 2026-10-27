import { Link, useLocation } from "react-router";
import { Eyebrow } from "../../components/ui/Eyebrow";
import type { MirrorMazeReportState } from "./MirrorMazePage";

const SCALE = 100;

export function MirrorMazeReportPage() {
  const location = useLocation();
  const report = location.state as MirrorMazeReportState | null;
  if (!report?.completed || !report.setup?.source || !Array.isArray(report.result?.segments) || report.result.segments.length === 0) {
    return (
      <section className="page-section optics-report">
        <Link className="back-link" to="/physics/optics/mirror-maze">← Về thí nghiệm</Link>
        <Eyebrow>BÁO CÁO / CHƯA CÓ KẾT QUẢ</Eyebrow>
        <h1>Hãy chạy xong một đường tia trước.</h1>
        <p className="intro">Sắp đặt gương rồi bấm chạy. Khi tia kết thúc, báo cáo lần thử sẽ xuất hiện ở đây.</p>
      </section>
    );
  }

  const totalDistanceM = report.result.segments.reduce((total, segment) => total + segment.lengthM, 0);
  const screenReached = report.result.termination === "screen";
  return (
    <section className="page-section optics-report">
      <Link className="back-link" to="/physics/optics/mirror-maze" state={report}>← Quay lại thí nghiệm</Link>
      <Eyebrow>BÁO CÁO / MÊ CUNG GƯƠNG</Eyebrow>
      <h1>Đường đi của tia sáng</h1>
      <p className="intro">Nguồn sáng xuất phát từ ({report.setup.source.origin.x.toFixed(1)}; {report.setup.source.origin.y.toFixed(1)}) m, hướng {report.setup.source.angleDeg.toFixed(0)}°.</p>

      <section className="experiment-measurements" aria-labelledby="optics-result-title">
        <h2 id="optics-result-title">Kết quả lần thử</h2>
        <div className="optics-report__metrics">
          <div><span>SỐ LẦN PHẢN XẠ</span><strong>{report.result.bounces.length}</strong></div>
          <div><span>TỔNG ĐƯỜNG ĐI</span><strong>{totalDistanceM.toFixed(2)} m</strong></div>
          <div><span>ĐIỂM KẾT THÚC</span><strong>{screenReached ? "Màn hứng" : "Giới hạn phản xạ"}</strong></div>
        </div>
      </section>

      <section className="optics-report__diagram" aria-labelledby="optics-diagram-title">
        <h2 id="optics-diagram-title">Sơ đồ đường tia</h2>
        <svg viewBox="0 0 900 520" role="img" aria-label="Sơ đồ gương và đường đi của tia sáng trong lần thử">
          <rect x="3" y="3" width="894" height="514" rx="12" fill="var(--paper)" stroke="var(--ink)" strokeWidth="6" />
          {report.setup.mirrors.map((mirror) => (
            <g key={mirror.id}>
              <line x1={mirror.start.x * SCALE} y1={mirror.start.y * SCALE} x2={mirror.end.x * SCALE} y2={mirror.end.y * SCALE}
                stroke="var(--blue)" strokeWidth="13" strokeLinecap="round" />
              <text x={(mirror.start.x + mirror.end.x) * SCALE / 2 + 12} y={(mirror.start.y + mirror.end.y) * SCALE / 2 - 16}
                fill="var(--ink)" fontSize="20" fontWeight="bold">{mirror.id}</text>
            </g>
          ))}
          {report.result.segments.map((segment, index) => (
            <line key={index} x1={segment.start.x * SCALE} y1={segment.start.y * SCALE} x2={segment.end.x * SCALE} y2={segment.end.y * SCALE}
              stroke="var(--ink)" strokeWidth="12" strokeLinecap="round" />
          ))}
          {report.result.segments.map((segment, index) => (
            <line key={`beam-${index}`} x1={segment.start.x * SCALE} y1={segment.start.y * SCALE} x2={segment.end.x * SCALE} y2={segment.end.y * SCALE}
              stroke="var(--yellow)" strokeWidth="7" strokeLinecap="round" />
          ))}
          <circle cx={report.setup.source.origin.x * SCALE} cy={report.setup.source.origin.y * SCALE} r="20" fill="var(--coral)" stroke="var(--ink)" strokeWidth="4" />
          {report.result.bounces.map((bounce, index) => (
            <circle key={index} cx={bounce.point.x * SCALE} cy={bounce.point.y * SCALE} r="8" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="3" />
          ))}
        </svg>
        <p>Viền bàn là màn hứng cố định. Sơ đồ biểu diễn cùng tọa độ đã dùng để tính kết quả.</p>
      </section>

      <section className="experiment-measurements" aria-labelledby="optics-measurements-title">
        <h2 id="optics-measurements-title">Các điểm phản xạ</h2>
        {report.result.bounces.length === 0 ? (
          <p>Tia đi thẳng tới màn hứng mà không chạm gương nào.</p>
        ) : (
          <table>
            <caption>Góc đo so với đường vuông góc với mặt gương.</caption>
            <thead><tr><th scope="col">Lần</th><th scope="col">Gương</th><th scope="col">Góc tới</th><th scope="col">Góc phản xạ</th><th scope="col">Đoạn trước gương</th></tr></thead>
            <tbody>
              {report.result.bounces.map((bounce, index) => (
                <tr key={`${bounce.mirrorId}-${index}`}>
                  <th scope="row">{index + 1}</th>
                  <td>{bounce.mirrorId}</td>
                  <td>{bounce.incidenceAngleDeg.toFixed(1)}°</td>
                  <td>{bounce.reflectionAngleDeg.toFixed(1)}°</td>
                  <td>{report.result.segments[index].lengthM.toFixed(2)} m</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {screenReached && <p>Đoạn cuối tới màn hứng: {report.result.segments.at(-1)!.lengthM.toFixed(2)} m.</p>}
      </section>

      <section className="experiment-explanation">
        <h2>Điều quan sát được</h2>
        <p>Mỗi khi tia gặp gương phẳng, góc tới và góc phản xạ bằng nhau khi cùng đo từ đường vuông góc với mặt gương. Xoay một gương sẽ đổi hướng toàn bộ những đoạn tia phía sau nó.</p>
        <p>{screenReached
          ? "Tia đã tới màn hứng quanh bàn thí nghiệm."
          : "Tia dừng ở giới hạn 12 lần phản xạ của mô hình; đường đi sau điểm này chưa được tính."} Mô hình dùng tia hình học 2D và gương phẳng lý tưởng; bỏ qua độ rộng chùm sáng, hấp thụ và tán xạ.</p>
      </section>
    </section>
  );
}
