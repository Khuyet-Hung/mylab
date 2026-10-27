import { useId } from "react";
import { fallTimeS, sampleGravity, type GravityInput } from "./model";

export function HeightGraph({
  input,
  currentTimeS,
}: {
  input: GravityInput;
  currentTimeS: number;
}) {
  const descriptionId = useId();
  const duration = fallTimeS(input);
  const current = sampleGravity(input, currentTimeS);
  const points = Array.from({ length: 41 }, (_, i) => {
    const snapshot = sampleGravity(input, (i / 40) * duration);
    return `${(i / 40) * 320},${160 - (snapshot.heightM / input.heightM) * 160}`;
  }).join(" ");
  return (
    <section
      className="height-graph"
      aria-labelledby={`${descriptionId}-title`}
    >
      <h2 id={`${descriptionId}-title`}>Độ cao theo thời gian</h2>
      <svg
        viewBox="0 0 390 220"
        role="img"
        aria-label="Đồ thị độ cao của hai vật"
        aria-describedby={descriptionId}
        style={{ width: "100%", maxWidth: 620 }}
      >
        <g transform="translate(45 20)">
          <path
            d="M0 0V160H320"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          {[0.25, 0.5, 0.75].map((fraction) => (
            <g key={fraction}>
              <line
                x1={fraction * 320}
                x2={fraction * 320}
                y1="0"
                y2="160"
                stroke="var(--ink)"
                strokeOpacity="0.15"
              />
              <circle
                cx={fraction * 320}
                cy={160 * fraction * fraction}
                r="4"
                fill="var(--paper)"
                stroke="var(--blue-ink)"
                strokeWidth="2"
              />
              <text
                x={fraction * 320}
                y="200"
                textAnchor="middle"
                fontSize="10"
              >
                {(fraction * duration).toFixed(2)} s
              </text>
            </g>
          ))}
          <polyline
            points={points}
            fill="none"
            stroke="var(--blue-ink)"
            strokeWidth="5"
          />
          <line
            x1={(current.timeS / duration) * 320}
            x2={(current.timeS / duration) * 320}
            y1="0"
            y2="160"
            stroke="var(--ink)"
            strokeDasharray="4 4"
          />
          <circle
            cx={(current.timeS / duration) * 320}
            cy={160 - (current.heightM / input.heightM) * 160}
            r="6"
            fill="var(--coral)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <text x="-8" y="4" textAnchor="end" fontSize="12">
            {input.heightM} m
          </text>
          <text x="-8" y="164" textAnchor="end" fontSize="12">
            0 m
          </text>
          <text x="0" y="182" fontSize="12">
            0 s
          </text>
          <text x="320" y="182" textAnchor="end" fontSize="12">
            {duration.toFixed(2)} s
          </text>
        </g>
      </svg>
      <p id={descriptionId}>
        Hai vật dùng chung một đường cong: khối lượng không làm thay đổi độ cao
        theo thời gian khi bỏ qua lực cản không khí. Ở{" "}
        {current.timeS.toFixed(2)} s, cả hai cao {current.heightM.toFixed(2)} m.
      </p>
    </section>
  );
}
