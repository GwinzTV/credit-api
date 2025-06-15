from fastapi import FastAPI
from . import routes
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path


app = FastAPI(title="AI-Powered Credit Scoring API")

app.include_router(routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # or 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_path = Path(__file__).resolve().parents[2] / "frontend" / "build"
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
