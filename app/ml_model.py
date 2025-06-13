from app.schemas import CreditRequest

def predict_credit_score(data: CreditRequest):
    # Mock logic, replace with real ML model later
    score = 80.0
    reasons = ["Stable income", "Low loan amount"]
    return score, reasons
