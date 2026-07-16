"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bolt,
  Cloud,
  Heart,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  exploreChips,
  searchMedia,
  softFluffy,
  sentiments,
  type MediaItem,
  type Sentiment,
} from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";
import { tmdbImage } from "@/lib/tmdb-image";

function chipToSentiment(chip: string): Sentiment | "all" {
  if (chip === "Dreamy") return "Dreamy";
  if (chip === "Warm" || chip === "Nostalgic") return "Warm";
  if (chip === "Thrilling") return "Intense";
  if (chip === "Melancholic") return "Soft";
  return "all";
}

function useDebounced(value: string, ms = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export function ExploreClient() {
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("Cinematic");
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [tmdbResults, setTmdbResults] = useState<MediaItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const debouncedQuery = useDebounced(query.trim());

  const mockFiltered = useMemo(
    () => searchMedia(debouncedQuery, chipToSentiment(activeChip)),
    [debouncedQuery, activeChip],
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tmdb/trending")
      .then(async (res) => {
        const data = (await res.json()) as {
          results?: MediaItem[];
          error?: string;
        };
        if (!cancelled && data.results?.length) {
          setTrending(data.results);
        }
      })
      .catch(() => {
        /* keep mock fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!debouncedQuery) {
      setTmdbResults([]);
      setSearchError(null);
      setSearching(false);
      return;
    }

    let cancelled = false;
    setSearching(true);
    setSearchError(null);

    fetch(`/api/tmdb/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(async (res) => {
        const data = (await res.json()) as {
          results?: MediaItem[];
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setSearchError(data.error ?? "검색에 실패했어요.");
          setTmdbResults([]);
          return;
        }
        setTmdbResults(data.results ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setSearchError("검색에 실패했어요.");
          setTmdbResults([]);
        }
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const bento = trending.length >= 4 ? trending : softFluffy;
  const [featured, second, third, fourth] = bento;

  const results =
    debouncedQuery && tmdbResults.length > 0
      ? tmdbResults
      : debouncedQuery
        ? mockFiltered
        : [];

  const moodThumbs = trending.length ? trending : softFluffy;

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
            <Search size={20} className="text-on-surface-variant" />
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="작품 제목으로 찾아보세요 (TMDB)"
            className="glass-panel h-14 w-full rounded-full pl-14 pr-6 text-body-lg text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/40"
          />
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity group-focus-within:opacity-100" />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
          {exploreChips.map((chip) => {
            const active = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveChip(chip.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-label-sm transition-all ${
                  active
                    ? "pearl-clay peach-glow"
                    : "glass-panel text-on-surface-variant hover:text-primary"
                }`}
              >
                {chip.icon === "trending" ? <TrendingUp size={18} /> : null}
                <span>{chip.label}</span>
                <span className="text-[10px] opacity-60">{chip.hash}</span>
              </button>
            );
          })}
        </div>
      </section>

      {!query.trim() ? (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="font-display text-headline-md text-primary">
                지금 뜨는 몽글
              </h2>
              <p className="text-body-md text-on-surface-variant/70">
                {trending.length
                  ? "TMDB 이번 주 트렌딩"
                  : "이번 주 사람들이 남긴 감정과 이야기"}
              </p>
            </div>
            <span className="text-label-sm text-secondary">Trending</span>
          </div>

          <div className="bento-grid">
            {featured ? (
              <Link
                href={`/movie/${featured.id}`}
                className="glass-panel group relative col-span-2 row-span-2 min-h-[280px] cursor-pointer overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <MediaVisual
                    item={featured}
                    sizes="(max-width:768px) 100vw, 60vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                  <div className="mb-3 flex gap-2">
                    <span className="rounded-full bg-primary-container/30 px-3 py-1 text-label-sm text-primary backdrop-blur-md">
                      꼭 보세요
                    </span>
                  </div>
                  <h3 className="mb-2 font-display text-display-lg-mobile text-on-surface">
                    {featured.title}
                  </h3>
                  <p className="line-clamp-2 text-body-md text-on-surface-variant">
                    {featured.overview}
                  </p>
                </div>
              </Link>
            ) : null}

            {second ? (
              <Link
                href={`/movie/${second.id}`}
                className="glass-panel group relative col-span-2 min-h-[160px] cursor-pointer overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <MediaVisual
                    item={second}
                    kind="backdrop"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="font-display text-headline-md text-on-surface">
                    {second.title}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant">
                    ★ {second.rating.toFixed(1)}
                  </p>
                </div>
              </Link>
            ) : null}

            {third ? (
              <Link
                href={`/movie/${third.id}`}
                className="glass-panel group relative min-h-[140px] cursor-pointer overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <MediaVisual item={third} sizes="30vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-label-sm font-bold text-on-surface">
                    {third.title}
                  </p>
                </div>
              </Link>
            ) : null}

            {fourth ? (
              <Link
                href={`/movie/${fourth.id}`}
                className="glass-panel group relative min-h-[140px] cursor-pointer overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <MediaVisual item={fourth} sizes="30vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-label-sm font-bold text-on-surface">
                    {fourth.title}
                  </p>
                </div>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <h2 className="font-display text-headline-md text-primary">
          감정으로 둘러보기
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {sentiments
            .filter((s) => ["Dreamy", "Intense", "Warm"].includes(s.id))
            .map((mood) => {
              const Icon =
                mood.id === "Dreamy"
                  ? Cloud
                  : mood.id === "Intense"
                    ? Bolt
                    : Heart;
              const iconWrap =
                mood.id === "Dreamy"
                  ? "bg-secondary-container/40 text-secondary"
                  : mood.id === "Intense"
                    ? "bg-error-container/40 text-error"
                    : "bg-primary-container/40 text-primary";

              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() =>
                    setActiveChip(
                      mood.id === "Soft"
                        ? "Melancholic"
                        : mood.id === "Intense"
                          ? "Thrilling"
                          : mood.id,
                    )
                  }
                  className="glass-panel space-y-4 rounded-3xl p-6 text-left transition-transform duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${iconWrap}`}
                  >
                    <Icon size={22} fill="currentColor" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-headline-md">
                      {mood.label}
                    </h3>
                    <p className="text-xs text-on-surface-variant/70">
                      {mood.hash}
                    </p>
                    <p className="text-body-md text-on-surface-variant">
                      {mood.description}
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((i) => {
                      const thumb = moodThumbs[i];
                      const src = tmdbImage(thumb?.posterPath, "w185");
                      return (
                        <div
                          key={i}
                          className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-surface-container bg-surface-container-high"
                          style={
                            !src
                              ? {
                                  background: thumb?.posterTone ?? "#272a2c",
                                }
                              : undefined
                          }
                        >
                          {src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={src}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                      );
                    })}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container bg-surface-container-high text-[10px] text-on-surface-variant">
                      +{mood.count}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </section>

      {query.trim() ? (
        <section className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            {searching
              ? "검색 중…"
              : `“${query.trim()}” 검색 결과 ${results.length}개`}
          </p>
          {searchError ? (
            <p className="text-sm text-error">{searchError}</p>
          ) : null}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((item) => (
              <Link key={item.id} href={`/movie/${item.id}`} className="group">
                <div className="glass-panel relative mb-2 aspect-[2/3] overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <MediaVisual item={item} sizes="20vw" />
                  </div>
                </div>
                <p className="truncate text-sm font-bold">{item.title}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
