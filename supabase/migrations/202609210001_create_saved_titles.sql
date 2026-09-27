create table public.saved_titles (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  list_type text not null check (list_type in ('favorite', 'reminder')),
  reminder_date date,
  item_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type, list_type)
);

alter table public.saved_titles enable row level security;
grant select, insert, update, delete on public.saved_titles to authenticated;
grant usage, select on sequence public.saved_titles_id_seq to authenticated;

create policy "Users can read their saved titles"
on public.saved_titles for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can add their saved titles"
on public.saved_titles for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their saved titles"
on public.saved_titles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their saved titles"
on public.saved_titles for delete to authenticated
using ((select auth.uid()) = user_id);
