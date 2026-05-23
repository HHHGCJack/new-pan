-- Supabase May 30th Update: Explicit Grants and RLS Policies Setup
-- Run this SQL in your Supabase SQL Editor.

-- 1. Grant access to the `books` table
GRANT SELECT ON public.books TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON public.books TO authenticated, service_role;

-- Enable RLS on `books`
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Allow public read access to `books`
CREATE POLICY "Allow public read access on books"
  ON public.books
  FOR SELECT
  USING (true);

-- Allow authenticated users (or service_role) to insert/update/delete books
-- Note: You may want to restrict this further if only admins should edit books.
CREATE POLICY "Allow authenticated full access on books"
  ON public.books
  FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);


-- 2. Grant access to the `settings` table
GRANT SELECT ON public.settings TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON public.settings TO authenticated, service_role;

-- Enable RLS on `settings`
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to `settings`
CREATE POLICY "Allow public read access on settings"
  ON public.settings
  FOR SELECT
  USING (true);

-- Allow authenticated users to manage `settings`
CREATE POLICY "Allow authenticated full access on settings"
  ON public.settings
  FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Note: Also ensure your storage buckets have proper RLS policies set up if you just created them.
