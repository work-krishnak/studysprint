# StudySprint — Annotated Prompt Library

This log records the actual prompts used during development (Phase 5 onward),
with what each one did and which component it targeted. Entries are added as
development happens — not written in advance.

| # | Prompt | What It Did | Targeted |
|---|---|---|---|

| 1 | "Set up an Express app with a `/api/health` endpoint, plus a server entry point that starts on `process.env.PORT || 3001`." | Created `server/app.js` and `server/server.js`; verified working via browser at `/api/health` | `server/app.js`, `server/server.js` |

| 2 | "Create a SQLite schema (users, assignments tables) using Node's built-in node:sqlite module, and initialize it on server startup." | Created `server/db/schema.sql` and `server/db/db.js`; verified `studysprint.db` file is created automatically on server start | `server/db/`, `server/app.js` |

| 3 | "Implement user registration and login with routes → services → repository layering, using bcrypt for password hashing and express-session for sessions." | Created `server/repository/user.repository.js`, `server/services/auth.service.js`, `server/routes/auth.routes.js`; wired sessions into `app.js`; verified register/login/me via PowerShell requests | `server/repository/`, `server/services/`, `server/routes/`, `server/app.js` |

| 4 | "Implement assignment CRUD endpoints (create, read, update, update-status, delete) with filtering, protected by auth middleware, following routes → services → repository layering." | Created `server/repository/assignment.repository.js`, `server/services/assignment.service.js`, `server/routes/assignments.routes.js`, `server/middleware/requireAuth.js`; wired into `app.js`; verified full CRUD via PowerShell requests | `server/repository/`, `server/services/`, `server/routes/`, `server/middleware/` |

| 5 | "Set up a React app with Vite in client/, install React Router and Recharts, and configure routing for /login, /register, /dashboard, and /assignments with placeholder pages." | Created `client/` via Vite scaffold; created `client/src/pages/` with 4 placeholder pages; configured routing in `App.jsx`; verified redirect and all 4 routes render correctly | `client/src/App.jsx`, `client/src/pages/` |

| 6 | "Configure a Vite dev proxy so the React frontend can call the Express API, create a shared api client helper, and build real Login and Register pages connected to the backend." | Created `client/src/api/client.js`, updated `vite.config.js` with proxy config, replaced `Login.jsx` and `Register.jsx` with working forms; verified registration redirects to dashboard end-to-end | `client/vite.config.js`, `client/src/api/`, `client/src/pages/Login.jsx`, `client/src/pages/Register.jsx` |