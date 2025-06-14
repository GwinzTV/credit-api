from fastapi import FastAPI
from app import routes


app = FastAPI(title="AI-Powered Credit Scoring API")

app.include_router(routes.router)
