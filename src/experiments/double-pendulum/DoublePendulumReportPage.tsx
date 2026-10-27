import { useId } from "react";
import { Link, useLocation } from "react-router";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { getTrialById, TRIAL_DURATION_S, type DoublePendulumReportState } from "./trialStore";

function SeparationPlot({ report, yMax, descriptionId, compact }: {
  report: DoublePendulumReportState;
  yMax: number;
  descriptionId: string;
  compact: boolean;
}) {
  const left = compact ? 42 : 58;
  const top = 20;
  const width = compact ? 248 : 600;
  const height = compact ? 180 : 220;
  const viewHeight = compact ? 250 : 290;
  const x = (timeS: number) => left + timeS / TRIAL_DURATION_S * width;
  const y = (separationM: number) => top + height - separationM / yMax * height;
  const points = report.samples.map((sample) => `${x(sample.timeS).toFixed(1)},${y(sample.separationM).toFixed(1)}`).join(" ");
  return (
      <svg
        className={compact ? "double-pendulum-chart__mobile" : "double-pendulum-chart__desktop"}
        viewBox={`0 0 ${compact ? 320 : 710} ${viewHeight}`}
        role="img"
        aria-label="Đồ thị khoảng cách giữa hai vật ở đầu dưới theo thời gian"
        aria-describedby={descriptionId}
      >
        {(compact ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]).map((fraction) => (
          <g key={fraction}>
            <path d={`M${left} ${y(fraction * yMax)}H${left + width}`} stroke="var(--ink)" strokeOpacity=".12" strokeDasharray="4 4" />
            <text x={left - 9} y={y(fraction * yMax) + 4} textAnchor="end">{(fraction * yMax).toFixed(1)}</text>
          </g>
        ))}
        {[0, 5, 10, 15, 20].map((timeS) => (
          <text key={timeS} x={x(timeS)} y={top + height + 19} textAnchor="middle">{timeS}</text>
        ))}
        <path d={`M${left} ${top}V${top + height}H${left + width}`} fill="none" stroke="var(--ink)" strokeWidth="2" />
        <polyline points={points} fill="none" stroke="var(--blue-ink)" strokeWidth="3" strokeLinejoin="round" />
        <circle cx={x(TRIAL_DURATION_S)} cy={y(report.finalSeparationM)} r="6" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" />
        <text x={left + width / 2} y={viewHeight - 6} textAnchor="middle">Thời gian mô phỏng (s)</text>
        <text transform={`translate(${compact ? 10 : 14} ${top + height / 2}) rotate(-90)`} textAnchor="middle">Khoảng cách (m)</text>
      </svg>
  );
}

function SeparationChart({ report }: { report: DoublePendulumReportState }) {
  const descriptionId = useId();
  const maxSeparation = Math.max(0.5, ...report.samples.map((sample) => sample.separationM));
  const yMax = Math.ceil(maxSeparation * 1.1 * 2) / 2;
  return (
    <section className="double-pendulum-chart" aria-labelledby={`${descriptionId}-title`}>
      <h2 id={`${descriptionId}-title`}>Hai vật ở đầu dưới cách nhau thế nào?</h2>
      <SeparationPlot report={report} yMax={yMax} descriptionId={descriptionId} compact={false} />
      <SeparationPlot report={report} yMax={yMax} descriptionId={descriptionId} compact />
      <p id={descriptionId}>Khoảng cách giữa hai vật ở đầu dưới được lấy từ vị trí của A và B sau mỗi 1/30 giây mô phỏng. Lúc bắt đầu: {report.samples[0].separationM.toFixed(3)} m; sau 20 giây: {report.finalSeparationM.toFixed(3)} m.</p>
    </section>
  );
}

