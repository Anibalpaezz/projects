-- Add time_format column to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN time_format text NOT NULL DEFAULT '24h';

-- Add a check constraint to ensure only valid values
ALTER TABLE public.user_settings 
ADD CONSTRAINT user_settings_time_format_check 
CHECK (time_format IN ('12h', '24h'));