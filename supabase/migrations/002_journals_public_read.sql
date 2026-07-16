-- Public read for archive feed + author display fields
-- Supabase SQL Editor에서 실행

alter table public.journals
  add column if not exists author_nickname text not null default '몽글러',
  add column if not exists author_emoji text not null default '☁️';

-- 기존: 본인만 조회 → 전원 공개 조회로 교체
drop policy if exists "journals_select_own" on public.journals;
drop policy if exists "journals_select_public" on public.journals;

create policy "journals_select_public"
  on public.journals for select
  using (true);

-- insert/update/delete는 본인만 (기존 정책 유지)
-- journals_insert_own / journals_update_own / journals_delete_own
