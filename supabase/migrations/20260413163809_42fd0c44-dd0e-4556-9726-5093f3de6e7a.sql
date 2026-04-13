
-- Add date_of_birth and photo_url to staff table
ALTER TABLE public.staff ADD COLUMN date_of_birth date;
ALTER TABLE public.staff ADD COLUMN photo_url text;

-- Create storage bucket for staff photos
INSERT INTO storage.buckets (id, name, public) VALUES ('staff-photos', 'staff-photos', true);

-- Allow authenticated users to upload staff photos
CREATE POLICY "Authenticated users can upload staff photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'staff-photos');

-- Allow anyone to view staff photos (public bucket)
CREATE POLICY "Anyone can view staff photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'staff-photos');

-- Allow authenticated users to update/delete staff photos
CREATE POLICY "Authenticated users can update staff photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'staff-photos');

CREATE POLICY "Authenticated users can delete staff photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'staff-photos');
