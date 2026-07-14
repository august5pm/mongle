"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Search } from "lucide-react";

export function TopAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isDetail = pathname.startsWith("/movie/");

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
        {isDetail ? (
          <button
            type="button"
            className="pearl-clay-soft flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-opacity hover:opacity-80"
            aria-label="찜하기"
          >
            <Heart size={18} />
          </button>
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
          href="/profile"
          className="pearl-clay flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-105"
          aria-label="프로필"
        >
          <span className="text-xs font-bold">나</span>
        </Link>
      </div>
    </header>
  );
}
