
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Fraud Investigation API")


class LoginRequest(BaseModel):
    username: str
    password: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/login")
def login(request: LoginRequest):
    # Temporary hardcoded authentication for the Sprint 1 demo.
    if request.username == "admin" and request.password == "admin123":
        return {"token": "fake-jwt-token"}

    raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )
