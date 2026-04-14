-- Fix subscription table constraints for plan and status fields
-- The plan column only allowed 'free' and 'pro' but we need 'premium' and 'enterprise'
-- The status column was missing 'pending' and 'failed' values

-- First, drop the existing constraints
ALTER TABLE public.subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

ALTER TABLE public.subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_status_check;

-- Add updated constraints with all required values
ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_plan_check
CHECK (plan = ANY (ARRAY['free'::text, 'pro'::text, 'premium'::text, 'enterprise'::text]));

ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_status_check
CHECK (status = ANY (ARRAY['active'::text, 'cancelled'::text, 'past_due'::text, 'trialing'::text, 'incomplete'::text, 'pending'::text, 'failed'::text]));
