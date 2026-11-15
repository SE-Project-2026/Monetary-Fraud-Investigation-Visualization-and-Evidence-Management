import hashlib
import csv
import io
from fastapi import FastAPI,Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from fastapi import Query
import networkx as nx

from database import SessionLocal
from models import Transaction

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
    content = await file.read()
    evidence_hash = hashlib.sha256(content).hexdigest()

    inserted_count = 0
    first_account = None

    if file.filename.endswith(".csv"):
        decoded = content.decode("utf-8", errors="ignore")
        reader = csv.DictReader(io.StringIO(decoded))
        if reader.fieldnames and "source_account" in reader.fieldnames:
            db = SessionLocal()
            try:
                db.query(Transaction).delete()
                for idx, row in enumerate(reader):
                    src = row["source_account"].strip()
                    dst = row["destination_account"].strip()
                    if not first_account:
                        first_account = src
                    tx = Transaction(
                        transaction_id=row.get("transaction_id", f"TX-{idx+1}").strip(),
                        source_account=src,
                        destination_account=dst,
                        amount=float(row["amount"]),
                        channel=row.get("channel", "NEFT").strip()
                    )
                    db.add(tx)
                    inserted_count += 1
                db.commit()
            finally:
                db.close()

    return {
        "filename": file.filename,
        "sha256_hash": evidence_hash,
        "records_ingested": inserted_count,
        "seed_account": first_account,
        "message": "Evidence hashed and ingested successfully."
    }

@app.get("/api/graph/{account_id}")
def get_account_graph(
    account_id: str,
    hops: int = Query(default=1, ge=1, le=3),
    min_amount: Optional[float] = Query(default=None, ge=0),
    channel: Optional[str] = None
):
    db = SessionLocal()
    try:
        query = db.query(Transaction)
        if min_amount is not None:
            query = query.filter(Transaction.amount >= min_amount)
        if channel:
            query = query.filter(Transaction.channel == channel)
        
        records = query.all()

        # Build directed graph
        G = nx.DiGraph()
        for t in records:
            G.add_edge(
                t.source_account,
                t.destination_account,
                amount=t.amount,
                channel=t.channel,
                timestamp=str(t.timestamp),
                transaction_id=t.transaction_id
            )

        if account_id not in G:
            return {"account_id": account_id, "nodes": [], "edges": []}

        # Multi-hop ego-graph extraction (radius = hops)
        subgraph = nx.ego_graph(G, n=account_id, radius=hops, undirected=False)

        nodes = [{"id": n, "label": f"{n[:4]}***{n[-4:]}" if len(n) >= 8 else n} for n in subgraph.nodes()]
        edges = [
            {
                "source": u,
                "target": v,
                "amount": data.get("amount"),
                "channel": data.get("channel"),
                "transaction_id": data.get("transaction_id")
            }
            for u, v, data in subgraph.edges(data=True)
        ]

        return {
            "account_id": account_id,
            "hops": hops,
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "nodes": nodes,
            "edges": edges
        }
    finally:
        db.close()
        

@app.get("/api/accounts/search")
def search_accounts(q: str = Query(..., min_length=2)):
    db = SessionLocal()
    try:
        # Search source accounts
        source_accounts = db.query(Transaction.source_account).filter(
            Transaction.source_account.ilike(f"%{q}%")
        ).distinct().all()

        # Search destination accounts
        dest_accounts = db.query(Transaction.destination_account).filter(
            Transaction.destination_account.ilike(f"%{q}%")
        ).distinct().all()

        # Combine both results and remove duplicates
        matches = sorted({
            acc[0]
            for acc in source_accounts + dest_accounts
            if acc[0] is not None
        })

        return {
            "query": q,
            "count": len(matches),
            "results": matches
        }

    finally:
        db.close()
