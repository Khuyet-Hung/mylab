import { Link, useLocation } from "react-router";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { HeightGraph } from "./HeightGraph";
import { fallTimeS, type GravitySnapshot } from "./model";

type Inputs = { heightM: number; leftMassKg: number; rightMassKg: number };
type ReportState = { inputs: Inputs; display: { left: GravitySnapshot; right: GravitySnapshot }; completed: true };

export function GravityReportPage() {
  const location = useLocation();
  const report = location.state as ReportState | null;
  if (!report?.completed || !report.display?.left?.landed || !report.display?.right?.landed) {
    return (
      <section className="page-section gravity-report">
        <Link className="back-link" to="/physics/gravity/free-fall">← Về thí nghiệm</Link>
        <Eyebrow>BÁO CÁO / CHƯA CÓ KẾT QUẢ</Eyebrow>
        <h1>Hãy hoàn thành lần thả trước.</h1>
        <p className="intro">Báo cáo sẽ xuất hiện sau khi cả hai vật chạm đất.</p>
      </section>
    );
  }
  const { inputs, display } = report;
  const graphInput = {
    heightM: inputs.heightM,
    massKg: inputs.leftMassKg,
    gravityMps2: 9.8,
  };

  return (
    <section className="page-section gravity-report">
      <Link className="back-link" to="/physics/gravity/free-fall" state={report}>
        ← Quay lại thí nghiệm
      </Link>
      <Eyebrow>BÁO CÁO / BẢN NHÁP</Eyebrow>
      <h1>Hai vật rơi tự do</h1>
      <p className="intro">
        Ghi nhận lần thả với độ cao {inputs.heightM.toFixed(1)} m, vật A nặng {inputs.leftMassKg.toFixed(1)} kg và vật B nặng {inputs.rightMassKg.toFixed(1)} kg.
      </p>
      <section className="experiment-measurements" aria-labelledby="report-observations">
        <h2 id="report-observations">Quan sát lần thử</h2>
        <div className="measurement-tiles">
          <div className="measurement-tile">
            <span>THỜI GIAN ĐÃ TRÔI</span>
            <strong>{display.left.timeS.toFixed(2)} <small>s</small></strong>
          </div>
          <div className="measurement-tile">
            <span>THỜI GIAN CHẠM ĐẤT DỰ KIẾN</span>
            <strong>{fallTimeS(graphInput).toFixed(2)} <small>s</small></strong>
          </div>
        </div>
        <table>
          <caption>Vận tốc hướng xuống; số liệu dừng tại lần chạm đất đầu tiên.</caption>
          <thead>
            <tr><th scope="col">Vật</th><th scope="col">Độ cao</th><th scope="col">Quãng đường rơi</th><th scope="col">Vận tốc</th></tr>
          </thead>
          <tbody>
            {([ ["A", display.left], ["B", display.right] ] as const).map(([name, snapshot]) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td>{snapshot.heightM.toFixed(2)} m</td>
                <td>{snapshot.distanceM.toFixed(2)} m</td>
                <td>{snapshot.velocityMps.toFixed(2)} m/s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <HeightGraph input={graphInput} currentTimeS={display.left.timeS} />
      <section className="experiment-explanation">
        <h2>Khác khối lượng, cùng thời gian rơi</h2>
        <p>
          Trong mô hình này, hai vật cùng chịu một gia tốc trọng trường. Khi thả từ cùng độ cao và bỏ qua lực cản không khí, chúng luôn ở cùng độ cao và chạm đất cùng lúc. Ngoài đời, hình dạng và lực cản không khí có thể làm kết quả khác đi.
        </p>
        <p>
          Giả định: trọng trường đều, g = 9.8 m/s², vận tốc ban đầu bằng 0, không có lực cản không khí. <a href="https://openstax.org/books/college-physics-2e/pages/2-7-falling-objects">Tìm hiểu về vật rơi tự do — OpenStax</a>.
        </p>
        <details>
          <summary>Xem công thức</summary>
          <p>Quãng đường rơi: d = ½gt². Độ cao: h = h₀ − ½gt². Vận tốc hướng xuống: v = gt. Thời gian chạm đất: t = √(2h₀/g).</p>
          <p>h₀ và d tính bằng m; t bằng s; v bằng m/s. Khối lượng không xuất hiện trong các công thức này.</p>
        </details>
      </section>
    </section>
  );
}
