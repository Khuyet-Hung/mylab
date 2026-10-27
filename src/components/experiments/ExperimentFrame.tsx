import type { ReactNode } from "react";
import { Link } from "react-router";

type ExperimentFrameProps = {
  ariaLabel: string;
  canvas: ReactNode;
  settings: ReactNode;
  isRunning: boolean;
  hasRun: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  reportLink: ReactNode;
  exitTo: string;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 5 11 7-11 7z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h4v14H7zm6 0h4v14h-4z" fill="currentColor" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 11a8 8 0 1 1 2.3 6M4 5v6h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExperimentFrame({
  ariaLabel,
  canvas,
  settings,
  isRunning,
  hasRun,
  onStart,
  onPause,
  onReset,
  reportLink,
  exitTo,
}: ExperimentFrameProps) {
  return (
    <section className="experiment-frame" aria-label={ariaLabel}>
      <div className="experiment-frame__canvas">{canvas}</div>
      <aside className="experiment-frame__controls" aria-label="Điều khiển thí nghiệm">
        <div
          className="experiment-frame__toolbar"
          role="toolbar"
          aria-label="Điều khiển thí nghiệm"
        >
          <button
            type="button"
            className="experiment-icon-button"
            aria-label="Bắt đầu thí nghiệm"
            title="Bắt đầu"
            disabled={isRunning}
            onClick={onStart}
          >
            <PlayIcon />
          </button>
          <button
            type="button"
            className="experiment-icon-button"
            aria-label="Tạm dừng thí nghiệm"
            title="Tạm dừng"
            disabled={!isRunning}
            onClick={onPause}
          >
            <PauseIcon />
          </button>
          <button
            type="button"
            className="experiment-icon-button"
            aria-label="Đặt lại thí nghiệm"
            title="Đặt lại"
            onClick={onReset}
          >
            <ResetIcon />
          </button>
          {hasRun && <div className="experiment-frame__report">{reportLink}</div>}
        </div>
        <details className="experiment-frame__settings">
          <summary aria-label="Thiết lập thí nghiệm" title="Thiết lập">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 7h9m4 0h3M4 17h3m4 0h9M13 4v6M9 14v6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </summary>
          <div className="experiment-frame__settings-panel">{settings}</div>
        </details>
        <Link
          className="experiment-frame__exit"
          to={exitTo}
          aria-label="Thoát về danh sách thí nghiệm"
          title="Thoát về danh sách"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M19 12H5m0 0 6-6m-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </aside>
    </section>
  );
}
