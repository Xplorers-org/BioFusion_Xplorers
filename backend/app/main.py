from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analyze_router

app = FastAPI(
    title = "Parkinson's disease prediction API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


app.include_router(analyze_router.router)

@app.get("/")
def read_root():
    return {"message": "Parkinson's disease prediction API"}

