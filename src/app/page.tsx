import { Hero } from "@/components/Hero";
import { PosterRail } from "@/components/PosterRail";
import { SoftFluffyBento } from "@/components/SoftFluffyBento";
import { TodayPickGrid } from "@/components/TodayPickGrid";
import {
  continueWatching,
  featured as mockFeatured,
  rainyDay as mockRainy,
  softFluffy as mockSoft,
} from "@/data/mock";
import { pickTodayCurations } from "@/lib/home-curation";
import { fetchHomeRails } from "@/lib/tmdb-api";

/** 날짜 큐레이션이 바뀌도록 주기적으로 재생성 */
export const revalidate = 3600;

export default async function HomePage() {
  const rails = await fetchHomeRails();
  const [bentoCat, railCat] = pickTodayCurations();

  const featured = rails?.featured ?? mockFeatured;

  // 오늘 픽 = 일간 / 지금 뜨는 = 주간 (서로 다른 풀)
  const todayPicks = rails?.todayPicks?.length
    ? rails.todayPicks
    : continueWatching.slice(0, 10);
  const trending = rails?.trending?.length
    ? rails.trending
    : continueWatching.slice(0, 12);

  const bentoItems = rails?.bento.items?.length ? rails.bento.items : mockSoft;
  const railItems = rails?.posterRail.items?.length
    ? rails.posterRail.items
    : mockRainy;

  // 제목·데이터는 같은 큐레이션 카테고리를 씀
  const bentoMeta = rails?.bento.category ?? bentoCat;
  const railMeta = rails?.posterRail.category ?? railCat;

  return (
    <div>
      <Hero item={featured} />
      <TodayPickGrid items={todayPicks} />
      <PosterRail
        id="home-trending"
        items={trending}
        title="지금 뜨는"
        icon="sparkles"
        priorityCount={0}
      />
      <SoftFluffyBento
        items={bentoItems}
        title={bentoMeta.title}
        subtitle={bentoMeta.subtitle}
        badge={bentoMeta.badge}
        icon={bentoMeta.icon}
      />
      <PosterRail
        id="home-debate"
        items={railItems}
        title={railMeta.title}
        icon={railMeta.icon}
      />
    </div>
  );
}
