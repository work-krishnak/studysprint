# StudySprint — Project Proposal

## Problem Statement
Working professionals pursuing courses, certifications, or continuing education
juggle assignments across multiple courses, platforms, and deadlines
simultaneously. Existing tools (course platform dashboards, generic to-do apps,
spreadsheets) show tasks in isolation per course or as flat, unprioritized lists.
There is no single place to see what matters most, right now, across everything
they're studying.

## Target User
Working professionals enrolled in one or more courses, certifications, or
self-directed learning programs alongside a full-time job — juggling limited,
fragmented study time and needing to know at a glance what to work on next
without digging through multiple course sites or a messy to-do list.

## Value Proposition
StudySprint gives working professionals one prioritized, cross-course view of
every assignment: what's due, what's overdue, what's most important, and how
much progress they've made — replacing scattered course dashboards and generic
to-do lists with a single, purpose-built tracker.

## MVP Scope
- User registration, login, and logout (email/password, session-based)
- Create, edit, delete assignments (title, course/subject, due date, priority,
  status)
- Mark assignments complete / incomplete
- Filter and sort assignments (by course, priority, status, due date)
- Export assignment list (CSV)
- Dashboard with KPIs (total, overdue, due this week, completed) and a
  progress chart

## Top 3 Risks
1. **Priority is subjective** — without a clear, simple priority model (e.g.
   High/Medium/Low), the "prioritized view" value proposition could feel
   arbitrary rather than genuinely useful.
2. **Single-user SQLite** — fine for MVP and portfolio use, unproven under
   concurrent multi-user writes if this ever had real simultaneous users.
3. **No mobile app** — professionals often want to check tasks on the go;
   MVP is a responsive web app only, not a native app, which could limit
   real-world daily use.

## Biggest Assumption
That a simple manual priority field (High/Medium/Low) combined with due-date
sorting is "prioritized enough" for users — versus needing a more complex
scoring system (e.g. urgency + importance matrix). We're testing the simpler
approach first and can validate with user feedback later.