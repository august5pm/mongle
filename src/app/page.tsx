import { ContinueWatchingRail } from "@/components/ContinueWatchingRail";
import { Hero } from "@/components/Hero";
import { RainyDayRail } from "@/components/RainyDayRail";
import { SoftFluffyBento } from "@/components/SoftFluffyBento";
import {
  continueWatching,
  featured as mockFeatured,
  rainyDay as mockRainy,
  softFluffy as mockSoft,
} from "@/data/mock";
import { fetchHomeRails } from "@/lib/tmdb-api";

export default async function HomePage() {
  const rails = await fetchHomeRails();

  const featured = rails?.featured ?? mockFeatured;
  const trending = rails?.trending?.length
    ? rails.trending
    : continueWatching;
  const soft = rails?.softFluffy?.length ? rails.softFluffy : mockSoft;
  const rainy = rails?.rainyDay?.length ? rails.rainyDay : mockRainy;

  return (
    <div>
      <Hero item={featured} />
      <ContinueWatchingRail
        items={trending}
        title={rails ? "지금 뜨는" : "이어보기"}
        subtitle={rails ? "Trending Now" : "Continue Watching"}
      />
      <SoftFluffyBento items={soft} />
      <RainyDayRail items={rainy} />
    </div>
  );
}
