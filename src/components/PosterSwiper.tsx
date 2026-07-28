"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { MediaItem } from "@/data/mock";
import { CompactPosterCard } from "@/components/HomePosterBits";

import "swiper/css";

type PosterSwiperProps = {
  items: MediaItem[];
  priorityCount?: number;
};

const SPACE_BETWEEN = 14;
const MOVE_DURATION = 450;

/** 뷰포트에 완전히 들어가는 포스터 장 수 */
function getVisibleCount(instance: SwiperInstance) {
  const slideEl = instance.slides[0] as HTMLElement | undefined;
  const slideW = slideEl?.offsetWidth ?? 0;
  if (slideW <= 0 || instance.width <= 0) return 1;
  return Math.max(
    1,
    Math.floor((instance.width + SPACE_BETWEEN) / (slideW + SPACE_BETWEEN)),
  );
}

/** 포스터 폭(cqi) 변경 후 레이아웃이 안정되면 Swiper 크기·가장자리 상태를 맞춤 */
function refreshSwiper(
  instance: SwiperInstance,
  syncEdges: (s: SwiperInstance) => void,
) {
  if (instance.destroyed) return;
  instance.updateSize();
  instance.updateSlides();
  instance.updateProgress();
  instance.updateSlidesClasses();
  // translate가 새 max를 넘지 않게
  const max = instance.maxTranslate();
  const min = instance.minTranslate();
  const current = instance.getTranslate();
  if (current < max || current > min) {
    instance.setTranslate(Math.max(max, Math.min(min, current)));
  }
  syncEdges(instance);
}

/** 우측 페이드 + 호버 좌우 버튼 — 한 화면씩 이동, 이동 중엔 재클릭 불가 */
export function PosterSwiper({
  items,
  priorityCount = 0,
}: PosterSwiperProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [locked, setLocked] = useState(true);
  const [moving, setMoving] = useState(false);
  const movingRef = useRef(false);
  const moveTimerRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const resizeTimerRef = useRef<number | null>(null);

  const syncEdges = useCallback((instance: SwiperInstance) => {
    setAtStart(instance.isBeginning);
    setAtEnd(instance.isEnd);
    setLocked(instance.isLocked);
  }, []);

  // 셸/포스터 폭이 바뀔 때(모바일↔웹) cqi 반영 후 Swiper 재계산
  useEffect(() => {
    if (!swiper || !wrapRef.current) return;

    const scheduleRefresh = () => {
      if (resizeTimerRef.current != null) {
        window.clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = window.setTimeout(() => {
        requestAnimationFrame(() => {
          refreshSwiper(swiper, syncEdges);
        });
      }, 80);
    };

    const ro = new ResizeObserver(scheduleRefresh);
    ro.observe(wrapRef.current);

    return () => {
      ro.disconnect();
      if (resizeTimerRef.current != null) {
        window.clearTimeout(resizeTimerRef.current);
      }
    };
  }, [swiper, syncEdges]);

  const unlockMoving = useCallback(
    (instance?: SwiperInstance | null) => {
      if (moveTimerRef.current != null) {
        window.clearTimeout(moveTimerRef.current);
        moveTimerRef.current = null;
      }
      movingRef.current = false;
      setMoving(false);
      if (instance && !instance.destroyed) syncEdges(instance);
    },
    [syncEdges],
  );

  const moveByPage = useCallback(
    (direction: -1 | 1) => {
      if (!swiper || swiper.destroyed || movingRef.current) return;

      const slideEl = swiper.slides[0] as HTMLElement | undefined;
      if (!slideEl) return;

      const slideW = slideEl.offsetWidth;
      const unit = slideW + SPACE_BETWEEN;
      const visible = getVisibleCount(swiper);
      const pageWidth = visible * unit;

      const current = swiper.getTranslate();
      const next = current - direction * pageWidth;
      const clamped = Math.max(
        swiper.maxTranslate(),
        Math.min(swiper.minTranslate(), next),
      );

      // 이미 끝이면 무시
      if (Math.abs(clamped - current) < 1) {
        syncEdges(swiper);
        return;
      }

      movingRef.current = true;
      setMoving(true);
      swiper.translateTo(clamped, MOVE_DURATION);

      moveTimerRef.current = window.setTimeout(() => {
        unlockMoving(swiper);
      }, MOVE_DURATION + 30);
    },
    [swiper, syncEdges, unlockMoving],
  );

  if (!items.length) return null;

  const navBusy = moving;

  return (
    <div ref={wrapRef} className="poster-swiper-wrap app-bleed relative">
      <div className="poster-swiper">
        <Swiper
          modules={[FreeMode, Mousewheel]}
          freeMode={{
            enabled: true,
            momentumRatio: 0.7,
            momentumVelocityRatio: 0.7,
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.85,
          }}
          slidesPerView="auto"
          spaceBetween={SPACE_BETWEEN}
          grabCursor
          watchOverflow
          resizeObserver
          speed={MOVE_DURATION}
          onSwiper={(instance) => {
            setSwiper(instance);
            syncEdges(instance);
          }}
          onSlideChange={syncEdges}
          onResize={(instance) => refreshSwiper(instance, syncEdges)}
          onReachBeginning={syncEdges}
          onReachEnd={syncEdges}
          onFromEdge={syncEdges}
          onTransitionEnd={(instance) => unlockMoving(instance)}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id} className="!h-auto !w-auto">
              <CompactPosterCard
                item={item}
                priority={index < priorityCount}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {!locked ? (
        <>
          <button
            type="button"
            aria-label="이전"
            disabled={atStart || navBusy}
            onClick={() => moveByPage(-1)}
            className={`poster-swiper-nav poster-swiper-nav--prev ${
              atStart
                ? "pointer-events-none opacity-0"
                : navBusy
                  ? "pointer-events-none opacity-40"
                  : ""
            }`}
          >
            <ChevronLeft size={22} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            aria-label="다음"
            disabled={atEnd || navBusy}
            onClick={() => moveByPage(1)}
            className={`poster-swiper-nav poster-swiper-nav--next ${
              atEnd
                ? "pointer-events-none opacity-0"
                : navBusy
                  ? "pointer-events-none opacity-40"
                  : ""
            }`}
          >
            <ChevronRight size={22} strokeWidth={2.25} />
          </button>
        </>
      ) : null}
    </div>
  );
}
