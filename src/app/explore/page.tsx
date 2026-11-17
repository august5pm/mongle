import type { Metadata } from "next";
import { ExploreClient } from "@/components/ExploreClient";

export const metadata: Metadata = {
  title: "찾기",
};

export default function ExplorePage() {
  return (
    <div className="relative space-y-10 pb-8 pt-24">
      <ExploreClient />
    </div>
  );
}
