from fastapi import FastAPI
from app import routes
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="AI-Powered Credit Scoring API")

app.include_router(routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
