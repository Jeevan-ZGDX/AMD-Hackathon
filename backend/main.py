import asyncio
import json
import random
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

# --- EXPANDED IN-MEMORY DATABASE ---
DB_PRODUCTS = [
    { "id": 1, "name": "Organic Alphonso Mangoes", "category": "Fruits", "price": 450, "competitor_price": 520, "stock": 45, "tag": "Seasonal", "color": "from-yellow-400/20 to-orange-500/10" },
    { "id": 2, "name": "Fresh Broccoli (500g)", "category": "Vegetables", "price": 85, "competitor_price": 110, "stock": 120, "tag": "Bestseller", "color": "from-green-500/20 to-emerald-600/10" },
    { "id": 3, "name": "A2 Desi Cow Ghee (500ml)", "category": "Dairy", "price": 890, "competitor_price": 950, "stock": 30, "tag": "Premium", "color": "from-yellow-600/20 to-yellow-800/10" },
    { "id": 4, "name": "Quinoa Puffs - Masala", "category": "Snacks", "price": 120, "competitor_price": 150, "stock": 200, "tag": "Healthy", "color": "from-red-400/20 to-pink-500/10" },
    { "id": 5, "name": "Cold Pressed Orange Juice", "category": "Beverages", "price": 180, "competitor_price": 220, "stock": 80, "tag": "Fresh", "color": "from-orange-400/20 to-yellow-500/10" },
    { "id": 6, "name": "Hass Avocado (Imported)", "category": "Fruits", "price": 299, "competitor_price": 350, "stock": 15, "tag": "Limited", "color": "from-green-700/20 to-green-900/10" },
]

DB_CART = []
DB_ORDERS = [] # Tracking order history

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
    return {
        "total_revenue": total_sales,
        "total_orders": len(DB_ORDERS),
        "top_categories": ["Fruits", "Dairy", "Vegetables"],
        "active_users": random.randint(50, 200),
        "stock_alerts": [p["name"] for p in DB_PRODUCTS if p["stock"] < 20]
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
