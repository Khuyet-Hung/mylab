import { useId } from "react";
import { Link, useLocation } from "react-router";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { smallAnglePeriodS } from "./model";
import type { PendulumReportState } from "./PendulumPage";

function PeriodChart({ report }: { report: PendulumReportState }) {
  const descriptionId = useId();
  const left = 48;
  const top = 15;
  const width = 386;
  const height = 174;
  const x = (lengthM: number) => left + ((lengthM - 0.5) / 2.5) * width;
  const y = (periodS: number) => top + height - (periodS / 4.5) * height;
  const curve = Array.from({ length: 51 }, (_, index) => {
    const lengthM = 0.5 + (index / 50) * 2.5;
    return `${x(lengthM).toFixed(1)},${y(smallAnglePeriodS(lengthM)).toFixed(1)}`;
  }).join(" ");
  const points = [
    { label: "A", lengthM: report.settings.leftLengthM, periodS: report.readout.leftPeriodS!, color: "var(--coral)" },
    { label: "B", lengthM: report.settings.rightLengthM, periodS: report.readout.rightPeriodS!, color: "var(--blue)" },
  ];

  return (
    <section className="pendulum-report-chart" aria-labelledby={`${descriptionId}-title`}>
      <h2 id={`${descriptionId}-title`}>Chu kỳ theo độ dài dây</h2>
      <svg viewBox="0 0 460 235" role="img" aria-label="Đồ thị chu kỳ theo độ dài dây" aria-describedby={descriptionId}>
        <path d={`M${left} ${top}V${top + height}H${left + width}`} fill="none" stroke="var(--ink)" strokeWidth="2" />
        {[1, 2, 3, 4].map((periodS) => (
          <g key={periodS}>
            <path d={`M${left} ${y(periodS)}H${left + width}`} stroke="var(--ink)" strokeOpacity=".14" strokeDasharray="4 4" />
            <text x={left - 8} y={y(periodS) + 4} textAnchor="end">{periodS}</text>
          </g>
        ))}
        {[0.5, 1, 1.5, 2, 2.5, 3].map((lengthM) => (
          <text key={lengthM} x={x(lengthM)} y={top + height + 18} textAnchor="middle">{lengthM}</text>
        ))}
        <polyline points={curve} fill="none" stroke="var(--blue-ink)" strokeWidth="3" strokeDasharray="6 4" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={x(point.lengthM)} cy={y(point.periodS)} r="8" fill={point.color} stroke="var(--ink)" strokeWidth="2" />
            <text x={x(point.lengthM)} y={y(point.periodS) - 13} textAnchor="middle" className="pendulum-report-chart__point-label">{point.label}</text>
          </g>
        ))}
        <text x={left + width / 2} y="228" textAnchor="middle">Độ dài dây (m)</text>
        <text transform="translate(12 108) rotate(-90)" textAnchor="middle">Chu kỳ (s)</text>
      </svg>
      <p id={descriptionId}>Đường đứt là dự đoán góc nhỏ T₀ = 2π√(L/g). Điểm A và B là chu kỳ đo được khi cả hai bắt đầu ở góc {report.settings.initialAngleDeg}°.</p>
    </section>
  );
}

export function PendulumReportPage() {
  const location = useLocation();
  const report = location.state as PendulumReportState | null;
  if (
    !report?.completed ||
    report.readout?.leftPeriodS == null ||
    report.readout?.rightPeriodS == null
  ) {
    return (
      <section className="page-section pendulum-report">
        <Link className="back-link" to="/physics/pendulum/simple">← Về thí nghiệm</Link>
        <Eyebrow>BÁO CÁO / CHƯA CÓ KẾT QUẢ</Eyebrow>
        <h1>Hãy hoàn thành phép đo trước.</h1>
        <p className="intro">Báo cáo xuất hiện khi cả hai con lắc đã đo xong một chu kỳ.</p>
      </section>
    );
  }

  const { settings, readout } = report;
  const leftPeriodS = readout.leftPeriodS!;
  const rightPeriodS = readout.rightPeriodS!;
  const longerIsA = settings.leftLengthM > settings.rightLengthM;
  const equalLength = settings.leftLengthM === settings.rightLengthM;
  return (
    <section className="page-section pendulum-report">
      <Link className="back-link" to="/physics/pendulum/simple" state={report}>← Quay lại thí nghiệm</Link>
      <Eyebrow>BÁO CÁO / CON LẮC ĐƠN</Eyebrow>
      <h1>Độ dài dây và chu kỳ</h1>
      <p className="intro">Hai con lắc bắt đầu ở cùng góc {settings.initialAngleDeg}°. Thí nghiệm tự dừng sau khi đo đủ một chu kỳ cho cả hai.</p>
      <section className="experiment-measurements" aria-labelledby="pendulum-observations">
        <h2 id="pendulum-observations">Kết quả lần thử</h2>
        <table>
          <caption>Góc ban đầu chung: {settings.initialAngleDeg}°. Gia tốc trọng trường: 9,8 m/s².</caption>
          <thead>
            <tr><th scope="col">Con lắc</th><th scope="col">Độ dài dây</th><th scope="col">Chu kỳ đo</th><th scope="col">Xấp xỉ góc nhỏ</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">A</th><td>{settings.leftLengthM.toFixed(1)} m</td><td>{leftPeriodS.toFixed(2)} s</td><td>{smallAnglePeriodS(settings.leftLengthM).toFixed(2)} s</td></tr>
            <tr><th scope="row">B</th><td>{settings.rightLengthM.toFixed(1)} m</td><td>{rightPeriodS.toFixed(2)} s</td><td>{smallAnglePeriodS(settings.rightLengthM).toFixed(2)} s</td></tr>
          </tbody>
        </table>
      </section>
      <PeriodChart report={report} />
      <section className="experiment-explanation">
        <h2>Điều quan sát được</h2>
        <p>
          {equalLength
            ? "Hai dây bằng nhau và cùng góc ban đầu nên hai con lắc có cùng chu kỳ trong mô hình này."
            : `Con lắc ${longerIsA ? "A" : "B"} có dây dài hơn và chu kỳ đo lớn hơn: nó dao động chậm hơn.`}
          {" "}Công thức T₀ = 2π√(L/g) là xấp xỉ cho góc nhỏ. Ở góc lớn, mô phỏng dùng phương trình đầy đủ nên chu kỳ có thể cao hơn đường dự đoán.
        </p>
        <p>Giả định: vật treo là vật điểm, dây nhẹ và không giãn, trọng trường đều; bỏ qua lực cản không khí và ma sát.</p>
      </section>
    </section>
  );
}
