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
    <section className="relative flex h-[70vh] w-full flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="hero-mask absolute inset-0 scale-105 animate-fade-in">
          <MediaVisual
            item={item}
            kind="backdrop"
            priority
            sizes="100vw"
            className=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute -right-16 top-16 h-[380px] w-[380px] animate-float rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -left-20 bottom-8 h-[300px] w-[300px] rounded-full bg-secondary/12 blur-[110px]" />
      </div>

      <div className="relative z-10 mb-8 space-y-4 px-container-mobile sm:px-container-desktop">
        <div className="pearl-clay-soft inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5">
          <span className="relative h-5 w-6 shrink-0">
            <Image
              src="/cloud.png"
              alt=""
              fill
              sizes="24px"
              className="object-contain"
            />
          </span>
          <span className="text-label-sm tracking-widest text-primary">
            오늘의 추천
          </span>
        </div>

        <h2 className="font-display text-4xl leading-tight text-on-surface md:text-6xl">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        {item.originalTitle ? (
          <p className="text-sm text-on-surface-variant">{item.originalTitle}</p>
        ) : null}

        <p className="max-w-md line-clamp-2 text-body-md text-on-surface-variant">
          {item.overview}
        </p>

        <div className="flex items-center gap-4 pt-2">
          <Link
            href={`/movie/${item.id}`}
            className="pearl-clay peach-glow flex items-center gap-2 rounded-full px-8 py-3 font-bold transition-transform hover:scale-105 active:scale-[0.98]"
          >
            <Play size={20} fill="currentColor" />
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
