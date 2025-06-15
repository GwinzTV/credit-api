import joblib
from pathlib import Path
import pandas as pd
import shap
import numpy as np
from .schemas import CreditRequest

model_path = Path(__file__).resolve().parents[1] / "credit_score_model.joblib"
pipeline = joblib.load(model_path)

FEATURE_NAMES = [
    "status_of_account", "duration_in_months", "credit_history", "purpose",
    "credit_amount", "savings_account_bonds", "present_employment", "installment_rate",
    "personal_status", "other_debtors", "residence_since", "property",
    "age", "other_installment_plans", "housing", "existing_credits",
    "job", "number_dependents", "own_telephone", "foreign_worker"
]


def predict_credit_score(data: CreditRequest):
    # Prepare input as a DataFrame with column names
    input_dict = {name: getattr(data, name) for name in FEATURE_NAMES}
    input_df = pd.DataFrame([input_dict])

    # Predict probability of "good" credit
    prob_good = pipeline.predict_proba(input_df)[0][1]
    score = prob_good * 100

    # SHAP explainability
    scaler = pipeline.named_steps["scaler"]
    model = pipeline.named_steps["model"]
    input_scaled = scaler.transform(input_df)

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(input_scaled)

    # Safely extract SHAP values
    if isinstance(shap_values, list) or isinstance(shap_values, tuple):
        shap_array = shap_values[0][0]  # first class, first sample
    else:
        shap_array = shap_values[0]  # first sample

    # Ensure it's a 1D array
    shap_array = np.array(shap_array).flatten()

    # Get top 3 influencing features by absolute impact
    influences = sorted(
        zip(FEATURE_NAMES, shap_array),
        key=lambda x: abs(x[1]),
        reverse=True
    )[:3]

    reasons = [f"{name} → {round(value, 3)} impact" for name, value in influences]

    return round(score, 2), reasons


def risk_band(score):
    if score >= 80:
        return "Low"
    elif score >= 50:
        return "Medium"
    else:
        return "High"
