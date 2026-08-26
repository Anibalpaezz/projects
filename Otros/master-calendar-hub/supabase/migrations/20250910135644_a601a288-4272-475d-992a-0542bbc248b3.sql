-- Fix the trigger function to be SECURITY DEFINER so it can insert into calendar_members
DROP TRIGGER IF EXISTS calendars_owner_membership ON public.calendars;
DROP FUNCTION IF EXISTS public.ensure_owner_membership() CASCADE;

CREATE OR REPLACE FUNCTION public.ensure_owner_membership()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.calendar_members (calendar_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (calendar_id, user_id) do nothing;
  return new;
end;
$function$;

-- Recreate the trigger
CREATE TRIGGER calendars_owner_membership
  AFTER INSERT ON public.calendars
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_owner_membership();