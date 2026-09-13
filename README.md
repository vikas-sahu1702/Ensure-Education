# Ensure Education — Student Education Protection Platform

An institutional-grade digital platform designed to financially protect a student's education if their registered fee payer passes away, subject to policy terms and conditions.

---

## 🏛️ Executive Summary

Ensure Education is a specialized **Student Education Protection Platform** connecting:
$$\text{COLLEGE} \longrightarrow \text{STUDENT} \longrightarrow \text{FEE PAYER} \longrightarrow \text{EDUCATION PROTECTION POLICY}$$

- **Student Premium**: Exactly **1.0%** of total course fee (e.g. ₹3,00,000 Course Fee = ₹3,000 one-time Scheme Premium).
- **College Channel**: Partner colleges introduce the scheme during admission and receive a configurable **5.0%** institutional promotional incentive (funded institutionally, never charged to students).
- **Fee Payer Eligibility**:
  - **Father or Mother**: Income proof is **NOT required**.
  - **Other Eligible Family Member**: Income proof **IS required**.
  - **Age Limit**: Fee payer must **NOT exceed 55 years of age** on the date of registration.
  - **Security**: Mandatory two-step authentication (2FA).

---

## 🚀 Backend Architecture (Node.js v24 + SQLite)

The backend provides a full-featured REST API with native relational SQLite storage (`node:sqlite` DatabaseSync) and zero external npm compilation dependencies:

```
Ensureducation/
├── server/
│   ├── index.js                # Master REST API server (Port 3000)
│   ├── config.js               # Server configuration & defaults
│   ├── db/
│   │   ├── database.js         # Native SQLite connection & schema migrations
│   │   └── seed.js             # Institutional test data seeder
│   ├── services/
│   │   ├── eligibility.js      # Strict fee payer age (<= 55) & relationship rules
│   │   ├── calculator.js       # Dynamic 1% premium & 5% college incentive engine
│   │   └── policy.js           # Atomic transactional policy issuance & claims
│   ├── routes/
│   │   ├── auth.js             # Credentials & 2FA OTP verification
│   │   ├── student.js          # 10-step registration, policy view, claim filing
│   │   ├── college.js          # Institutional KPIs, roster search, verification
│   │   └── admin.js            # Global metrics, claim adjudication, configurable settings
│   └── data/
│       └── talvex.db           # Persistent SQLite database
├── tests/
│   └── api_tests.js            # 15 automated integration tests (100% passing)
├── js/
│   ├── api-client.js           # Frontend REST API bridge with auto-sync & fallback
│   ├── store.js                # Local reactive state store
│   ├── shield3d.js             # Three.js 3D Education Protection Shield
│   ├── calculator.js           # Client-side 1% premium calculator
│   ├── registration.js         # 10-step student onboarding wizard
│   ├── portals.js              # Student, College, and Admin view controllers
│   └── app.js                  # Client SPA router & role switcher
└── index.html                  # Master Single Page Application container (16 views)
```

---

## 🔌 Complete REST API Endpoints

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health check & system status | `200 OK` |
| `POST` | `/api/v1/calculate-premium` | Dynamic 1% calculation & breakdown | `200 OK` |
| `POST` | `/api/v1/auth/login` | Institutional login | `200 OK` |
| `POST` | `/api/v1/auth/verify-2fa` | 6-digit OTP authentication | `200 OK` |
| `POST` | `/api/v1/register` | 10-step student registration & policy issuance | `201 Created` / `422 Unprocessable` |
| `GET` | `/api/v1/student/policy` | Student policy card, tuition, documents | `200 OK` |
| `POST` | `/api/v1/student/claims` | Lodge bereavement protection claim | `201 Created` |
| `GET` | `/api/v1/college/dashboard` | Partner college KPIs & incentive summary | `200 OK` |
| `GET` | `/api/v1/college/students` | Filterable and searchable student roster | `200 OK` |
| `PUT` | `/api/v1/college/students/:id/verify` | Verify student admission proof | `200 OK` |
| `GET` | `/api/v1/admin/dashboard` | Global platform metrics & funnel analytics | `200 OK` |
| `GET` | `/api/v1/admin/claims` | Claim adjudication queue | `200 OK` |
| `PUT` | `/api/v1/admin/claims/:id/adjudicate` | Approve / Reject bereavement claim | `200 OK` |
| `GET` | `/api/v1/admin/settings` | Retrieve configurable business rules | `200 OK` |
| `PUT` | `/api/v1/admin/settings` | Update 1% premium, 5% incentive, 55 max age | `200 OK` |

---

## 🧪 Automated Testing

Run the automated integration test suite:
```powershell
node tests/api_tests.js
```
Validates all 15 core operational assertions:
- Dynamic 1% calculations (`₹3,00,000` $\rightarrow$ `₹3,000`; `₹4,80,000` $\rightarrow$ `₹4,800`)
- Enforces fee payer age limit $\le 55$ years (rejects age $> 55$ with `422 Unprocessable Entity`)
- Full policy issuance, claim lodging, college roster search, and administrative claim approval.

---

## 💎 Design System & 3D Visuals

- **Theme**: Deep Obsidian (`#0B0B0D`), Warm Ivory (`#F7F5F0`), Burnished Gold (`#D6A84F`), Warm Amber (`#F59E0B`).
- **Interactive 3D**: Three.js metallic Education Protection Shield with realistic studio key/rim lighting, orbital rings, and pointer tilt.
- **3D Card Tilt**: Perspective tilt on student policy cards and calculators.
