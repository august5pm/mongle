import Link from "next/link";
import { CloudRain, Star } from "lucide-react";
import type { MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";

type RainyDayRailProps = {
  items: MediaItem[];
};

export function RainyDayRail({ items }: RainyDayRailProps) {
  return (
    <section className="mt-12 px-container-mobile sm:px-container-desktop">
      <div className="mb-6 flex items-center gap-3">
        <CloudRain size={22} className="text-secondary" fill="currentColor" />
        <div>
          <h3 className="font-display text-headline-md text-on-surface">
            비 오는 날의 영화
          </h3>
          <p className="text-xs tracking-wide text-on-surface-variant">
            Movies for a Rainy Day
          </p>
        </div>
      </div>

      <div className="hide-scrollbar -mx-container-mobile flex gap-6 overflow-x-auto px-container-mobile pb-4 sm:-mx-container-desktop sm:px-container-desktop">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/movie/${item.id}`}
            className="group w-40 flex-none"
          >
            <div className="relative mb-3 aspect-[2/3] overflow-hidden rounded-2xl shadow-poster ring-1 ring-white/20 transition-transform duration-300 group-hover:-translate-y-2">
              <MediaVisual item={item} sizes="160px" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent" />
            </div>
            <p className="truncate text-center text-sm font-bold text-on-surface">
              {item.title}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1">
              <Star size={12} className="text-primary" fill="currentColor" />
              <span className="text-[10px] text-on-surface-variant">
                {item.rating.toFixed(1)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
