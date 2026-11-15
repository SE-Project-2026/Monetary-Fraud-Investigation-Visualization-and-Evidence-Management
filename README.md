# Monetary Fraud Investigation, Visualization, and Evidence Management Platform

A full-stack forensic workbench designed to ingest raw financial transaction records, maintain cryptographic chain-of-custody via SHA-256 verification, and expose multi-hop fund routing and circular money-laundering networks through an interactive graph topology canvas.

---

## Key Capabilities

* **Cryptographic Evidence Vault (`POST /api/upload`):** Streams uploaded transaction logs (`.csv`) and case files to compute a SHA-256 integrity digest for chain-of-custody verification while automatically ingesting structured records into the relational store.
* **Multi-Hop Ego-Graph Traversal (`GET /api/graph/{account_id}`):** Constructs a directed transaction graph via `NetworkX` and executes breadth-first neighborhood expansion ($1\text{–}3$ hops) around target suspect accounts, applying account number masking for privacy compliance.
* **Dynamic Edge & Channel Filtering:** Filters transaction edges in real time by minimum transfer threshold (`min_amount`) and payment rail (`NEFT`, `RTGS`, `IMPS`, `UPI`) to isolate high-value anomalous flows.
* **Suspect Account Lookup (`GET /api/accounts/search`):** Performs case-insensitive partial pattern matching across sender and receiver accounts to rapidly pivot investigations.
* **Interactive Forensic Topology Canvas:** Dark-mode `Cytoscape.js` visualization rendering suspect nodes, connected counterparties, directed transfer arrows, and an entity inspector panel.

---

## Tech Stack

* **Backend:** Python 3.11, FastAPI, SQLAlchemy, SQLite, NetworkX
* **Frontend:** React, Cytoscape.js
* **Testing & CI:** Pytest, `pytest-cov` (>80% coverage gate enforced via GitHub Actions)

---

## Project Structure

```text
├── backend/
│   ├── main.py              # FastAPI endpoints (upload/SHA-256, graph traversal, search)
│   ├── models.py            # SQLAlchemy ORM schema (Transaction)
│   ├── database.py          # Database engine & session management
│   ├── test_auth.py         # Unit tests for upload hashing & account search
│   ├── test_db.py           # Unit tests for database persistence
│   ├── test_graph.py        # Unit tests for multi-hop traversal & edge filters
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js           # Forensic workbench layout, Evidence Vault & Account Search
│   │   ├── GraphCanvas.js   # Cytoscape.js interactive network topology & filter controls
│   │   └── App.css          # Dark-mode layout & styling
│   └── package.json         # Node dependencies
├── demo/
│   ├── Sprint1_Demo.mp4     # Sprint 1 working increment recording
│   └── Sprint2_Demo.mp4     # Sprint 2 end-to-end workbench & test coverage recording
└── README.md
```

## Local Setup & Execution

### 1. Backend Server

```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate

# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

The API and interactive Swagger documentation will be available at http://127.0.0.1:8000/docs.

### 2. Frontend Workbench

```bash
cd frontend
npm install
npm start
```

The web application will launch at http://localhost:3000.

### 3. Running Automated Tests & Coverage

```bash
cd backend
pytest -W ignore::DeprecationWarning --cov=. --cov-report=term-missing
```

## Sample CSV Format for Ingestion

To test end-to-end CSV ingestion and graph generation, upload a .csv file formatted with the following headers:

```text
transaction_id,source_account,destination_account,amount,channel
TX-501,ACC9000000000001,ACC9000000000002,250000,RTGS
TX-502,ACC9000000000001,ACC9000000000003,45000,UPI
TX-503,ACC9000000000002,ACC9000000000004,240000,NEFT
TX-504,ACC9000000000003,ACC9000000000005,40000,IMPS
TX-505,ACC9000000000004,ACC9000000000001,235000,RTGS
```

## Team — Project ID 54 (Jackfruit 54)

### Member Module & Responsibilities

| Member | Module & Responsibilities |
| --- | --- |
| Suraj C D | Multi-hop graph traversal service (NetworkX), edge amount/channel filtering, and full-stack workbench integration (JF-9, JF-11) |
| Thota Ronav | Interactive Cytoscape.js network graph visualization canvas, node/edge rendering (JF-7, JF-8) |
| Suchir Reddy Adi | Suspect account search & query API with input validation (JF-6) |
| Syed Junaid Ahmed | SHA-256 cryptographic evidence hashing & circular fund routing logic (JF-15, JF-25) |