from fastapi import APIRouter
from app.schemas import CreditRequest, CreditResponse
from app.ml_model import predict_credit_score, risk_band

router = APIRouter()


@router.post("/score", response_model=CreditResponse)
def get_credit_score(data: CreditRequest):
    score, reasons = predict_credit_score(data)
    risk = risk_band(score)
    return {"score": score, "risk_band": risk, "reasons": reasons}
