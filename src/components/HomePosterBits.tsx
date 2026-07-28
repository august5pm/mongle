import Link from "next/link";
import { Star } from "lucide-react";
import type { MediaItem } from "@/data/mock";
import { MediaVisual } from "@/components/MediaVisual";

type PosterMetaProps = {
  item: MediaItem;
};

export function PosterMeta({ item }: PosterMetaProps) {
  const meta = [
    item.year || null,
    item.type === "tv" ? "시리즈" : null,
    item.genres[0] ?? null,
  ].filter(Boolean);

  return (
    <div className="mt-2.5 w-full space-y-1 text-left">
      <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-on-surface">
        {item.title}
      </p>
      <p className="flex items-center justify-start gap-1 text-[12px] text-on-surface-variant">
        <Star size={12} className="shrink-0 text-primary" fill="currentColor" />
        <span className="tabular-nums text-on-surface/90">
          {item.rating.toFixed(1)}
        </span>
      </p>
      {meta.length ? (
        <p className="truncate text-[12px] text-on-surface-variant/75">
          {meta.join(" · ")}
        </p>
      ) : null}
    </div>
  );
}

type SectionHeaderProps = {
  title: string;
  moreHref?: string;
  moreLabel?: string;
};

export function HomeSectionHeader({
  title,
  moreHref = "/explore",
  moreLabel = "더보기",
}: SectionHeaderProps) {
  return (
    <div className="mb-3.5 flex items-center justify-between gap-3">
      <h3 className="text-[17px] font-semibold tracking-tight text-on-surface">
        {title}
      </h3>
      <Link
        href={moreHref}
        className="shrink-0 text-[13px] text-on-surface-variant transition-colors hover:text-on-surface"
      >
        {moreLabel}
      </Link>
    </div>
  );
}

type CompactPosterCardProps = {
  item: MediaItem;
  priority?: boolean;
};

/** 컨테이너 폭에 따라 같이 줄어드는 포스터 카드 */
export function CompactPosterCard({
  item,
  priority = false,
}: CompactPosterCardProps) {
  return (
    <Link href={`/movie/${item.id}`} className="poster-card group block">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-surface-container">
        <MediaVisual
          item={item}
          size="w342"
          priority={priority}
          sizes="(max-width:1280px) 22vw, 168px"
          className="object-center"
        />
      </div>
      <PosterMeta item={item} />
    </Link>
  );
}
