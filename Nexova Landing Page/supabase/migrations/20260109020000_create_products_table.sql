-- Create products table for inventory management
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- SKU/Product Code
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  base_price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'RM',
  quantity_pricing JSONB DEFAULT '[]'::jsonb, -- Array of {min_qty: number, price: number}
  notes TEXT, -- Internal notes
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_products_user_id ON products(user_id);

-- Create index on code for searching
CREATE INDEX idx_products_code ON products(code);

-- Create index on status for filtering
CREATE INDEX idx_products_status ON products(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Users can view their own products
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own products
CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own products
CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own products
CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE products IS 'Stores product inventory for e-commerce functionality';
COMMENT ON COLUMN products.quantity_pricing IS 'JSON array of bulk pricing: [{"min_qty": 10, "price": 45.00}, {"min_qty": 50, "price": 40.00}]';
COMMENT ON COLUMN products.notes IS 'Internal notes not visible to customers';
