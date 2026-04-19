import sqlite3
import json
import os
import uuid

# Configuration
DB_FILE = 'nexgen.db'
BACKEND_DIR = 'backend'

def migrate():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    print("🚀 Starting Migration to SQLite...")

    # 1. Create Default Retailer
    retailer_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO users (id, email, password, full_name, role)
        VALUES (?, ?, ?, ?, ?)
    """, (retailer_id, 'retailer@nexgen.test', 'password123', 'NexGen Main Store', 'retailer'))
    
    cursor.execute("""
        INSERT INTO retailers (id, store_name, store_description)
        VALUES (?, ?, ?)
    """, (retailer_id, 'NexGen Global', 'Official NexGen retail partner for high-performance goods.'))

    # 2. Migrate Products
    products_path = os.path.join(BACKEND_DIR, 'seed_products.json')
    with open(products_path, 'r') as f:
        products = json.load(f)
    
    for p in products:
        cursor.execute("""
            INSERT INTO products (
                id, retailer_id, name, description, price, original_price, 
                category, image_url, stock_count, rating, review_count, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(p['id']), 
            retailer_id, 
            p['name'], 
            p.get('description', ''), 
            p['price'], 
            p.get('competitor_price', p['price']), 
            p['category'], 
            p.get('image_url', ''), 
            p.get('stock', 0), 
            p.get('rating', 0), 
            p.get('review_count', 0), 
            1
        ))
    print(f"✅ Migrated {len(products)} products.")

    # 3. Create Mock Users for Orders
    orders_path = os.path.join(BACKEND_DIR, 'seed_orders.json')
    with open(orders_path, 'r') as f:
        orders = json.load(f)
    
    unique_user_ids = set(o['user_id'] for o in orders)
    user_map = {}
    for uid in unique_user_ids:
        new_id = str(uuid.uuid4())
        user_map[uid] = new_id
        cursor.execute("""
            INSERT INTO users (id, email, password, full_name, role)
            VALUES (?, ?, ?, ?, ?)
        """, (new_id, f"{uid}@test.com", 'password123', f"Test User {uid}", 'customer'))
    
    # 4. Migrate Orders and Order Items
    for o in orders:
        sqlite_order_id = o['order_id']
        cursor.execute("""
            INSERT INTO orders (
                id, user_id, status, total_amount, gst_amount, 
                shipping_address, payment_method, payment_status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            sqlite_order_id,
            user_map[o['user_id']],
            o['status'].lower(),
            o['total'],
            round(o['total'] * 0.18, 2),
            json.dumps({"street": "123 Seed Street", "city": "Genesis", "zip": "000001"}),
            'card',
            'paid',
            o.get('created_at', '2026-04-19T00:00:00Z')
        ))

        for item in o['items']:
            cursor.execute("""
                INSERT INTO order_items (
                    id, order_id, product_id, quantity, price_at_purchase
                ) VALUES (?, ?, ?, ?, ?)
            """, (
                str(uuid.uuid4()),
                sqlite_order_id,
                str(item['id']),
                1, # Seed data doesn't specify quantity, assuming 1
                item['price']
            ))

    print(f"✅ Migrated {len(orders)} orders and their items.")

    conn.commit()
    conn.close()
    print("🎉 Migration Complete!")

if __name__ == "__main__":
    migrate()
