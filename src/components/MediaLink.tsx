"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, type ComponentProps, type MouseEvent } from "react";

/**
 * 포스터 → 상세 공유 요소 전환 (View Transitions API).
 *
 * 1. 클릭한 링크 안의 `[data-vt-source]`(없으면 링크 자신)에 `view-transition-name: media-hero`를 붙이고
 * 2. `document.startViewTransition` 안에서 router.push 한 뒤
 * 3. 새 경로가 커밋되는 순간(`ViewTransitionRouteWatcher`의 layout effect) 전환을 마무리한다.
 * 상세 페이지의 `.vt-media-hero`가 같은 이름을 가져 두 요소가 이어진다.
 *
 * 미지원 브라우저·움직임 줄이기·새 탭 클릭은 일반 Link 동작 그대로.
 */

const NAME = "media-hero";
/** 도착 이미지 디코딩을 기다리는 최대 시간 — 그동안 이전 화면이 멈춰 보이므로 짧게 */
const IMAGE_WAIT_MS = 600;

let finishPending: (() => void) | null = null;

/** 루트 레이아웃에 한 번 마운트 — 경로가 바뀌어 새 화면이 DOM에 반영되면 전환을 끝낸다 */
export function ViewTransitionRouteWatcher() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const finish = finishPending;
    if (!finish) return;
    finishPending = null;

    // 도착 이미지가 아직 없으면 톤 배경으로 전환돼 탁해 보이므로, 디코딩될 때까지 잠깐 기다린다
    const img = document.querySelector<HTMLImageElement>(".vt-media-hero img");
    if (!img || img.complete) {
      finish();
      return;
    }
    Promise.race([
      img.decode().catch(() => undefined),
      new Promise((r) => setTimeout(r, IMAGE_WAIT_MS)),
    ]).then(finish);
  }, [pathname]);
  return null;
}

type MediaLinkProps = ComponentProps<typeof Link> & {
  href: string;
  /** 링크 바깥 요소를 전환 출발점으로 쓸 때 (예: 히어로 버튼 → 히어로 이미지) */
  sourceSelector?: string;
};

export function MediaLink({
  href,
  sourceSelector,
  onClick,
  ...props
}: MediaLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      typeof document.startViewTransition !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      href === window.location.pathname
    ) {
      return;
    }

    e.preventDefault();

    const source =
      (sourceSelector
        ? document.querySelector<HTMLElement>(sourceSelector)
        : e.currentTarget.querySelector<HTMLElement>("[data-vt-source]")) ??
      e.currentTarget;

    // 이름은 페이지에서 유일해야 하므로, 현재 페이지에 이미 있는 상세 히어로(.vt-media-hero)는 잠시 끈다
    document
      .querySelectorAll<HTMLElement>(".vt-media-hero")
      .forEach((el) => el.style.setProperty("view-transition-name", "none"));
    source.style.setProperty("view-transition-name", NAME);

    const transition = document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          finishPending = resolve;
          router.push(href);
        }),
    );

    transition.finished.finally(() => {
      source.style.removeProperty("view-transition-name");
    });
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
