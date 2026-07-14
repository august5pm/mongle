export type MediaType = "movie" | "tv";

export type Sentiment = "Dreamy" | "Warm" | "Intense" | "Soft";

export type MediaItem = {
  id: string;
  title: string;
  originalTitle?: string;
  type: MediaType;
  year: number;
  rating: number;
  overview: string;
  genres: string[];
  runtime?: string;
  posterTone: string;
  backdropTone: string;
  posterPath?: string;
  backdropPath?: string;
  sentiments?: Sentiment[];
  cast?: { name: string; role: string }[];
  progress?: number;
  remainingLabel?: string;
  director?: string;
};

export type JournalEntry = {
  id: string;
  mediaId: string;
  emotion: Sentiment;
  emotionLabel: string;
  note: string;
  date: string;
  recordedAgo: string;
  genreLabel: string;
  bubbleTone: "primary" | "secondary" | "surface" | "tertiary" | "container";
};

export const sentiments: {
  id: Sentiment;
  label: string;
  hash: string;
  description: string;
  count: number;
}[] = [
  {
    id: "Dreamy",
    label: "몽환",
    hash: "#Dreamy",
    description: "초현실적인 화면과 은은한 사운드트랙.",
    count: 12,
  },
  {
    id: "Warm",
    label: "따뜻함",
    hash: "#Warm",
    description: "담요처럼 포근한 이야기들.",
    count: 24,
  },
  {
    id: "Intense",
    label: "강렬",
    hash: "#Intense",
    description: "첫 장면부터 엔딩까지 손을 놓지 못하게.",
    count: 8,
  },
  {
    id: "Soft",
    label: "잔잔함",
    hash: "#Melancholic",
    description: "크레딧이 끝난 뒤에도 남는 고요한 감정.",
    count: 15,
  },
];

export const exploreChips = [
  { id: "Cinematic", label: "시네마틱", hash: "#Cinematic", icon: "trending" as const },
  { id: "Warm", label: "따뜻함", hash: "#Warm", icon: null },
  { id: "Thrilling", label: "스릴", hash: "#Thrilling", icon: null },
  { id: "Dreamy", label: "몽환", hash: "#Dreamy", icon: null },
  { id: "Melancholic", label: "잔잔함", hash: "#Melancholic", icon: null },
  { id: "Nostalgic", label: "그리움", hash: "#Nostalgic", icon: null },
];

export const featured: MediaItem = {
  id: "hero-1",
  title: "너의 이름은.",
  originalTitle: "君の名は。",
  type: "movie",
  year: 2016,
  rating: 8.4,
  overview:
    "전혀 다른 삶을 살던 두 고등학생이 꿈을 통해 서로의 몸과 일상을 바꾸게 된다. 시간이 겹치고, 풍경이 기억으로 남는다.",
  genres: ["애니메이션", "판타지", "로맨스"],
  runtime: "1시간 46분",
  sentiments: ["Dreamy", "Soft"],
  posterTone: "linear-gradient(160deg, #1a1230 0%, #4a2a58 40%, #ffb3a7 150%)",
  backdropTone:
    "linear-gradient(125deg, #101415 0%, #2a1838 28%, #5c3a6a 55%, #ffb3a7 140%)",
  posterPath: "/2DJCufz3Oa703PbLjNX1pM6MCG2.jpg",
  backdropPath: "/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg",
  cast: [
    { name: "카미키 류노스케", role: "타치바나 타키" },
    { name: "카미시라이시 모네", role: "미야미즈 미츠하" },
  ],
  director: "신카이 마코토",
};

