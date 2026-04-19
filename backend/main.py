import asyncio
import json
import random
import os
import sqlite3
import uuid
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException
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

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "nexgen.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- MODELS ---
class BehaviorEvent(BaseModel):
    user_id: str
    scroll_velocity: float
    hover_dwell_ms: int
    mouse_tremor: float

class CheckoutRequest(BaseModel):
    user_id: str
    address: dict
    payment_method: str

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    original_price: Optional[float] = None
    stock_count: int
    image_url: Optional[str] = None
    description: Optional[str] = None

# --- SHOPPER (CUSTOMER) ROUTES ---
@app.get("/api/v1/products")
async def get_products(category: Optional[str] = None, q: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM products WHERE is_active = 1"
    params = []
    
    if category and category != "All Items":
        query += " AND category = ?"
        params.append(category)
    
    if q:
        query += " AND name LIKE ?"
        params.append(f"%{q}%")
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/api/v1/products/{product_id}")
async def get_product(product_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return dict(row)

@app.post("/api/v1/checkout")
async def api_checkout(req: CheckoutRequest):
    # This is a simplified checkout for the SQLite version
    # In a real app, you'd calculate totals from the cart (which should be in DB)
    # But for this demo, we'll assume the cart is passed or managed elsewhere
    # Here we just record an order
    conn = get_db()
    cursor = conn.cursor()
    
    order_id = f"ORD-{random.randint(1000, 9999)}"
    try:
        cursor.execute("""
            INSERT INTO orders (id, user_id, status, total_amount, gst_amount, shipping_address, payment_method, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            order_id,
            req.user_id,
            'confirmed',
            0.0, # Total should be calculated
            0.0,
            json.dumps(req.address),
            req.payment_method,
            'paid'
        ))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    
    conn.close()
    return {"status": "success", "order_id": order_id}

@app.get("/api/v1/orders")
async def get_orders(user_id: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    else:
        cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# --- RETAILER / ADMIN ROUTES ---
@app.get("/api/v1/admin/analytics")
async def get_analytics():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT SUM(total_amount) as revenue, COUNT(*) as count FROM orders")
    order_stats = cursor.fetchone()
    
    cursor.execute("SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC LIMIT 5")
    top_cats = [row['category'] for row in cursor.fetchall()]
    
    cursor.execute("SELECT name FROM products WHERE stock_count < 20")
    alerts = [row['name'] for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        "total_revenue": order_stats['revenue'] or 0,
        "total_orders": order_stats['count'] or 0,
        "top_categories": top_cats,
        "active_users": random.randint(120, 380),
        "avg_order_value": round((order_stats['revenue'] or 0) / max(order_stats['count'] or 1, 1), 2),
        "stock_alerts": alerts,
        "low_stock_count": len(alerts),
        "total_products": 30, # Hardcoded for now or fetch
        "categories_count": len(top_cats)
    }

# --- WEBSOCKET HEATMAP (REMAINS SAME) ---
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
