# StudySprint API Documentation

All endpoints are prefixed with `/api`. Responses are JSON unless noted otherwise (CSV export is the one exception). Session-based auth uses a signed cookie set by `express-session` — no separate token/API key is used.

**Auth requirement key:**
- **None** — no session required
- **Session** — requires a valid logged-in session (enforced by `requireAuth` middleware); returns `401` if missing/invalid

---

## Auth (`/api/auth`)

### POST `/api/auth/register`
- **Auth:** None
- **Request body:** `{ name, email, password }` (exact validation rules live in `services/auth.service.js` — see service layer for details)
- **Success response:** `201` — `{ "user": { ...sanitized user fields, no password } }`. Also sets `req.session.userId`, logging the user in immediately.
- **Errors:** Any validation/duplicate-email failure in `authService.register()` is caught and returned as `{ "message": "..." }` with the error's own `.status` (defaults to `500` if unspecified).

### POST `/api/auth/login`
- **Auth:** None
- **Request body:** `{ email, password }`
- **Success response:** `200` — `{ "user": { ... } }`. Sets `req.session.userId`.
- **Errors:** Invalid credentials or other failures return `{ "message": "..." }` with the error's `.status` (defaults to `500`).

### POST `/api/auth/logout`
- **Auth:** None (destroys session if one exists)
- **Request body:** none
- **Success response:** `200` — `{ "success": true }`. Destroys the session and clears the `connect.sid` cookie.
- **Errors:** None expected.

### GET `/api/auth/me`
- **Auth:** Session (manual check, not via `requireAuth` middleware)
- **Request body:** none
- **Success response:** `200` — `{ "user": { ...sanitized fields } }`
- **Errors:** `401` — `{ "message": "Not logged in." }` if no session or user not found.

---

## Assignments (`/api/assignments`)
*All routes below require a valid session (`requireAuth` applied at router level).*

### GET `/api/assignments`
- **Auth:** Session
- **Query params (all optional):** `course`, `priority`, `status`, `from`, `to`, `sort`
- **Success response:** `200` — `{ "assignments": [ ... ] }`
- **Errors:** `{ "message": "..." }` with error's `.status` (defaults `500`)

### GET `/api/assignments/export`
- **Auth:** Session
- **Query params (all optional):** `course`, `priority`, `status`, `from`, `to`
- **Success response:** `200` — CSV file download (`Content-Type: text/csv`, `Content-Disposition: attachment; filename="assignments.csv"`), **not JSON**
- **Errors:** `{ "message": "..." }` JSON with error's `.status` (defaults `500`)

### POST `/api/assignments`
- **Auth:** Session
- **Request body:** assignment fields — exact required fields defined in `services/assignment.service.js` (`createAssignment`) — TODO: verify exact field list against service layer
- **Success response:** `201` — `{ "assignment": { ... } }`
- **Errors:** `{ "message": "..." }` with error's `.status` (defaults `500`)

### PUT `/api/assignments/:id`
- **Auth:** Session
- **Request body:** updated assignment fields (see `updateAssignment` in service layer)
- **Success response:** `200` — `{ "assignment": { ... } }`
- **Errors:** `{ "message": "..." }` with error's `.status` (e.g. `404` if not owned/found — TODO: verify exact status used)

### PATCH `/api/assignments/:id/status`
- **Auth:** Session
- **Request body:** `{ "status": "Not Started" | "In Progress" | "Complete" }` (exact allowed values — TODO: verify against service layer)
- **Success response:** `200` — `{ "assignment": { ... } }`
- **Errors:** `{ "message": "..." }` with error's `.status`

### DELETE `/api/assignments/:id`
- **Auth:** Session
- **Request body:** none
- **Success response:** `200` — `{ "success": true }`
- **Errors:** `{ "message": "..." }` with error's `.status` (e.g. `404` if not owned/found)

---

## Dashboard (`/api/dashboard`)
*Requires a valid session (`requireAuth` applied at router level).*

### GET `/api/dashboard`
- **Auth:** Session
- **Request body:** none
- **Success response:** `200` — dashboard data object (KPIs + chart data) — exact shape defined in `services/dashboard.service.js` `getDashboardData()` — TODO: paste example response here once confirmed via a manual test call
- **Errors:** `{ "message": "..." }` with error's `.status`

---

## Health (`/api`)

### GET `/api/health`
- **Auth:** None
- **Success response:** `200` — `{ "status": "ok" }`