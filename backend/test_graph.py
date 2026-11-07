from fastapi.testclient import TestClient
from main import app
from database import SessionLocal
from models import Transaction

client = TestClient(app)

def setup_module():
    db = SessionLocal()
    db.query(Transaction).delete()
    t1 = Transaction(
        transaction_id="tx-graph-1",
        source_account="ACC1000000000001",
        destination_account="ACC2000000000002",
        amount=5000.0,
        channel="UPI"
    )
    t2 = Transaction(
        transaction_id="tx-graph-2",
        source_account="ACC2000000000002",
        destination_account="ACC3000000000003",
        amount=4000.0,
        channel="IMPS"
    )
    t3 = Transaction(
        transaction_id="tx-graph-3",
        source_account="ACC1000000000001",
        destination_account="ACC4000000000004",
        amount=500.0,
        channel="NEFT"
    )
    db.add_all([t1, t2, t3])
    db.commit()
    db.close()

def test_graph_traversal_hops():
    res_1 = client.get("/api/graph/ACC1000000000001?hops=1")
    assert res_1.status_code == 200
    data_1 = res_1.json()
    assert data_1["total_nodes"] == 3

    res_2 = client.get("/api/graph/ACC1000000000001?hops=2")
    assert res_2.status_code == 200
    data_2 = res_2.json()
    assert data_2["total_nodes"] == 4

def test_graph_traversal_filters():
    res = client.get("/api/graph/ACC1000000000001?hops=1&min_amount=1000")
    assert res.status_code == 200
    data = res.json()
    targets = [e["target"] for e in data["edges"]]
    assert "ACC2000000000002" in targets
    assert "ACC4000000000004" not in targets

def test_graph_nonexistent_account():
    res = client.get("/api/graph/NON_EXISTENT")
    assert res.status_code == 200
    data = res.json()
    assert data["nodes"] == []