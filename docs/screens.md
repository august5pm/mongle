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

| 블록 | 컴포넌트 | 내용 |
|------|----------|------|
| 히어로 | `Hero` | 오늘의 추천, 백드롭, 자세히 보기 |
| 이어보기 | `ContinueWatchingRail` | 진행률 바 |
| 포근한 이야기 | `SoftFluffyBento` | 2×2 벤토 |
| 비 오는 날 | `RainyDayRail` | 세로 포스터 레일 |

데이터: `featured`, `continueWatching`, `softFluffy`, `rainyDay`

## `/explore` 탐색

`ExploreClient` (클라이언트)

1. 검색 인풋 — `searchMedia(query, sentiment)`  
2. 분위기 칩 — Cinematic / Warm / Thrilling / Dreamy / Melancholic  
3. 비검색 시: 트렌딩 벤토 + 감정 섹션  
4. 검색 시: 결과 그리드  

## `/archive` 아카이브

- 헤더 + 통계(전체 몽글 / 이번 달)  
- 저널 카드 그리드: 포스터 + `cloud-bubble` 감정 메모  
- “새 기록” 점선 카드 → 로그인 시 `/journal/new`, 아니면 `/login`  
- FAB → 동일  
- 시드 미리보기(비로그인) / Supabase 내 기록(로그인)  

## `/login`

Google OAuth (`LoginClient`) → `/auth/callback`  

## `/journal/new` 새 몽글

로그인 필수. 미로그인 시 `/login?next=…`  

1. 작품 선택 — `?mediaId=`면 생략  
2. 감정 선택  
3. 메모 → Supabase `journals` insert → `/archive`  

## `/movie/[id]` 상세

- CTA: 몽글 기록하기 → `/journal/new?mediaId=` (미로그인 시 작성 화면에서 로그인으로 보냄)  
- 줄거리 · 감독 · 출연 · 관련 몽글  

## `/profile` 프로필

- 비로그인: Google 로그인 CTA  
- 로그인: 아바타·이메일·저널 수·로그아웃  

## 리다이렉트

| 예전 | 지금 |
|------|------|
| `/search` | `/explore` |
| `/detail/[id]` | `/movie/[id]` |
