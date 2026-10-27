import { Link } from "react-router";
import { experiments } from "./experiments";
import type { ExperimentCard } from "./experiments";
import { Badge } from "../components/ui/Badge";
import { Eyebrow } from "../components/ui/Eyebrow";

export function CatalogPage({
  field,
  topic,
}: {
  field: ExperimentCard["field"];
  topic?: string;
}) {
  if (field === "chemistry") {
    const preview = experiments.find(
      (experiment) => experiment.field === "chemistry",
    );
    return (
      <section className="page-section">
        <Link className="back-link" to="/">
          ← Tất cả lĩnh vực
        </Link>
        <Eyebrow>
          02 / HÓA HỌC <Badge>Sắp có</Badge>
        </Eyebrow>
        <h1>
          Những thay đổi nhỏ.
          <br />
          Thế giới khác biệt.
        </h1>
        <p className="intro">
          {preview?.question} Chúng mình đang chuẩn bị những thí nghiệm để bạn
          khám phá câu trả lời.
        </p>
        <div className="preview-panel">
          <h2>Một góc nhìn trước</h2>
          <p>
            Các chủ đề dự kiến: trạng thái của vật chất, dung dịch và sự biến
            đổi màu sắc.
          </p>
          <p>
            Thí nghiệm Hóa học chưa mở trong phiên bản này. Trong lúc chờ đợi,
            hãy bắt đầu với trọng lực.
          </p>
          <Link className="text-link" to="/physics/gravity">
            Khám phá Vật lý <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    );
  }

  const available = experiments.filter(
    (experiment) =>
      experiment.field === field &&
      experiment.status === "available" &&
      (!topic || experiment.topic === topic),
  );
  const topicCopy: Record<string, { title: string; intro: string }> = {
    "Trọng lực": {
      title: "Điều gì kéo mọi thứ xuống?",
      intro: "Cùng quan sát chuyển động quen thuộc và tìm lời giải cho một câu hỏi tưởng chừng đơn giản.",
    },
    "Dao động": {
      title: "Điều gì quyết định nhịp dao động?",
      intro: "Thay đổi độ dài dây và cùng tìm ra vì sao nhịp con lắc thay đổi.",
    },
    "Quang học": {
      title: "Ánh sáng sẽ đi về đâu?",
      intro: "Tự đặt và xoay gương để khám phá cách một tia sáng đổi hướng sau mỗi lần phản xạ.",
    },
  };
  return (
    <section className="page-section">
      <Link className="back-link" to={topic ? "/physics" : "/"}>
        ← {topic ? "Vật lý" : "Tất cả lĩnh vực"}
      </Link>
      <Eyebrow>01 / VẬT LÝ{topic ? ` / ${topic.toUpperCase()}` : ""}</Eyebrow>
      <h1>
        {topic ? topicCopy[topic]?.title ?? topic : "Hiểu những quy luật\nqua từng lần thử."}
      </h1>
      <p className="intro">
        {topic ? topicCopy[topic]?.intro ?? "Tự mình khám phá hiện tượng này." : "Bắt đầu từ một hiện tượng quen thuộc. Đặt câu hỏi và tự mình khám phá."}
      </p>
      <div className="catalog-grid">
        {topic ? (
          available.map((experiment, index) => (
            <Link
              className="catalog-card"
              key={experiment.id}
              to={experiment.href}
            >
              <Eyebrow as="span">THÍ NGHIỆM / {String(index + 1).padStart(2, "0")}</Eyebrow>
              {experiment.id === "simple-pendulum" ? (
                <div className="pendulum-illustration" aria-hidden="true"><span /><span /></div>
              ) : experiment.id === "mirror-maze" ? (
                <div className="optics-illustration" aria-hidden="true"><span /><span /></div>
              ) : (
                <div className="fall-illustration" aria-hidden="true"><span /><span /></div>
              )}
              <h2>{experiment.title}</h2>
              <p>{experiment.question}</p>
              <span className="text-link">Mở thí nghiệm ↗</span>
            </Link>
          ))
        ) : (
          <>
            <Link className="catalog-card" to="/physics/gravity">
              <Eyebrow as="span">CHỦ ĐỀ / 01</Eyebrow>
              <div className="fall-illustration" aria-hidden="true"><span /><span /></div>
              <h2>Trọng lực</h2>
              <p>Vì sao mọi vật rơi xuống? Khám phá chuyển động dưới tác dụng của trọng lực.</p>
              <span className="text-link">{experiments.filter((experiment) => experiment.topic === "Trọng lực" && experiment.status === "available").length} thí nghiệm ↗</span>
            </Link>
            <Link className="catalog-card" to="/physics/pendulum">
              <Eyebrow as="span">CHỦ ĐỀ / 02</Eyebrow>
              <div className="pendulum-illustration" aria-hidden="true"><span /><span /></div>
              <h2>Dao động</h2>
              <p>Điều gì làm thay đổi nhịp con lắc? Quan sát và so sánh chu kỳ giữa hai độ dài dây.</p>
              <span className="text-link">{experiments.filter((experiment) => experiment.topic === "Dao động" && experiment.status === "available").length} thí nghiệm ↗</span>
            </Link>
            <Link className="catalog-card" to="/physics/optics">
              <Eyebrow as="span">CHỦ ĐỀ / 03</Eyebrow>
              <div className="optics-illustration" aria-hidden="true"><span /><span /></div>
              <h2>Quang học</h2>
              <p>Tia sáng đổi hướng ra sao khi gặp gương? Tự sắp đặt đường đi và quan sát kết quả.</p>
              <span className="text-link">{experiments.filter((experiment) => experiment.topic === "Quang học" && experiment.status === "available").length} thí nghiệm ↗</span>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
