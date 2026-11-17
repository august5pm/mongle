"use client";

import Image from "next/image";
import { useState } from "react";
import { tmdbImage, type TmdbSize } from "@/lib/tmdb-image";
import type { MediaItem } from "@/data/mock";

type MediaVisualProps = {
  item: MediaItem;
  kind?: "poster" | "backdrop";
  size?: TmdbSize;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** 장식용이면 빈 문자열. 기본은 작품 제목 기반 */
  alt?: string;
};

/**
 * 포스터/백드롭 이미지.
 * 로드 전엔 톤 그라데이션이 보이고, 로드되면 살짝 선명해지며 페이드인(.media-img).
 * priority 이미지는 LCP를 늦추지 않도록 처음부터 보인다. 실패 시 톤이 그대로 비침.
 */
export function MediaVisual({
  item,
  kind = "poster",
  size,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 50vw, 25vw",
  alt,
}: MediaVisualProps) {
  const [loaded, setLoaded] = useState(priority);
  const path = kind === "backdrop" ? item.backdropPath : item.posterPath;
  const fallbackTone =
    kind === "backdrop" ? item.backdropTone : item.posterTone;
  const imgSize =
    size ?? (kind === "backdrop" ? "w780" : "w342");
  const src = tmdbImage(path, imgSize);
  const resolvedAlt =
    alt ??
    (item.title
      ? `${item.title} ${kind === "backdrop" ? "장면" : "포스터"}`
      : "");

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
          alt={resolvedAlt}
          fill
          priority={priority}
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          data-loaded={loaded}
          className={`media-img object-cover ${className}`}
        />
      ) : null}
    </div>
  );
}
