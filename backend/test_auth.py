
from fastapi.testclient import TestClient
from main import app

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
