from fastapi import FastAPI
from app.routes import credit_score

app = FastAPI(title="AI-Powered Credit Scoring API")

app.include_router(credit_score.router)
