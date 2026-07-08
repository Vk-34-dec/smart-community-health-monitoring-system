import sys
import json
import numpy as np
import pickle

# This is a placeholder for the actual ML model
# In a real scenario, you would load a trained model:
# model = pickle.load(open('model.pkl', 'rb'))

def predict_risk(data):
    """
    Simulates a risk prediction based on vitals.
    In reality, this would use a model.predict() call.
    """
    heart_rate = data.get('heart_rate', 70)
    spo2 = data.get('spo2', 98)
    temp = data.get('temp', 36.6)

    # Simple logic for demonstration
    risk_score = 0
    if heart_rate > 100 or heart_rate < 60: risk_score += 30
    if spo2 < 95: risk_score += 40
    if temp > 38: risk_score += 30

    prediction = "High Risk" if risk_score >= 60 else "Moderate Risk" if risk_score >= 30 else "Low Risk"

    return {
        "risk_score": risk_score,
        "prediction": prediction,
        "advice": "Consult a doctor immediately" if risk_score >= 60 else "Monitor vitals closely" if risk_score >= 30 else "Health is normal"
    }

if __name__ == "__main__":
    # Expecting JSON input via stdin
    try:
        input_data = json.load(sys.stdin)
        result = predict_risk(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
