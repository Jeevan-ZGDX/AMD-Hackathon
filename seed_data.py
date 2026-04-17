import json
import random
from faker import Faker

fake = Faker()

def generate_skus(num=5000):
    categories = ['Athleisure', 'Tech', 'Home', 'Beauty', 'Fitness']
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
            "stock_level": random.randint(0, 1000)
        })
    return skus

def generate_users(num=10000):
    moods = ['Exploratory', 'Stressed', 'Focused', 'Impulsive']
    users = []
    for _ in range(num):
        users.append({
            "user_id": fake.uuid4(),
            "name": fake.name(),
            "email": fake.email(),
            "behavior_vector": [round(random.random(), 4) for _ in range(5)], # Mock pgvector embedding
            "typical_mood": random.choice(moods),
            "confidence_score": round(random.uniform(0.5, 0.99), 2)
        })
    return users

if __name__ == "__main__":
    print("Seeding 5000 SKUs...")
    skus = generate_skus(5000)
    with open("backend/skus_seed.json", "w") as f:
        json.dump(skus, f, indent=2)
    
    print("Seeding 10000 Users...")
    users = generate_users(10000)
    with open("backend/users_seed.json", "w") as f:
        json.dump(users, f, indent=2)
    
    print("Seeding complete! Files saved in backend/ directory.")
