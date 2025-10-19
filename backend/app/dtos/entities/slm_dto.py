from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class SlmBase(BaseModel):
    name: str = Field(..., description="Name of the model")
    notes: Optional[str] = Field(None, description="Notes about the model")


class SlmCreate(SlmBase):
    pass


class SlmUpdate(BaseModel):
    name: Optional[str] = Field(None)
    notes: Optional[str] = Field(None)


class SlmResponse(SlmBase):
    id: int
