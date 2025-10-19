from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.dtos.response import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 'I will not botch this project!' AS db_existence"))
        database_status = "connected"
    except Exception:
        database_status = "disconnected"

    return HealthResponse(
        status="healthy" if database_status == "connected" else "unhealthy",
        message="API is alive",
        database=database_status,
    )
