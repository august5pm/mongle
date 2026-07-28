import { PosterRail } from "@/components/PosterRail";
import type { MediaItem } from "@/data/mock";
import type { CurationIcon } from "@/lib/home-curation";

type HomeCurationRailProps = {
  items: MediaItem[];
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: CurationIcon;
};

/**
 * 홈 큐레이션 섹션.
 * 포스터는 2:3 비율이라 벤토(가로·정사각)로 넣으면 잘리므로
 * 다른 홈 레일과 동일한 세로 포스터 스와이퍼를 사용한다.
 */
export function SoftFluffyBento({
  items,
  title,
  icon,
}: HomeCurationRailProps) {
  return (
    <PosterRail
      id="home-curation"
      items={items}
      title={title}
      icon={icon}
      priorityCount={3}
    />
  );
}
