import type { Metadata } from "next";
import { ExploreClient } from "@/components/ExploreClient";

export const metadata: Metadata = {
  title: "탐색",
};

export default function ExplorePage() {
  return (
    <div className="relative mx-auto max-w-7xl space-y-10 px-container-mobile pb-8 pt-24 sm:px-container-desktop">
      <div className="pointer-events-none fixed right-[-10%] top-[-10%] -z-10 h-[500px] w-[500px] animate-pulse rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-secondary/10 blur-[140px]" />
      <ExploreClient />
    </div>
  );
}
