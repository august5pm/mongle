# 아키텍처

## 폴더 구조

```
src/
  app/
    layout.tsx
    page.tsx              # 홈
    explore/
    archive/              # ArchiveClient
    movie/[id]/
    journal/new/          # 작성 (로그인 필요)
    login/                # Google OAuth
    auth/callback/        # code → session
    profile/
    middleware.ts 경로용 → 루트 src/middleware.ts
  components/
  data/mock.ts            # 작품 mock (저널 시드 미리보기용)
  lib/tmdb.ts
  lib/journal.ts          # Supabase journals CRUD
  lib/supabase/           # client / server / middleware
supabase/migrations/      # journals + RLS SQL
docs/
```

## Auth & 데이터

| 항목 | 구현 |
|------|------|
| 로그인 | Google OAuth via Supabase (`/login`) |
| 콜백 | `/auth/callback` |
| 세션 | `@supabase/ssr` + `middleware` 쿠키 갱신 |
| 저널 | `public.journals` + RLS (`user_id = auth.uid()`) |
| 비로그인 아카이브 | mock 시드 미리보기 |
| 로그인 아카이브 | DB 본인 기록 |

설정 가이드: [supabase-setup.md](./supabase-setup.md)

## 라우팅

| 경로 | 비고 |
|------|------|
| `/` | Hero + 레일/벤토 |
| `/explore` | 검색/칩 |
| `/archive` | 시드 또는 내 저널 |
| `/journal/new` | 미로그인 시 `/login`으로 |
| `/login` | Google 버튼 |
| `/movie/[id]` | 상세 |
| `/profile` | 계정·통계·로그아웃 |
| `/auth/callback` | OAuth code exchange |

## 작품 데이터

`MediaItem`은 여전히 mock. 포스터는 TMDB CDN path.

저널만 계정에 묶입니다. `media_id`는 mock id 문자열을 저장합니다.

## 이미지

- TMDB: `media.themoviedb.org` / `image.tmdb.org`
- Google 아바타: `lh3.googleusercontent.com`

## 의존성

```
UI
 ├─ data/mock.ts          작품
 ├─ lib/journal.ts        저널 ↔ Supabase
 └─ lib/supabase/*        Auth 세션
```
