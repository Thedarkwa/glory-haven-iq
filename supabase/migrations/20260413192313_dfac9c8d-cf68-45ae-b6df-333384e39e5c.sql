DROP TRIGGER IF EXISTS protect_profile_system_fields ON public.profiles;

CREATE OR REPLACE FUNCTION public.protect_profile_system_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  NEW.approved := OLD.approved;
  NEW.role := OLD.role;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER protect_profile_system_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_system_fields();