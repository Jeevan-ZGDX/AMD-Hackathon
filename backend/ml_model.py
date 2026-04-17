import random
import numpy as np
from sklearn.linear_model import LogisticRegression

# Simulated trained model for hackathon
# In a real scenario, this would load a pre-trained pickle file
class MockPreCognitiveModel:
    def __init__(self):
        self.model = LogisticRegression()
        # Train with some dummy data to initialize weights
        X_dummy = np.random.rand(100, 3) # scroll_vel, hover_ms, mouse_tremor
        y_dummy = np.random.randint(0, 2, 100)
        self.model.fit(X_dummy, y_dummy)
        
    def predict_proba(self, X):
        # We'll fake the logic slightly so the demo looks realistic
        # High dwell time + low tremor = high confidence
        scroll_vel, hover_ms, mouse_tremor = X[0]
        base_confidence = 0.5
        
        if hover_ms > 2000:
            base_confidence += 0.3
        if mouse_tremor < 0.2:
            base_confidence += 0.15
            
        # Add some random noise
        confidence = min(0.99, base_confidence + random.uniform(-0.05, 0.05))
        return confidence

mock_model = MockPreCognitiveModel()

def predict_intent(scroll_velocity: float, hover_dwell_ms: int, mouse_tremor: float):
    """
    Returns (confidence_score, predicted_bundle)
    """
    features = np.array([[scroll_velocity, hover_dwell_ms, mouse_tremor]])
    confidence = mock_model.predict_proba(features)
    
    # Pre-built bundles based on implicit intent
    bundles = [
        [
            {"id": "sku_1", "name": "Air Flex Trainer", "price": 2499, "match": 97},
            {"id": "sku_2", "name": "MagSafe Stand Pro", "price": 1199, "match": 89},
            {"id": "sku_3", "name": "Recovery Foam Roll", "price": 599, "match": 82}
        ],
        [
            {"id": "sku_4", "name": "Noise Cancelling Earbuds", "price": 5999, "match": 94},
            {"id": "sku_5", "name": "Smart Water Bottle", "price": 1499, "match": 88}
        ]
    ]
    
    selected_bundle = random.choice(bundles) if confidence > 0.8 else []
    
    return round(confidence, 2), selected_bundle

def suggest_price(category: str, competitor_price: float) -> float:
    """
    Dummy ML logic for pricing:
    If it's tech/electronics, undercut competitor by 5%.
    If apparel/athleisure, match or undercut by 2% if demand is low.
    """
    if category.lower() in ["electronics", "tech"]:
        return round(competitor_price * 0.95, 2)
    elif category.lower() in ["apparel", "footwear", "athleisure"]:
        return round(competitor_price * 0.98, 2)
    else:
        return round(competitor_price * 0.90, 2)
