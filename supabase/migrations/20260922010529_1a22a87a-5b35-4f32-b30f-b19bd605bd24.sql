GRANT SELECT, INSERT, UPDATE ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;
GRANT SELECT, INSERT ON public.opening_balance_history TO authenticated;
GRANT ALL ON public.opening_balance_history TO service_role;

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER trg_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_log_opening_balance_change ON public.user_settings;
CREATE TRIGGER trg_log_opening_balance_change
AFTER UPDATE ON public.user_settings
FOR EACH ROW
WHEN (OLD.opening_balance IS DISTINCT FROM NEW.opening_balance)
EXECUTE FUNCTION public.log_opening_balance_change();