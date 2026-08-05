# Capstone Self-Assessment — StudySprint

**Project:** StudySprint
**Repository:** https://github.com/work-krishnak/studysprint
**Live URL:** https://studysprint-production-1647.up.railway.app
**Completed:** 2026-08-05

## Dimension Scores

| Dimension | Score (1-4) | Justification | Evidence |
|---|---|---|---|
| Planning Quality | 3 | PRD + spec + prompt library all completed with clear scope | docs/01-04 |
| Plan Mode Discipline | 3 | Planned before each sprint; some fixes done reactively during debugging | commit history |
| Prompt Engineering | 3 | Structured, specific prompts used for tests/docs; annotated library documents intent | 04-vibe-coding-spec, 05-prompt-library |
| Architecture Quality | 3 | Clear routes/services/repository layering, session auth, SQLite | docs/03-architecture.md |
| Code Organisation | 3 | Consistent folder structure (routes/services/repository) across the app | server/ folder structure |
| Error Handling | 3 | Global error handler + per-route try/catch with user-facing messages (Sprint 2) | server/app.js, routes/*.js |
| Security | 3 | Full npm audit pass on both client/server, fixed a real production-dependency CVE chain, verified app still worked after fixes | this session's audit logs |
| Testing | 3 | 6 test suites, 34 tests, unit + integration, isolated in-memory DB | server/tests/ |
| Documentation | 4 | README, API docs, debugging journal, and retrospective all present and specific | docs/ |
| Deployment | 3 | Live, working Docker-based Railway deployment, verified end-to-end after real failures | live URL |
| Debugging Recovery | 4 | 4 distinct real failures documented with root cause, fix, and verification | docs/DEBUGGING_JOURNAL.md |
| Change Request | 3 | Sprint 2 added error handling, loading states, mobile responsiveness per the change request | commit "Sprint 2 - error handling..." |
| Product Thinking | 3 | Solves a real, scoped problem (assignment tracking) with working CRUD + dashboard | live app |
| Retrospective | 3 | Honest, specific, names a real hardest-part and a concrete lesson learned | docs/RETROSPECTIVE.md |

**Total: 43 / 56 (77%)**

## Honest Reflection

**Most proud of:** Diagnosing and recovering from 4 real, escalating deployment failures rather than giving up or faking success.

**Would improve first with more time:** Node version pinning and earlier, incremental security audits — both issues were only caught late because they weren't checked until the very end.

**Most important thing learned:** Getting an app to run locally is a different skill from getting it to run reliably in production — most of the real debugging in this project happened at that boundary, not in the application logic itself.