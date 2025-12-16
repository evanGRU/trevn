-- =========================================
-- TABLE: groups_games
-- =========================================
create table if not exists public.groups_games (
    id uuid primary key default gen_random_uuid(),
    group_id text NOT NULL,
    game_id integer NOT NULL,
    added_by uuid,
    created_at timestamp with time zone default now(),
    constraint groups_games_group_id_fkey
        foreign key (group_id)
        references public.groups(id)
        on delete cascade,
    constraint groups_games_game_id_fkey
        foreign key (game_id)
        references public.steam_apps_min(id)
        on delete cascade,
    constraint groups_games_added_by_fkey
        foreign key (added_by)
        references auth.users(id)
        on delete set null,
    constraint groups_games_unique unique (group_id, game_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_groups_games_group_id
    ON public.groups_games (group_id);

CREATE INDEX IF NOT EXISTS idx_groups_games_game_id
    ON public.groups_games (game_id);

CREATE INDEX IF NOT EXISTS idx_groups_games_added_by
    ON public.groups_games (added_by);