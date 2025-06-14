# train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib

# Synthetic dataset
data = pd.DataFrame({
    "income": [30000, 50000, 45000, 70000, 35000, 80000, 40000, 60000],
    "employment_years": [1, 5, 3, 10, 2, 12, 4, 6],
    "loan_amount": [10000, 15000, 12000, 20000, 8000, 25000, 9000, 16000],
    "previous_defaults": [1, 0, 0, 0, 2, 0, 1, 0],
    "num_dependents": [2, 1, 2, 0, 3, 0, 2, 1],
    "credit_score": [60, 85, 75, 95, 50, 98, 65, 90]
})

X = data.drop(columns=["credit_score"])
y = data["credit_score"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", RandomForestRegressor(n_estimators=100, random_state=42))
])

pipeline.fit(X_train, y_train)

# Save locally
joblib.dump(pipeline, "credit_score_model.joblib")
print("✅ Model trained and saved successfully.")
