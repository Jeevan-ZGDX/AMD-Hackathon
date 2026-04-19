import asyncio
import json
import random
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from ml_model import predict_intent, suggest_price

app = FastAPI(title="NexGen Retail OS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOAD SEED DATA FROM JSON FILES ---
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

def load_json_seed(filename: str, fallback: list = []):
    filepath = os.path.join(BACKEND_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            print(f"✅ Loaded seed data from {filename}")
            return json.load(f)
    print(f"⚠️  Seed file {filename} not found, using fallback.")
    return fallback

DB_PRODUCTS = load_json_seed("seed_products.json")
DB_CART = []
DB_ORDERS = load_json_seed("seed_orders.json")

# --- MODELS ---
class BehaviorEvent(BaseModel):
    user_id: str
    scroll_velocity: float
    hover_dwell_ms: int
    mouse_tremor: float

class CheckoutRequest(BaseModel):
    user_id: str
    cart_items: List[int]
    address: str
    delivery_slot: str

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    competitor_price: float
    stock: int

class PriceUpdate(BaseModel):
    price: float

class PriceSuggestionRequest(BaseModel):
    category: str
    competitor_price: float
    current_price: float

# --- SHOPPER (CUSTOMER) ROUTES ---
@app.get("/api/v1/products")
async def get_products(category: Optional[str] = None, q: Optional[str] = None):
    results = DB_PRODUCTS
    if category:
        results = [p for p in results if p["category"].lower() == category.lower()]
    if q:
        results = [p for p in results if q.lower() in p["name"].lower()]
    return results

@app.get("/api/v1/cart")
async def get_cart():
    return DB_CART

@app.post("/api/v1/cart/{product_id}")
async def add_to_cart(product_id: int):
    product = next((p for p in DB_PRODUCTS if p["id"] == product_id), None)
    if product and not any(p["id"] == product_id for p in DB_CART):
        DB_CART.append(product)
    return DB_CART

@app.delete("/api/v1/cart/{product_id}")
async def remove_from_cart(product_id: int):
    global DB_CART
    DB_CART = [p for p in DB_CART if p["id"] != product_id]
    return DB_CART

@app.post("/api/v1/checkout")
async def api_checkout(req: CheckoutRequest):
    global DB_CART, DB_ORDERS
    order = {
        "order_id": f"ORD-{random.randint(1000, 9999)}",
        "user_id": req.user_id,
        "items": DB_CART.copy(),
        "total": sum(p["price"] for p in DB_CART),
        "status": "Processing",
        "delivery_slot": req.delivery_slot
    }
    DB_ORDERS.append(order)
    DB_CART = [] 
    return {"status": "success", "order": order}

@app.get("/api/v1/orders")
async def get_orders():
    return DB_ORDERS

# --- RETAILER / ADMIN ROUTES ---
@app.get("/api/v1/admin/analytics")
async def get_analytics():
    total_sales = sum(o["total"] for o in DB_ORDERS)
    # Compute top categories from real product data
    from collections import Counter
    cat_counter = Counter(p["category"] for p in DB_PRODUCTS)
    top_cats = [cat for cat, _ in cat_counter.most_common(5)]
    return {
        "total_revenue": total_sales,
        "total_orders": len(DB_ORDERS),
        "top_categories": top_cats,
        "active_users": random.randint(120, 380),
        "avg_order_value": round(total_sales / max(len(DB_ORDERS), 1), 2),
        "stock_alerts": [p["name"] for p in DB_PRODUCTS if p["stock"] < 20],
        "low_stock_count": len([p for p in DB_PRODUCTS if p["stock"] < 20]),
        "total_products": len(DB_PRODUCTS),
        "categories_count": len(set(p["category"] for p in DB_PRODUCTS))
    }

@app.post("/api/v1/products")
async def create_product(prod: ProductCreate):
    new_id = max([p["id"] for p in DB_PRODUCTS]) + 1 if DB_PRODUCTS else 1
    new_prod = {
        "id": new_id,
        "name": prod.name,
        "category": prod.category,
        "price": prod.price,
        "competitor_price": prod.competitor_price,
        "stock": prod.stock,
        "tag": "New",
        "color": "from-indigo-500/20 to-blue-500/10"
    }
    DB_PRODUCTS.append(new_prod)
    return new_prod

@app.delete("/api/v1/products/{product_id}")
async def delete_product(product_id: int):
    global DB_PRODUCTS
    DB_PRODUCTS = [p for p in DB_PRODUCTS if p["id"] != product_id]
    return {"status": "deleted"}

@app.post("/api/v1/pricing-suggestion")
async def api_price_suggestion(req: PriceSuggestionRequest):
    suggested = suggest_price(req.category, req.competitor_price)
    return {
        "suggested_price": suggested,
        "reasoning": f"Predictive optimization for {req.category}. Matching market elasticity."
    }

# --- WEBSOCKET HEATMAP ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

manager = ConnectionManager()

@app.websocket("/ws/heatmap")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            cities = ["MUM", "DEL", "BLR", "CHE", "HYD"]
            data = [{"city": c, "data": [round(random.uniform(0.1, 0.9), 2) for _ in range(7)]} for c in cities]
            await websocket.send_json({"type": "heatmap_update", "payload": data})
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
