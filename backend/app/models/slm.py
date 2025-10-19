from sqlalchemy import Column, Integer, Text
from app.core.database import Base


class Slm(Base):
    __tablename__ = "slms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
