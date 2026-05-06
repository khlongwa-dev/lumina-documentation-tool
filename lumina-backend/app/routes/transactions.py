from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionResponse, LogResponse, HistoryItemResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/history", response_model=List[HistoryItemResponse])
def get_history(db: Session = Depends(get_db)):
    """
    Returns all transactions ordered by most recent.
    Maps to the 'history' terminal command.
    """
    transactions = db.query(Transaction).order_by(Transaction.created_at.desc()).all()
    return transactions


@router.get("/return", response_model=TransactionResponse)
def get_latest_transaction(db: Session = Depends(get_db)):
    """
    Returns the latest transaction with full input and output.
    Maps to 'return' terminal command with no id.
    """
    transaction = db.query(Transaction).order_by(Transaction.created_at.desc()).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="No transactions found.")
    return transaction


@router.get("/return/{transaction_id}", response_model=TransactionResponse)
def get_transaction_by_id(transaction_id: UUID, db: Session = Depends(get_db)):
    """
    Returns a specific transaction by ID with full input and output.
    Maps to 'return {id}' terminal command.
    """
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    return transaction


@router.get("/log", response_model=LogResponse)
def get_latest_log(db: Session = Depends(get_db)):
    """
    Returns the log details of the latest transaction.
    Maps to 'log' terminal command with no id.
    """
    transaction = db.query(Transaction).order_by(Transaction.created_at.desc()).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="No transactions found.")
    return transaction


@router.get("/log/{transaction_id}", response_model=LogResponse)
def get_log_by_id(transaction_id: UUID, db: Session = Depends(get_db)):
    """
    Returns the log details of a specific transaction.
    Maps to 'log {id}' terminal command.
    """
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    return transaction
