ALTER TABLE public.profiles
    ADD CONSTRAINT username_length_check
        CHECK (char_length(username) BETWEEN 3 AND 20);

ALTER TABLE public.groups
    ADD CONSTRAINT group_name_length_check
        CHECK (char_length(name) BETWEEN 3 AND 30);

ALTER TABLE public.groups
    ADD CONSTRAINT group_description_length_check
        CHECK (
            description IS NULL
                OR char_length(description) <= 300
            );