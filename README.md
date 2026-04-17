# NexGen Retail OS - Hackathon Demo

NexGen Retail OS is an AI-powered retail operating system that predicts what shoppers want before they search, builds their cart automatically, and gives retailers a real-time demand heatmap.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, GSAP ScrollTrigger
- **Backend**: FastAPI, scikit-learn
- **Data**: Mocking Supabase/PostgreSQL with pgvector using in-memory state or SQLite for the demo.
- **Tools**: Faker.js and Mockaroo for dummy data.

## Getting Started

### 1. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Seed Data
```bash
python seed_data.py
```

## Modules Included:
1. **Pre-Cognitive Engine**: Reads scroll/hover/dwell signals and predicts shopping intent.
2. **Zero-Click Checkout**: Assembles a cart at 92% confidence.
3. **Live Demand Heatmap**: Live WebSocket KPI cards for retailers.
4. **Autonomous Pricing Engine**: Dynamic markup and competitor scraping simulation.