export function DoublePendulumReportPage() {
  const location = useLocation();
  const navigationState = location.state as { trialId?: string } | null;
  const report = getTrialById(navigationState?.trialId);
  if (
    report?.completed !== true ||
    !Array.isArray(report.samples) ||
    report.samples.length < 2 ||
    !Number.isFinite(report.finalSeparationM)
  ) {
    return (
      <section className="page-section double-pendulum-report">
        <Link className="back-link" to="/physics/oscillations/double-pendulum">← Về thí nghiệm</Link>
        <Eyebrow>BÁO CÁO / CHƯA CÓ KẾT QUẢ</Eyebrow>
        <h1>Hãy hoàn tất lần quan sát trước.</h1>
        <p className="intro">Báo cáo xuất hiện sau 20 giây mô phỏng con lắc kép.</p>
      </section>
    );
  }

  const { settings } = report;
  const noOffset = settings.initialOffsetDeg === 0;
  return (
    <section className="page-section double-pendulum-report">
      <Link className="back-link" to="/physics/oscillations/double-pendulum" state={{ trialId: report.id }}>← Quay lại thí nghiệm</Link>
      <Eyebrow>BÁO CÁO / CON LẮC KÉP</Eyebrow>
      <h1>Một chút khác biệt, hai hành trình</h1>
      <p className="intro">Hai hệ chỉ khác góc khớp trên lúc thả {settings.initialOffsetDeg.toFixed(1)}°. Cả hai được quan sát trong {TRIAL_DURATION_S} giây mô phỏng.</p>

      <section className="experiment-measurements" aria-labelledby="double-pendulum-observations">
        <h2 id="double-pendulum-observations">Kết quả lần thử</h2>
        <div className="measurement-tiles">
          <div className="measurement-tile"><span>Sai khác góc ban đầu</span><strong>{settings.initialOffsetDeg.toFixed(1)}°</strong></div>
          <div className="measurement-tile"><span>Khoảng cách cuối giữa hai vật dưới</span><strong>{report.finalSeparationM.toFixed(2)} m</strong></div>
        </div>
        <table>
          <caption>Hai hệ có cùng chiều dài và khối lượng; trọng lực g = 9,8 m/s².</caption>
          <thead><tr><th scope="col">Hệ</th><th scope="col">Góc khớp trên ban đầu</th><th scope="col">Góc khớp dưới ban đầu</th></tr></thead>
          <tbody>
            <tr><th scope="row">A</th><td>{settings.initialUpperAngleDeg.toFixed(1)}°</td><td>{settings.initialLowerAngleDeg.toFixed(1)}°</td></tr>
            <tr><th scope="row">B</th><td>{(settings.initialUpperAngleDeg + settings.initialOffsetDeg).toFixed(1)}°</td><td>{settings.initialLowerAngleDeg.toFixed(1)}°</td></tr>
          </tbody>
        </table>
        <p>Thanh trên {settings.upperLengthM.toFixed(1)} m, thanh dưới {settings.lowerLengthM.toFixed(1)} m; vật trên {settings.upperMassKg.toFixed(1)} kg, vật dưới {settings.lowerMassKg.toFixed(1)} kg.</p>
      </section>

      <SeparationChart report={report} />
      <section className="experiment-explanation">
        <h2>Điều quan sát được</h2>
        <p>{noOffset
          ? "Khi hai hệ bắt đầu hoàn toàn giống nhau, phương trình xác định cho chúng cùng một quỹ đạo."
          : "Hai hệ tuân theo cùng một phương trình, nhưng một sai khác nhỏ lúc bắt đầu có thể tăng lên mạnh khi chuyển động tiếp diễn. Đó là độ nhạy với điều kiện ban đầu của hệ hỗn loạn."}</p>
        <p>Khoảng cách trên đồ thị là khoảng cách tức thời giữa hai vật dưới. Nó có thể tăng rồi giảm khi hai quỹ đạo lại đến gần nhau; một điểm giảm không có nghĩa là chuyển động đã trở nên giống hệt.</p>
        <p>Mô hình dùng vật điểm, thanh nhẹ và cứng, trọng lực đều; bỏ qua ma sát và lực cản. Đường tính bằng tích phân số với bước thời gian hữu hạn, nên kết quả sau thời gian dài chỉ minh họa xu hướng trong mô hình này.</p>
      </section>
    </section>
  );
}
