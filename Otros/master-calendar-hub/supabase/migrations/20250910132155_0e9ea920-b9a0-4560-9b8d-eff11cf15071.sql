-- Fix infinite recursion in calendar_members RLS policies by creating a security definer function

-- Drop the problematic policy first
DROP POLICY IF EXISTS "select members if member" ON calendar_members;

-- Create a security definer function to check if user is a member of calendar
CREATE OR REPLACE FUNCTION public.is_calendar_member(calendar_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM calendar_members m
    WHERE m.calendar_id = $1 AND m.user_id = $2
  )
$$;

-- Recreate the policy using the security definer function
CREATE POLICY "select members if member" 
ON calendar_members 
FOR SELECT 
USING (public.is_calendar_member(calendar_members.calendar_id, auth.uid()));

-- Also fix the calendars policy that might have similar issues
DROP POLICY IF EXISTS "select calendars where member" ON calendars;

CREATE POLICY "select calendars where member" 
ON calendars 
FOR SELECT 
USING (public.is_calendar_member(calendars.id, auth.uid()));