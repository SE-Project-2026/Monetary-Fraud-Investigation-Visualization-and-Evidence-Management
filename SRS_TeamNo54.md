# **Jackfruit Phase-1: Software Requirements Specification (SRS)**

## **For Monetary Fraud Investigation, Visualization, and Evidence Management Platform**

**Version 1.0 approved**

### **Team Details**

|     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- |
| **Team Name** | **Project ID Selected** | **Team Member 1 Name & SRN** | **Team Member 2 Name & SRN** | **Team Member 3 Name & SRN** | **Team Member 4 Name & SRN** |
| Team Jackfruit 54 | 54  | Suraj C D, PES2UG24AM165 | Suchir Reddy Adi, PES2UG24AM163 | Thota Ronav, PES2UG24AM173 | Syed Junaid Ahmed, PES2UG24AM166 |

**Prepared by:** Development Team

**Organization:** Department of CSE (AI/ML), PES University

**Date Created:** September 5, 2026

### **Revision History**

|     |     |     |     |
| --- | --- | --- | --- |
| **Name** | **Date** | **Reason For Changes** | **Version** |
| Suraj C D, Suchir Reddy Adi, Thota Ronav, Syed Junaid Ahmed | September 5, 2026 | Initial baseline document draft for Phase-1 | 1.0 |

### **1\. Introduction**

#### **1.1 Purpose**

This Software Requirements Specification (SRS) establishes the complete functional and non-functional specifications for the **Monetary Fraud Investigation, Visualization, and Evidence Management Platform** (Release 1.0). The platform enables financial crime investigators, compliance officers, and forensic analysts to ingest transaction ledgers, uncover money-laundering rings via graph visualization, preserve a tamper-evident audit chain of evidence, and assemble regulatory-compliant case files.

#### **1.2 Intended Audience and Reading Suggestions**

- **Faculty Evaluators / Project Guides:** Review Section 2 and Section 5 to assess alignment with SE course deliverables and learning goals.
- **Development Team & System Architects:** Rely on Section 3, Section 4, Section 5, and Appendix C for architecture, interface contracts, and implementation milestones.
- **Quality Assurance / Test Engineers:** Reference Section 5 and Appendix C (Traceability Matrix) to derive unit, integration, and system test suites.

#### **1.3 Product Scope**

The system addresses the operational bottlenecks of manual financial fraud investigation by automating transaction graph construction, flagging suspicious typologies (structuring, cyclical layering, mule accounts), and securing case evidence using cryptographic hashing. By unifying graph visual analytics with evidence management, the platform accelerates root-cause investigation while enforcing evidentiary integrity for regulatory reporting and prosecution.

#### **1.4 References**

- IEEE Standard 830-1998: Recommended Practice for Software Requirements Specifications.
- PES University UE24CS341A Software Engineering Project Guidelines.
- RBI Master Direction on Cyber Security & Fraud Monitoring in Commercial Banks.

### **2\. Overall Description**

#### **2.1 Product Perspective**

The platform is an autonomous, web-based software application integrating relational data persistence, graph data structures, and interactive UI frameworks. It interfaces with banking core databases via batch CSV ingestion and secure REST APIs, delivering an end-to-end investigative workspace.

#### **2.2 Product Functions**

- Multi-source transaction and account data ingestion with validation checks.
- Interactive multi-hop entity-relationship graph visualization (nodes = accounts, edges = transactions).
- Automated pattern-detection engine to detect smurfing, circular fund routing, and high-frequency velocity anomalies.
- Immutable evidence repository featuring cryptographic hashing (SHA-256) and audit logging.
- Case file builder and automated regulatory report generator (SAR/STR export in PDF).

#### **2.3 User Classes and Characteristics**

- **Fraud Investigator (Primary):** Analyzes flagged entities, queries multi-hop transaction networks, isolates fraud rings, and collates case evidence.
- **Lead Auditor / Compliance Manager:** Reviews case findings, verifies evidentiary chain of custody, signs off on reports, and tracks resolution SLAs.
- **System Administrator:** Manages role-based access control (RBAC), oversees database health, configures rule thresholds, and reviews audit logs.

#### **2.4 Operating Environment**

- **Web Client:** Modern standards-compliant web browsers (Google Chrome 120+, Firefox 120+, Safari 17+).
- **Backend Runtime:** Node.js (v20+) or Python (v3.11+) containerized on Alpine Linux / Ubuntu 22.04 LTS.
- **Data Layer**: PostgreSQL / SQLite with in-memory graph structures (NetworkX / Cytoscape.js).
- **Communications**: Standard HTTP/HTTPS REST APIs using JSON payloads.
- **Containerization & CI/CD:** Docker and GitHub Actions / Jenkins pipelines.

#### **2.5 Design and Implementation Constraints**

- Strict adherence to modular architectural design separating UI, business logic, and database persistence.
- Agile methodology execution across short development sprints.
- Implementation of static code analysis checks (SonarQube) and branch test coverage exceeding 80%.
- Zero plain-text storage of Personally Identifiable Information (PII); all customer financial identifiers must be masked.

