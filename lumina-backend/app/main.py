from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import generate, transactions

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Lumina API",
    description="Technical documentation generation tool powered by Gemini.",
    version="1.0.0",
)

# CORS — allows React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://lumina-documentation-tool-np6ys52lw.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(generate.router)
app.include_router(transactions.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "Lumina is running"}
