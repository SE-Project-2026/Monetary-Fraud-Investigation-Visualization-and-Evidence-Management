import hashlib
from fastapi.testclient import TestClient
from main import app
from database import Base, engine, SessionLocal
from models import Transaction

client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_login_success():
    response = client.post(
        "/api/login",
        json={
            "username": "admin",
            "password": "admin123"
        }
    )

    assert response.status_code == 200
    assert response.json() == {"token": "fake-jwt-token"}


def test_login_wrong_password():
    response = client.post(
        "/api/login",
        json={
            "username": "admin",
            "password": "wrong"
        }
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}


def test_login_wrong_username():
    response = client.post(
        "/api/login",
        json={
            "username": "unknown",
            "password": "admin123"
        }
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}

def test_upload_evidence_sha256_success():
    payload = b"fraud-investigation-sample-evidence-data"
    expected_hash = hashlib.sha256(payload).hexdigest()

    response = client.post(
        "/api/upload",
        files={"file": ("evidence_test.csv", payload, "text/csv")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "evidence_test.csv"
    assert data["sha256_hash"] == expected_hash
    assert data["message"] == "Evidence uploaded and hashed successfully."
    

def test_account_search_success():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    test_transaction_ids = [
        "jf6-search-test-1",
        "jf6-search-test-2",
        "jf6-search-test-3"
    ]

    try:
        db.query(Transaction).filter(
            Transaction.transaction_id.in_(test_transaction_ids)
        ).delete(synchronize_session=False)

        test_transactions = [
            Transaction(
                transaction_id="jf6-search-test-1",
                source_account="JF6TEST1001",
                destination_account="ACC9001",
                amount=1000.0,
                channel="UPI"
            ),
            Transaction(
                transaction_id="jf6-search-test-2",
                source_account="ACC9002",
                destination_account="JF6TEST2001",
                amount=2000.0,
                channel="IMPS"
            ),
            Transaction(
                transaction_id="jf6-search-test-3",
                source_account="JF6TEST1001",
                destination_account="JF6TEST2001",
                amount=3000.0,
                channel="NEFT"
            )
        ]

        db.add_all(test_transactions)
        db.commit()

        response = client.get("/api/accounts/search?q=JF6TEST")

        assert response.status_code == 200

        data = response.json()

        assert data["query"] == "JF6TEST"
        assert data["count"] == 2
        assert data["results"] == [
            "JF6TEST1001",
            "JF6TEST2001"
        ]

    finally:
        db.query(Transaction).filter(
            Transaction.transaction_id.in_(test_transaction_ids)
        ).delete(synchronize_session=False)

        db.commit()
        db.close()


def test_account_search_min_length_validation():
    response = client.get("/api/accounts/search?q=A")

    assert response.status_code == 422
