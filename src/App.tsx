import { BrowserRouter, Link, Route, Routes } from "react-router";
import { SiteShell } from "./components/SiteShell";
import { Badge } from "./components/ui/Badge";
import { Eyebrow } from "./components/ui/Eyebrow";
import { CatalogPage } from "./catalog/CatalogPage";
import { GravityPage } from "./experiments/gravity/GravityPage";
import { GravityReportPage } from "./experiments/gravity/GravityReportPage";

function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div>
          <Eyebrow>
            <span className="status-dot" /> MỞ CỬA CHO SỰ TÒ MÒ
          </Eyebrow>
          <h1>
            Thử một chút.
            <br />
            Hiểu <em>nhiều hơn.</em>
          </h1>
          <p className="intro">
            Một phòng thí nghiệm nhỏ cho những câu hỏi lớn.
            <br />
            Khám phá khoa học bằng chính những lần thử của bạn.
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="art-ball" />
          <span className="art-label">QUAN SÁT → ĐẶT CÂU HỎI → KHÁM PHÁ</span>
          <span className="art-cross">+</span>
        </div>
      </section>
      <section className="fields-section" aria-labelledby="fields-title">
        <div className="section-heading">
          <h2 id="fields-title">Hôm nay, bạn tò mò về điều gì?</h2>
          <span>CHỌN MỘT LĨNH VỰC ↓</span>
        </div>
        <div className="field-grid">
          <Link className="field-card physics-card" to="/physics">
            <div className="card-top">
              <Eyebrow as="span">01 / VẬT LÝ</Eyebrow>
              <Badge>1 thí nghiệm</Badge>
            </div>
            <span className="field-symbol" aria-hidden="true">
              ↘
            </span>
            <h3>Vật lý</h3>
            <p>
              Từ một vật rơi đến những quy luật
              <br />
              chuyển động của thế giới.
            </p>
            <span className="card-bottom">
              Bắt đầu khám phá <span aria-hidden="true">↗</span>
            </span>
          </Link>
          <Link className="field-card chemistry-card" to="/chemistry">
            <div className="card-top">
              <Eyebrow as="span">02 / HÓA HỌC</Eyebrow>
              <Badge>Sắp có</Badge>
            </div>
            <span className="field-symbol chemistry-symbol" aria-hidden="true">
              ⚗
            </span>
            <h3>Hóa học</h3>
            <p>
              Gặp gỡ vật chất và những
              <br />
              biến đổi đầy bất ngờ.
            </p>
            <span className="card-bottom">
              Xem trước chủ đề <span aria-hidden="true">↗</span>
            </span>
          </Link>
        </div>
      </section>
      <p className="home-note">
        <span aria-hidden="true">✳</span> Không cần áo blouse. Chỉ cần một chút
        tò mò.
      </p>
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="page-section">
      <Eyebrow>404 / CHƯA TÌM THẤY</Eyebrow>
      <h1>Có lẽ bạn đã đi hơi xa.</h1>
      <p className="intro">
        Trang này không tồn tại. Một khám phá mới vẫn đang chờ ở phòng thí
        nghiệm.
      </p>
      <Link className="text-link" to="/">
        Về trang khám phá ↗
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/physics" element={<CatalogPage field="physics" />} />
          <Route
            path="/physics/gravity"
            element={<CatalogPage field="physics" topic="Trọng lực" />}
          />
          <Route path="/physics/gravity/free-fall" element={<GravityPage />} />
          <Route path="/physics/gravity/free-fall/report" element={<GravityReportPage />} />
          <Route
            path="/chemistry"
            element={<CatalogPage field="chemistry" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SiteShell>
    </BrowserRouter>
  );
}
