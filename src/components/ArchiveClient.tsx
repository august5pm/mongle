"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bolt,
  Cloud,
  Heart,
  Plus,
  Smile,
  Sparkles,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { getMediaById, type JournalEntry } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";
import {
  computeArchiveStats,
  fetchMyJournals,
  getSeedJournals,
} from "@/lib/journal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const bubbleStyles: Record<JournalEntry["bubbleTone"], string> = {
  primary: "pearl-clay",
  secondary: "pearl-clay-soft text-on-surface",
  surface: "pearl-clay-soft text-on-surface",
  tertiary: "pearl-clay",
  container: "pearl-clay",
};

const emotionIcons: Record<string, typeof Sparkles> = {
  "순수한 경이": Sparkles,
  그리움: Heart,
  전율: Bolt,
  "잔잔한 슬픔": Cloud,
  장난스러움: Smile,
  몽환: Sparkles,
  따뜻함: Heart,
  강렬: Bolt,
  잔잔함: Cloud,
};

export function ArchiveClient() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!isSupabaseConfigured()) {
          if (!cancelled) {
            setEntries(getSeedJournals());
            setUser(null);
            setReady(true);
          }
          return;
        }

        const supabase = createClient();
        const {
          data: { user: u },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        setUser(u);

        if (u) {
          const mine = await fetchMyJournals();
          if (!cancelled) setEntries(mine);
        } else {
          setEntries(getSeedJournals());
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "불러오기 실패");
          setEntries(getSeedJournals());
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = computeArchiveStats(entries);
  const writeHref = user
    ? "/journal/new"
    : `/login?next=${encodeURIComponent("/journal/new")}`;

  return (
    <div className="mx-auto max-w-7xl px-container-mobile pb-8 pt-24 sm:px-container-desktop">
      <section className="mb-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 font-display text-display-lg-mobile text-primary md:text-display-lg">
              나의 몽글 아카이브
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              {user
                ? "영화에 남긴 감정과 기록이 모이는 공간"
                : "미리보기예요. 로그인하면 내 기록이 여기에 쌓입니다."}
            </p>
            <p className="mt-1 text-xs tracking-wide text-on-surface-variant/70">
              {user ? "My Mongle Archive" : "Demo preview · Sign in to sync"}
            </p>
            {loadError ? (
              <p className="mt-2 text-sm text-error">{loadError}</p>
            ) : null}
          </div>
          <div className="flex gap-4">
            <div className="glass-panel flex min-w-[140px] flex-col items-center justify-center rounded-3xl px-6 py-4">
              <span className="font-display text-headline-md leading-none text-secondary">
                {ready ? stats.totalMongles : "—"}
              </span>
              <span className="mt-1 text-label-sm tracking-widest text-on-surface-variant">
                전체 몽글
              </span>
            </div>
            <div className="glass-panel flex min-w-[140px] flex-col items-center justify-center rounded-3xl px-6 py-4">
              <span className="font-display text-headline-md leading-none text-primary">
                {ready ? stats.thisMonth : "—"}
              </span>
              <span className="mt-1 text-label-sm tracking-widest text-on-surface-variant">
                이번 달
              </span>
            </div>
          </div>
        </div>
      </section>

      {!user && ready ? (
        <div className="glass-panel mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center">
          <p className="text-sm text-on-surface-variant">
            Google로 로그인하면 기록이 클라우드에 저장돼요.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent("/archive")}`}
            className="pearl-clay peach-glow shrink-0 rounded-full px-5 py-2.5 text-sm font-bold"
          >
            로그인하기
          </Link>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {entries.map((entry) => {
          const media = getMediaById(entry.mediaId);
          if (!media) return null;
          const Icon = emotionIcons[entry.emotionLabel] ?? Sparkles;

          return (
            <Link
              key={entry.id}
              href={`/movie/${media.id}`}
              className="group relative cursor-pointer overflow-hidden rounded-3xl glass-panel transition-all duration-500 ease-out hover:-translate-y-2"
            >
              <div className="relative aspect-[2/3] w-full">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <MediaVisual
                    item={media}
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 animate-float">
                  <div
                    className={`cloud-bubble p-4 shadow-xl backdrop-blur-md ${bubbleStyles[entry.bubbleTone]}`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Icon size={18} fill="currentColor" />
                      <span className="text-label-sm">{entry.emotionLabel}</span>
                    </div>
                    <p className="line-clamp-2 text-[13px] leading-relaxed">
                      &ldquo;{entry.note}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="truncate font-display text-headline-md text-on-surface">
                  {media.title}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full border border-secondary/10 bg-secondary/20 px-2 py-0.5 text-label-sm text-secondary">
                    {entry.genreLabel}
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    {entry.recordedAgo}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        <Link
          href={writeHref}
          id="new-entry"
          className="glass-panel group flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/15 transition-colors duration-300 hover:border-pearl/40"
        >
          <div className="pearl-clay mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
            <Plus size={28} />
          </div>
          <p className="font-display text-headline-md text-on-surface-variant">
            새 기록
          </p>
          <p className="mt-1 text-label-sm text-on-surface-variant/60">
            {user ? "오늘의 감정을 남겨보세요" : "로그인 후 기록할 수 있어요"}
          </p>
        </Link>
      </div>
    </div>
  );
}
