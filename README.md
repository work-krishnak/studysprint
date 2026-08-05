# StudySprint

StudySprint is a personal learning and assignment tracker that helps students organize coursework in one place. Users can register and log in, create assignments with due dates and priorities, filter and sort their workload, view dashboard KPIs and completion trends, and export assignments to CSV.

**Live app:** https://studysprint-production-1647.up.railway.app

## Tech Stack

### Frontend (`client/`)

| Category | Packages |
|----------|----------|
| **Runtime** | React 19, React DOM 19 |
| **Routing** | React Router DOM 7 |
| **Charts** | Recharts 3 |
| **Build tool** | Vite 8 |
| **Linting** | ESLint 10 |

### Backend (`server/`)

| Category | Packages |
|----------|----------|
| **Server** | Node.js, Express 5 |
| **Database** | SQLite via Node.js built-in `node:sqlite` module |
| **Auth** | bcrypt (password hashing), express-session (session cookies) |
| **Other** | cors, dotenv |
| **Testing** | Jest, Supertest, nodemon (dev) |

## Features

The following capabilities are implemented in the current codebase:

- **Authentication** — Register, log in, log out, and session-based access (`/api/auth/*`)
- **Assignment management** — Create, list, update status, and delete assignments
- **Due dates & priorities** — Each assignment has a due date and a priority (`High`, `Medium`, `Low`)
- **Status tracking** — Assignments support `Not Started`, `In Progress`, and `Complete`
- **Filtering & sorting** — Filter by course, priority, and status; sort by due date or priority
- **Dashboard KPIs** — Total, overdue, due this week, and completed counts
- **Completion chart** — Line chart of completed assignments over time (Recharts)
- **CSV export** — Download filtered assignments as a CSV file
- **Health check** — `GET /api/health` for server status

## Project Structure

```
studysprint/
├── client/                    # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js      # API client (fetch wrapper)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Assignments.jsx
│   │   ├── App.jsx            # React Router setup
│   │   └── main.jsx
│   ├── vite.config.js         # Dev proxy: /api → localhost:3001
│   └── package.json
├── server/                    # Express API
│   ├── db/
│   │   ├── db.js              # SQLite connection & schema init
│   │   └── schema.sql
│   ├── middleware/
│   │   └── requireAuth.js
│   ├── repository/            # Data access layer
│   ├── routes/                # Express route handlers
│   ├── services/              # Business logic
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── app.js                 # Express app (exported for tests)
│   ├── server.js              # Server entry point
│   └── package.json
└── docs/                      # Project documentation
```

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)

### 1. Clone the repository

```bash
git clone <repository-url>
cd studysprint
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Run locally

Start the API server (default port **3001**):

```bash
cd server
npm run dev
```

In a second terminal, start the Vite dev server (default port **5173**):

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The Vite dev server proxies `/api` requests to the backend at `http://localhost:3001`.

### Production start (backend only)

```bash
cd server
npm start
```

## Environment Variables

The server reads the following environment variables. Do not commit real secret values.

| Variable | Used in | Description | Example |
|----------|---------|-------------|---------|
| `PORT` | `server/server.js` | HTTP port for the Express server | `3001` |
| `SESSION_SECRET` | `server/app.js` | Secret key for signing session cookies. Falls back to a dev-only default if unset. | `your-random-secret-here` |
| `DB_PATH` | `server/db/db.js` | Path to the SQLite database file. Defaults to `server/db/studysprint.db`. Tests set this to `:memory:`. | `./db/studysprint.db` |

The frontend does not use `import.meta.env` variables. API calls go to `/api`, which is proxied to the backend during local development.

Optional: create a `server/.env` file for local overrides. The `dotenv` package is listed as a dependency but is not yet wired into the entry point; you can also export variables in your shell before starting the server.

## Running Tests

The Jest test suite lives in `server/tests/` and uses an in-memory SQLite database so it does not touch `studysprint.db`.

```bash
cd server
npm test
```

This runs unit tests (service layer) and integration tests (HTTP endpoints via Supertest).

## Deployment

Deployed as a single service on Railway using the `Dockerfile` at the project root:

1. The Docker image builds the React frontend (`client/`) and installs backend dependencies (`server/`)
2. Express (`server/app.js`) serves the built frontend as static files and handles all `/api/*` routes from the same process
3. Environment variables set on Railway: `PORT`, `SESSION_SECRET`
4. Live at: https://studysprint-production-1647.up.railway.app

## API Overview

See [docs/API.md](docs/API.md) for full endpoint documentation.
