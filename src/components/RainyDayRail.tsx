import { PosterRail } from "@/components/PosterRail";
import type { MediaItem } from "@/data/mock";
import type { CurationIcon } from "@/lib/home-curation";

type RainyDayRailProps = {
  items: MediaItem[];
  title: string;
  subtitle?: string;
  icon?: CurationIcon;
};

/** @deprecated Prefer PosterRail — 호환용 래퍼 */
export function RainyDayRail({
  items,
  title,
  subtitle,
  icon = "rain",
}: RainyDayRailProps) {
  return (
    <PosterRail
      items={items}
      title={title}
      subtitle={subtitle}
      icon={icon}
    />
  );
}
