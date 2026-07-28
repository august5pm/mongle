# 화면 가이드

## 공통 크롬

### TopAppBar

- 고정 상단, blur 배경
- 로고(클라우드 + 몽글), 검색(`/explore`), 프로필 아바타
- 상세(`/movie/*`)에서는 뒤로가기 + 찜 아이콘

### BottomNav

탭: 홈 · 탐색 · 저널 · 프로필  

- **확장:** 넓은 플로팅 도크 + 라벨  
- **컴팩트:** 스크롤 다운 시 알약형으로 축소, 활성 탭은 pearl 칩  
- 항상 떠 있는 도크가 폭·여백만 변해 형태가 이어짐

### JournalFab

- `/archive`에서만 표시  
- 스크롤 다운 시 숨김, 업/상단에서 표시  
- 링크: `/journal/new`

---

## `/` 홈

중앙 `max-width: 1280px` 프레임. 키비주얼은 풀블리드로 좌우 배경과 페이드 연결.

| 블록 | 컴포넌트 | 내용 |
|------|----------|------|
| 히어로 | `Hero` | 오늘의 추천 (풀블리드 + 사이드 페이드) |
| 오늘 픽 | `TodayPickGrid` + `PosterSwiper` | 「오늘 이거 볼까요」 스와이프 포스터 레일 |
| 지금 뜨는 | `PosterRail` + `PosterSwiper` | 타이트 세로 포스터 스와이프 |
| 큐레이션 | `SoftFluffyBento` | 날짜 로테이션 카테고리 벤토 |
| 호불호 | `PosterRail` + `PosterSwiper` | 「호불호 갈리는 작품」 |

데이터: TMDB (`fetchHomeRails`) — 실패 시 mock 폴백  
큐레이션: [`pickTodayCurations`](../src/lib/home-curation.ts) 매일 2슬롯

## `/wishlist` 위시리스트

- 로그인 필요 (Supabase `wishlists`)  
- 상세·히어로·앱바 하트/북마크로 토글  
- 프로필에서 진입  

## `/explore` 탐색

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
- 로그인: 이모지 아바타 · 닉네임(편집 가능) · 이메일 · 저널 수 · 위시리스트 링크 · 로그아웃  
- 닉네임/이모지는 Supabase `user_metadata`에 저장되어 기기 간 동기화  

## 리다이렉트

| 예전 | 지금 |
|------|------|
| `/search` | `/explore` |
| `/detail/[id]` | `/movie/[id]` |
