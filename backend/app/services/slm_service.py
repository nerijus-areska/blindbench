from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.slm import Slm as SlmModel
from app.dtos.entities.slm_dto import SlmCreate, SlmUpdate


class SlmService:
    def __init__(self, db: Session):
        self.db = db

    def create_slm(self, slm: SlmCreate) -> SlmModel:
        db_slm = SlmModel(name=slm.name, notes=slm.notes)
        self.db.add(db_slm)
        self.db.commit()
        self.db.refresh(db_slm)
        return db_slm

    def get_slm(self, Slm_id: int) -> Optional[SlmModel]:
        return self.db.query(SlmModel).filter(SlmModel.id == Slm_id).first()

    def get_slm_list(self, skip: int = 0, limit: int = 100) -> List[SlmModel]:
        return self.db.query(SlmModel).offset(skip).limit(limit).all()

    def search_slm(self, query: str, skip: int = 0, limit: int = 100) -> List[SlmModel]:
        return (
            self.db.query(SlmModel)
            .filter(SlmModel.name.contains(query))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update_slm(self, slm_id: int, slm: SlmUpdate) -> Optional[SlmModel]:
        db_slm = self.get_slm(slm_id)
        if not db_slm:
            return None

        update_data = slm.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_slm, field, value)

        self.db.commit()
        self.db.refresh(db_slm)
        return db_slm

    def delete_slm(self, slm_id: int) -> bool:
        db_slm = self.get_slm(slm_id)
        if not db_slm:
            return False

        self.db.delete(db_slm)
        self.db.commit()
        return True

    def count_slm(self) -> int:
        return self.db.query(SlmModel).count()
