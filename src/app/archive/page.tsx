import type { Metadata } from "next";
import Link from "next/link";
import {
  Bolt,
  Cloud,
  Heart,
  Plus,
  Sparkles,
  Smile,
} from "lucide-react";
import {
  archiveStats,
  getMediaById,
  journalEntries,
  type JournalEntry,
} from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";

export const metadata: Metadata = {
  title: "아카이브",
};

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
};

export default function ArchivePage() {
  return (
    <div className="mx-auto max-w-7xl px-container-mobile pb-8 pt-24 sm:px-container-desktop">
      <section className="mb-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 font-display text-display-lg-mobile text-primary md:text-display-lg">
              나의 몽글 아카이브
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              영화에 남긴 감정과 기록이 모이는 공간
            </p>
            <p className="mt-1 text-xs tracking-wide text-on-surface-variant/70">
              My Mongle Archive
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass-panel flex min-w-[140px] flex-col items-center justify-center rounded-3xl px-6 py-4">
              <span className="font-display text-headline-md leading-none text-secondary">
                {archiveStats.totalMongles}
              </span>
              <span className="mt-1 text-label-sm tracking-widest text-on-surface-variant">
                전체 몽글
              </span>
            </div>
            <div className="glass-panel flex min-w-[140px] flex-col items-center justify-center rounded-3xl px-6 py-4">
              <span className="font-display text-headline-md leading-none text-primary">
                {archiveStats.thisMonth}
              </span>
              <span className="mt-1 text-label-sm tracking-widest text-on-surface-variant">
                이번 달
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {journalEntries.map((entry) => {
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
                  <MediaVisual item={media} sizes="(max-width:768px) 100vw, 25vw" />
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
          href="/explore"
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
            오늘의 감정을 남겨보세요
          </p>
        </Link>
      </div>
    </div>
  );
}
