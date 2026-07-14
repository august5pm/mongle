import Link from "next/link";
import type { MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";

type SoftFluffyBentoProps = {
  items: MediaItem[];
};

export function SoftFluffyBento({ items }: SoftFluffyBentoProps) {
  const [featured, second, third, fourth] = items;

  if (!featured) return null;

  return (
    <section className="mt-12 px-container-mobile sm:px-container-desktop">
      <h3 className="font-display text-headline-md text-on-surface">
        포근한 이야기
      </h3>
      <p className="mb-6 mt-0.5 text-xs tracking-wide text-on-surface-variant">
        Soft &amp; Fluffy Stories
      </p>

      <div className="grid h-auto grid-cols-2 grid-rows-2 gap-3 sm:h-[450px] sm:grid-cols-4">
        <Link
          href={`/movie/${featured.id}`}
          className="glass-panel group relative col-span-2 row-span-2 min-h-[220px] cursor-pointer overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <MediaVisual item={featured} sizes="(max-width:768px) 100vw, 50vw" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-6">
            <span className="pearl-clay mb-2 w-fit rounded-full px-3 py-1 text-[10px] font-bold">
              추천 작품
            </span>
            <h4 className="font-display text-2xl font-bold text-on-surface">
              {featured.title}
            </h4>
          </div>
        </Link>

        {second ? (
          <Link
            href={`/movie/${second.id}`}
            className="glass-panel group relative col-span-2 row-span-1 min-h-[120px] cursor-pointer overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
              <MediaVisual
                item={second}
                kind="backdrop"
                sizes="(max-width:768px) 100vw, 40vw"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
              <h4 className="font-bold text-on-surface">{second.title}</h4>
            </div>
          </Link>
        ) : null}

        {third ? (
          <Link
            href={`/movie/${third.id}`}
            className="glass-panel group relative col-span-1 row-span-1 min-h-[120px] cursor-pointer overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
              <MediaVisual item={third} sizes="25vw" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
              <h4 className="truncate text-sm font-bold text-on-surface">
                {third.title}
              </h4>
            </div>
          </Link>
        ) : null}

        {fourth ? (
          <Link
            href={`/movie/${fourth.id}`}
            className="glass-panel group relative col-span-1 row-span-1 min-h-[120px] cursor-pointer overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
              <MediaVisual item={fourth} sizes="25vw" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
              <h4 className="truncate text-sm font-bold text-on-surface">
                {fourth.title}
              </h4>
            </div>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
