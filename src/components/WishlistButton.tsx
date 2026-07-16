"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, Heart } from "lucide-react";
import type { MediaType } from "@/data/mock";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  isInWishlist,
  toggleWishlist,
  type WishlistInput,
} from "@/lib/wishlist";

type Variant = "bookmark" | "heart" | "pill" | "icon";

type WishlistButtonProps = {
  mediaId: string;
  title: string;
  posterPath?: string;
  mediaType?: MediaType;
  variant?: Variant;
  className?: string;
  label?: string;
};

export function WishlistButton({
  mediaId,
  title,
  posterPath,
  mediaType = "movie",
  variant = "pill",
  className = "",
  label = "위시리스트에 담기",
}: WishlistButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isSupabaseConfigured()) {
        setReady(true);
        return;
      }
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) {
          if (!cancelled) setReady(true);
          return;
        }
        const inList = await isInWishlist(mediaId);
        if (!cancelled) setSaved(inList);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [mediaId]);

  function onClick() {
    if (!isSupabaseConfigured()) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        const input: WishlistInput = {
          mediaId,
          title,
          posterPath,
          mediaType,
        };
        const result = await toggleWishlist(input);
        setSaved(result === "added");
        window.dispatchEvent(new Event("mongle-wishlist-updated"));
      } catch (e) {
        console.error(e);
        alert(
          e instanceof Error
            ? e.message
            : "위시리스트 저장에 실패했어요. DB 마이그레이션을 확인해 주세요.",
        );
      }
    });
  }

  const active = saved && ready;

  if (variant === "heart") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-label={active ? "위시리스트에서 제거" : "찜하기"}
        aria-pressed={active}
        className={`pearl-clay-soft flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80 disabled:opacity-50 ${className}`}
      >
        <Heart
          size={18}
          className={active ? "text-primary" : "text-on-surface-variant"}
          fill={active ? "currentColor" : "none"}
        />
      </button>
    );
  }

  if (variant === "icon" || variant === "bookmark") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-label={active ? "위시리스트에서 제거" : "나중에 보기"}
        aria-pressed={active}
        className={`pearl-clay-soft flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-105 disabled:opacity-50 ${className}`}
      >
        <Bookmark
          size={20}
          className={active ? "text-primary" : "text-on-surface"}
          fill={active ? "currentColor" : "none"}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={active}
      className={`pearl-clay-soft flex items-center gap-3 rounded-full px-6 py-4 text-on-surface transition-transform hover:scale-[1.02] disabled:opacity-50 ${className}`}
    >
      <Bookmark size={20} fill={active ? "currentColor" : "none"} />
      <span>{active ? "위시리스트에 담김" : label}</span>
    </button>
  );
}
