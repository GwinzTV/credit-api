from pydantic import BaseModel
from typing import List

class CreditRequest(BaseModel):
    income: float
    employment_years: int
    loan_amount: float
    previous_defaults: int
    num_dependents: int

class CreditResponse(BaseModel):
    score: float
    reasons: List[str]
