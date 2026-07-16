import type { User } from "@supabase/supabase-js";

export const PROFILE_EMOJIS = [
  "☁️",
  "🎬",
  "🌙",
  "✨",
  "🌸",
  "🍵",
  "🌧️",
  "🫧",
  "🎀",
  "🪐",
  "💫",
  "🧸",
] as const;

export type MongleProfile = {
  nickname: string;
  emoji: string;
  /** Google 원본 이름 (참고용) */
  googleName?: string;
  email?: string;
};

export function getMongleProfile(user: User | null | undefined): MongleProfile {
  const meta = user?.user_metadata ?? {};
  const googleName =
    (meta.full_name as string | undefined) ||
    (meta.name as string | undefined) ||
    undefined;
  const nickname =
    (typeof meta.nickname === "string" && meta.nickname.trim()) ||
    googleName ||
    user?.email?.split("@")[0] ||
    "시네마 드리머";
  const emoji =
    (typeof meta.emoji === "string" && meta.emoji.trim()) || "☁️";

  return {
    nickname,
    emoji,
    googleName,
    email: user?.email,
  };
}

export function hasCustomProfile(user: User | null | undefined): boolean {
  const meta = user?.user_metadata ?? {};
  return Boolean(
    (typeof meta.nickname === "string" && meta.nickname.trim()) ||
      (typeof meta.emoji === "string" && meta.emoji.trim()),
  );
}