export const continueWatching: MediaItem[] = [
  {
    id: "cw1",
    title: "그녀",
    originalTitle: "Her",
    type: "movie",
    year: 2013,
    rating: 8.0,
    overview: "가까운 미래, 한 남자가 OS와 사랑에 빠진다.",
    genres: ["드라마", "로맨스", "SF"],
    sentiments: ["Dreamy", "Soft"],
    progress: 66,
    remainingLabel: "24분 남음",
    posterTone: "linear-gradient(135deg, #0c1220, #1e3a5f 45%, #7eb6d9)",
    backdropTone: "linear-gradient(120deg, #070b14, #152238)",
    posterPath: "/thUJI82kWMxA2jtjLtPxDIj67tY.jpg",
    backdropPath: "/sPPsR9f4K0movWVQ99u4uMqFzEL.jpg",
  },
  {
    id: "cw2",
    title: "어느 가족",
    originalTitle: "万引き家族",
    type: "movie",
    year: 2018,
    rating: 8.0,
    overview: "모여 살지만 혈연이 아닌 가족. 작고 따뜻한, 그러나 아슬아슬한 일상.",
    genres: ["드라마"],
    sentiments: ["Warm", "Soft"],
    progress: 25,
    remainingLabel: "1시간 12분 남음",
    posterTone: "linear-gradient(135deg, #1c2b1a, #4d7c4a 45%, #c4d6a5)",
    backdropTone: "linear-gradient(120deg, #0f1610, #243528)",
    posterPath: "/vjBjqZ4AWO0l6mMfPpd3z1Z2Oo9.jpg",
    backdropPath: "/k49RhOmaKfoybjR3vBSaOJrIGmc.jpg",
  },
  {
    id: "cw3",
    title: "레이디 버드",
    originalTitle: "Lady Bird",
    type: "movie",
    year: 2017,
    rating: 7.9,
    overview: "졸업을 앞둔 십대의 서툴고 찬란한 성장, 그리고 엄마와의 애정.",
    genres: ["코미디", "드라마"],
    sentiments: ["Warm", "Soft"],
    progress: 83,
    remainingLabel: "5분 남음",
    posterTone: "linear-gradient(135deg, #2a1830, #6b4e8e 45%, #ffb3a7)",
    backdropTone: "linear-gradient(120deg, #100c18, #2a1e34)",
    posterPath: "/mnBtnrUqchSibHCvCAOUcdcuEDA.jpg",
    backdropPath: "/jwBiY1kE5089i2WpfS1MHDYp3VO.jpg",
  },
];

export const rainyDay: MediaItem[] = [
  {
    id: "r1",
    title: "이터널 선샤인",
    originalTitle: "Eternal Sunshine of the Spotless Mind",
    type: "movie",
    year: 2004,
    rating: 8.3,
    overview: "이별을 지우려는 두 연인. 기억이 지워질수록 사랑이 선명해진다.",
    genres: ["로맨스", "SF", "드라마"],
    sentiments: ["Dreamy", "Soft"],
    posterTone: "linear-gradient(165deg, #0f1720, #334155 55%, #94a3b8)",
    backdropTone: "linear-gradient(120deg, #0a0e14, #1e293b)",
    posterPath: "/jULvvUymAqM18gIDHbMRfKHbCSB.jpg",
    backdropPath: "/W1ffLQGHoxfAOq0ZYdPtJlvAdb.jpg",
  },
  {
    id: "r2",
    title: "문라이트",
    originalTitle: "Moonlight",
    type: "movie",
    year: 2016,
    rating: 8.2,
    overview: "세 시기로 나뉜 한 남자의 성장. 빛과 그림자가 교차하는 초상.",
    genres: ["드라마"],
    sentiments: ["Soft", "Intense"],
    posterTone: "linear-gradient(165deg, #111111, #3f3f46 50%, #a1a1aa)",
    backdropTone: "linear-gradient(120deg, #09090b, #27272a)",
    posterPath: "/h5h2acyeXXoxeS8BcDJtFpR2qCD.jpg",
    backdropPath: "/jm1oD3eB08LImSwL1LrzF9AJQ5b.jpg",
  },
  {
    id: "r3",
    title: "아멜리에",
    originalTitle: "Le Fabuleux Destin d'Amélie Poulain",
    type: "movie",
    year: 2001,
    rating: 8.3,
    overview: "몬마르트르의 아멜리가 작은 행복으로 세상을 살짝기 시작한다.",
    genres: ["코미디", "로맨스"],
    sentiments: ["Warm", "Dreamy"],
    posterTone: "linear-gradient(165deg, #1c2b1a, #4d7c4a 55%, #c4d6a5)",
    backdropTone: "linear-gradient(120deg, #0f1610, #243528)",
    posterPath: "/EkQ9Lu1NFnxfPSGizktuLJuxdv.jpg",
    backdropPath: "/6n53UI4mX9QMfe2S0Pgt8mGebY1.jpg",
  },
  {
    id: "r4",
    title: "시네마 천국",
    originalTitle: "Nuovo Cinema Paradiso",
    type: "movie",
    year: 1988,
    rating: 8.5,
    overview: "작은 마을의 영화관에서 시작된 꿈과 우정, 그리움의 일생.",
    genres: ["드라마", "로맨스"],
    sentiments: ["Warm", "Soft"],
    posterTone: "linear-gradient(165deg, #1c1810, #5c4c28 55%, #d4c48a)",
    backdropTone: "linear-gradient(120deg, #120f0a, #2a2418)",
    posterPath: "/r782z4H7GzkyNaf3hAtBB4pVkOj.jpg",
    backdropPath: "/zoVeIgKzGJzpdG6Gwnr7iOYfIMU.jpg",
  },
  {
    id: "r5",
    title: "콜 미 바이 유어 네임",
    originalTitle: "Call Me by Your Name",
    type: "movie",
    year: 2017,
    rating: 8.0,
    overview: "이탈리아의 여름, 처음 사랑에 빠진 청춘의 감각적인 서정.",
    genres: ["로맨스", "드라마"],
    sentiments: ["Dreamy", "Warm"],
    posterTone: "linear-gradient(165deg, #140a12, #5b2145 50%, #c77d9b)",
    backdropTone: "linear-gradient(120deg, #0c060a, #2a1020)",
    posterPath: "/guzNdgRjANTBDkTRYGqgzFOgSWx.jpg",
    backdropPath: "/4Xh2a1WeTp6b8Ksvug0pAMbX3dT.jpg",
  },
];

