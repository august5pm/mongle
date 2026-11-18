import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * 로그인 사용자 공용 저장소 (브라우저 전용).
 *
 * `auth.getUser()`는 부를 때마다 Supabase Auth 서버에 요청을 보내므로,
 * 앱 전체에서 `onAuthStateChange` 구독 하나만 두고 그 값을 나눠 쓴다.
 * 첫 이벤트(INITIAL_SESSION)는 저장된 세션을 네트워크 없이 읽어 오고,
 * 로그인·로그아웃·프로필 수정(USER_UPDATED)·토큰 갱신 때마다 갱신된다.
 *
 * 화면 표시용 값이다 — 실제 권한은 DB의 RLS가 JWT로 다시 확인한다.
 */

export type AuthSnapshot = {
  user: User | null;
  /** 첫 세션 확인이 끝났는지 (Supabase 미설정이면 처음부터 true) */
  ready: boolean;
};

const INITIAL: AuthSnapshot = { user: null, ready: !isSupabaseConfigured() };

let snapshot = INITIAL;
let readyPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function start() {
  if (readyPromise || typeof window === "undefined" || !isSupabaseConfigured()) {
    return;
  }
  const supabase = createClient();
  readyPromise = new Promise((resolve) => {
    // 콜백 안에서 다른 supabase 호출을 기다리면 교착될 수 있어 값만 바꾼다
    supabase.auth.onAuthStateChange((_event, session) => {
      snapshot = { user: session?.user ?? null, ready: true };
      listeners.forEach((notify) => notify());
      resolve();
    });
  });
}

/** 데이터 함수용 — 첫 세션 확인을 기다린 뒤 현재 사용자 */
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return null;
  start();
  await readyPromise;
  return snapshot.user;
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  start();
  return () => {
    listeners.delete(notify);
  };
}

/** 컴포넌트용 — 로그인 상태가 바뀌면 다시 그린다 */
export function useAuthUser(): AuthSnapshot {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => INITIAL,
  );
}
