drop view if exists public.groups_games_with_likes;

create view public.groups_games_with_likes as
with likes_count as (
  select
    group_id,
    game_id,
    count(*) as count
  from public.groups_games_likes
  group by group_id, game_id
),
user_likes as (
  select
    group_id,
    game_id
  from public.groups_games_likes
  where user_id = auth.uid()
)
select
    gg.group_id,
    gg.game_id,
    gg.created_at,
    sa.name,
    coalesce(lc.count, 0) as likes_count,
    ul.game_id is not null as is_liked
from public.groups_games gg
join public.steam_apps_min sa on sa.id = gg.game_id
left join likes_count lc
    on lc.group_id = gg.group_id and lc.game_id = gg.game_id
left join user_likes ul
    on ul.group_id = gg.group_id and ul.game_id = gg.game_id;