export const softFluffy: MediaItem[] = [
  {
    id: "m1",
    title: "센과 치히로의 행방불명",
    originalTitle: "千と千尋の神隠し",
    type: "movie",
    year: 2001,
    rating: 8.5,
    overview: "신비한 세계로 빨려 들어간 치히로가 이름을 되찾기 위한 모험을 떠난다.",
    genres: ["애니메이션", "판타지", "가족"],
    sentiments: ["Dreamy", "Warm"],
    posterTone: "linear-gradient(165deg, #2b1d16, #8b5a3c 60%, #d4a574)",
    backdropTone: "linear-gradient(120deg, #1a100c, #4a2f22)",
    posterPath: "/u1L4qxIu5sC2P082uMHYt7Ifvnj.jpg",
    backdropPath: "/dyJvKsNs2KP8qQnAXbRwDjblViy.jpg",
    director: "미야자키 하야오",
  },
  {
    id: "m4",
    title: "소울",
    originalTitle: "Soul",
    type: "movie",
    year: 2020,
    rating: 8.0,
    overview: "재즈 피아니스트가 ‘영혼의 세계’에서 삶의 의미를 되묻는다.",
    genres: ["애니메이션", "가족", "코미디"],
    sentiments: ["Warm", "Dreamy"],
    posterTone: "linear-gradient(165deg, #1c2b1a, #4d7c4a 55%, #c4d6a5)",
    backdropTone: "linear-gradient(120deg, #0f1610, #243528)",
    posterPath: "/qJiaB4RJMM5Oh6A4rqrEOHQUJbu.jpg",
    backdropPath: "/rQaHA74pevnGsxcKGaoZVGWe9TC.jpg",
  },
  {
    id: "m6",
    title: "코코",
    originalTitle: "Coco",
    type: "movie",
    year: 2017,
    rating: 8.1,
    overview: "음악을 꿈꾸는 소년이 죽은 자들의 세계에서 가족을 만난다.",
    genres: ["애니메이션", "가족", "판타지"],
    sentiments: ["Warm", "Dreamy"],
    posterTone: "linear-gradient(165deg, #1a1520, #5c4a7a 55%, #b8a4d9)",
    backdropTone: "linear-gradient(120deg, #100c16, #2a2038)",
    posterPath: "/pQu93NuwR90AaCULzglVD5Ge4Ml.jpg",
    backdropPath: "/g7CHF8gTLGooTbP4GznIGwaqAGL.jpg",
  },
  {
    id: "t5",
    title: "업",
    originalTitle: "Up",
    type: "movie",
    year: 2009,
    rating: 8.0,
    overview: "풍선 묶은 집으로 모험을 떠난 할아버지와 소년의 다정한 여행.",
    genres: ["애니메이션", "가족", "모험"],
    sentiments: ["Warm", "Soft"],
    posterTone: "linear-gradient(165deg, #1c1810, #5c4c28 55%, #d4c48a)",
    backdropTone: "linear-gradient(120deg, #120f0a, #2a2418)",
    posterPath: "/lL2WzkjLZP0RkPgUhybBjb9x9SL.jpg",
    backdropPath: "/hGGC9gKo7CFE3fW07RA587e5kol.jpg",
  },
  {
    id: "t1",
    title: "라라랜드",
    originalTitle: "La La Land",
    type: "movie",
    year: 2016,
    rating: 8.0,
    overview: "꿈을 좇는 배우와 재즈 피아니스트의 사랑의 뮤지컬.",
    genres: ["로맨스", "뮤지컬", "드라마"],
    sentiments: ["Dreamy", "Warm"],
    posterTone: "linear-gradient(165deg, #0c1220, #1e3a5f 55%, #7eb6d9)",
    backdropTone: "linear-gradient(120deg, #070b14, #152238)",
    posterPath: "/ad9ndytwOckyShSc0A6tx1rZRkW.jpg",
    backdropPath: "/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg",
  },
  {
    id: "sf6",
    title: "위대한 쇼맨",
    originalTitle: "The Greatest Showman",
    type: "movie",
    year: 2017,
    rating: 7.5,
    overview: "서커스를 만든 한 남자의 꿈과 음악이 빛나는 이야기.",
    genres: ["뮤지컬", "드라마"],
    sentiments: ["Warm", "Dreamy"],
    posterTone: "linear-gradient(160deg, #2a1824 0%, #5c3048 42%, #ffb3a7 150%)",
    backdropTone:
      "linear-gradient(125deg, #101415 0%, #2a1824 32%, #4a2a3c 58%, #1a1218 100%)",
    posterPath: "/h8qzZtSScJV1zIf6lVc4449Zgui.jpg",
    backdropPath: "/lrNKm3HNvGdZoAfiBKu7b04FLHN.jpg",
  },
];