#### **2.6 Assumptions and Dependencies**

- Financial transaction inputs conform to defined formats (CSV or JSON schema) with valid timestamps, unique account IDs, and monetary quantities.
- Modern web browser client environments support WebGL / Canvas rendering for complex graph visualization libraries (e.g., Cytoscape.js, Vis.js, or D3.js).

### **3\. External Interface Requirements**

#### **3.1 User Interfaces**

- **Authentication View:** Secure login enforcing role-based credential verification.
- **Investigation Dashboard:** High-level summary of active cases, newly ingested transaction volume, and triggered anomaly alerts.
- **Network Graph Canvas:** Dynamic node-link interface supporting multi-hop expansions, node filtering by transaction threshold, entity searches, and color-coded risk flags.
- **Evidence Management Vault:** Workspace to append notes, attach transaction receipts, log chronological events, and generate case audit trails.

#### **3.2 Software Interfaces**

- **Database Engine:** PostgreSQL 16 via Prisma/SQLAlchemy ORM for transactional consistency, user authentication, and case metadata.
- **Data Layer**: PostgreSQL / SQLite with in-memory graph structures (NetworkX / Cytoscape.js).
- **Graph Computation:** Neo4j / In-memory NetworkX graph processing library.
- **Communications**: Standard HTTP/HTTPS REST APIs using JSON payloads.
- **Continuous Integration:** Docker container runtime orchestrated via GitHub Actions and Jenkins.

#### **3.3 Communications Interfaces**

- HTTPS with TLS 1.3 encryption across all client-server communications.
- RESTful JSON APIs for data exchanges; WebSocket connections for real-time long-running query updates.

### **4\. Analysis Models**

+-------------------------------------------+

|Fraud Investigation & Evidence Platform|

+-------------------------------------------+

|

+-------------------+-----------------------+----------------------+---------------------+

| | | |

\[Ingest & Validate\] \[Visualize Network\] \[Flag Anomalies\] \[Manage Evidence & Cases\]  
(UC-01) (UC-02) (UC-03) (UC-04)

| | | |

+-------------------+------------+------------+--------------------+

|

v

\[Export Regulatory Audit Report\]

(UC-05)

- **UC-01 (Data Ingestion):** User uploads financial ledger data. System validates format, checks fields, and inserts into DB.
- **UC-02 (Graph Visualization):** User selects an account. System executes multi-hop traversal and renders interactive node-link network.
- **UC-03 (Anomaly Detection):** Automated engine runs heuristic rules. Highlights circular layering rings and velocity spikes on canvas.
- **UC-04 (Evidence Vault Management):** Investigator attaches flagged subgraphs and transaction receipts. System computes SHA-256 hashes and writes tamper-evident audit logs.
- **UC-05 (Report Generation):** Investigator requests case compilation. System exports formatted, verifiable PDF report.

### **5\. System Features**

#### **5.1 Interactive Transaction Network Visualization**

- **5.1.1 Description and Priority:** Visualizes relationships between sender and receiver accounts up to N-degrees of separation. Priority: High.
- **5.1.2 Stimulus/Response Sequences:**
    - Investigator inputs an Account Number into the query bar.
    - System queries adjacency records and returns a node-link diagram on the canvas.
    - Investigator double-clicks an adjacent node; system queries and expands second-degree edges dynamically.
- **5.1.3 Functional Requirements:**
    - **REQ-1:** System shall render accounts as distinct nodes labeled with masked account identifiers.
    - **REQ-2:** System shall render financial transfers as directed arrows labeled with timestamp and transfer amount.
    - **REQ-3:** System shall support dynamic edge filtering by transaction amount threshold, date range, and transfer channel.

#### **5.2 Fraud Pattern Detection and Ring Identification Engine**

- **5.2.1 Description and Priority:** Automated identification of high-risk transaction typologies (cyclical loops, structuring/smurfing, rapid velocity). Priority: High.
- **5.2.2 Stimulus/Response Sequences:**
    - Automated scheduler triggers pattern scan upon dataset ingestion.
    - Rule engine discovers a circular transfer path.
    - System flags participating accounts with elevated risk scores and annotates nodes on the dashboard.
- **5.2.3 Functional Requirements:**
    - **REQ-4:** System shall identify closed directed cycles in transaction paths within a user-configurable time window.
    - **REQ-5:** System shall flag rapid sequential fund movements exceeding configurable velocity limits (e.g., >5 transfers in <10 minutes).
    - **REQ-6:** System shall compute an aggregate Suspicious Activity Score (1–100) per investigated account entity.

#### **5.3 Evidence Management Vault & Audit Trail**

- **5.3.1 Description and Priority:** Centralized repository to preserve investigation artifacts with non-repudiation guarantees. Priority: High.
- **5.3.2 Stimulus/Response Sequences:**
    - Investigator pins a flagged subgraph and attaches notes to an active case file.
    - System computes the SHA-256 hash of the snapshot, persists the artifact, and logs the action.
    - System renders an unalterable chronological timeline view of all logged evidence.
