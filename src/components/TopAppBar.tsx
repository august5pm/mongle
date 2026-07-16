"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getMongleProfile } from "@/lib/profile";
import { WishlistButton } from "@/components/WishlistButton";
import { getMediaById } from "@/data/mock";

export function TopAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isDetail = pathname.startsWith("/movie/");
  const detailId = isDetail ? decodeURIComponent(pathname.slice("/movie/".length)) : null;
  const [user, setUser] = useState<User | null>(null);
  const [detailMeta, setDetailMeta] = useState<{
    title: string;
    posterPath?: string;
    mediaType: "movie" | "tv";
  } | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const onProfileUpdated = () => {
      supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    };
    window.addEventListener("mongle-profile-updated", onProfileUpdated);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("mongle-profile-updated", onProfileUpdated);
    };
  }, []);

  useEffect(() => {
    if (!detailId) {
      setDetailMeta(null);
      return;
    }
    const local = getMediaById(detailId);
    if (local) {
      setDetailMeta({
        title: local.title,
        posterPath: local.posterPath,
        mediaType: local.type,
      });
      return;
    }
    let cancelled = false;
    fetch(`/api/tmdb/media/${encodeURIComponent(detailId)}`)
      .then(async (res) => {
        const data = (await res.json()) as {
          item?: {
            title?: string;
            posterPath?: string;
            type?: "movie" | "tv";
          } | null;
        };
        if (!cancelled && data.item?.title) {
          setDetailMeta({
            title: data.item.title,
            posterPath: data.item.posterPath,
            mediaType: data.item.type ?? "movie",
          });
        }
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      cancelled = true;
    };
  }, [detailId]);

  const profile = getMongleProfile(user);

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between px-container-mobile sm:px-container-desktop">
      <div className="absolute inset-0 border-b border-white/10 bg-[#050607]/55 backdrop-blur-2xl" />

      <div className="relative z-10 flex items-center gap-2.5">
        {isDetail ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="pearl-clay-soft mr-1 flex h-9 w-9 items-center justify-center rounded-full text-primary transition-transform active:scale-95"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={18} />
          </button>
        ) : null}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative h-9 w-11 shrink-0 drop-shadow-[0_6px_16px_rgba(180,200,230,0.35)]">
            <Image
              src="/cloud.png"
              alt=""
              fill
              sizes="44px"
              className="object-contain"
              priority
            />
          </span>
          <span className="flex items-baseline gap-2">
            <h1 className="font-brand text-[2.35rem] font-bold leading-none tracking-tight mongle-gradient-text">
              몽글
            </h1>
            <span className="hidden font-brand text-sm font-normal tracking-[0.08em] text-on-surface-variant sm:inline">
              Mongle
            </span>
          </span>
        </Link>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        {isDetail && detailId && detailMeta ? (
          <WishlistButton
            mediaId={detailId}
            title={detailMeta.title}
            posterPath={detailMeta.posterPath}
            mediaType={detailMeta.mediaType}
            variant="heart"
          />
        ) : (
          <Link
            href="/explore"
            className="pearl-clay-soft flex h-9 w-9 items-center justify-center rounded-full text-primary transition-transform hover:scale-105"
            aria-label="검색"
          >
            <Search size={18} strokeWidth={1.75} />
          </Link>
        )}
        <Link
          href={user ? "/profile" : `/login?next=${encodeURIComponent(pathname)}`}
          className="pearl-clay relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-base leading-none transition-transform hover:scale-105"
          aria-label={user ? "프로필" : "로그인"}
        >
          {user ? (
            <span aria-hidden>{profile.emoji}</span>
          ) : (
            <span className="text-xs font-bold">나</span>
          )}
        </Link>
      </div>
    </header>
  );
}
