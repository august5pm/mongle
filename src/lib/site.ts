/** 사이트 공통 메타 정보 — 레이아웃·상세 OG에서 공유 */

export const SITE_NAME = "몽글";

export const SITE_DESCRIPTION =
  "몽글(Mongle) — 영화와 감정을 부드럽게 기록하는 시네마틱 공간.";

/**
 * OG 이미지 등 절대 URL의 기준.
 * NEXT_PUBLIC_SITE_URL(직접 지정) → Vercel 프로덕션 도메인(시스템 변수) → 로컬 순.
 */
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

/** public/og-default.png — 1200×630 브랜드 이미지 */
export const DEFAULT_OG_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "몽글 — 영화와 감정을 부드럽게 기록하는 곳",
};

/**
 * 하위 페이지가 openGraph를 정의하면 레이아웃 값을 통째로 덮어쓰므로(얕은 병합),
 * 공통 필드는 여기서 펼쳐 쓴다.
 */
export const BASE_OPEN_GRAPH = {
  siteName: SITE_NAME,
  locale: "ko_KR",
} as const;

/** 공유 미리보기용 설명 — 너무 길면 말줄임 */
export function summarize(text: string | undefined, max = 110) {
  const t = text?.replace(/\s+/g, " ").trim();
  if (!t) return undefined;
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}
