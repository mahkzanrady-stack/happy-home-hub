GRANT SELECT, INSERT, UPDATE, DELETE ON public.beneficiaries TO authenticated;
GRANT ALL ON public.beneficiaries TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.movement_types TO authenticated;
GRANT ALL ON public.movement_types TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.goods_transactions TO authenticated;
GRANT ALL ON public.goods_transactions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.money_transactions TO authenticated;
GRANT ALL ON public.money_transactions TO service_role;