export const trendingMovies: MediaItem[] = softFluffy;

export const trendingTv: MediaItem[] = [
  {
    id: "t2",
    title: "위플래쉬",
    originalTitle: "Whiplash",
    type: "movie",
    year: 2014,
    rating: 8.5,
    overview: "완벽을 강요하는 스승과 드럼에 목숨을 건 제자의 대결.",
    genres: ["드라마", "음악"],
    sentiments: ["Intense"],
    posterTone: "linear-gradient(165deg, #1a140c, #6b4e2e 55%, #e0c089)",
    backdropTone: "linear-gradient(120deg, #100c08, #2a1e14)",
    posterPath: "/oKNkhmyIBiDENivK6ELZxfBWa3q.jpg",
    backdropPath: "/wbQa0EnWUyRzQ5d1pHLNRlmsCUP.jpg",
  },
  {
    id: "t3",
    title: "겟 아웃",
    originalTitle: "Get Out",
    type: "movie",
    year: 2017,
    rating: 7.8,
    overview: "여자친구 집에 방문한 흑인 청년이 마주한 기이하고 섬뜩한 진실.",
    genres: ["스릴러", "공포", "미스터리"],
    sentiments: ["Intense"],
    posterTone: "linear-gradient(165deg, #0e1a1a, #1a4a4a 55%, #7dd3c7)",
    backdropTone: "linear-gradient(120deg, #081212, #123030)",
    posterPath: "/paPvmoLgUUQojsSdAZmf7dwkKGT.jpg",
    backdropPath: "/o8dPH0ZSIyyViP6rjRX1djwCUwI.jpg",
  },
  {
    id: "t4",
    title: "기생충",
    originalTitle: "기생충",
    type: "movie",
    year: 2019,
    rating: 8.5,
    overview: "반지하 가족과 부유층 집의 계급 비극이 날카롭게 교차한다.",
    genres: ["드라마", "스릴러"],
    sentiments: ["Intense"],
    posterTone: "linear-gradient(165deg, #141018, #3d2a55 55%, #a78bc9)",
    backdropTone: "linear-gradient(120deg, #0c0a10, #221830)",
    posterPath: "/jjHccoFjbqlfr4VGLVLT7yek0Xn.jpg",
    backdropPath: "/wCuUKiRaz0wEESsYqmQy005xvTE.jpg",
    director: "봉준호",
  },
  {
    id: "m2",
    title: "인셉션",
    originalTitle: "Inception",
    type: "movie",
    year: 2010,
    rating: 8.4,
    overview: "꿈 속에 꿈을 심는 특수 요원들의 미션.",
    genres: ["SF", "액션", "스릴러"],
    sentiments: ["Intense", "Dreamy"],
    posterTone: "linear-gradient(165deg, #0f1720, #334155 55%, #94a3b8)",
    backdropTone: "linear-gradient(120deg, #0a0e14, #1e293b)",
    posterPath: "/atSxEGstxXRoSKDQFBgqQ5lpGSt.jpg",
    backdropPath: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
  },
  {
    id: "m3",
    title: "인터스텔라",
    originalTitle: "Interstellar",
    type: "movie",
    year: 2014,
    rating: 8.4,
    overview: "죽어가는 지구를 떠나 새로운 행성을 찾아 떠나는 우주 탐사.",
    genres: ["SF", "드라마", "모험"],
    sentiments: ["Intense", "Dreamy"],
    posterTone: "linear-gradient(165deg, #111111, #3f3f46 50%, #a1a1aa)",
    backdropTone: "linear-gradient(120deg, #09090b, #27272a)",
    posterPath: "/evoEi8SBSvIIEveM3V6nCJ6vKj8.jpg",
    backdropPath: "/2ssWTSVklAEc98frZUQhgtGHx7s.jpg",
  },
  {
    id: "m5",
    title: "미드소마",
    originalTitle: "Midsommar",
    type: "movie",
    year: 2019,
    rating: 7.1,
    overview: "백야의 축제 속, 밝을수록 더 깊은 공포가 피어난다.",
    genres: ["공포", "드라마"],
    sentiments: ["Intense"],
    posterTone: "linear-gradient(165deg, #140a12, #5b2145 50%, #c77d9b)",
    backdropTone: "linear-gradient(120deg, #0c060a, #2a1020)",
    posterPath: "/u2c6wgkam9JJ5V4ML3l8EqIXCdF.jpg",
    backdropPath: "/pYgj8e2Y6RufnSyOA6OnzmxFXxZ.jpg",
  },
];

