"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { getMediaById, type JournalEntry, type MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";
import { parseAppMediaId } from "@/lib/tmdb-image";
import { deleteJournalEntry } from "@/lib/journal";
import {
  isJournalUuid,
  toggleJournalLike,
  type LikeState,
} from "@/lib/journal-likes";
import { isSupabaseConfigured } from "@/lib/supabase/client";

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
  like?: LikeState;
  loggedIn?: boolean;
  onDeleted?: (id: string) => void;
  onLikeChange?: (id: string, next: LikeState) => void;
};

export function JournalArchiveCard({
  entry,
  Icon,
  isMine,
  like,
  loggedIn,
  onDeleted,
  onLikeChange,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [media, setMedia] = useState<MediaItem | undefined>(() =>
    getMediaById(entry.mediaId),
  );
  const [busy, setBusy] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [localLike, setLocalLike] = useState<LikeState>(
    like ?? { count: 0, likedByMe: false },
  );

  useEffect(() => {
    setLocalLike(like ?? { count: 0, likedByMe: false });
  }, [like]);

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

  const canLike = isJournalUuid(entry.id);

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

  async function onLike() {
    if (!canLike || likeBusy) return;
    if (!isSupabaseConfigured() || !loggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setLikeBusy(true);
    const prev = localLike;
    setLocalLike({
      count: prev.likedByMe ? Math.max(0, prev.count - 1) : prev.count + 1,
      likedByMe: !prev.likedByMe,
    });
    try {
      const next = await toggleJournalLike(entry.id);
      setLocalLike(next);
      onLikeChange?.(entry.id, next);
    } catch (e) {
      setLocalLike(prev);
      alert(e instanceof Error ? e.message : "좋아요에 실패했어요.");
    } finally {
      setLikeBusy(false);
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
      </Link>

      <div className="flex items-center justify-between gap-2 p-5 pt-4">
        <div className="min-w-0 flex-1">
          <Link href={`/movie/${media.id}`} className="block">
            <h3 className="truncate font-display text-headline-md text-on-surface">
              {media.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full border border-secondary/10 bg-secondary/20 px-2 py-0.5 text-label-sm text-secondary">
              {entry.genreLabel}
            </span>
            <span className="text-label-sm text-on-surface-variant">
              {entry.recordedAgo}
            </span>
          </div>
        </div>

        {canLike ? (
          <button
            type="button"
            disabled={likeBusy}
            onClick={onLike}
            aria-pressed={localLike.likedByMe}
            aria-label={
              localLike.likedByMe ? "좋아요 취소" : "좋아요"
            }
            className={`pearl-clay-soft flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm transition hover:scale-105 disabled:opacity-50 ${
              localLike.likedByMe ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <Heart
              size={16}
              fill={localLike.likedByMe ? "currentColor" : "none"}
            />
            <span className="min-w-[1ch] tabular-nums font-semibold">
              {localLike.count}
            </span>
          </button>
        ) : null}
      </div>
    </article>
  );
}
