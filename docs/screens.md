# 화면 가이드

## 공통 크롬

### TopAppBar

- 고정 상단, blur 배경
- 로고(클라우드 + 몽글), 검색(`/explore`), 프로필 아바타
- 상세(`/movie/*`)에서는 뒤로가기 + 찜 아이콘

### BottomNav

탭: 홈 · 찾기 · 몽글 · 프로필  

- **확장:** 넓은 플로팅 도크 + 라벨  
- **컴팩트:** 스크롤 다운 시 알약형으로 축소, 활성 탭은 pearl 칩  
- 항상 떠 있는 도크가 폭·여백만 변해 형태가 이어짐

### SiteFooter

- 페이지 하단 (BottomNav 위): 몽글 워드마크 + `© {year} by august5pm. All rights reserved.`
- GitHub: https://github.com/august5pm

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

## `/profile` 프로필

- 비로그인: Google 로그인 CTA  
- 로그인: 이모지 아바타 · 닉네임(편집 가능) · 이메일 · 몽글 수 · 위시리스트 링크 · 로그아웃  
- 닉네임/이모지는 Supabase `user_metadata`에 저장되어 기기 간 동기화  

## 리다이렉트

| 예전 | 지금 |
|------|------|
| `/search` | `/explore` |
| `/detail/[id]` | `/movie/[id]` |
