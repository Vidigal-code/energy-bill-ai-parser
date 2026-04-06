# Delivery and evidence

Use GitHub **Issues** and **Projects** to track work on **energy-bill-ai-parser** and to attach evidence for reviewers.

## Suggested GitHub Issues

- **Bug**: extraction mismatch for a PDF sample; attach PDF (if allowed) and redacted logs.
- **Feature**: new provider or dashboard field; link to contract or API change.
- **Chore**: dependency update, Docker fix, CI improvement.

Labels such as `backend`, `frontend`, `llm`, `infra` keep the backlog searchable.

## Projects (Kanban)

Optional board columns:

| Column | Meaning |
|--------|---------|
| Backlog | Not started |
| In progress | Assigned and active |
| Review | PR open |
| Done | Merged and verified |

## Validation checklist (before delivery)

- [ ] `GET /api/health` returns OK when stack is up.
- [ ] Swagger loads and auth flows are callable (`/api/docs/en` or `/api/docs/pt`).
- [ ] Frontend loads on `http://localhost:3001` (Docker defaults).
- [ ] Upload PDF → extraction completes and data appears in the UI or DB.
- [ ] Admin vs user routes behave per RBAC (`ADMIN` / `USER`).
- [ ] Evidence: short screen recording or screenshots + Issue/PR links.

## Video walkthrough

The **video** route in this docs site points to the official project execution recording (YouTube).

> Version: 1.0.0
