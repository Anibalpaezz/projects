-- Add description and visibility fields to calendars table
ALTER TABLE public.calendars 
ADD COLUMN description TEXT,
ADD COLUMN visible BOOLEAN NOT NULL DEFAULT true;

-- Add locale field to user_settings for i18n
ALTER TABLE public.user_settings 
ADD COLUMN language TEXT NOT NULL DEFAULT 'en';