"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/archive";
  const err = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    err === "auth" ? "로그인에 실패했어요. 다시 시도해 주세요." : null,
  );

  async function signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      setMessage(
        "Supabase 환경 변수가 없습니다. docs/supabase-setup.md 를 확인해 주세요.",
      );
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "로그인에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-container-mobile pb-12 pt-24 sm:px-container-desktop">
      <div className="mb-10 text-center">
        <div className="relative mx-auto mb-4 h-14 w-16">
          <Image src="/cloud.png" alt="" fill className="object-contain" />
        </div>
        <h1 className="font-display text-4xl text-on-surface">몽글 로그인</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          구글로 로그인하면 감정 기록이 어디에 있어도 이어집니다.
        </p>
      </div>

      <div className="glass-panel space-y-4 rounded-3xl p-6">
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="pearl-clay peach-glow flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 font-bold transition hover:scale-[1.01] disabled:opacity-60"
        >
          <GoogleMark />
          {loading ? "이동 중…" : "Google로 계속하기"}
        </button>

        {message ? (
          <p className="text-center text-sm text-error">{message}</p>
        ) : null}

        {!isSupabaseConfigured() ? (
          <p className="text-center text-xs text-on-surface-variant">
            로컬에서는 `.env.local`에 Supabase 키를 넣어야 합니다.
          </p>
        ) : null}
      </div>

      <Link
        href="/"
        className="mt-8 text-center text-sm text-on-surface-variant hover:text-primary"
      >
        ← 홈으로
      </Link>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.5 7.1l.1.1 6.2 5.2C36.9 39 44 34 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
