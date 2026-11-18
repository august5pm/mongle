import type { Sentiment } from "@/data/mock";

/**
 * 감정 색 — globals.css --emotion-*.
 * 몽환·따뜻함·강렬·잔잔함 순서로 이웃할 때 색약에서도 구분되도록 검증한 조합이라
 * 순서·값을 바꾸면 다시 검증한다 (docs/design-system.md).
 */
export const EMOTION_COLOR: Record<Sentiment, string> = {
  Dreamy: "var(--emotion-dreamy)",
  Warm: "var(--emotion-warm)",
  Intense: "var(--emotion-intense)",
  Soft: "var(--emotion-soft)",
};
