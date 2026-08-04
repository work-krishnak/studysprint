# StudySprint — Annotated Prompt Library

This log records the actual prompts used during development (Phase 5 onward),
with what each one did and which component it targeted. Entries are added as
development happens — not written in advance.

| # | Prompt | What It Did | Targeted |
|---|---|---|---|

| 1 | "Set up an Express app with a `/api/health` endpoint, plus a server entry point that starts on `process.env.PORT || 3001`." | Created `server/app.js` and `server/server.js`; verified working via browser at `/api/health` | `server/app.js`, `server/server.js` |

| 2 | "Create a SQLite schema (users, assignments tables) using Node's built-in node:sqlite module, and initialize it on server startup." | Created `server/db/schema.sql` and `server/db/db.js`; verified `studysprint.db` file is created automatically on server start | `server/db/`, `server/app.js` |