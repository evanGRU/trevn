-- =========================================
-- Migration : smart_search_with_trigrams
-- =========================================

-- Enable pg_trgm extension (needed for fast fuzzy search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add new column search_name
ALTER TABLE IF EXISTS public.steam_apps_min
    ADD COLUMN IF NOT EXISTS search_name text;

-- Update column search_name for existing entries
UPDATE public.steam_apps_min
SET search_name = lower(regexp_replace(name, '[^a-zA-Z0-9 ]', ' ', 'g'))
WHERE search_name IS NULL;

-- Index for prefix search (fast for "term%")
CREATE INDEX IF NOT EXISTS idx_steam_apps_min_search_name
    ON public.steam_apps_min(search_name);

-- Trigram index for fuzzy search and substring search (%term%)
CREATE INDEX IF NOT EXISTS idx_steam_apps_min_search_trgm
    ON public.steam_apps_min
    USING gin (search_name gin_trgm_ops);

-- Normalization trigger function
CREATE OR REPLACE FUNCTION public.normalize_steam_name()
RETURNS trigger AS $$
BEGIN
    NEW.search_name := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9 ]', ' ', 'g'));
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update search_name
DROP TRIGGER IF EXISTS trg_normalize_steam_name ON public.steam_apps_min;

CREATE TRIGGER trg_normalize_steam_name
BEFORE INSERT OR UPDATE ON public.steam_apps_min
    FOR EACH ROW
    EXECUTE FUNCTION public.normalize_steam_name();
