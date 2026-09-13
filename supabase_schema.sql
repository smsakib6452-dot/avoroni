-- ==============================================================================
-- AVORONI MAISON (আভরণী) - Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. Table for CMS Site Content (editable in real-time from /admin)
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'active',
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site_content
DROP POLICY IF EXISTS "Allow public read on site_content" ON public.site_content;
CREATE POLICY "Allow public read on site_content"
  ON public.site_content FOR SELECT
  USING (true);

-- Allow full access to service_role / all operations
DROP POLICY IF EXISTS "Allow full access on site_content" ON public.site_content;
CREATE POLICY "Allow full access on site_content"
  ON public.site_content FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. Table for Customer Orders & Inquiries (1-Click COD Checkout & CRM)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'order' NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  delivery_zone TEXT DEFAULT 'inside_dhaka',
  delivery_fee NUMERIC DEFAULT 80,
  payment_method TEXT DEFAULT 'cod',
  product JSONB,
  occasion TEXT,
  message TEXT,
  notes TEXT,
  total_amount NUMERIC DEFAULT 0,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public insert on inquiries
DROP POLICY IF EXISTS "Allow public insert on inquiries" ON public.inquiries;
CREATE POLICY "Allow public insert on inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- Allow full access on inquiries
DROP POLICY IF EXISTS "Allow full access on inquiries" ON public.inquiries;
CREATE POLICY "Allow full access on inquiries"
  ON public.inquiries FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for fast CRM sorting
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