export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    mediaId: "hero-1",
    emotion: "Dreamy",
    emotionLabel: "순수한 경이",
    note: "화면이 나를 안아주는 느낌이었다. 이렇게까지 공감한 영화는 오랜만이다.",
    date: "2026.07.12",
    recordedAgo: "2일 전 기록",
    genreLabel: "판타지",
    bubbleTone: "primary",
  },
  {
    id: "j2",
    mediaId: "m1",
    emotion: "Warm",
    emotionLabel: "그리움",
    note: "비 오는 오후, 따뜻한 차를 마시는 기분. 담백한데 오래 남는다.",
    date: "2026.07.10",
    recordedAgo: "5일 전 기록",
    genreLabel: "애니메이션",
    bubbleTone: "secondary",
  },
  {
    id: "j3",
    mediaId: "m3",
    emotion: "Intense",
    emotionLabel: "전율",
    note: "순수한 아드레날린. 색감만으로도 눈이 즐거웠다. 아직도 심장이 뛰는다.",
    date: "2026.07.08",
    recordedAgo: "1주 전 기록",
    genreLabel: "SF",
    bubbleTone: "surface",
  },
  {
    id: "j4",
    mediaId: "t5",
    emotion: "Soft",
    emotionLabel: "잔잔한 슬픔",
    note: "이 영화에서 가장 큰 대사는 침묵이었다. 아름답게 마음이 아팠다.",
    date: "2026.07.05",
    recordedAgo: "2주 전 기록",
    genreLabel: "가족",
    bubbleTone: "tertiary",
  },
  {
    id: "j5",
    mediaId: "m4",
    emotion: "Warm",
    emotionLabel: "장난스러움",
    note: "어린 나를 다시 만났다. 매 프레임이 들어가 살고 싶은 그림 같았다.",
    date: "2026.06.28",
    recordedAgo: "3주 전 기록",
    genreLabel: "애니메이션",
    bubbleTone: "container",
  },
];

export const archiveStats = {
  totalMongles: 128,
  thisMonth: 42,
  watched: 42,
  journal: 5,
  softPick: 18,
  streak: 7,
};

export const allMedia: MediaItem[] = [
  featured,
  ...continueWatching,
  ...softFluffy,
  ...trendingTv,
  ...rainyDay,
].filter(
  (item, index, arr) => arr.findIndex((x) => x.id === item.id) === index,
);

export function getMediaById(id: string): MediaItem | undefined {
  return allMedia.find((item) => item.id === id);
}

export function searchMedia(query: string, sentiment?: Sentiment | "all"): MediaItem[] {
  const q = query.trim().toLowerCase();
  return allMedia.filter((item) => {
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.originalTitle?.toLowerCase().includes(q) ||
      item.genres.some((g) => g.toLowerCase().includes(q)) ||
      item.overview.toLowerCase().includes(q);
    const matchesSentiment =
      !sentiment ||
      sentiment === "all" ||
      item.sentiments?.includes(sentiment);
    return matchesQuery && matchesSentiment;
  });
}
