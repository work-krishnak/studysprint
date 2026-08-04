# StudySprint — Product Requirements Document

## 1. Problem Statement
Working professionals pursuing courses, certifications, or continuing education
juggle assignments across multiple courses, platforms, and deadlines
simultaneously. Existing tools show tasks in isolation per course or as flat,
unprioritized lists. There is no single place to see what matters most, right
now, across everything they're studying. StudySprint solves this with one
prioritized, cross-course view of every assignment.

## 2. Target Users and User Stories
**Working professional learner** — juggling a job and one or more courses or
certifications, with limited, fragmented study time.

- As a user, I want to register and log in securely, so my assignments are
  private and accessible whenever I need them.
- As a user, I want to create an assignment with a course name, due date, and
  priority, so I can track exactly what I owe and when.
- As a user, I want to edit or delete an assignment, so I can correct mistakes
  or remove items that no longer apply.
- As a user, I want to mark an assignment complete, so my progress is
  reflected accurately.
- As a user, I want to filter and sort assignments by course, priority,
  status, or due date, so I can quickly find what matters most right now.
- As a user, I want to export my assignment list as CSV, so I can back it up
  or use it outside the app.
- As a user, I want a dashboard showing KPIs and a progress chart, so I can
  see my overall standing at a glance.

## 3. Core Features (Must-Have, with Acceptance Criteria)

| Feature | Acceptance Criteria |
|---|---|
| Register / login / logout | User can register with name, email, password; is auto-logged-in; can log out and session is cleared |
| Profile & preferences | User can update name, email, timezone, and theme (light/dark); email must be unique |
| Assignment CRUD | User can create/edit/delete an assignment with: title, course name (free text), due date, priority (High/Medium/Low), status (Not Started/In Progress/Complete) |
| Mark complete/incomplete | Toggling status to Complete stamps a completed date; toggling back clears it |
| Filter & sort | Dashboard/list can be filtered by course, priority, status, and date range, and sorted by due date or priority |
| CSV export | Export respects the currently active filters |
| Dashboard KPIs & chart | Shows total assignments, overdue count, due-this-week count, completed count, and a chart of completion over time |

**Nice-to-have (deferred, not forgotten):**
- Password reset via email (blocked — no email provider chosen)
- Recurring assignments
- Course-level grouping/summary view
- Reminder notifications
- Dark mode auto-detect from system preference

## 4. Non-Functional Requirements
- **Performance:** Dashboard queries are filtered at the database level, not loaded and filtered in the browser.
- **Security:** Passwords hashed (never stored in plain text); session cookies signed; app refuses to start without a `SECRET_KEY`/session secret set outside development mode.
- **Usability:** Core screens (dashboard, assignment form) must be usable on both desktop and mobile widths.
- **Scalability:** SQLite is appropriate for single-user/small-scale use; not tested under concurrent multi-user writes.

## 5. Out of Scope
1. Multi-user shared accounts or team/household assignment sharing
2. Native mobile apps (web only, responsive)
3. Integration with external course platforms (Coursera, Udemy, etc.)
4. Recurring/repeating assignments
5. Email or push notifications/reminders
6. File attachments on assignments

## 6. Success Metrics
No analytics instrumentation exists yet — these are proposed starting targets:

| Metric | Target |
|---|---|
| Activation — first assignment created within first session | ≥ 60% |
| Weekly active use — ≥1 assignment updated/week | ≥ 40% |
| Dashboard filter usage per session | ≥ 1 use |
| CSV export usage | Tracked, no target yet |

## 7. Open Questions
- Should "course" eventually become a structured entity (with its own metadata) instead of free text?
- Is a numeric priority score worth building later instead of High/Medium/Low?
- What's the long-term hosting plan — portfolio project or real users?

## 8. Constraints
Solo-developer capstone project, built in sequential phases with Claude/Cursor
as the primary AI development partner. No budget for paid infrastructure —
free-tier hosting (Railway), no paid email/SMS services. SQLite chosen to
keep the free-tier footprint minimal.

## 9. Status
Draft — Phase 2 of capstone. Owner: Krishna (work.krishnak@gmail.com). Last updated: 2026-08-05.