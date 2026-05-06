import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
import enum


class CommandType(str, enum.Enum):
    readme = "readme"
    comment = "comment"
    docstring = "docstring"
    changelog = "changelog"
    review = "review"


class StatusType(str, enum.Enum):
    success = "success"
    failed = "failed"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    command = Column(Enum(CommandType), nullable=False)
    title = Column(String(150), nullable=True)
    input = Column(Text, nullable=False)
    output = Column(Text, nullable=True)
    status = Column(Enum(StatusType), nullable=False)
    tokens_used = Column(Integer, nullable=True)
    gen_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())