- **5.3.3 Functional Requirements:**
    - **REQ-7:** System shall record chronological audit logs capturing user identity, timestamp, action type, and modified object ID.
    - **REQ-8:** System shall generate and store a cryptographic hash (SHA-256) for every uploaded document or captured graph snapshot to guarantee evidentiary integrity.
    - **REQ-9:** System shall prevent deletion or modification of evidence records once submitted by an investigator.

#### **5.4 Case Compilation and Regulatory Report Export**

- **5.4.1 Description and Priority:** Assembles findings into standardized case dossiers suitable for legal and regulatory submission. Priority: Medium.
- **5.4.2 Stimulus/Response Sequences:**
    - Investigator clicks "Generate Case Report" on an active case.
    - System verifies evidence completeness and renders a preview of the report.
    - Investigator approves; system exports an immutable, digitally signed PDF document.
- **5.4.3 Functional Requirements:**
    - **REQ-10:** System shall export comprehensive case files into PDF format incorporating executive summaries, transaction tables, graph captures, and evidence checksums.
    - **REQ-11:** System shall assign a unique Case Reference Tracking ID to each finalized dossier.

### **6\. Other Nonfunctional Requirements**

#### **6.1 Performance Requirements**

- **PERF-1:** Graph queries up to 3 hops across 2,500 active transactions shall render on screen within 2.5 seconds.
- **PERF-2:** Transaction batch ingestion of up to 500 records shall complete within 1.0 second.

#### **6.2 Safety Requirements**

- **SAFE-1:** Automated transactional rollback mechanisms must execute immediately if a network interruption occurs during evidence submission, preventing partial or corrupt states.

#### **6.3 Security Requirements**

- **SEC-1:** User authentication via JSON Web Tokens (JWT) with password hashing using bcrypt.
- **SEC-2:** Role-Based Access Control (RBAC) separating Investigator, Auditor, and Admin capabilities.
- **SEC-3:** All stored sensitive financial identifiers (account numbers, tax IDs) must be encrypted at rest using AES-256.

#### **6.4 Software Quality Attributes**

- **Maintainability:** Modular architecture adhering strictly to SOLID principles, validated via SonarQube quality gates.
- **Testability:** Unit test coverage exceeding 80% with branch coverage validation using standard frameworks (PyTest/Jest).
- **Usability:** Intuitive investigative canvas adhering to Nielsen Norman usability heuristics for data-intensive dashboards.

#### **6.5 Business Rules**

- **BR-1:** Only certified Lead Auditors can mark a fraud investigation case as "Closed / Prosecuted."
- **BR-2:** Evidence artifacts locked to a closed case cannot be detached or updated under any circumstance.

### **7\. Other Requirements**

- **Database Requirement:** Relational tables must strictly maintain referential integrity via foreign key cascading constraints.
- **Containerization:** All services must be packaged as standalone Docker containers runnable via a single docker-compose up command.

### **Appendix A: Glossary**

- **SAR:** Suspicious Activity Report.
- **Smurfing / Structuring:** Breaking large sums of money into multiple smaller transactions below regulatory reporting limits to evade detection.
- **Cyclical Layering:** Moving illicit funds through complex series of circular accounts to obscure source ownership.
- **RBAC:** Role-Based Access Control.
- **SHA-256:** Secure Hash Algorithm 256-bit used for cryptographic evidence integrity checks.

### **Appendix B: Field Layouts**

#### **B.1 Ingested Transaction Layout**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **Field** | **Length** | **Data Type** | **Description** | **Is Mandatory** |
| transaction_id | 36  | Alphanumeric (UUID) | Unique identifier for transaction | Y   |
| source_account | 16  | Alphanumeric | Originating bank account identifier | Y   |
| destination_account | 16  | Alphanumeric | Beneficiary bank account identifier | Y   |
| amount | 15, 2 | Decimal | Currency value transferred | Y   |
| timestamp | 24  | ISO-8601 DateTime | Execution date and time | Y   |
| channel | 10  | String | Transfer channel (NEFT, RTGS, UPI, IMPS) | Y   |
| risk_flag | 5   | Boolean | Anomaly flag triggered | N   |

#### **B.2 Evidence Management Artifact Layout**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **Field** | **Length** | **Data Type** | **Description** | **Is Mandatory** |
| evidence_id | 36  | Alphanumeric (UUID) | Unique artifact identifier | Y   |
| case_id | 36  | Alphanumeric (UUID) | Parent case identifier | Y   |
| submitted_by | 50  | String | SRN/Employee ID of investigator | Y   |
| hash_checksum | 64  | Alphanumeric | SHA-256 cryptographic digest | Y   |
| timestamp | 24  | ISO-8601 DateTime | System timestamp of upload | Y   |
| notes | 1000 | String | Qualitative investigative narrative | N   |

### **Appendix C: Requirement Traceability Matrix (RTM)**

|     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Sl. No** | **Requirement ID** | **Brief Description of Requirement** | **Architecture Reference** | **Design Reference** | **Code File Reference** | **Test Case ID** | **System Test Case ID** |
|     |     |     |     |     |     |     |     |
|     |     |     |     |     |     |     |     |