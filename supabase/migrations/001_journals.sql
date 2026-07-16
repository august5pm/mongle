-- Mongle journals table + RLS
-- Supabase SQL Editor에서 실행하거나 CLI로 migrate

create table if not exists public.journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  media_id text not null,
  emotion text not null,
  emotion_label text not null,
  note text not null check (char_length(note) >= 2 and char_length(note) <= 140),
  genre_label text not null default '영화',
  bubble_tone text not null default 'primary',
  author_nickname text not null default '몽글러',
  author_emoji text not null default '☁️',
  created_at timestamptz not null default now()
);

create index if not exists journals_user_id_created_at_idx
  on public.journals (user_id, created_at desc);

alter table public.journals enable row level security;

-- 누구나 조회 (아카이브 공개 피드)
drop policy if exists "journals_select_own" on public.journals;
drop policy if exists "journals_select_public" on public.journals;
create policy "journals_select_public"
  on public.journals for select
  using (true);

drop policy if exists "journals_insert_own" on public.journals;
create policy "journals_insert_own"
  on public.journals for insert
  with check (auth.uid() = user_id);

drop policy if exists "journals_update_own" on public.journals;
create policy "journals_update_own"
  on public.journals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "journals_delete_own" on public.journals;
create policy "journals_delete_own"
  on public.journals for delete
  using (auth.uid() = user_id);
