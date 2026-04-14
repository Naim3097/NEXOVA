-- Migration: Add LeanX Payment Integration Support
-- Description: Adds LeanX credentials to profiles and creates transactions table
-- Date: 2026-01-06

-- Add LeanX credentials to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS leanx_api_key TEXT,
ADD COLUMN IF NOT EXISTS leanx_secret_key TEXT,
ADD COLUMN IF NOT EXISTS leanx_merchant_id TEXT,
ADD COLUMN IF NOT EXISTS leanx_enabled BOOLEAN DEFAULT false;

-- Create transactions table for payment tracking
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Transaction details
  transaction_id TEXT UNIQUE NOT NULL, -- LeanX transaction ID
  order_id TEXT NOT NULL, -- Our internal order ID

  -- Product information
  product_name TEXT NOT NULL,
  product_description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'MYR',

  -- Bump offer (upsell)
  has_bump_offer BOOLEAN DEFAULT false,
  bump_offer_name TEXT,
  bump_offer_amount DECIMAL(10, 2),
  bump_offer_accepted BOOLEAN DEFAULT false,

  -- Total amount (including bump offer if accepted)
  total_amount DECIMAL(10, 2) NOT NULL,

  -- Customer information
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,

  -- Payment status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed, cancelled, refunded
  payment_method TEXT,

  -- LeanX specific data
  leanx_payment_url TEXT,
  leanx_response JSONB,

  -- Metadata
  ip_address TEXT,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Indexes for better query performance
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_email ON transactions(customer_email);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions table

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert transactions (via API)
CREATE POLICY "Users can create transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own transactions (status updates via webhook)
CREATE POLICY "Users can update own transactions"
ON transactions FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users cannot delete transactions (audit trail)
-- No DELETE policy - transactions should never be deleted

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER set_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_updated_at();

-- Function to calculate transaction statistics
CREATE OR REPLACE FUNCTION get_transaction_stats(p_user_id UUID, p_project_id UUID DEFAULT NULL)
RETURNS TABLE (
  total_transactions BIGINT,
  successful_transactions BIGINT,
  failed_transactions BIGINT,
  cancelled_transactions BIGINT,
  total_revenue DECIMAL(10, 2),
  today_revenue DECIMAL(10, 2),
  today_transactions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_transactions,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as successful_transactions,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT as failed_transactions,
    COUNT(*) FILTER (WHERE status = 'cancelled')::BIGINT as cancelled_transactions,
    COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0) as total_revenue,
    COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed' AND DATE(created_at) = CURRENT_DATE), 0) as today_revenue,
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE)::BIGINT as today_transactions
  FROM transactions
  WHERE user_id = p_user_id
    AND (p_project_id IS NULL OR project_id = p_project_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_transaction_stats TO authenticated;

-- Comments for documentation
COMMENT ON TABLE transactions IS 'Stores payment transactions processed through LeanX gateway';
COMMENT ON COLUMN transactions.transaction_id IS 'LeanX transaction ID from payment gateway';
COMMENT ON COLUMN transactions.order_id IS 'Internal order ID generated by our system';
COMMENT ON COLUMN transactions.has_bump_offer IS 'Whether this transaction included a bump offer/upsell';
COMMENT ON COLUMN transactions.bump_offer_accepted IS 'Whether customer accepted the bump offer';
COMMENT ON COLUMN transactions.leanx_response IS 'Full JSON response from LeanX API for debugging';
