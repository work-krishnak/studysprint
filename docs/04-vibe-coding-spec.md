# StudySprint — Vibe Coding Spec

## 1. Overview & Goals
Build StudySprint, a personal assignment tracker for working professionals,
following the architecture in `03-architecture.md`. Work in small, reviewable
steps: plan each piece with the AI assistant, review the generated diff before
accepting, and commit after each completed, working task.

## 2. Tech Stack & Conventions
See `03-architecture.md` Section 1. Convention: `routes → services → repository`
layering on the backend (no business logic in route handlers), functional
React components with hooks on the frontend, no class components.

## 3. Data Model
See `03-architecture.md` Section 3 (`users`, `assignments` tables).

## 4. Feature / Component Breakdown
See `03-architecture.md` Section 2 (component responsibility table), grouped
by the 4 implementation phases in Section 5.

## 5. Task List (as Cursor prompts)

**Backend foundation:**
1. "Set up an Express app in `server/` with a `/api/health` endpoint returning `{status: 'ok'}`. Include `package.json`, `app.js`, and a `server.js` entry point that starts the server on `process.env.PORT || 3001`."
2. "Create a SQLite database setup in `server/src/db/db.js` using `better-sqlite3`, with a `schema.sql` file defining `users` and `assignments` tables as specified in `docs/03-architecture.md` Section 3. Initialize the DB on server startup if tables don't exist."
3. "Implement user registration and login: `POST /api/auth/register` and `POST /api/auth/login` in `server/src/routes/auth.routes.js`, using `bcrypt` for password hashing and `express-session` for session cookies. Follow the routes → services → repository pattern."
4. "Add `POST /api/auth/logout` and `GET /api/auth/me` endpoints, plus middleware that protects routes requiring authentication."

**Core assignments:**
5. "Implement assignment CRUD endpoints (`GET/POST /api/assignments`, `PUT/DELETE /api/assignments/:id`) per the API spec in `docs/03-architecture.md` Section 4, with an assignments service and repository."
6. "Add `PATCH /api/assignments/:id/status` to toggle assignment status, setting `completed_at` when status becomes 'Complete' and clearing it otherwise."

**Frontend foundation:**
7. "Set up a React app with Vite in `client/`, with React Router configured for `/login`, `/register`, `/dashboard`, and `/assignments` routes."
8. "Build a Login page and Register page in React that call the auth API endpoints and redirect to `/dashboard` on success."
9. "Build an Assignments page with a table listing assignments, and a form to create a new assignment (title, course name, due date, priority)."

**Filtering, dashboard, export:**
10. "Add filter and sort UI to the Assignments page (by course, priority, status) and wire it to `GET /api/assignments` query parameters."
11. "Implement `GET /api/dashboard` returning KPIs (total, overdue, due this week, completed) and chart-ready data; build a Dashboard page displaying KPI cards and a Recharts chart."
12. "Implement `GET /api/assignments/export` generating a CSV respecting the current filters; add an Export button on the Assignments page."

## 6. Non-Functional Requirements
See `docs/02-prd.md` Section 4.

## 7. Testing Strategy
Jest + Supertest for the backend: one test file per domain (`auth.test.js`,
`assignments.test.js`, `dashboard.test.js`). Each test uses a fresh in-memory
or temp SQLite DB. Integration tests cover at least 3 endpoints end-to-end
(register→login, create assignment, filter assignments).

## 8. Deployment Plan
Single Railway service. Express serves the built React app (`client/dist`)
as static files and the `/api/*` routes from the same process. Environment
variables: `SESSION_SECRET`, `PORT` (Railway-provided). App fails fast at
startup if `SESSION_SECRET` is missing outside development mode.
## Sprint 2 — Stakeholder Change Request (Plan Mode)

**Change request received:** Add clear user-facing error messages, mobile-responsive
layout on at least 2 key screens, and loading states on all data-fetching operations.

**Impact assessment:**
- Error messages: partial coverage exists; needs audit across all pages for
  user-friendly fallback text, especially network/server-down cases.
- Mobile responsiveness: no breakpoints currently exist; Assignments and
  Dashboard chosen as the 2 target screens (most complex, most used).
- Loading states: Dashboard and initial Assignments load are covered; filter
  changes and action buttons (create/delete/complete) are not yet covered.

**Sprint 2 task list:**
1. Improve error handling across Login, Register, Assignments, Dashboard
2. Add loading states to filter changes and action buttons on Assignments
3. Make Assignments page responsive (target screen 1)
4. Make Dashboard page responsive (target screen 2)
5. Fix any bugs found during this pass