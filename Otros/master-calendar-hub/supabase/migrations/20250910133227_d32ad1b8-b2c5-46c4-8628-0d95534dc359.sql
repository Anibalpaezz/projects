-- Add location column to events table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'location') THEN
        ALTER TABLE events ADD COLUMN location text;
    END IF;
END $$;

-- Update the event saving process to handle reminders
-- First, let's make sure we can insert reminders properly after events are created