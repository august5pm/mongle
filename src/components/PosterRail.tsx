import type { MediaItem } from "@/data/mock";
import type { CurationIcon } from "@/lib/home-curation";
import { HomeSectionHeader } from "@/components/HomePosterBits";
import { PosterSwiper } from "@/components/PosterSwiper";

type PosterRailProps = {
  id?: string;
  items: MediaItem[];
  title: string;
  subtitle?: string;
  icon?: CurationIcon;
  moreHref?: string;
  moreLabel?: string;
  priorityCount?: number;
};

export function PosterRail({
  id,
  items,
  title,
  moreHref = "/explore",
  moreLabel = "더보기",
  priorityCount = 4,
}: PosterRailProps) {
  if (!items.length) return null;

  return (
    <section id={id} className="mt-7 scroll-mt-20">
      <HomeSectionHeader
        title={title}
        moreHref={moreHref}
        moreLabel={moreLabel}
      />
      <PosterSwiper items={items} priorityCount={priorityCount} />
    </section>
  );
}
