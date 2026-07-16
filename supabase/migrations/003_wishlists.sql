-- Wishlists (찜) — 본인만 CRUD
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  media_id text not null,
  title text not null default '',
  poster_path text,
  media_type text not null default 'movie',
  created_at timestamptz not null default now(),
  unique (user_id, media_id)
);

create index if not exists wishlists_user_id_created_at_idx
  on public.wishlists (user_id, created_at desc);

alter table public.wishlists enable row level security;

drop policy if exists "wishlists_select_own" on public.wishlists;
create policy "wishlists_select_own"
  on public.wishlists for select
  using (auth.uid() = user_id);

drop policy if exists "wishlists_insert_own" on public.wishlists;
create policy "wishlists_insert_own"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

drop policy if exists "wishlists_delete_own" on public.wishlists;
create policy "wishlists_delete_own"
  on public.wishlists for delete
  using (auth.uid() = user_id);

grant select, insert, delete on public.wishlists to authenticated;
