import type { Metadata } from "next";
import { StatsClient } from "@/components/StatsClient";

export const metadata: Metadata = {
  title: "감정 통계",
};

export default function StatsPage() {
  return <StatsClient />;
}
