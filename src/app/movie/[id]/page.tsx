import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bookmark,
  Calendar,
  Clock,
  PenLine,
  Star,
} from "lucide-react";
import { allMedia, getMediaById } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";

type MoviePageProps = {
  params: { id: string };
};

export function generateStaticParams() {
  return allMedia.map((item) => ({ id: item.id }));
}

export function generateMetadata({ params }: MoviePageProps): Metadata {
  const item = getMediaById(params.id);
  return {
    title: item?.title ?? "Details",
  };
}

export default function MovieDetailPage({ params }: MoviePageProps) {
  const item = getMediaById(params.id);
  if (!item) notFound();

  const related = allMedia
    .filter((m) => m.id !== item.id)
    .filter(
      (m) =>
        m.sentiments?.some((s) => item.sentiments?.includes(s)) ||
        m.type === item.type,
    )
    .slice(0, 4);

  return (
    <div className="relative min-h-screen">
      {/* Hero Backdrop */}
      <div className="relative h-[530px] w-full overflow-hidden md:h-[663px]">
        <div className="mask-vignette absolute inset-0 scale-105">
          <MediaVisual
            item={item}
            kind="backdrop"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        <div className="absolute bottom-0 left-0 flex w-full flex-col gap-4 p-container-mobile sm:px-container-desktop">
          <div className="mb-2 flex flex-wrap gap-2">
            {item.genres.map((genre) => (
              <span
                key={genre}
                className="glass-panel rounded-full px-3 py-1 text-label-sm text-secondary-fixed"
              >
                {genre}
              </span>
            ))}
          </div>
          <h1 className="font-display text-display-lg-mobile text-glow leading-tight text-on-surface md:text-display-lg">
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
            <div className="flex items-center gap-1">
              <Calendar size={18} />
              <span>{item.year}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12 px-container-mobile pb-8 pt-8 sm:px-container-desktop">
        {/* CTA */}
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
          <Link
            href={`/journal/new?mediaId=${item.id}`}
            className="pearl-clay peach-glow flex items-center gap-3 rounded-full px-8 py-4 font-bold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <PenLine size={22} />
            <span className="text-body-lg">몽글 기록하기</span>
          </Link>
          <button
            type="button"
            className="pearl-clay-soft flex items-center gap-3 rounded-full px-6 py-4 text-on-surface transition-transform hover:scale-[1.02]"
          >
            <Bookmark size={20} />
            <span>위시리스트에 담기</span>
          </button>
        </div>

        {/* Synopsis & Director */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section>
              <h2 className="mb-4 font-display text-headline-md text-primary">
                줄거리
              </h2>
              <p className="text-body-lg leading-relaxed text-on-surface-variant">
                {item.overview}
              </p>
            </section>
          </div>
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6">
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

        {/* Cast */}
        {item.cast && item.cast.length > 0 ? (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-headline-md text-primary">
                출연
              </h2>
              <span className="text-label-sm text-secondary">전체 보기</span>
            </div>
            <div className="hide-scrollbar -mx-container-mobile flex gap-4 overflow-x-auto px-container-mobile pb-4 snap-x scroll-smooth sm:-mx-container-desktop sm:px-container-desktop">
              {item.cast.map((person) => (
                <div
                  key={person.name}
                  className="w-32 flex-shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1"
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

        {/* Related */}
        {related.length > 0 ? (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-headline-md text-primary">
                비슷한 몽글
              </h2>
              <span className="text-label-sm text-on-surface-variant">
                지금 기분과 맞는 작품
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.map((m) => (
                <Link key={m.id} href={`/movie/${m.id}`} className="group">
                  <div className="glass-panel relative mb-3 aspect-[2/3] overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                      <MediaVisual item={m} sizes="25vw" />
                    </div>
                    <div className="glass-panel absolute right-2 top-2 rounded-md px-2 py-1 text-[10px] font-bold">
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
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
