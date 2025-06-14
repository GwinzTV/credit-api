from pydantic import BaseModel
from typing import List


class CreditRequest(BaseModel):
    status_of_account: float
    duration_in_months: float
    credit_history: float
    purpose: float
    credit_amount: float
    savings_account_bonds: float
    present_employment: float
    installment_rate: float
    personal_status: float
    other_debtors: float
    residence_since: float
    property: float
    age: float
    other_installment_plans: float
    housing: float
    existing_credits: float
    job: float
    number_dependents: float
    own_telephone: float
    foreign_worker: float


class CreditResponse(BaseModel):
    score: float
    risk_band: str
    reasons: List[str]
