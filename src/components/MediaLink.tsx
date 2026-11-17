"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, type ComponentProps, type MouseEvent } from "react";

/**
 * 포스터 ↔ 상세 공유 요소 전환 (View Transitions API).
 *
 * 가는 길(MediaLink 클릭)
 * 1. 클릭한 링크 안의 `[data-vt-source]`(없으면 링크 자신)에 `view-transition-name: media-hero`를 붙이고
 * 2. `document.startViewTransition` 안에서 router.push 한 뒤
 * 3. 새 경로가 커밋되는 순간(`ViewTransitionRouteWatcher`의 layout effect) 전환을 마무리한다.
 * 상세 페이지의 `.vt-media-hero`가 같은 이름을 가져 두 요소가 이어진다.
 *
 * 돌아오는 길(`navigateBackWithTransition`, 상단바 ← 버튼)
 * 클릭했던 포스터를 기억해 두었다가, 목록이 다시 그려지는 순간 그 포스터에 같은 이름을 붙여
 * 상세 이미지가 원래 자리로 줄어들게 한다.
 *
 * 미지원 브라우저·움직임 줄이기·새 탭 클릭은 일반 동작 그대로.
 */

const NAME = "media-hero";
/** 도착 이미지 디코딩을 기다리는 최대 시간 — 그동안 이전 화면이 멈춰 보이므로 짧게 */
const IMAGE_WAIT_MS = 600;

let finishPending: (() => void) | null = null;

/** 마지막으로 전환을 일으킨 포스터 — 뒤로 갈 때 도착점을 찾는 데 쓴다 */
type TransitionOrigin = {
  /** 출발한 목록 경로 */
  fromPath: string;
  /** 도착한 상세 경로 */
  detailPath: string;
  sourceSelector?: string;
  /** 같은 작품 링크가 여러 개일 때(여러 레일) 몇 번째였는지 */
  linkIndex: number;
  /** 출발 시 스크롤 위치 — Next는 화면을 그린 뒤에야 스크롤을 복원하므로 직접 맞춘다 */
  scrollY: number;
};
let lastOrigin: TransitionOrigin | null = null;

function canTransition() {
  return (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const linksTo = (path: string) =>
  document.querySelectorAll<HTMLAnchorElement>(
    `a[data-media-link][href="${CSS.escape(path)}"]`,
  );

/** 돌아온 목록에서 출발했던 포스터를 찾는다. 화면 밖이면 null(→ 상세 이미지는 그냥 사라짐) */
function findOriginTarget(origin: TransitionOrigin) {
  let el: HTMLElement | null = null;
  if (origin.sourceSelector) {
    el = document.querySelector<HTMLElement>(origin.sourceSelector);
  } else {
    const links = linksTo(origin.detailPath);
    const link = links[origin.linkIndex] ?? links[0];
    el = link?.querySelector<HTMLElement>("[data-vt-source]") ?? link ?? null;
  }
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const visible = r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  return visible ? el : null;
}

/**
 * 상세 → 목록 역방향 전환. 이 상세에 전환으로 들어온 경우에만 동작하고,
 * 그 밖에는 router.back()과 같다.
 */
export function navigateBackWithTransition(router: { back: () => void }) {
  const origin = lastOrigin;
  if (!canTransition() || !origin || origin.detailPath !== window.location.pathname) {
    router.back();
    return;
  }
  lastOrigin = null;

  const root = document.documentElement;
  root.dataset.vtDirection = "back";
  let target: HTMLElement | null = null;

  const transition = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        finishPending = () => {
          if (window.location.pathname === origin.fromPath) {
            // 도착점 위치를 재기 전에 스크롤을 출발 시점으로 (Next의 복원보다 먼저)
            window.scrollTo({ top: origin.scrollY, behavior: "instant" });
            target = findOriginTarget(origin);
            target?.style.setProperty("view-transition-name", NAME);
          }
          resolve();
        };
        router.back();
      }),
  );

  transition.finished.finally(() => {
    target?.style.removeProperty("view-transition-name");
    delete root.dataset.vtDirection;
  });
}

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
      !canTransition() ||
      href === window.location.pathname
    ) {
      return;
    }

    e.preventDefault();

    const link = e.currentTarget;
    const source =
      (sourceSelector
        ? document.querySelector<HTMLElement>(sourceSelector)
        : link.querySelector<HTMLElement>("[data-vt-source]")) ?? link;

    lastOrigin = {
      fromPath: window.location.pathname,
      detailPath: href,
      sourceSelector,
      linkIndex: Array.prototype.indexOf.call(linksTo(href), link),
      scrollY: window.scrollY,
    };

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

  // data-media-link: NavigationProgress가 전환 이동을 구분하는 표시
  return <Link href={href} onClick={handleClick} data-media-link="" {...props} />;
}
