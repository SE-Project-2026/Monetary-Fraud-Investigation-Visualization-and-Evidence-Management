from models import User, Transaction

def test_user_model_initialization():
    test_user = User(username="admin", email="admin@fraud.local", hashed_password="fakehash123")
    assert test_user.username == "admin"
    assert test_user.email == "admin@fraud.local"

def test_transaction_model_initialization():
    test_tx = Transaction(
        transaction_id="c9bf9e57-1685-4c89-bafb-ff5af830be8a",
        source_account="ACC1000000000001",
        destination_account="ACC2000000000002",
        amount=50000.0,
        channel="UPI"
    )
    assert test_tx.amount == 50000.0
    assert test_tx.channel == "UPI"