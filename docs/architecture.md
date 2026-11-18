# 아키텍처

## 폴더 구조

```
src/
  app/
    layout.tsx            # app-shell (max 1280px)
    page.tsx              # 홈 (트렌딩 + 날짜 큐레이션)
    explore/
    archive/              # ArchiveClient
    stats/                # 감정 통계 (StatsClient)
    about/                # 몽글 소개 (정적)
    wishlist/
    movie/[id]/
    journal/new/          # 작성·수정 (로그인 필요)
    login/                # Google OAuth
    auth/callback/        # code → session
    profile/
    api/tmdb/             # search · trending · media/[id]
  components/
    Hero.tsx
    TodayPickGrid.tsx     # 「오늘 이거 볼까요」
    PosterRail.tsx        # 제목 + PosterSwiper
    PosterSwiper.tsx      # FreeMode 스와이프 레일
    SoftFluffyBento.tsx   # 큐레이션 A (내부는 PosterRail)
    HomePosterBits.tsx
    MediaLink.tsx         # 포스터 ↔ 상세 공유 요소 전환 (View Transitions, 상단바 ← 역방향 포함)
    NavigationProgress.tsx # 느린 페이지 이동 시 상단 진행 바
    StatusScreen.tsx      # 404·오류 공용 화면
    nav-tabs.ts           # TopAppBar(데스크톱)·BottomNav(모바일) 공용 탭
  data/mock.ts            # 폴백 작품 · 저널 시드 미리보기
  lib/
    home-curation.ts      # 날짜/요일 큐레이션 풀·픽
    tmdb-api.ts           # TMDB API (server-only)
    tmdb-image.ts         # 포스터 URL · blur placeholder
    journal.ts            # journals CRUD
    journal-stats.ts      # 감정·월·장르 집계 (순수 함수)
    emotion-colors.ts     # 감정 색 (--emotion-*) 매핑
    journal-likes.ts      # 좋아요 토글·카운트
    wishlist.ts           # 찜 CRUD
    supabase/             # client / server / middleware
src/middleware.ts         # 세션 쿠키 갱신
supabase/migrations/      # journals · wishlists · journal_likes
docs/
```

## Auth & 데이터

| 항목 | 구현 |
|------|------|
| 로그인 | Google OAuth via Supabase (`/login`) |
| 콜백 | `/auth/callback` |
| 세션 | `@supabase/ssr` + `middleware` 쿠키 갱신 |
| 저널 | `public.journals` — **조회 공개**, 작성/수정/삭제 본인만 (RLS) |
| 위시리스트 | `public.wishlists` — 본인만 SELECT/INSERT/DELETE |
| 좋아요 | `public.journal_likes` — **조회 공개**, 추가/삭제 본인만 |
| 비로그인 아카이브 | mock 시드 미리보기 |
| 로그인 아카이브 | DB 기록 + 좋아요 토글 |

설정 가이드: [supabase-setup.md](./supabase-setup.md)

## 라우팅

| 경로 | 비고 |
|------|------|
| `/` | Hero + 일/주 트렌딩 + 날짜 큐레이션 2레일 (실패 시 mock) |
| `/explore` | TMDB 검색·트렌딩 |
| `/archive` | 공개 피드 / 내 몽글, 좋아요 |
| `/stats` | 감정 통계 (내 몽글 / 모두의 몽글) |
| `/about` | 몽글 소개 (정적) |
| `/wishlist` | 찜 목록 (로그인) |
| `/journal/new` | 작성·`?edit=` 수정, 미로그인 시 `/login` |
| `/login` | Google 버튼 |
| `/movie/[id]` | mock 또는 TMDB 상세 |
| `/profile` | 계정·통계·위시리스트 |
| `/auth/callback` | OAuth code exchange |
| `/api/tmdb/*` | 서버 전용 TMDB 프록시 |

## 작품 데이터

