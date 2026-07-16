"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bolt,
  Cloud,
  Heart,
  Plus,
  Smile,
  Sparkles,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { type JournalEntry } from "@/data/mock";
import { JournalArchiveCard } from "@/components/JournalArchiveCard";
import {
  computeArchiveStats,
  fetchMyJournals,
  fetchPublicJournals,
  getSeedJournals,
} from "@/lib/journal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

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

type FeedTab = "all" | "mine";

export function ArchiveClient() {
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  const [myEntries, setMyEntries] = useState<JournalEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<FeedTab>("all");
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      if (!isSupabaseConfigured()) {
        setAllEntries(getSeedJournals());
        setMyEntries([]);
        setUser(null);
        setReady(true);
        return;
      }

      const supabase = createClient();
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u);

      const publicFeed = await fetchPublicJournals();
      setAllEntries(publicFeed);

      if (u) {
        const mine = await fetchMyJournals();
        setMyEntries(mine);
      } else {
        setMyEntries([]);
      }
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "불러오기 실패");
      setAllEntries(getSeedJournals());
      setMyEntries([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const entries = useMemo(() => {
    if (tab === "mine") return myEntries;
    return allEntries;
  }, [tab, allEntries, myEntries]);

  const stats = computeArchiveStats(entries);
  const writeHref = user
    ? "/journal/new"
    : `/login?next=${encodeURIComponent("/journal/new")}`;

  return (
    <div className="mx-auto max-w-7xl px-container-mobile pb-8 pt-24 sm:px-container-desktop">
      <section className="mb-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 font-display text-display-lg-mobile text-primary md:text-display-lg">
              몽글 아카이브
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              사람들이 남긴 영화의 여운이 모이는 공간
            </p>
            <p className="mt-1 text-xs tracking-wide text-on-surface-variant/70">
              Shared Mongle Archive
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
                {tab === "mine" ? "내 몽글" : "전체 몽글"}
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

      <div
        className="mb-8 flex gap-2"
        role="tablist"
        aria-label="아카이브 피드"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "all"}
          onClick={() => setTab("all")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "all"
              ? "pearl-clay peach-glow"
              : "glass-panel text-on-surface-variant hover:text-on-surface"
          }`}
        >
          모두의 몽글
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "mine"}
          onClick={() => {
            if (!user) return;
            setTab("mine");
          }}
          disabled={!user}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "mine"
              ? "pearl-clay peach-glow"
              : "glass-panel text-on-surface-variant hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
          }`}
        >
          내 몽글
        </button>
      </div>

      {!user && ready ? (
        <div className="glass-panel mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center">
          <p className="text-sm text-on-surface-variant">
            로그인하면 내 기록을 남기고, ‘내 몽글’에서 모아볼 수 있어요.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent("/archive")}`}
            className="pearl-clay peach-glow shrink-0 rounded-full px-5 py-2.5 text-sm font-bold"
          >
            로그인하기
          </Link>
        </div>
      ) : null}

      {tab === "mine" && ready && myEntries.length === 0 ? (
        <div className="glass-panel mb-8 rounded-3xl p-6 text-center text-sm text-on-surface-variant">
          아직 남긴 기록이 없어요. 첫 몽글을 남겨 보세요.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {entries.map((entry) => {
          const Icon = emotionIcons[entry.emotionLabel] ?? Sparkles;
          const isMine = Boolean(user && entry.userId === user.id);

          return (
            <JournalArchiveCard
              key={entry.id}
              entry={entry}
              Icon={Icon}
              isMine={isMine}
              onDeleted={(id) => {
                setAllEntries((prev) => prev.filter((e) => e.id !== id));
                setMyEntries((prev) => prev.filter((e) => e.id !== id));
              }}
            />
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
