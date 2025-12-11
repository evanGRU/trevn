-- =========================================
-- Migration : add smart search on steam_apps_min
-- =========================================

-- Add new column search_name
ALTER TABLE IF EXISTS public.steam_apps_min
    ADD COLUMN IF NOT EXISTS search_name text;

-- Update column search_name for existing games
UPDATE public.steam_apps_min
SET search_name = lower(regexp_replace(name, '[^a-zA-Z0-9 ]', '', 'g'))
WHERE search_name IS NULL;

-- Add an index to speed up the search
CREATE INDEX IF NOT EXISTS idx_steam_apps_min_search_name
    ON public.steam_apps_min(search_name);

-- Create a function to automatically normalize new inserts/updates
CREATE OR REPLACE FUNCTION public.normalize_steam_name()
RETURNS trigger AS $$
BEGIN
    NEW.search_name := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9 ]', '', 'g'));
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to automatically populate search_name
DROP TRIGGER IF EXISTS trg_normalize_steam_name ON public.steam_apps_min;

CREATE TRIGGER trg_normalize_steam_name
BEFORE INSERT OR UPDATE ON public.steam_apps_min
    FOR EACH ROW
    EXECUTE FUNCTION public.normalize_steam_name();