- 홈·찾기·상세: TMDB (`/api/tmdb/*` → `lib/tmdb-api.ts`)
- 홈 레일: `fetchHomeRails()` — featured · todayPicks(day) · trending(week) · 큐레이션 discover 2슬롯
- 큐레이션 카테고리: `lib/home-curation.ts` (`pickTodayCurations`)
- 포스터 URL · blur: `lib/tmdb-image.ts` (클라이언트 안전)
- mock은 폴백·시드용. `media_id`는 `tmdb-m-{id}` / `tmdb-t-{id}` 또는 mock id
- **캐시:** TMDB 응답은 `tmdbFetch` 안의 `unstable_cache`로 30분 캐시 (렌더링 방식과 무관, 실패는 캐시 안 함)
- **상세 렌더링:** `/movie/[id]`는 `dynamic = "force-dynamic"` — ISR로 두면 TMDB 장애 시 `error.tsx` 대신 Next 기본 500이 뜸
- **오류 구분:** TMDB 404 → `notFound()` (없는 작품) / 그 밖의 실패(키 오류·장애·네트워크) → throw → `error.tsx`. `generateMetadata`는 실패를 삼켜 기본 제목으로 (메타데이터 단계 오류는 `error.tsx`가 못 잡음)

## 공유 미리보기 (OG · 트위터 카드)

| 대상 | 이미지 | 제목 · 설명 |
|------|--------|-------------|
| 사이트 공통 (`layout.tsx`) | `public/og-default.png` (1200×630 브랜드 이미지) | 몽글 · 사이트 설명 |
| 상세 (`movie/[id]` `generateMetadata`) | 작품 백드롭 w1280 → 없으면 포스터 → 없으면 기본 이미지 | `작품명 · 몽글` · 줄거리 110자 |

- 절대 URL 기준 `metadataBase`: `NEXT_PUBLIC_SITE_URL` → Vercel `VERCEL_PROJECT_PRODUCTION_URL` → `http://localhost:3000` (`lib/site.ts`)
- 공통 `og:url`은 두지 않음 — 하위 페이지가 물려받으면 모든 공유가 홈 링크로 묶임. 상세만 `og:url`·canonical 지정
- 하위 페이지의 `openGraph`는 레이아웃 값을 통째로 덮어쓰므로 `BASE_OPEN_GRAPH`(siteName·locale)를 펼쳐 씀
- TMDB 이미지는 `tmdbImageForShare`로 `image.tmdb.org` 주소를 씀 — `media.themoviedb.org`는 301 리다이렉트라 일부 크롤러(카카오톡 등)가 못 가져옴
- `og-default.png`는 HTML을 Playwright로 찍은 정적 이미지 (한글 글꼴 때문에 `ImageResponse` 대신)

## 오류·404·로딩

| 파일 | 역할 |
|------|------|
| `app/not-found.tsx` | 전역 404 |
| `app/movie/[id]/not-found.tsx` | 없는 작품 404 |
| `app/error.tsx` | 페이지 렌더링 오류 (상단바·탭바 유지, 다시 시도) |
| `app/global-error.tsx` | 루트 레이아웃까지 실패했을 때의 안전망 |
| `NavigationProgress` | 120ms 넘게 걸리는 이동에 상단 2px 진행 바. `MediaLink` 전환 이동은 제외 (전환 중엔 화면이 멈춰 안 보임) |

`loading.tsx`는 두지 않음 — 넣으면 포스터 → 상세 전환이 스켈레톤으로 커지는 모양이 됨

## 이미지

- TMDB: `media.themoviedb.org` / `image.tmdb.org`
- Google 아바타: `lh3.googleusercontent.com`

## 의존성

```
UI
 ├─ data/mock.ts          폴백·시드
 ├─ lib/home-curation.ts  날짜 큐레이션 풀
 ├─ lib/tmdb-api.ts       TMDB API (server-only)
 ├─ lib/tmdb-image.ts     포스터 URL · blur
 ├─ lib/journal.ts        저널 ↔ Supabase
 ├─ lib/journal-stats.ts  감정 통계 집계
 ├─ lib/journal-likes.ts  좋아요 ↔ Supabase
 ├─ lib/wishlist.ts       찜 ↔ Supabase
 └─ lib/supabase/*        Auth 세션
```
