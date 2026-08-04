# StudySprint — Technical Architecture

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React (Vite) | Fast dev server, simple build step, matches capstone recommended stack |
| Backend | Node.js + Express | Simple REST API, huge ecosystem, beginner-friendly |
| Database | SQLite (via `better-sqlite3`) | Zero infra cost, no separate DB server needed for MVP |
| Auth | `bcrypt` password hashing + `express-session` signed cookies | No external provider needed; standard for server-rendered/API session auth |
| Charts | Recharts | React-native charting library, matches PRD requirement |
| CSV export | Backend-generated (`json2csv` or manual string building) | Reuses existing filter logic; single source of truth |
| Prod server | Express serving built React files + API from one process | One Railway service, simpler deployment |
| Tests | Jest + Supertest (backend) | Standard Node testing stack for unit + integration/API tests |
| Deployment | Railway (Docker or Nixpacks auto-detect) | Free tier acceptable, matches capstone requirement |

## 2. Components

| Component | Responsibility |
|---|---|
| `server/src/app.js` | Express app setup: middleware, route mounting, static file serving |
| `server/src/routes/auth.routes.js` | HTTP layer for register/login/logout/profile |
| `server/src/services/auth.service.js` | Validation + orchestration for auth and profile logic |
| `server/src/repository/user.repository.js` | All SQL for the `users` table |
| `server/src/routes/assignments.routes.js` | HTTP layer for assignment CRUD, filtering, export |
| `server/src/services/assignments.service.js` | Assignment validation, filter parsing, status logic |
| `server/src/repository/assignment.repository.js` | All SQL for the `assignments` table |
| `server/src/services/dashboard.service.js` | Computes KPIs and chart data from assignments |
| `server/src/db/db.js` | SQLite connection, schema init |
| `client/src/pages/*` | Page-level React components (Login, Register, Dashboard, Assignments) |
| `client/src/components/*` | Reusable UI pieces (AssignmentForm, AssignmentTable, FilterBar, KPI cards) |

## 3. Data Model

Two tables, defined in `server/src/db/schema.sql`:

**`users`**
- `id` (PK, autoincrement)
- `name` (text, required)
- `email` (text, unique, required)
- `password_hash` (text, required)
- `timezone` (text, default 'UTC')
- `theme` (text, default 'light')
- `created_at`, `updated_at` (timestamps)

**`assignments`**
- `id` (PK, autoincrement)
- `user_id` (FK → users.id, required)
- `title` (text, required)
- `course_name` (text, required, free text)
- `due_date` (date, required)
- `priority` (text: 'High' | 'Medium' | 'Low', required)
- `status` (text: 'Not Started' | 'In Progress' | 'Complete', default 'Not Started')
- `completed_at` (timestamp, nullable — set when status becomes Complete)
- `created_at`, `updated_at` (timestamps)

## 4. API Design

All endpoints prefixed `/api`. Auth via signed session cookie unless noted.

| Method | Path | Auth | Request | Response | Errors |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | No | `{ name, email, password }` | `201 { user: {id, name, email} }`, sets session cookie | `400` invalid input / duplicate email |
| POST | `/api/auth/login` | No | `{ email, password }` | `200 { user: {...} }`, sets session cookie | `401` invalid credentials |
| POST | `/api/auth/logout` | Session | — | `200 { success: true }`, clears cookie | `401` if not logged in |
| GET | `/api/auth/me` | Session | — | `200 { user: {...} }` | `401` if not logged in |
| PUT | `/api/profile` | Session | `{ name, email, timezone, theme }` | `200 { user: {...} }` | `400` invalid/duplicate email; `401` unauthenticated |
| GET | `/api/assignments` | Session | Query: `course, priority, status, from, to, sort` | `200 { assignments: [...] }` | `401` unauthenticated |
| POST | `/api/assignments` | Session | `{ title, course_name, due_date, priority }` | `201 { assignment: {...} }` | `400` invalid input; `401` unauthenticated |
| PUT | `/api/assignments/:id` | Session, owner | Any updatable fields | `200 { assignment: {...} }` | `400` invalid input; `404` not found/not owned |
| DELETE | `/api/assignments/:id` | Session, owner | — | `200 { success: true }` | `404` not found/not owned |
| PATCH | `/api/assignments/:id/status` | Session, owner | `{ status }` | `200 { assignment: {...} }` | `400` invalid status; `404` not found/not owned |
| GET | `/api/assignments/export` | Session | Same filter query params as GET /assignments | `200` CSV file download | `401` unauthenticated |
| GET | `/api/dashboard` | Session | — | `200 { kpis: {...}, chartData: [...] }` | `401` unauthenticated |

## 5. Implementation Sequence

1. **Foundation** — Express app setup, SQLite schema, session auth (register/login/logout), basic React shell with routing.
2. **Core assignments** — Assignment CRUD API + React forms/table, connected end-to-end.
3. **Filtering, dashboard, export** — Filter/sort logic, KPI + chart calculations, CSV export endpoint.
4. **Polish** — Profile page, theme toggle, error handling, mobile responsiveness, loading states (Sprint 2 change request).

## 6. Risks

- **SQLite concurrency** — untested under concurrent multi-user writes; acceptable for single-user MVP.
- **Session-based auth in production** — needs `SESSION_SECRET` set as a Railway environment variable; app should fail fast if missing outside development mode.
- **Free-tier Railway hosting** — possible cold-start delay after inactivity.
- **No CI pipeline** — tests run locally only, not yet wired to run automatically on push.
- **Timezone simplification** — using server/browser local time for "overdue"/"due this week" may be slightly inaccurate for users far from server timezone; acceptable tradeoff for MVP.