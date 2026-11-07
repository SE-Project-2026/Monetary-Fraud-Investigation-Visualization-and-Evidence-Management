from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fraud_algorithms import detect_routing_cycles

app = FastAPI(title="Fraud Investigation API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In a real application, you should be more specific about allowed origins
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
    # Temporary hardcoded authentication for the Sprint 1 demo.
    if request.username == "admin" and request.password == "admin123":
        return {"token": "fake-jwt-token"}

    raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )

@app.get("/api/fraud/circular-routing")
def get_circular_routing():
    # Mock data simulating a fraud ring: A -> B -> C -> A
    mock_db_transactions = [
        {"tx_id": 1, "sender_id": "Acc_A", "receiver_id": "Acc_B"},
        {"tx_id": 2, "sender_id": "Acc_B", "receiver_id": "Acc_C"},
        {"tx_id": 3, "sender_id": "Acc_C", "receiver_id": "Acc_A"},
        {"tx_id": 4, "sender_id": "Acc_D", "receiver_id": "Acc_E"} # Normal transaction
    ]
    
    detected_cycles = detect_routing_cycles(mock_db_transactions)
    
    return {
        "status": "success",
        "total_cycles_found": len(detected_cycles),
        "cycles": detected_cycles 
    }