from pydantic import BaseModel
from typing import Any, Optional


class HealthResponse(BaseModel):
    status: str
    message: str
    database: str


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None


class SuccessResponse(BaseModel):
    message: str
    data: Optional[Any] = None
