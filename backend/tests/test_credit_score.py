from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_get_credit_score():
    response = client.post("/score", json={
        "income": 50000,
        "employment_years": 5,
        "loan_amount": 10000,
        "previous_defaults": 0,
        "num_dependents": 2
    })
    assert response.status_code == 200
    assert "score" in response.json()
