import Link from "next/link";
import { PlayCircle } from "lucide-react";
import type { MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";

type ContinueWatchingRailProps = {
  items: MediaItem[];
  title?: string;
  subtitle?: string;
};

export function ContinueWatchingRail({
  items,
  title = "이어보기",
  subtitle = "Continue Watching",
}: ContinueWatchingRailProps) {
  return (
    <section className="mt-8 px-container-mobile sm:px-container-desktop">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="font-display text-headline-md text-on-surface">
            {title}
          </h3>
          <p className="mt-0.5 text-xs tracking-wide text-on-surface-variant">
            {subtitle}
          </p>
        </div>
        <Link href="/explore" className="text-label-sm text-primary">
          전체 보기
        </Link>
      </div>

      <div className="hide-scrollbar -mx-container-mobile flex gap-4 overflow-x-auto px-container-mobile pb-4 sm:-mx-container-desktop sm:px-container-desktop">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/movie/${item.id}`}
            className="group w-64 flex-none cursor-pointer"
          >
            <div className="glass-panel relative mb-3 aspect-video overflow-hidden rounded-2xl">
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                <MediaVisual
                  item={item}
                  kind="backdrop"
                  sizes="280px"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                <div
                  className="h-full bg-pearl shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                  style={{ width: `${item.progress ?? 0}%` }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle size={40} className="text-white" />
              </div>
            </div>
            <h4 className="truncate font-bold text-on-surface">{item.title}</h4>
            <p className="text-label-sm text-on-surface-variant">
              {item.remainingLabel ?? `${100 - (item.progress ?? 0)}% 남음`}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
