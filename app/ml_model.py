import joblib
from pathlib import Path
from app.schemas import CreditRequest
import pandas as pd

model_path = Path(__file__).resolve().parents[1] / "credit_score_model.joblib"
model = joblib.load(model_path)

# Match training feature names exactly
FEATURE_NAMES = [
    "status_of_account", "duration_in_months", "credit_history", "purpose",
    "credit_amount", "savings_account_bonds", "present_employment", "installment_rate",
    "personal_status", "other_debtors", "residence_since", "property",
    "age", "other_installment_plans", "housing", "existing_credits",
    "job", "number_dependents", "own_telephone", "foreign_worker"
]


def predict_credit_score(data: CreditRequest):
    input_dict = {name: getattr(data, name) for name in FEATURE_NAMES}
    input_df = pd.DataFrame([input_dict])  # ✅ preserves column names
    prob_good = model.predict_proba(input_df)[0][1]
    score = prob_good * 100
    reasons = ["Probability-based credit risk from real data"]
    return round(score, 2), reasons


def risk_band(score):
    if score >= 80:
        return "Low"
    elif score >= 50:
        return "Medium"
    else:
        return "High"
