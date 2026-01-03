set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.normalize_steam_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.search_name :=
        lower(regexp_replace(NEW.name, '[^a-zA-Z0-9 ]', ' ', 'g'));
RETURN NEW;
END;
$function$
;


