from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.transaction import GenerateRequest, TransactionResponse
from app.models.transaction import Transaction
from app.services.gemini import call_gemini

router = APIRouter(prefix="/generate", tags=["Generate"])


@router.post("/", response_model=TransactionResponse)
def generate(request: GenerateRequest, db: Session = Depends(get_db)):
    """
    Accepts a command (readme | comment) and user input.
    Calls Gemini, logs the transaction, and returns the full result.
    """
    result = call_gemini(command=request.command, user_input=request.input)

    transaction = Transaction(
        command=request.command,
        input=request.input,
        title=result["title"],
        output=result["output"],
        status=result["status"],
        tokens_used=result["tokens_used"],
        gen_time_ms=result["gen_time_ms"],
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    if result["status"] == "failed":
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Generation failed. Transaction has been logged.",
                "transaction_id": str(transaction.id),
            },
        )

    return transaction