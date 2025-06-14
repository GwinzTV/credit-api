import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib

# Load German Credit Data
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/statlog/german/german.data-numeric"
columns = [f"feature_{i+1}" for i in range(24)] + ["target"]
df = pd.read_csv(url, sep="\\s+", header=None, names=columns)

# Use human-readable names for first 20 features
feature_map = {
    "feature_1": "status_of_account",
    "feature_2": "duration_in_months",
    "feature_3": "credit_history",
    "feature_4": "purpose",
    "feature_5": "credit_amount",
    "feature_6": "savings_account_bonds",
    "feature_7": "present_employment",
    "feature_8": "installment_rate",
    "feature_9": "personal_status",
    "feature_10": "other_debtors",
    "feature_11": "residence_since",
    "feature_12": "property",
    "feature_13": "age",
    "feature_14": "other_installment_plans",
    "feature_15": "housing",
    "feature_16": "existing_credits",
    "feature_17": "job",
    "feature_18": "number_dependents",
    "feature_19": "own_telephone",
    "feature_20": "foreign_worker"
}

df = df.rename(columns=feature_map)
selected_features = list(feature_map.values())
df["target"] = df["target"].map({1: 1, 2: 0})

X = df[selected_features]
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", RandomForestClassifier(n_estimators=100, random_state=42))
])

pipeline.fit(X_train, y_train)

joblib.dump(pipeline, "credit_score_model.joblib")
print("✅ Model retrained using human-readable feature names.")
