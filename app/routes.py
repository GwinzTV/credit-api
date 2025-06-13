from fastapi import APIRouter
from app.schemas import CreditRequest, CreditResponse
from app.ml_model import predict_credit_score

router = APIRouter()


@router.post("/score", response_model=CreditResponse)
def get_credit_score(data: CreditRequest):
    score, reasons = predict_credit_score(data)
    return {"score": score, "reasons": reasons}
