"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { computeArchiveStats, fetchMyJournals } from "@/lib/journal";
import {
  PROFILE_EMOJIS,
  getMongleProfile,
} from "@/lib/profile";

export function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState({ totalMongles: 0, thisMonth: 0 });
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [emoji, setEmoji] = useState("☁️");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
        const p = getMongleProfile(u);
        setNickname(p.nickname);
        setEmoji(p.emoji);
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

  async function saveProfile() {
    if (!isSupabaseConfigured() || !user) return;
    const trimmed = nickname.trim();
    if (trimmed.length < 1) {
      setMessage("닉네임을 입력해 주세요.");
      return;
    }
    if (trimmed.length > 20) {
      setMessage("닉네임은 20자 이내로 해주세요.");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.updateUser({
        data: {
          nickname: trimmed,
          emoji,
        },
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        const p = getMongleProfile(data.user);
        setNickname(p.nickname);
        setEmoji(p.emoji);
      }
      setEditing(false);
      setMessage("프로필을 저장했어요.");
      window.dispatchEvent(new Event("mongle-profile-updated"));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "저장에 실패했어요.");
    } finally {
      setSaving(false);
    }
  }

  const profile = getMongleProfile(user);

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
              <div className="pearl-clay flex h-16 w-16 items-center justify-center rounded-full text-3xl">
                {profile.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-headline-md text-on-surface">
                  {profile.nickname}
                </p>
                <p className="mt-1 truncate text-label-sm text-secondary">
                  {user.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing((v) => !v);
                  setMessage(null);
                  setNickname(profile.nickname);
                  setEmoji(profile.emoji);
                }}
                className="pearl-clay-soft shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
              >
                {editing ? "닫기" : "편집"}
              </button>
            </div>

            {editing ? (
              <div className="mt-6 space-y-5 border-t border-white/10 pt-6">
                <div>
                  <label className="mb-2 block text-label-sm text-on-surface-variant">
                    이모지 아바타
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {PROFILE_EMOJIS.map((item) => {
                      const active = emoji === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setEmoji(item)}
                          className={`flex h-11 items-center justify-center rounded-2xl text-xl transition ${
                            active
                              ? "pearl-clay peach-glow scale-105"
                              : "glass-panel hover:border-white/30"
                          }`}
                          aria-label={`이모지 ${item}`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="nickname"
                    className="mb-2 block text-label-sm text-on-surface-variant"
                  >
                    닉네임
                  </label>
                  <input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value.slice(0, 20))}
                    maxLength={20}
                    placeholder="예: 몽글러"
                    className="glass-panel h-12 w-full rounded-2xl px-4 text-sm outline-none placeholder:text-on-surface-variant/45 focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="mt-1.5 text-right text-[11px] text-on-surface-variant">
                    {nickname.trim().length}/20
                  </p>
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={saveProfile}
                  className="pearl-clay peach-glow w-full rounded-full py-3 text-sm font-bold disabled:opacity-60"
                >
                  {saving ? "저장 중…" : "프로필 저장"}
                </button>
              </div>
            ) : null}

            {message ? (
              <p className="mt-4 text-center text-sm text-on-surface-variant">
                {message}
              </p>
            ) : null}

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
              href="/wishlist"
              className="glass-panel block rounded-2xl px-5 py-4 text-sm text-on-surface transition-colors hover:border-white/30"
            >
              위시리스트 보기 →
            </Link>
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
