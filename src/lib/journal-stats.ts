import { sentiments, type JournalEntry, type Sentiment } from "@/data/mock";

/** 감정 통계 화면에 쓰는 집계 — 순수 함수라 서버·클라이언트·테스트 어디서나 쓴다 */

export const SENTIMENT_ORDER: Sentiment[] = sentiments.map((s) => s.id);

export type EmotionShare = {
  id: Sentiment;
  label: string;
  description: string;
  count: number;
  /** 0–1 */
  share: number;
};

export type MonthBucket = {
  /** "2026-07" */
  key: string;
  /** "7월" (해가 바뀌는 달은 "2027년 1월") */
  label: string;
  counts: Record<Sentiment, number>;
  total: number;
};

export type GenreCount = { label: string; count: number };

export type EmotionStats = {
  total: number;
  thisMonth: number;
  /** 기록이 없거나 1등이 여럿이면 null */
  topEmotion: EmotionShare | null;
  emotions: EmotionShare[];
  months: MonthBucket[];
  genres: GenreCount[];
};

const MONTH_WINDOW = 6;
const GENRE_LIMIT = 5;

/** "2026.07.12" 또는 ISO 문자열 → Date */
function parseEntryDate(value: string): Date | null {
  const dotted = value.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (dotted) {
    return new Date(Number(dotted[1]), Number(dotted[2]) - 1, Number(dotted[3]));
  }
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : new Date(t);
}

const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const emptyCounts = (): Record<Sentiment, number> =>
  Object.fromEntries(SENTIMENT_ORDER.map((id) => [id, 0])) as Record<Sentiment, number>;

export function computeEmotionStats(
  entries: JournalEntry[],
  now: Date = new Date(),
): EmotionStats {
  const total = entries.length;
  const byEmotion = emptyCounts();
  const genreCounts = new Map<string, number>();

  // 이번 달을 끝으로 최근 6개월 버킷
  const months: MonthBucket[] = [];
  for (let i = MONTH_WINDOW - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const showYear = d.getMonth() === 0 && i !== MONTH_WINDOW - 1;
    months.push({
      key: monthKey(d),
      label: showYear ? `${d.getFullYear()}년 1월` : `${d.getMonth() + 1}월`,
      counts: emptyCounts(),
      total: 0,
    });
  }
  const monthIndex = new Map(months.map((m, i) => [m.key, i]));
  const currentKey = monthKey(now);
  let thisMonth = 0;

  for (const entry of entries) {
    const emotion = SENTIMENT_ORDER.includes(entry.emotion) ? entry.emotion : null;
    if (emotion) byEmotion[emotion] += 1;

    const genre = entry.genreLabel?.trim();
    if (genre) genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);

    const date = parseEntryDate(entry.date);
    if (!date) continue;
    const key = monthKey(date);
    if (key === currentKey) thisMonth += 1;
    const idx = monthIndex.get(key);
    if (idx !== undefined && emotion) {
      months[idx].counts[emotion] += 1;
      months[idx].total += 1;
    }
  }

  const emotions: EmotionShare[] = sentiments.map((s) => ({
    id: s.id,
    label: s.label,
    description: s.description,
    count: byEmotion[s.id],
    share: total > 0 ? byEmotion[s.id] / total : 0,
  }));

  const max = Math.max(...emotions.map((e) => e.count));
  const leaders = emotions.filter((e) => e.count === max);
  const topEmotion = max > 0 && leaders.length === 1 ? leaders[0] : null;

  const genres = Array.from(genreCounts, ([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "ko"))
    .slice(0, GENRE_LIMIT);

  return { total, thisMonth, topEmotion, emotions, months, genres };
}
