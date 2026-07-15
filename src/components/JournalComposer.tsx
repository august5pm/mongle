"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Search } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import {
  allMedia,
  getMediaById,
  sentiments,
  type MediaItem,
  type Sentiment,
} from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";
import { tmdbImage } from "@/lib/tmdb";
import { addJournalEntry } from "@/lib/journal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Step = "pick" | "feel" | "note";

export function JournalComposer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetId = searchParams.get("mediaId");
  const preset = presetId ? getMediaById(presetId) : undefined;

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [media, setMedia] = useState<MediaItem | undefined>(preset);
  const [step, setStep] = useState<Step>(preset ? "feel" : "pick");
  const [emotion, setEmotion] = useState<Sentiment | null>(null);
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthReady(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!isSupabaseConfigured()) return;
    if (!user) {
      const next = `/journal/new${presetId ? `?mediaId=${presetId}` : ""}`;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [authReady, user, router, presetId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allMedia;
    return allMedia.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.originalTitle?.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q)),
    );
  }, [query]);

  const canSubmit =
    Boolean(media) && Boolean(emotion) && note.trim().length >= 2 && !saving;

  function pickMedia(item: MediaItem) {
    setMedia(item);
    setStep("feel");
    setError(null);
  }

  async function onSave() {
    if (!media || !emotion) return;
    const trimmed = note.trim();
    if (trimmed.length < 2) {
      setError("두 글자 이상 적어 주세요.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await addJournalEntry({
        mediaId: media.id,
        emotion,
        note: trimmed,
      });
      router.push("/archive");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했어요.");
      setSaving(false);
    }
  }

  if (!authReady || (isSupabaseConfigured() && !user)) {
    return (
      <div className="px-container-mobile pt-28 text-on-surface-variant">
        로그인 확인 중…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-container-mobile pb-12 pt-24 sm:px-container-desktop">
      <div className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (step === "note") setStep("feel");
            else if (step === "feel" && !preset) setStep("pick");
            else router.back();
          }}
          className="pearl-clay-soft flex h-10 w-10 items-center justify-center rounded-full"
          aria-label="뒤로"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-label-sm tracking-widest text-primary">새 몽글</p>
          <h1 className="font-display text-3xl text-on-surface">감정을 남겨요</h1>
        </div>
      </div>

      {media ? (
        <div className="glass-panel mb-8 flex items-center gap-4 rounded-3xl p-3">
          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl">
            <MediaVisual item={media} sizes="56px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-on-surface">{media.title}</p>
            <p className="text-xs text-on-surface-variant">
              {media.year}
              <span className="mx-1.5 opacity-40">·</span>
              {media.genres[0]}
            </p>
            {!preset && step !== "pick" ? (
              <button
                type="button"
                onClick={() => setStep("pick")}
                className="mt-1 text-xs text-secondary underline-offset-2 hover:underline"
              >
                작품 바꾸기
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === "pick" ? (
        <section className="space-y-4">
          <p className="text-body-md text-on-surface-variant">
            어떤 작품의 여운을 기록할까요?
          </p>
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목 · 장르로 찾기"
              className="glass-panel h-12 w-full rounded-full pl-11 pr-4 text-sm outline-none placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="grid max-h-[52vh] grid-cols-3 gap-3 overflow-y-auto pb-2">
            {filtered.map((item) => {
              const src = tmdbImage(item.posterPath, "w185");
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => pickMedia(item)}
                  className="group text-left"
                >
                  <div
                    className="relative aspect-[2/3] overflow-hidden rounded-2xl ring-1 ring-white/15 transition group-hover:ring-primary/50"
                    style={{ background: item.posterTone }}
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="33vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="mt-1.5 truncate text-xs font-semibold">
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {step === "feel" && media ? (
        <section className="space-y-5">
          <p className="text-body-md text-on-surface-variant">
            이 작품이 남긴 감정은 무엇에 가까웠나요?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {sentiments.map((s) => {
              const active = emotion === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setEmotion(s.id)}
                  className={`rounded-3xl px-4 py-5 text-left transition-all ${
                    active
                      ? "pearl-clay peach-glow scale-[1.02]"
                      : "glass-panel hover:border-white/30"
                  }`}
                >
                  <p className="font-display text-xl">{s.label}</p>
                  <p
                    className={`mt-1 text-[11px] leading-snug ${
                      active ? "text-[#5c4038]/80" : "text-on-surface-variant"
                    }`}
                  >
                    {s.description}
                  </p>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!emotion}
            onClick={() => emotion && setStep("note")}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition ${
              emotion
                ? "pearl-clay peach-glow hover:scale-[1.01]"
                : "cursor-not-allowed bg-white/10 text-on-surface-variant"
            }`}
          >
            다음
          </button>
        </section>
      ) : null}

      {step === "note" && media && emotion ? (
        <section className="space-y-5">
          <p className="text-body-md text-on-surface-variant">
            한 줄로도 좋아요. 지금 떠오른 말을 남겨 보세요.
          </p>
          <div className="pearl-clay-soft inline-flex rounded-full px-3 py-1 text-label-sm">
            {sentiments.find((s) => s.id === emotion)?.label}
          </div>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value.slice(0, 140));
              setError(null);
            }}
            rows={5}
            placeholder="예: 엔딩 크레딧이 올라갈 때 마음이 조용히 울렸다."
            className="glass-panel w-full resize-none rounded-3xl p-5 text-body-md leading-relaxed outline-none placeholder:text-on-surface-variant/45 focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>{note.trim().length}/140</span>
            {error ? <span className="text-error">{error}</span> : null}
          </div>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onSave}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition ${
              canSubmit
                ? "pearl-clay peach-glow hover:scale-[1.01]"
                : "cursor-not-allowed bg-white/10 text-on-surface-variant"
            }`}
          >
            <Check size={18} />
            {saving ? "저장 중…" : "아카이브에 남기기"}
          </button>
        </section>
      ) : null}
    </div>
  );
}
