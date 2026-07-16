# 아키텍처

## 폴더 구조

```
src/
  app/
    layout.tsx
    page.tsx              # 홈 (TMDB 레일)
    explore/
    archive/              # ArchiveClient
    wishlist/
    movie/[id]/
    journal/new/          # 작성·수정 (로그인 필요)
    login/                # Google OAuth
    auth/callback/        # code → session
    profile/
    api/tmdb/             # search · trending · media/[id]
  components/
  data/mock.ts            # 폴백 작품 · 저널 시드 미리보기
  lib/
    tmdb-api.ts           # TMDB API (server-only)
    tmdb-image.ts         # 포스터 URL (클라이언트 안전)
    journal.ts            # journals CRUD
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
| `/` | Hero + TMDB 레일 (실패 시 mock) |
| `/explore` | TMDB 검색·트렌딩 |
| `/archive` | 공개 피드 / 내 몽글, 좋아요 |
| `/wishlist` | 찜 목록 (로그인) |
| `/journal/new` | 작성·`?edit=` 수정, 미로그인 시 `/login` |
| `/login` | Google 버튼 |
| `/movie/[id]` | mock 또는 TMDB 상세 |
| `/profile` | 계정·통계·위시리스트 |
| `/auth/callback` | OAuth code exchange |
| `/api/tmdb/*` | 서버 전용 TMDB 프록시 |

## 작품 데이터

- 홈·탐색·상세: TMDB (`/api/tmdb/*` → `lib/tmdb-api.ts`)
- 포스터 URL: `lib/tmdb-image.ts` (클라이언트 안전)
- mock은 폴백·시드용. `media_id`는 `tmdb-m-{id}` / `tmdb-t-{id}` 또는 mock id

## 이미지

- TMDB: `media.themoviedb.org` / `image.tmdb.org`
- Google 아바타: `lh3.googleusercontent.com`

## 의존성

```
UI
 ├─ data/mock.ts          폴백·시드
 ├─ lib/tmdb-api.ts       TMDB API (server-only)
 ├─ lib/tmdb-image.ts     포스터 URL
 ├─ lib/journal.ts        저널 ↔ Supabase
 ├─ lib/journal-likes.ts  좋아요 ↔ Supabase
 ├─ lib/wishlist.ts       찜 ↔ Supabase
 └─ lib/supabase/*        Auth 세션
```
