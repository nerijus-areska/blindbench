from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.core.database import create_tables

from app.api.v1.api import api_router
from app.core.config import settings
# import app.models  # Import models to register them with SQLAlchemy

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    print(f"Connected to SQLite database: {settings.database_url}")
    yield
    print("Disconnected from database")


app = FastAPI(
    title="BlindBench Backend",
    description="A FastAPI backend for BlindBench",
    version="0.0.1",
    lifespan=lifespan,
)

# Giving some maximum flexibility due to this forever staying a local app (I hope)
# I am not even sure I will ever have CORS issues - but this should be foolproof
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to BlindBench",
        "version": "v0.1",
    }
