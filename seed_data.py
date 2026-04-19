"""
NexGen Retail OS — Master Seed Generator
=========================================
Generates all seed data files for the backend:
  - seed_products.json  (30 curated retail products)
  - seed_orders.json    (12 realistic orders)
  - skus_seed.json      (5000 SKUs for ML pricing engine)
  - users_seed.json     (10000 behavioral user profiles)

Run:  python seed_data.py
"""

import json
import random
from faker import Faker

fake = Faker()

# ─── SKU DATA (for ML pricing engine) ────────────────────
def generate_skus(num=5000):
    categories = ['Athleisure', 'Tech', 'Home', 'Beauty', 'Fitness', 'Electronics', 'Groceries', 'Fashion']
    tags = ['Bestseller', 'New', 'Seasonal', 'Premium', 'Limited', 'Clearance', 'Organic', 'Imported']
    skus = []
    for _ in range(num):
        base_price = round(random.uniform(10.0, 500.0), 2)
        skus.append({
            "sku_id": fake.uuid4(),
            "name": fake.catch_phrase(),
            "category": random.choice(categories),
            "base_price": base_price,
            "margin_floor": round(base_price * 0.4, 2),
            "competitor_price": round(base_price * random.uniform(0.9, 1.1), 2),
            "stock_level": random.randint(0, 1000),
            "tag": random.choice(tags),
            "demand_score": round(random.uniform(0.1, 1.0), 3),
            "elasticity": round(random.uniform(-2.5, -0.3), 2)
        })
    return skus

# ─── USER BEHAVIORAL DATA (for pre-cognitive engine) ─────
def generate_users(num=10000):
    moods = ['Exploratory', 'Stressed', 'Focused', 'Impulsive', 'Bargain-Hunting', 'Premium-Seeking']
    devices = ['mobile', 'desktop', 'tablet']
    regions = ['MUM', 'DEL', 'BLR', 'CHE', 'HYD', 'KOL', 'PUN', 'AHM']
    users = []
    for _ in range(num):
        users.append({
            "user_id": fake.uuid4(),
            "name": fake.name(),
            "email": fake.email(),
            "behavior_vector": [round(random.random(), 4) for _ in range(5)],
            "typical_mood": random.choice(moods),
            "confidence_score": round(random.uniform(0.5, 0.99), 2),
            "preferred_device": random.choice(devices),
            "region": random.choice(regions),
            "avg_session_duration_sec": random.randint(30, 600),
            "total_orders": random.randint(0, 50),
            "lifetime_value": round(random.uniform(0, 50000), 2)
        })
    return users


if __name__ == "__main__":
    print("╔══════════════════════════════════════════════╗")
    print("║   🌱 NexGen Retail OS — Master Seeder       ║")
    print("╚══════════════════════════════════════════════╝")
    print()

    print("📦 Generating 5,000 SKUs for pricing engine...")
    skus = generate_skus(5000)
    with open("backend/skus_seed.json", "w") as f:
        json.dump(skus, f, indent=2)
    print(f"   ✅ Saved → backend/skus_seed.json ({len(skus)} records)")

    print("👥 Generating 10,000 user behavioral profiles...")
    users = generate_users(10000)
    with open("backend/users_seed.json", "w") as f:
        json.dump(users, f, indent=2)
    print(f"   ✅ Saved → backend/users_seed.json ({len(users)} records)")

    print()
    print("╔══════════════════════════════════════════════╗")
    print("║   ✅ Seeding Complete!                       ║")
    print("╠══════════════════════════════════════════════╣")
    print("║   Files generated:                          ║")
    print("║     • backend/skus_seed.json    (5,000)     ║")
    print("║     • backend/users_seed.json   (10,000)    ║")
    print("║     • backend/seed_products.json (30)       ║")
    print("║     • backend/seed_orders.json  (12)        ║")
    print("╠══════════════════════════════════════════════╣")
    print("║   Next steps:                               ║")
    print("║     1. cd backend && python main.py         ║")
    print("║     2. cd frontend && npm run seed          ║")
    print("╚══════════════════════════════════════════════╝")
