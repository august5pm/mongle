import { MediaLink } from "@/components/MediaLink";
import Image, { getImageProps } from "next/image";
import { Play } from "lucide-react";
import type { MediaItem } from "@/data/mock";
import { tmdbImage } from "@/lib/tmdb-image";
import { WishlistButton } from "@/components/WishlistButton";

type HeroProps = {
  item: MediaItem;
};

/** 모바일 세로 포스터 ↔ sm+ 가로 백드롭 전환 지점 (Tailwind sm) */
const DESKTOP_MEDIA = "(min-width: 640px)";

/**
 * 키비주얼 아트 디렉션.
 * 모바일은 세로 포스터(2:3), sm 이상은 가로 백드롭(16:9)을 <picture>로 골라
 * 화면에 맞는 이미지 하나만 내려받는다. 한쪽이 없으면 있는 쪽을 양쪽에 쓴다.
 */
function HeroArt({ item }: HeroProps) {
  const backdrop = tmdbImage(item.backdropPath, "w1280");
  const poster = tmdbImage(item.posterPath, "w780");
  const desktopSrc = backdrop ?? poster;
  const mobileSrc = poster ?? backdrop;
  if (!desktopSrc || !mobileSrc) return null;

  const common = { alt: `${item.title} 키비주얼`, fill: true, priority: true };
  const desktop = getImageProps({
    ...common,
    src: desktopSrc,
    sizes: "(max-width: 1280px) 100vw, 1280px",
  }).props;
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: mobileSrc, sizes: "100vw" });

  return (
    <picture>
      <source
        media={DESKTOP_MEDIA}
        srcSet={desktop.srcSet}
        sizes={desktop.sizes}
      />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt는 getImageProps가 채움 */}
      <img
        {...imgProps}
        srcSet={mobileSrcSet}
        // 남는 크롭은 인물이 많은 위쪽 1/3을 남기도록 초점을 올린다
        className="object-cover object-[center_20%] sm:object-[center_30%]"
      />
    </picture>
  );
}

export function Hero({ item }: HeroProps) {
  return (
    <section
      id="home-hero"
      className="hero-frame app-bleed relative mt-16 flex scroll-mt-20 flex-col justify-end overflow-hidden"
    >
      <div data-vt-source className="edge-fade-x absolute inset-0 z-0">
        <div
          className="hero-mask absolute inset-0 animate-fade-in"
          style={{ background: item.backdropTone }}
        >
          <HeroArt item={item} />
        </div>
        {/* 데스크톱: 텍스트 쪽(좌측)만 어둡게 — 밝은 키비주얼에서도 제목·설명이 읽히게 */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(to_right,rgba(5,6,7,0.78)_0%,rgba(5,6,7,0.4)_38%,transparent_68%)] sm:block"
          aria-hidden
        />
        <div className="hero-fade-bottom" aria-hidden />
      </div>

      <div className="relative z-10 mb-6 space-y-3 px-[var(--app-pad)] sm:mb-10">
        <div className="soft-fill inline-flex items-center gap-2 rounded-full px-3 py-1">
          <span className="relative h-4 w-5 shrink-0">
            <Image
              src="/cloud.png"
              alt=""
              fill
              sizes="20px"
              className="object-contain"
            />
          </span>
          <span className="text-label-sm tracking-widest text-primary">
            오늘의 추천
          </span>
        </div>

        {/* 모바일은 포스터 그림 속 제목이 주인공 — 텍스트 제목은 한 단계 작게 (그림에 제목이 없는 작품도 있어 숨기지는 않음) */}
        <h2 className="max-w-[16ch] text-balance font-display text-2xl font-extrabold leading-[1.08] tracking-[-0.03em] text-on-surface sm:text-[clamp(2rem,5.5cqi,3.75rem)] sm:tracking-[-0.035em]">
          {item.title}
        </h2>

        <p className="max-w-md line-clamp-2 text-sm text-on-surface/75 md:text-body-md">
          {item.overview}
        </p>

        <div className="flex items-center gap-3 pt-1">
          <MediaLink
            href={`/movie/${item.id}`}
            sourceSelector="#home-hero [data-vt-source]"
            className="accent-fill flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold"
          >
            <Play size={18} fill="currentColor" />
            자세히 보기
          </MediaLink>
          <WishlistButton
            mediaId={item.id}
            title={item.title}
            posterPath={item.posterPath}
            mediaType={item.type}
            variant="bookmark"
          />
        </div>
      </div>
    </section>
  );
}
