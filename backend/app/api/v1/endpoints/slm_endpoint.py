from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.services.slm_service import SlmService
from app.dtos.entities.slm_dto import SlmCreate, SlmUpdate, SlmResponse
from app.dtos.response import SuccessResponse

router = APIRouter()


@router.get("/", response_model=List[SlmResponse])
async def get_slm_list(
    skip: int = Query(0, ge=0, description="Number of slm entries to skip"),
    limit: int = Query(
        100, ge=1, le=1000, description="Number of slm entries to return"
    ),
    search: Optional[str] = Query(None, description="Search query for slm name"),
    db: Session = Depends(get_db),
):
    try:
        slm_service = SlmService(db)
        if search:
            slm_entries = slm_service.search_slm(search, skip=skip, limit=limit)
        else:
            slm_entries = slm_service.get_slm_list(skip=skip, limit=limit)
        return slm_entries
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch slm entries: {str(e)}"
        ) from e


@router.get("/{slm_id}", response_model=SlmResponse)
async def get_slm(slm_id: int, db: Session = Depends(get_db)):
    slm_service = SlmService(db)
    slm_entry = slm_service.get_slm(slm_id)
    if not slm_entry:
        raise HTTPException(status_code=404, detail="Slm entry not found")

    return slm_entry


@router.post("/", response_model=SlmResponse, status_code=201)
async def create_slm(slm: SlmCreate, db: Session = Depends(get_db)):
    try:
        slm_service = SlmService(db)
        created_slm = slm_service.create_slm(slm)
        return created_slm
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create slm entry: {str(e)}"
        ) from e


@router.put("/{slm_id}", response_model=SlmResponse)
async def update_slm(slm_id: int, slm: SlmUpdate, db: Session = Depends(get_db)):
    slm_service = SlmService(db)
    updated_slm = slm_service.update_slm(slm_id, slm)
    if not updated_slm:
        raise HTTPException(status_code=404, detail="Slm entry not found")

    return updated_slm


@router.delete("/{slm_id}", response_model=SuccessResponse)
async def delete_slm(slm_id: int, db: Session = Depends(get_db)):
    slm_service = SlmService(db)
    deleted = slm_service.delete_slm(slm_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Slm entry not found")

    return SuccessResponse(message="Slm entry deleted successfully")


@router.get("/count/total", response_model=dict)
async def get_slm_count(db: Session = Depends(get_db)):
    try:
        slm_service = SlmService(db)
        count = slm_service.count_slm()
        return {"count": count}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to count slm entries: {str(e)}"
        ) from e
