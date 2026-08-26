-- Create trigger to automatically add calendar owner as a member
CREATE TRIGGER ensure_owner_membership_trigger
AFTER INSERT ON public.calendars
FOR EACH ROW
EXECUTE FUNCTION public.ensure_owner_membership();