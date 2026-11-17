import type { Metadata } from "next";
import Link from "next/link";
import { MediaLink } from "@/components/MediaLink";
import { notFound } from "next/navigation";
import { Calendar, Clock, PenLine, Star } from "lucide-react";
import { allMedia, getMediaById, type MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";
import { WishlistButton } from "@/components/WishlistButton";
import { fetchTmdbMediaByAppId, trendingTmdb } from "@/lib/tmdb-api";
import { parseAppMediaId, tmdbImageForShare } from "@/lib/tmdb-image";
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, SITE_NAME, summarize } from "@/lib/site";

type MoviePageProps = {
  params: { id: string };
};

/**
 * 요청마다 렌더링 — 정적 생성(ISR)으로 두면 TMDB 장애 시 error.tsx 대신 Next 기본 500 화면이 뜬다.
 * TMDB 응답 자체는 lib/tmdb-api의 unstable_cache로 30분 캐시된다.
 */
export const dynamic = "force-dynamic";

/** 없는 작품이면 undefined(→ notFound), TMDB 장애는 throw(→ error.tsx) */
async function resolveMedia(id: string): Promise<MediaItem | undefined> {
  const local = getMediaById(id);
  if (local) return local;
  if (parseAppMediaId(id)) return fetchTmdbMediaByAppId(id);
  return undefined;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  // 메타데이터 단계의 오류는 error.tsx가 잡지 못하고 기본 500 화면이 뜨므로 여기서는 삼킨다.
  // 실제 오류는 아래 페이지 본문에서 다시 던져 error.tsx가 처리한다.
  let item: MediaItem | undefined;
  try {
    item = await resolveMedia(params.id);
  } catch {
    return { title: "잠시 문제가 생겼어요" };
  }
  if (!item) return { title: "작품을 찾을 수 없어요" };

  // 공유 미리보기: 가로 백드롭(16:9) 우선, 없으면 포스터, 둘 다 없으면 사이트 기본 이미지
  const backdrop = tmdbImageForShare(item.backdropPath, "w1280");
  const poster = tmdbImageForShare(item.posterPath, "w780");
  const image = backdrop
    ? { url: backdrop, width: 1280, height: 720, alt: `${item.title} 장면` }
    : poster
      ? { url: poster, width: 780, height: 1170, alt: `${item.title} 포스터` }
      : DEFAULT_OG_IMAGE;
  const title = `${item.title} · ${SITE_NAME}`;
  const description =
    summarize(item.overview) ?? `${item.title} — 몽글에서 감정을 기록해 보세요.`;
  const url = `/movie/${item.id}`;

  return {
    title: item.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: item.type === "tv" ? "video.tv_show" : "video.movie",
      title,
      description,
      url,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const item = await resolveMedia(params.id);
  if (!item) notFound();

  let related = allMedia
    .filter((m) => m.id !== item.id)
    .filter(
      (m) =>
        m.sentiments?.some((s) => item.sentiments?.includes(s)) ||
        m.type === item.type,
    )
    .slice(0, 4);

  if (parseAppMediaId(item.id) || related.length < 4) {
    try {
      const trend = await trendingTmdb("week");
      related = trend.filter((m) => m.id !== item.id).slice(0, 4);
    } catch {
      /* keep mock related */
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="app-bleed relative h-[min(530px,70vh)] w-auto overflow-hidden md:h-[min(663px,75vh)]">
        {/* 공유 요소 전환 도착점 — 이미지+그라데이션만 (텍스트는 vt-media-meta로 따로) */}
        <div className="vt-media-hero absolute inset-0 overflow-hidden">
          <div className="mask-vignette absolute inset-0 scale-105">
            <MediaVisual
              item={item}
              kind="backdrop"
              size="w1280"
              priority
              sizes="(max-width:1100px) 100vw, 1100px"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="vt-media-meta absolute bottom-0 left-0 flex w-full flex-col gap-4 px-[var(--app-pad)] pb-6">
          <div className="mb-2 flex flex-wrap gap-2">
            {item.genres.map((genre) => (
              <span
                key={genre}
                className="chrome-glass rounded-full px-3 py-1 text-label-sm text-secondary-fixed"
              >
                {genre}
              </span>
            ))}
          </div>
          <h1 className="font-display text-display-lg-mobile leading-tight text-on-surface md:text-display-lg">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-on-surface-variant">
            <div className="flex items-center gap-1">
              <Star size={18} className="text-primary" fill="currentColor" />
              <span className="font-bold text-on-surface">
                {item.rating.toFixed(1)}
              </span>
            </div>
            {item.runtime ? (
              <div className="flex items-center gap-1">
                <Clock size={18} />
                <span>{item.runtime}</span>
              </div>
            ) : null}
            {item.year ? (
              <div className="flex items-center gap-1">
                <Calendar size={18} />
                <span>{item.year}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-12 pb-8 pt-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
          <Link
            href={`/journal/new?mediaId=${item.id}`}
            className="accent-fill flex items-center gap-3 rounded-full px-8 py-4 font-bold"
          >
            <PenLine size={22} />
            <span className="text-body-lg">몽글 기록하기</span>
          </Link>
          <WishlistButton
            mediaId={item.id}
            title={item.title}
            posterPath={item.posterPath}
            mediaType={item.type}
            variant="pill"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section>
              <h2 className="mb-4 font-display text-headline-md text-on-surface">
                줄거리
              </h2>
              <p className="text-body-lg leading-relaxed text-on-surface-variant">
                {item.overview}
              </p>
            </section>
          </div>
          <div className="space-y-6">
            <div className="surface-panel rounded-3xl p-6">
              <h3 className="mb-4 text-label-sm tracking-widest text-primary">
                감독
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-variant text-sm font-bold text-primary">
                  {(item.director ?? "감").slice(0, 1)}
                </div>
                <span className="text-body-md font-semibold">
                  {item.director ?? "미상"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {item.cast && item.cast.length > 0 ? (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-headline-md text-on-surface">
                출연
              </h2>
            </div>
            <div className="app-bleed hide-scrollbar flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth">
              {item.cast.map((person) => (
                <div
                  key={person.name}
                  className="w-32 flex-shrink-0 snap-start"
                >
                  <div className="mb-3 aspect-square overflow-hidden rounded-xl border border-white/5 bg-surface-container transition-colors hover:border-primary/50">
                    <div
                      className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary/80"
                      style={{
                        background: `linear-gradient(145deg, #272a2c, #1d2022 60%, #ffb3a733)`,
                      }}
                    >
                      {person.name.slice(0, 1)}
                    </div>
                  </div>
                  <p className="truncate text-center text-label-sm text-on-surface">
                    {person.name}
                  </p>
                  <p className="truncate text-center text-[10px] text-on-surface-variant">
                    {person.role}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-headline-md text-on-surface">
                비슷한 몽글
              </h2>
              <span className="text-label-sm text-on-surface-variant">
                지금 기분과 맞는 작품
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.map((m) => (
                <MediaLink key={m.id} href={`/movie/${m.id}`} className="group">
                  <div data-vt-source className="surface-panel relative mb-3 aspect-[2/3] overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 transition-transform duration-slow group-hover:scale-[1.04]">
                      <MediaVisual item={m} size="w185" sizes="25vw" />
                    </div>
                    <div className="chrome-glass absolute right-2 top-2 rounded-md px-2 py-1 text-[10px] font-bold">
                      {m.rating.toFixed(1)}
                    </div>
                  </div>
                  <h4 className="truncate text-body-md font-semibold">
                    {m.title}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant">
                    {m.year}
                    {m.director ? ` • ${m.director}` : ""}
                  </p>
                </MediaLink>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
