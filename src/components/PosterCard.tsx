import Link from "next/link";
import type { MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";

type PosterCardProps = {
  item: MediaItem;
  index?: number;
  className?: string;
  showProgress?: boolean;
};

export function PosterCard({
  item,
  index = 0,
  className = "",
  showProgress = false,
}: PosterCardProps) {
  return (
    <Link
      href={`/movie/${item.id}`}
      className={`group block w-full shrink-0 animate-rail-in ${className}`}
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-surface-container shadow-poster ring-1 ring-white/20 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-lift group-hover:ring-pearl/50">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          <MediaVisual item={item} sizes="(max-width:768px) 40vw, 200px" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

        <div className="pearl-clay-soft absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium tabular-nums text-on-surface">
          {item.rating.toFixed(1)}
        </div>

        {showProgress && item.progress != null ? (
          <div className="absolute inset-x-3 bottom-3">
            <div className="h-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-pearl shadow-[0_0_10px_rgba(255,255,255,0.45)]"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 space-y-1 px-0.5">
        <p className="truncate text-[15px] font-bold text-on-surface transition-colors group-hover:text-primary">
          {item.title}
        </p>
        <p className="text-xs text-on-surface-variant">
          {item.year}
          <span className="mx-1.5 opacity-40">·</span>
          {item.type === "movie" ? "영화" : "시리즈"}
        </p>
      </div>
    </Link>
  );
}
