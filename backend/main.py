import hashlib
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Fraud Investigation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/login")
def login(request: LoginRequest):
    if request.username == "admin" and request.password == "admin123":
        return {"token": "fake-jwt-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/upload")
async def upload_evidence(file: UploadFile = File(...)):
    sha256_hash = hashlib.sha256()
    while chunk := await file.read(8192):
        sha256_hash.update(chunk)
    evidence_hash = sha256_hash.hexdigest()
    await file.seek(0)
    return {
        "filename": file.filename,
        "sha256_hash": evidence_hash,
        "message": "Evidence uploaded and hashed successfully."
    }
