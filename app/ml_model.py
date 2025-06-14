import joblib
from pathlib import Path
from app.schemas import CreditRequest
import numpy as np

# Load the trained model
model_path = Path(__file__).resolve().parent.parent / "credit_score_model.joblib"
model = joblib.load(model_path)


def predict_credit_score(data: CreditRequest):
    input_features = np.array([[
        data.income,
        data.employment_years,
        data.loan_amount,
        data.previous_defaults,
        data.num_dependents
    ]])
    score = model.predict(input_features)[0]
    reasons = ["Predicted using RandomForest model"]  # Optional: add explainability here
    return round(score, 2), reasons
