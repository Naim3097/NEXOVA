-- Fix the sync_subscription_to_profile trigger to only update profile plan
-- when subscription status is 'active' (payment completed)
-- Pending payments should NOT upgrade the user

CREATE OR REPLACE FUNCTION sync_subscription_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Only sync subscription_plan to profile if status is 'active'
  -- This ensures users aren't upgraded until payment is confirmed
  IF NEW.status = 'active' THEN
    UPDATE profiles
    SET
      subscription_plan = NEW.plan,
      subscription_status = NEW.status,
      subscription_renewal_date = NEW.current_period_end,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  ELSE
    -- For non-active statuses, only update the status field, not the plan
    UPDATE profiles
    SET
      subscription_status = NEW.status,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
