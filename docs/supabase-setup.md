# Supabase + Google 로그인 설정

코드는 이미 연결되어 있습니다. 아래 순서로 프로젝트만 붙이면 됩니다.

## 1. Supabase 프로젝트

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. **Project Settings → API**
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 루트에 `.env.local` 생성:

```bash
cp .env.example .env.local
# 값을 채워 넣기
```

4. **SQL Editor**에서 아래를 **순서대로** 실행
   - [`supabase/migrations/001_journals.sql`](../supabase/migrations/001_journals.sql)
   - [`supabase/migrations/002_journals_public_read.sql`](../supabase/migrations/002_journals_public_read.sql)  
     → 아카이브 **공개 피드**(다른 사람 기록 조회) + 작성자 닉네임/이모지 컬럼
   - [`supabase/migrations/003_wishlists.sql`](../supabase/migrations/003_wishlists.sql)  
     → **위시리스트**(본인만 조회·추가·삭제)
   - [`supabase/migrations/004_journal_likes.sql`](../supabase/migrations/004_journal_likes.sql)  
     → 몽글 **좋아요**(조회 공개, 추가·삭제는 본인만)

> 이미 앞선 마이그레이션만 실행했다면 빠진 번호만 추가 실행하면 됩니다.

## 2. Google OAuth

### Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) → 새 프로젝트(또는 기존)
2. **APIs & Services → OAuth consent screen** 설정 (External / 테스트 사용자 추가 가능)
3. **Credentials → Create OAuth client ID**
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - (배포 후) `https://your-domain.com`
   - Authorized redirect URIs — **Supabase 콜백**을 넣습니다:
     - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
4. Client ID / Client Secret 복사

### Supabase Auth

1. Authentication → Providers → **Google** 활성화
2. Client ID / Secret 붙여넣기
3. Authentication → URL Configuration
   - Site URL: `https://mongle-steel.vercel.app` (프로덕션)
   - Redirect URLs에 추가:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**`
     - `https://mongle-steel.vercel.app/auth/callback`
     - `https://mongle-steel.vercel.app/**`
     - (프리뷰용, 선택) `https://*.vercel.app/**`

### Google Cloud Console — 배포 후 추가

Authorized JavaScript origins에 프로덕션도 넣습니다:

- `https://mongle-steel.vercel.app`

> Google **Authorized redirect URIs**는 앱 도메인이 아니라  
> `https://<PROJECT_REF>.supabase.co/auth/v1/callback` 만 있으면 됩니다.

## 3. 확인

```bash
nvm use 20
npm run dev
```

1. `/login` → **Google로 계속하기**
2. 로그인 후 `/journal/new`에서 기록 저장
3. `/archive` · 프로필에 동일 계정으로 표시되는지 확인
4. 다른 브라우저/시크릿에서도 같은 Google 계정으로 로그인하면 기록이 보입니다

## 동작 요약

| 항목 | 내용 |
|------|------|
| Auth | Supabase Auth + Google OAuth |
| 콜백 | `/auth/callback` (code → session) |
| 테이블 | `public.journals` — SELECT 공개, INSERT/UPDATE/DELETE 본인만 |
| 테이블 | `public.wishlists` — SELECT/INSERT/DELETE 본인만 |
| 테이블 | `public.journal_likes` — SELECT 공개, INSERT/DELETE 본인만 |
| 미들웨어 | 세션 쿠키 갱신 (`src/middleware.ts`) |
| 비로그인 아카이브 | 시드 미리보기 + 로그인 CTA |
| 로그인 아카이브 | DB의 내 기록만 |

## 트러블슈팅

| 증상 | 확인 |
|------|------|
| redirect_uri_mismatch | Google Redirect URI가 Supabase 콜백인지 |
| 로그인 후 바로 풀림 | Site URL / Redirect URLs에 `/auth/callback` 포함 여부 |
| insert 실패 / RLS | SQL 마이그레이션 실행·정책 존재 여부 |
| env 없음 안내 | `.env.local` 저장 후 **dev 서버 재시작** |
