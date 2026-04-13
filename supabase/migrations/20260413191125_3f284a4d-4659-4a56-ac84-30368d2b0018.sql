ALTER TABLE public.profiles
ALTER COLUMN role DROP DEFAULT;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_key
ON public.profiles (user_id);

CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_role_key
ON public.user_roles (user_id, role);

CREATE OR REPLACE FUNCTION public.bootstrap_profile_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  is_first_profile boolean;
BEGIN
  PERFORM pg_advisory_xact_lock(214748301);

  SELECT NOT EXISTS (
    SELECT 1
    FROM public.profiles
  ) INTO is_first_profile;

  NEW.role := NULL;

  IF is_first_profile THEN
    NEW.approved := true;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    NEW.approved := false;
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS bootstrap_profile_on_insert ON public.profiles;
CREATE TRIGGER bootstrap_profile_on_insert
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.bootstrap_profile_on_insert();

CREATE OR REPLACE FUNCTION public.protect_profile_system_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.approved := OLD.approved;
    NEW.role := OLD.role;
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS protect_profile_system_fields ON public.profiles;
CREATE TRIGGER protect_profile_system_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_system_fields();