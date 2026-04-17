-- 1. Create Products Table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id uuid REFERENCES retailers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  category text NOT NULL,
  image_url text,
  stock_count int DEFAULT 0,
  rating numeric(3,2) DEFAULT 0,
  review_count int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Retailers can insert their own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = retailer_id);

CREATE POLICY "Retailers can update their own products" ON products
  FOR UPDATE USING (auth.uid() = retailer_id);

CREATE POLICY "Retailers can delete their own products" ON products
  FOR DELETE USING (auth.uid() = retailer_id);
