-- Journal likes — 누구나 조회, 로그인한 본인만 추가/삭제
create table if not exists public.journal_likes (
  id uuid primary key default gen_random_uuid(),
  journal_id uuid not null references public.journals (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (journal_id, user_id)
);

create index if not exists journal_likes_journal_id_idx
  on public.journal_likes (journal_id);

create index if not exists journal_likes_user_id_idx
  on public.journal_likes (user_id);

alter table public.journal_likes enable row level security;

drop policy if exists "journal_likes_select_public" on public.journal_likes;
create policy "journal_likes_select_public"
  on public.journal_likes for select
  using (true);

drop policy if exists "journal_likes_insert_own" on public.journal_likes;
create policy "journal_likes_insert_own"
  on public.journal_likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "journal_likes_delete_own" on public.journal_likes;
create policy "journal_likes_delete_own"
  on public.journal_likes for delete
  using (auth.uid() = user_id);

grant select on public.journal_likes to anon, authenticated;
grant insert, delete on public.journal_likes to authenticated;
