-- NexGen Retail OS — SQLite Schema

-- 1. Users & Profiles
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- In a real app, this should be hashed
  full_name TEXT,
  role TEXT CHECK (role IN ('customer', 'retailer')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Retailers
CREATE TABLE IF NOT EXISTS retailers (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  store_name TEXT,
  store_description TEXT,
  logo_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  retailer_id TEXT REFERENCES retailers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  original_price REAL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock_count INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1, -- 0 for false, 1 for true
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount REAL NOT NULL,
  gst_amount REAL NOT NULL,
  shipping_address TEXT, -- JSON string
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
