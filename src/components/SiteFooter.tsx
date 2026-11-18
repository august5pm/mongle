import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/[0.06] pt-5 pb-5 text-center">
      <p className="font-brand text-xl tracking-wide text-on-surface/80">
        몽글
      </p>
      <Link
        href="/about"
        className="mt-1.5 inline-block text-[13px] text-on-surface-variant transition-colors duration-fast hover:text-on-surface"
      >
        몽글 소개
      </Link>
      <p className="mt-2.5 text-[12px] leading-relaxed tracking-wide text-on-surface-variant/65">
        © {year} by{" "}
        <a
          href="https://github.com/august5pm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface-variant/85 transition-colors hover:text-on-surface"
        >
          august5pm
        </a>
        . All rights reserved.
      </p>

      {/*
        TMDB 출처 표기 — API 이용약관 3항: 로고로 TMDB 사용을 밝히고 아래 고지문을 표시.
        로고는 몽글 워드마크보다 덜 눈에 띄게(작게) 둔다. 파일은 공식 'Alt short' SVG 원본.
      */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TMDB (The Movie Database)"
          className="opacity-60 transition-opacity hover:opacity-90"
        >
          <Image
            src="/tmdb-logo.svg"
            alt="TMDB"
            width={64}
            height={8}
            unoptimized
          />
        </a>
        <p className="max-w-sm text-[11px] leading-relaxed text-on-surface-variant/55">
          This website uses TMDB and the TMDB APIs but is not endorsed,
          certified, or otherwise approved by TMDB.
        </p>
      </div>
    </footer>
  );
}
