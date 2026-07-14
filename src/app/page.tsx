import { ContinueWatchingRail } from "@/components/ContinueWatchingRail";
import { Hero } from "@/components/Hero";
import { RainyDayRail } from "@/components/RainyDayRail";
import { SoftFluffyBento } from "@/components/SoftFluffyBento";
import { continueWatching, featured, rainyDay, softFluffy } from "@/data/mock";

export default function HomePage() {
  return (
    <div>
      <Hero item={featured} />
      <ContinueWatchingRail items={continueWatching} />
      <SoftFluffyBento items={softFluffy} />
      <RainyDayRail items={rainyDay} />
    </div>
  );
}
