from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.transaction import CommandType, StatusType


# --- Request ---

class GenerateRequest(BaseModel):
    command: CommandType
    input: str


# --- Responses ---

class TransactionResponse(BaseModel):
    id: UUID
    command: CommandType
    title: Optional[str]
    input: str
    output: Optional[str]
    status: StatusType
    tokens_used: Optional[int]
    gen_time_ms: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class LogResponse(BaseModel):
    id: UUID
    command: CommandType
    title: Optional[str]
    status: StatusType
    tokens_used: Optional[int]
    gen_time_ms: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class HistoryItemResponse(BaseModel):
    id: UUID
    command: CommandType
    title: Optional[str]
    status: StatusType
    created_at: datetime

    class Config:
        from_attributes = True