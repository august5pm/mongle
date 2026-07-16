"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { getMediaById, type JournalEntry, type MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";
import { parseAppMediaId } from "@/lib/tmdb-image";
import { deleteJournalEntry } from "@/lib/journal";

const bubbleStyles: Record<JournalEntry["bubbleTone"], string> = {
  primary: "pearl-clay",
  secondary: "pearl-clay-soft text-on-surface",
  surface: "pearl-clay-soft text-on-surface",
  tertiary: "pearl-clay",
  container: "pearl-clay",
};

type Props = {
  entry: JournalEntry;
  Icon: LucideIcon;
  isMine?: boolean;
  onDeleted?: (id: string) => void;
};

export function JournalArchiveCard({
  entry,
  Icon,
  isMine,
  onDeleted,
}: Props) {
  const [media, setMedia] = useState<MediaItem | undefined>(() =>
    getMediaById(entry.mediaId),
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const local = getMediaById(entry.mediaId);
    if (local) {
      setMedia(local);
      return;
    }
    if (!parseAppMediaId(entry.mediaId)) return;

    let cancelled = false;
    fetch(`/api/tmdb/media/${encodeURIComponent(entry.mediaId)}`)
      .then(async (res) => {
        const data = (await res.json()) as { item?: MediaItem | null };
        if (!cancelled && data.item) setMedia(data.item);
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      cancelled = true;
    };
  }, [entry.mediaId]);

  async function onDelete() {
    if (busy) return;
    const ok = window.confirm("이 몽글 기록을 삭제할까요?");
    if (!ok) return;
    setBusy(true);
    try {
      await deleteJournalEntry(entry.id);
      onDeleted?.(entry.id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제에 실패했어요.");
      setBusy(false);
    }
  }

  if (!media) {
    return (
      <div className="glass-panel flex min-h-[280px] flex-col justify-end rounded-3xl p-5">
        <p className="text-sm text-on-surface-variant">작품을 불러오는 중…</p>
        <p className="mt-2 line-clamp-3 text-[13px]">“{entry.note}”</p>
      </div>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl glass-panel transition-all duration-500 ease-out hover:-translate-y-2">
      {isMine ? (
        <div className="absolute right-3 top-3 z-20 flex gap-1.5">
          <Link
            href={`/journal/new?edit=${entry.id}`}
            className="pearl-clay-soft flex h-9 w-9 items-center justify-center rounded-full text-on-surface transition hover:scale-105"
            aria-label="몽글 수정"
            title="수정"
          >
            <Pencil size={15} />
          </Link>
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="pearl-clay-soft flex h-9 w-9 items-center justify-center rounded-full text-on-surface transition hover:scale-105 disabled:opacity-50"
            aria-label="몽글 삭제"
            title="삭제"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ) : null}

      <Link href={`/movie/${media.id}`} className="block cursor-pointer">
        <div className="relative aspect-[2/3] w-full">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <MediaVisual item={media} sizes="(max-width:768px) 100vw, 25vw" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 backdrop-blur-md">
            <span className="text-sm leading-none">
              {entry.authorEmoji ?? "☁️"}
            </span>
            <span className="max-w-[7rem] truncate text-[11px] font-semibold text-on-surface">
              {entry.authorNickname ?? "몽글러"}
            </span>
            {isMine ? (
              <span className="rounded-full bg-primary/25 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                나
              </span>
            ) : null}
          </div>
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
    </article>
  );
}
