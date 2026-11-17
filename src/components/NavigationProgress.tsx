"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/** 이보다 빨리 끝나는 이동은 바를 아예 보이지 않는다 (깜빡임 방지) */
const SHOW_DELAY_MS = 120;
/** 끝까지 채운 뒤 사라지기까지 */
const FINISH_MS = 260;

/**
 * 페이지 이동 진행 바 — 서버 렌더링이 느린 이동(TMDB 상세 등)에서 눌렸다는 피드백을 준다.
 * 같은 출처 링크 클릭에서 시작해 pathname이 바뀌면 끝낸다.
 * View Transition으로 이동하는 MediaLink([data-media-link])는 전환 중 화면이 멈춰 바가 보이지 않으므로 제외.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const active = useRef(false);
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const trickle = useRef<ReturnType<typeof setInterval>>();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const clearTimers = () => {
    clearTimeout(showTimer.current);
    clearInterval(trickle.current);
    clearTimeout(hideTimer.current);
  };

  const start = useCallback(() => {
    clearTimers();
    active.current = true;
    setProgress(0);
    showTimer.current = setTimeout(() => {
      setVisible(true);
      setProgress(0.12);
      // 90%까지 점점 느려지며 차오름
      trickle.current = setInterval(() => {
        setProgress((p) => p + (0.9 - p) * 0.08);
      }, 200);
    }, SHOW_DELAY_MS);
  }, []);

  // 새 경로가 반영되면 마무리
  useEffect(() => {
    if (!active.current) return;
    active.current = false;
    clearTimers();
    if (!visible) {
      setProgress(0);
      return;
    }
    setProgress(1);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, FINISH_MS);
    // visible은 의도적으로 제외 — 경로 변경 시점의 값만 본다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (
        anchor.hasAttribute("data-media-link") &&
        typeof document.startViewTransition === "function"
      ) {
        return;
      }
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // 같은 페이지(해시만 다름 포함)는 이동이 없으므로 제외
      if (url.pathname === window.location.pathname) return;
      start();
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, [start]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms var(--ease-standard)" }}
    >
      <div
        className="h-full origin-left bg-primary"
        style={{
          transform: `scaleX(${progress})`,
          transition: "transform 200ms var(--ease-standard)",
        }}
      />
    </div>
  );
}
