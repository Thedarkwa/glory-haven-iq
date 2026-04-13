
ALTER TABLE public.profiles ADD COLUMN approved boolean NOT NULL DEFAULT false;

-- Auto-approve admins (the first user / creator)
UPDATE public.profiles SET approved = true WHERE user_id IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
);
