import type { MediaItem } from "@/data/mock";
import { HomeSectionHeader } from "@/components/HomePosterBits";
import { PosterSwiper } from "@/components/PosterSwiper";

type TodayPickGridProps = {
  items: MediaItem[];
  title?: string;
  moreHref?: string;
};

export function TodayPickGrid({
  items,
  title = "오늘 이거 볼까요",
  moreHref = "/explore",
}: TodayPickGridProps) {
  const picks = items.slice(0, 10);
  if (!picks.length) return null;

  return (
    <section id="home-today" className="mt-6 scroll-mt-20">
      <HomeSectionHeader title={title} moreHref={moreHref} />
      <PosterSwiper items={picks} priorityCount={3} />
    </section>
  );
}
