import Image from "next/image";
import { tmdbImage, type TmdbSize } from "@/lib/tmdb";
import type { MediaItem } from "@/data/mock";

type MediaVisualProps = {
  item: MediaItem;
  kind?: "poster" | "backdrop";
  size?: TmdbSize;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** 포스터/백드롭 이미지. 실패 시 톤 그라데이션이 비침. */
export function MediaVisual({
  item,
  kind = "poster",
  size,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: MediaVisualProps) {
  const path = kind === "backdrop" ? item.backdropPath : item.posterPath;
  const fallbackTone =
    kind === "backdrop" ? item.backdropTone : item.posterTone;
  const imgSize =
    size ?? (kind === "backdrop" ? "w1280" : "w500");
  const src = tmdbImage(path, imgSize);

  return (
    <div className="absolute inset-0">
      <div
        className={`absolute inset-0 ${className}`}
        style={{ background: fallbackTone }}
        aria-hidden
      />
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${className}`}
        />
      ) : null}
    </div>
  );
}
