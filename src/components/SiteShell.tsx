import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";

export function SiteShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isExperimentPage = pathname === "/physics/gravity/free-fall" || pathname === "/physics/pendulum/simple" || pathname === "/physics/optics/mirror-maze";
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      main.current?.focus();
      window.scrollTo(0, 0);
      previousPath.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (isExperimentPage) return;
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      const previewReduced =
        import.meta.env.DEV &&
        new URLSearchParams(window.location.search).get("reduce") === "1";
      media.add(
        {
          normal: previewReduced
            ? "not all"
            : "(prefers-reduced-motion: no-preference)",
          reduced: previewReduced ? "all" : "(prefers-reduced-motion: reduce)",
        },
        (match) => {
          const reduced = match.conditions?.reduced;
          const targets =
            pathname === "/"
              ? ".home-hero > div, .section-heading, .field-card"
              : ".back-link, .page-section > .eyebrow, .page-section > h1, .page-section > .intro";
          gsap.timeline().from(targets, {
            y: reduced ? 0 : 12,
            opacity: reduced ? 0.7 : 0,
            duration: reduced ? 0.15 : 0.42,
            stagger: reduced ? 0 : 0.06,
            ease: "power2.out",
            clearProps: "transform,opacity",
          });
        },
      );
      return () => media.revert();
    }, main);
    return () => context.revert();
  }, [pathname]);

  return (
    <div className={isExperimentPage ? "site-shell site-shell--experiment" : "site-shell"}>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <header className="site-header">
        <Link
          to="/"
          className="brand"
          aria-label="Phòng thí nghiệm — Trang chủ"
        >
          <span className="brand-symbol" aria-hidden="true">
            ✳
          </span>
          <span>
            phòng thí nghiệm<span className="brand-caption">KHOA HỌC / 2D</span>
          </span>
        </Link>
        <nav aria-label="Điều hướng chính">
          <NavLink to="/" end>
            Khám phá
          </NavLink>
          <NavLink to="/physics">Vật lý</NavLink>
          <NavLink to="/chemistry">
            Hóa học <span className="nav-dot" aria-hidden="true" />
          </NavLink>
        </nav>
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <span>Một câu hỏi nhỏ. Một khám phá mới.</span>
        <span>Khoa học dành cho mọi người ↗</span>
      </footer>
    </div>
  );
}
