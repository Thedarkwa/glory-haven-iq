CREATE OR REPLACE FUNCTION public.ensure_profile_exists(_user_id uuid, _display_name text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  is_first_profile boolean;
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user_id) THEN
    RETURN;
  END IF;

  PERFORM pg_advisory_xact_lock(214748301);

  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles
  ) INTO is_first_profile;

  INSERT INTO public.profiles (user_id, display_name, approved, role)
  VALUES (
    _user_id,
    COALESCE(_display_name, 'User'),
    CASE WHEN is_first_profile THEN true ELSE false END,
    NULL
  )
  ON CONFLICT (user_id) DO NOTHING;

  IF is_first_profile THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$function$;