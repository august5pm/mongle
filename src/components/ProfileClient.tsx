"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { computeArchiveStats, fetchMyJournals } from "@/lib/journal";

export function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState({ totalMongles: 0, thisMonth: 0 });

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setReady(true);
        return;
      }
      const supabase = createClient();
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u);
      if (u) {
        try {
          const entries = await fetchMyJournals();
          setStats(computeArchiveStats(entries));
        } catch {
          /* ignore */
        }
      }
      setReady(true);
    }
    load();
  }, []);

  async function signOut() {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setStats({ totalMongles: 0, thisMonth: 0 });
    window.location.href = "/";
  }

  const name =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "시네마 드리머";
  const avatar =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="mx-auto max-w-lg px-container-mobile pb-8 pt-24 sm:px-container-desktop">
      <p className="text-label-sm tracking-widest text-primary">프로필</p>
      <h1 className="mt-3 font-display text-display-lg-mobile text-on-surface">
        나의 몽글
      </h1>

      {!ready ? (
        <p className="mt-8 text-on-surface-variant">불러오는 중…</p>
      ) : !user ? (
        <div className="glass-panel mt-8 space-y-4 rounded-3xl p-6">
          <p className="text-body-md text-on-surface-variant">
            Google로 로그인하면 감정 기록이 계정에 연결됩니다.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent("/profile")}`}
            className="pearl-clay peach-glow inline-flex rounded-full px-6 py-3 text-sm font-bold"
          >
            Google로 로그인
          </Link>
        </div>
      ) : (
        <>
          <div className="glass-panel mt-8 rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div className="pearl-clay relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full text-xl font-semibold">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  name.slice(0, 1)
                )}
              </div>
              <div>
                <p className="font-display text-headline-md text-on-surface">
                  {name}
                </p>
                <p className="mt-1 text-label-sm text-secondary">{user.email}</p>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-3 text-center">
              <div>
                <dt className="text-xs text-on-surface-variant">몽글</dt>
                <dd className="mt-1 font-display text-2xl text-primary">
                  {stats.totalMongles}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-on-surface-variant">이번 달</dt>
                <dd className="mt-1 font-display text-2xl text-primary">
                  {stats.thisMonth}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 space-y-2">
            <Link
              href="/archive"
              className="glass-panel block rounded-2xl px-5 py-4 text-sm text-on-surface transition-colors hover:border-white/30"
            >
              저널 아카이브 보기 →
            </Link>
            <Link
              href="/journal/new"
              className="glass-panel block rounded-2xl px-5 py-4 text-sm text-on-surface transition-colors hover:border-white/30"
            >
              새 몽글 남기기 →
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="glass-panel w-full rounded-2xl px-5 py-4 text-left text-sm text-on-surface-variant transition-colors hover:border-white/30"
            >
              로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  );
}
