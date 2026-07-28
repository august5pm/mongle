import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";
import { WishlistButton } from "@/components/WishlistButton";

type HeroProps = {
  item: MediaItem;
};

export function Hero({ item }: HeroProps) {
  const titleLines = item.title.includes(" ")
    ? (() => {
        const words = item.title.split(" ");
        const mid = Math.ceil(words.length / 2);
        return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
      })()
    : [item.title];

  return (
    <section
      id="home-hero"
      className="app-bleed relative mt-16 flex min-h-[360px] scroll-mt-20 flex-col justify-end overflow-hidden"
      style={{ height: "min(52vh, 560px)" }}
    >
      <div className="edge-fade-x absolute inset-0 z-0">
        <div className="hero-mask absolute inset-0 animate-fade-in">
          <MediaVisual
            item={item}
            kind="backdrop"
            size="w1280"
            priority
            sizes="(max-width:1280px) 100vw, 1280px"
            className="object-center"
          />
        </div>
        <div className="hero-fade-bottom" aria-hidden />
      </div>

      <div className="relative z-10 mb-6 space-y-3 px-[var(--app-pad)]">
        <div className="pearl-clay-soft inline-flex items-center gap-2 rounded-full px-3 py-1">
          <span className="relative h-4 w-5 shrink-0">
            <Image
              src="/cloud.png"
              alt=""
              fill
              sizes="20px"
              className="object-contain"
            />
          </span>
          <span className="text-label-sm tracking-widest text-primary">
            오늘의 추천
          </span>
        </div>

        <h2 className="font-display text-[clamp(1.75rem,4.5cqi,3.25rem)] leading-tight text-on-surface">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p className="max-w-md line-clamp-2 text-sm text-on-surface-variant md:text-body-md">
          {item.overview}
        </p>

        <div className="flex items-center gap-3 pt-1">
          <Link
            href={`/movie/${item.id}`}
            className="pearl-clay peach-glow flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-transform hover:scale-105 active:scale-[0.98]"
          >
            <Play size={18} fill="currentColor" />
            자세히 보기
          </Link>
          <WishlistButton
            mediaId={item.id}
            title={item.title}
            posterPath={item.posterPath}
            mediaType={item.type}
            variant="bookmark"
          />
        </div>
      </div>
    </section>
  );
}
