create table if not exists public.groups_games_likes (
    id uuid primary key default gen_random_uuid(),
    group_id text not null references public.groups(id) on delete cascade,
    game_id bigint not null references public.steam_apps_min(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz default now(),
    constraint like_group_game_fkey
        foreign key (group_id, game_id)
        references public.groups_games (group_id, game_id)
        on delete cascade,
    constraint unique_like_per_user unique (group_id, game_id, user_id)
);

create index on public.groups_games_likes (group_id);
create index on public.groups_games_likes (game_id);
create index on public.groups_games_likes (user_id);
create index on public.groups_games_likes (group_id, game_id);

alter table public.groups_games_likes enable row level security;

-- Read own likes
create policy "members can read group likes"
on public.groups_games_likes
for select
using (
    exists (
        select 1
        from public.groups_members gm
        where gm.group_id = groups_games_likes.group_id
        and gm.user_id = auth.uid()
    )
);

-- Like
create policy "members can like games"
on public.groups_games_likes
for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.groups_members gm
    where gm.group_id = groups_games_likes.group_id
    and gm.user_id = auth.uid()
  )
);

-- Unlike
create policy "users can remove their own likes"
on public.groups_games_likes
for delete
using (
  user_id = auth.uid()
);