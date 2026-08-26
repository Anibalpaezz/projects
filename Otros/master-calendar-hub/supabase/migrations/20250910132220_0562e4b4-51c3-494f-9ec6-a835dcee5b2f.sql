-- Fix security definer functions to have proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.ensure_owner_membership()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
begin
  insert into public.calendar_members (calendar_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (calendar_id, user_id) do nothing;
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.ensure_primary_calendar()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
declare
  uid uuid := auth.uid();
  existing uuid;
begin
  select id into existing from public.calendars where owner_id = uid and is_primary = true limit 1;
  if existing is null then
    insert into public.calendars (owner_id, name, color, is_primary)
    values (uid, 'Personal', '#4F46E5', true);
  end if;
end;
$function$;