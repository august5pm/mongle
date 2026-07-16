"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import type { MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";
import { WishlistButton } from "@/components/WishlistButton";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchMyWishlist, type WishlistRow } from "@/lib/wishlist";

function rowToMedia(row: WishlistRow): MediaItem {
  return {
    id: row.media_id,
    title: row.title || "제목 없음",
    type: row.media_type === "tv" ? "tv" : "movie",
    year: 0,
    rating: 0,
    overview: "",
    genres: [],
    posterTone: "linear-gradient(160deg, #1a1230 0%, #4a2a58 45%, #ffb3a7 150%)",
    backdropTone:
      "linear-gradient(160deg, #0c1420 0%, #1e3a5f 50%, #c9d8ff 140%)",
    posterPath: row.poster_path ?? undefined,
  };
}

export function WishlistClient() {
  const [rows, setRows] = useState<WishlistRow[]>([]);
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  async function reload() {
    if (!isSupabaseConfigured()) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setLoggedIn(Boolean(user));
    if (!user) {
      setRows([]);
      setReady(true);
      return;
    }
    try {
      setRows(await fetchMyWishlist());
    } catch {
      setRows([]);
    }
    setReady(true);
  }

  useEffect(() => {
    reload();
    const onUpdate = () => reload();
    window.addEventListener("mongle-wishlist-updated", onUpdate);
    return () => window.removeEventListener("mongle-wishlist-updated", onUpdate);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-container-mobile pb-8 pt-24 sm:px-container-desktop">
      <p className="text-label-sm tracking-widest text-primary">Wishlist</p>
      <h1 className="mt-3 font-display text-display-lg-mobile text-on-surface">
        위시리스트
      </h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        나중에 보고 싶은 작품을 담아 두세요.
      </p>

      {!ready ? (
        <p className="mt-10 text-on-surface-variant">불러오는 중…</p>
      ) : !loggedIn ? (
        <div className="glass-panel mt-10 space-y-4 rounded-3xl p-6">
          <p className="text-body-md text-on-surface-variant">
            로그인하면 위시리스트가 계정에 저장됩니다.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent("/wishlist")}`}
            className="pearl-clay peach-glow inline-flex rounded-full px-6 py-3 text-sm font-bold"
          >
            Google로 로그인
          </Link>
        </div>
      ) : rows.length === 0 ? (
        <div className="glass-panel mt-10 space-y-4 rounded-3xl p-8 text-center">
          <Bookmark size={28} className="mx-auto text-primary" />
          <p className="text-body-md text-on-surface-variant">
            아직 담아 둔 작품이 없어요.
          </p>
          <Link
            href="/explore"
            className="pearl-clay peach-glow inline-flex rounded-full px-6 py-3 text-sm font-bold"
          >
            탐색하러 가기
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {rows.map((row) => {
            const item = rowToMedia(row);
            return (
              <div key={row.id} className="group relative">
                <Link href={`/movie/${row.media_id}`} className="block">
                  <div className="glass-panel relative mb-3 aspect-[2/3] overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <MediaVisual item={item} sizes="25vw" />
                    </div>
                  </div>
                  <h3 className="truncate text-sm font-semibold text-on-surface">
                    {row.title}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    {row.media_type === "tv" ? "시리즈" : "영화"}
                  </p>
                </Link>
                <div className="absolute right-2 top-2 z-10">
                  <WishlistButton
                    mediaId={row.media_id}
                    title={row.title}
                    posterPath={row.poster_path ?? undefined}
                    mediaType={row.media_type === "tv" ? "tv" : "movie"}
                    variant="heart"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
