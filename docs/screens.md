# 화면 가이드

## 공통 크롬

### TopAppBar

- 고정 상단, blur 배경
- 로고(클라우드 + 몽글), 검색(`/explore`), 프로필 아바타
- 데스크톱(`md+`): 로고 옆에 주요 메뉴 텍스트 탭 (홈 · 찾기 · 몽글 · 프로필)
- 상세(`/movie/*`)에서는 뒤로가기 + 찜 아이콘 — 포스터에서 전환으로 들어왔다면 ← 를 누를 때 상세 이미지가 원래 포스터로 줄어듦

### BottomNav (모바일 전용)

탭: 홈 · 찾기 · 몽글 · 프로필 (`components/nav-tabs.ts`를 TopAppBar와 공유)  

- 화면 하단에 붙은 얇은 탭바(`chrome-glass`), 아이콘 + 라벨  
- 활성 탭은 피치색 텍스트·굵은 아이콘  
- 데스크톱(`md+`)에서는 숨기고 TopAppBar 탭을 사용

### SiteFooter

- 페이지 하단 (모바일에서는 BottomNav 위): 몽글 워드마크 + 「몽글 소개」(`/about`) 링크 + `© {year} by august5pm. All rights reserved.`
- GitHub: https://github.com/august5pm
- **TMDB 출처 표기 (필수):** TMDB 공식 로고(`public/tmdb-logo.svg`, Alt short 원본, themoviedb.org 링크) + 고지문
  `This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.`
  — [API 이용약관](https://www.themoviedb.org/api-terms-of-use) 3항. 로고는 몽글 로고보다 덜 눈에 띄게(64px, 60% 불투명)

### JournalFab

- `/archive`에서만 표시  
- 스크롤 다운 시 숨김, 업/상단에서 표시  
- 링크: `/journal/new`

### 앱 셸

- `layout`의 `main.app-shell`: 중앙 `max-width: 1280px` (`--app-max`)
- 좌우 패딩은 셸이 담당. 포스터 폭은 `--poster-w` / `.poster-card`

---

## `/` 홈

키비주얼은 셸 폭에 맞춘 `app-bleed` + 좌우·하단 페이드로 배경과 자연스럽게 이어짐.

- **모바일(< 640px):** 세로 포스터(2:3), 높이 `clamp(440px, 폭×1.5, 80svh)`
- **sm 이상:** 가로 백드롭(16:9), 높이 `clamp(420px, 폭×9/16, 75vh)` — 1280 폭이면 720px, 1440×900 화면에서는 675px
- `<picture>`(`getImageProps`)로 화면에 맞는 이미지 하나만 내려받음. 한쪽 이미지가 없으면 다른 쪽을 공용
- 남는 크롭은 초점을 위로(`center 20%` / `center 30%`) — 인물이 많은 위쪽 1/3을 남김

| 블록 | 컴포넌트 | 내용 |
|------|----------|------|
| 히어로 | `Hero` | 오늘의 추천 (셸 폭 + `.edge-fade-x` / `.hero-fade-bottom`) |
| 오늘 픽 | `TodayPickGrid` + `PosterSwiper` | 「오늘 이거 볼까요」 — **일간** 트렌딩 |
| 지금 뜨는 | `PosterRail` + `PosterSwiper` | 「지금 뜨는」 — **주간** 트렌딩 (일간과 중복 제거) |
| 큐레이션 A | `SoftFluffyBento` → `PosterRail` | 날짜 로테이션 카테고리 1 (세로 포스터 스와이프) |
| 큐레이션 B | `PosterRail` + `PosterSwiper` | 날짜 로테이션 카테고리 2 (제목은 카테고리명) |

데이터: TMDB (`fetchHomeRails`) — 실패 시 mock 폴백  
큐레이션: [`pickTodayCurations`](../src/lib/home-curation.ts) 매일 서로 다른 2슬롯  
레일 UI: FreeMode + 마우스휠 `PosterSwiper` (페이지 단위 화살표 이동)  
`revalidate = 3600` — 날짜 큐레이션이 바뀌도록 주기 재생성

> `SoftFluffyBento`는 이름만 벤토이고, 실제로는 다른 홈 레일과 같은 세로 포스터 스와이퍼를 쓴다.

## `/wishlist` 위시리스트

- 로그인 필요 (Supabase `wishlists`)  
- 상세·히어로·앱바 하트/북마크로 토글  
- 프로필에서 진입  

## `/explore` 찾기

`ExploreClient` (클라이언트)

1. 검색 인풋 — TMDB `/api/tmdb/search` (디바운스)  
2. 분위기 칩 — Cinematic / Warm / Thrilling / Dreamy / Melancholic  
3. 비검색 시: 트렌딩 벤토 + 감정 섹션  
4. 검색 시: 결과 그리드  

## `/archive` 아카이브

- 탭: **모두의 몽글** / **내 몽글**  
- 카드에 작성자 이모지·닉네임 표시 (내 글은 `나` 뱃지)  
- 내 글: 수정 · 삭제 버튼  
- 모든 DB 기록: **좋아요** (로그인 필요, 하트 + 카운트)  
- 비로그인도 공개 피드 열람 가능, 작성·좋아요는 로그인 필요  
- FAB · 새 기록 → `/journal/new`  
- 머리말 아래 「감정 통계 보기 →」 → `/stats`  

## `/stats` 감정 통계

`StatsClient` + 집계는 [`computeEmotionStats`](../src/lib/journal-stats.ts)

- 탭: **내 몽글**(로그인 시 기본) / **모두의 몽글** — 비로그인은 모두의 몽글만, 로그인 안내 표시  
- 요약 타일: 전체 몽글 · 이번 달 · 가장 많은 감정 (1등이 여럿이면 「고르게」)  
- **감정 분포:** 4가지 감정의 개수·비율 가로 막대 (막대 길이 = 전체 대비 비율)  
- **월별 감정 흐름:** 이번 달까지 최근 6개월 누적 막대. 막대에 올리거나(포커스·탭) 누르면 그 달의 감정별 수 툴팁, 「표로 보기」로 같은 값을 표로  
- **자주 기록한 장르:** 상위 5개 (`genre_label` 기준)  
- 기록이 없으면 빈 상태 + 「몽글 남기기」  
- 진입: 아카이브 머리말, 프로필 링크 목록  

## `/login`

Google OAuth (`LoginClient`) → `/auth/callback`  

## `/journal/new` 새 몽글 / 수정

로그인 필수. 미로그인 시 `/login?next=…`  

1. 작품 선택 — `?mediaId=`면 생략, `?edit=` 수정 시 작품 고정  
2. 감정 선택  
3. 메모 → insert 또는 update → `/archive`  

## `/movie/[id]` 상세

- CTA: 몽글 기록하기 → `/journal/new?mediaId=` (미로그인 시 작성 화면에서 로그인으로 보냄)  
- 위시리스트 토글 (`WishlistButton`)  
- 줄거리 · 감독 · 출연 · 관련 작품(TMDB 트렌딩)  

## `/about` 몽글 소개

정적 페이지 (서버 컴포넌트), 진입은 푸터 「몽글 소개」

- 머리말: 클라우드 + 「영화가 끝난 뒤에 남는 감정을 기록하는 곳」 + 둘러보기 / 모두의 몽글 읽기  
- **이렇게 써요:** 고르기(`/explore`) → 기록하기(`/journal/new`) → 돌아보기(`/stats`) 3단계 카드  
- **네 가지 감정:** `sentiments` 설명 + 통계와 같은 감정 색  
- **알아 두면 좋은 것:** 공개 범위(몽글은 닉네임·이모지와 함께 공개, 이메일 비공개, 위시리스트는 나만) · Google 로그인 · TMDB 출처 · 만든 사람/GitHub  
- 자체 OG(`og:url` = `/about`)

## `/profile` 프로필

- 비로그인: Google 로그인 CTA  
- 로그인: 이모지 아바타 · 닉네임(편집 가능) · 이메일 · 몽글 수 · 감정 통계·위시리스트 링크 · 로그아웃  
- 닉네임/이모지는 Supabase `user_metadata`에 저장되어 기기 간 동기화  

## 404 · 오류

- 공용 `StatusScreen`: 구름 + 제목 + 설명 + 버튼 (주: `accent-fill`, 보조: `soft-fill`)
- 404: 「찾는 장면이 없어요」 / 상세는 「이 작품을 찾을 수 없어요」 — 홈으로 · 작품 찾기
- 오류: 「잠시 문제가 생겼어요」 + 오류 코드(digest) — 다시 시도 · 홈으로

## 리다이렉트

| 예전 | 지금 |
|------|------|
| `/search` | `/explore` |
| `/detail/[id]` | `/movie/[id]` |
