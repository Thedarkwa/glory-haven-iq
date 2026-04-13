DO $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, approved, role)
  VALUES ('040215f2-eedb-446f-9fab-75c3646b49d0', 'kelvin Darkwa', true, NULL)
  ON CONFLICT (user_id)
  DO UPDATE SET
    approved = true,
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name);

  INSERT INTO public.user_roles (user_id, role)
  VALUES ('040215f2-eedb-446f-9fab-75c3646b49d0', 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;