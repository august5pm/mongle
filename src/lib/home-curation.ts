/** 홈 큐레이션 카테고리 풀 + 날짜/요일 로테이션 (클라이언트·서버 공용) */

export type CurationIcon =
  | "sparkles"
  | "smile"
  | "heart"
  | "zap"
  | "moon"
  | "film"
  | "coffee"
  | "gem"
  | "rain"
  | "clapper";

export type HomeCurationCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: CurationIcon;
  /** 벤토 카드 뱃지 문구 */
  badge: string;
  /** TMDB /discover/movie 쿼리 */
  discover: Record<string, string>;
};

/**
 * 몽글 톤 + OTT 스타일 카테고리 풀.
 * 매일 2개를 뽑아 벤토·포스터 레일에 쓴다.
 */
export const HOME_CURATION_POOL: HomeCurationCategory[] = [
  {
    id: "tonight",
    title: "오늘 밤 추천",
    subtitle: "Tonight's Picks",
    icon: "sparkles",
    badge: "오늘 밤",
    discover: {
      sort_by: "popularity.desc",
      "vote_average.gte": "6.8",
      "vote_count.gte": "200",
    },
  },
  {
    id: "laughs",
    title: "웃고 싶을 때",
    subtitle: "Feel-Good Laughs",
    icon: "smile",
    badge: "웃음 충전",
    discover: {
      with_genres: "35",
      "vote_average.gte": "6.5",
      "vote_count.gte": "150",
    },
  },
  {
    id: "thriller",
    title: "심장이 쫄깃할 때",
    subtitle: "Edge of Your Seat",
    icon: "zap",
    badge: "긴장감",
    discover: {
      with_genres: "53|80|9648",
      "vote_average.gte": "6.8",
      "vote_count.gte": "200",
    },
  },
  {
    id: "romance",
    title: "설레는 이야기",
    subtitle: "Soft Romance",
    icon: "heart",
    badge: "설렘",
    discover: {
      with_genres: "10749",
      "vote_average.gte": "6.8",
      "vote_count.gte": "120",
    },
  },
  {
    id: "hidden",
    title: "평점 높은 숨은 작품",
    subtitle: "Hidden Gems",
    icon: "gem",
    badge: "숨은 명작",
    discover: {
      sort_by: "vote_average.desc",
      "vote_average.gte": "7.5",
      "vote_count.gte": "400",
      "vote_count.lte": "8000",
    },
  },
  {
    id: "solo",
    title: "혼자 보기 좋은",
    subtitle: "Solo Night",
    icon: "moon",
    badge: "나 혼자",
    discover: {
      with_genres: "18",
      "vote_average.gte": "7.2",
      "vote_count.gte": "250",
      sort_by: "vote_average.desc",
    },
  },
  {
    id: "cozy",
    title: "마음이 포근해지는",
    subtitle: "Warm & Cozy",
    icon: "coffee",
    badge: "포근함",
    discover: {
      with_genres: "10751|16|35",
      "vote_average.gte": "6.8",
      "vote_count.gte": "150",
    },
  },
  {
    id: "korea",
    title: "한국에서 사랑받은",
    subtitle: "Loved in Korea",
    icon: "clapper",
    badge: "한국",
    discover: {
      with_origin_country: "KR",
      "vote_average.gte": "6.5",
      "vote_count.gte": "80",
      sort_by: "popularity.desc",
    },
  },
  {
    id: "fresh",
    title: "최근 화제의 개봉",
    subtitle: "Fresh Releases",
    icon: "film",
    badge: "신작",
    discover: {
      sort_by: "popularity.desc",
      "vote_count.gte": "40",
      // primary_release_date.gte 는 호출 시 주입
    },
  },
  {
    id: "debate",
    title: "호불호 갈리는 작품",
    subtitle: "Love It or Leave It",
    icon: "zap",
    badge: "호불호",
    discover: {
      // 중간 평점 + 충분한 투표 = 평가가 갈리는 작품에 가까움
      "vote_average.gte": "5.8",
      "vote_average.lte": "7.0",
      "vote_count.gte": "800",
      sort_by: "popularity.desc",
    },
  },
  {
    id: "afterglow",
    title: "긴 여운이 남는",
    subtitle: "Lingering Afterglow",
    icon: "rain",
    badge: "여운",
    discover: {
      with_genres: "18|10749|9648",
      "vote_average.gte": "7.2",
      "vote_count.gte": "300",
      sort_by: "vote_average.desc",
    },
  },
];

/** Asia/Seoul 기준 YYYYMMDD 숫자 */
export function seoulDateSeed(date: Date = new Date()): number {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return Number(ymd.replaceAll("-", ""));
}

/** Asia/Seoul 요일 0(일)~6(토) */
export function seoulDayOfWeek(date: Date = new Date()): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    weekday: "short",
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? date.getDay();
}

/** 최근 N개월 전 YYYY-MM-DD (Seoul) — fresh 카테고리용 */
export function seoulMonthsAgoIso(months: number, date: Date = new Date()): string {
  const seed = String(seoulDateSeed(date));
  const y = Number(seed.slice(0, 4));
  const m = Number(seed.slice(4, 6));
  const d = Number(seed.slice(6, 8));
  const dt = new Date(Date.UTC(y, m - 1 - months, d));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/**
 * 오늘 홈에 올릴 큐레이션 2개.
 * 날짜·요일 시드로 매일 조합이 바뀌고, 같은 카테고리가 겹치지 않는다.
 */
export function pickTodayCurations(
  date: Date = new Date(),
): [HomeCurationCategory, HomeCurationCategory] {
  const pool = HOME_CURATION_POOL;
  const seed = seoulDateSeed(date);
  const dow = seoulDayOfWeek(date);

  // 요일 선호 오프셋 + 날짜 시드로 인덱스 결정
  const primary = (seed + dow * 3) % pool.length;
  let secondary = (primary + 3 + (seed % 3) + dow) % pool.length;
  if (secondary === primary) {
    secondary = (primary + 1) % pool.length;
  }

  return [enrichCategory(pool[primary]!, date), enrichCategory(pool[secondary]!, date)];
}

function enrichCategory(
  category: HomeCurationCategory,
  date: Date,
): HomeCurationCategory {
  if (category.id !== "fresh") return category;
  return {
    ...category,
    discover: {
      ...category.discover,
      "primary_release_date.gte": seoulMonthsAgoIso(4, date),
    },
  };
}
