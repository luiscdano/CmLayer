# CmLayer Backend (Fastify)

Lightweight API for Feedback Loop, Status, and data-driven content.

## Setup

1. Install deps.
```
cd backend
npm install
```

2. Create env file.
```
cp .env.example .env
```

3. Run.
```
npm run dev
```

## Endpoints

Public

1. `GET /api/health`
2. `GET /api/status`
3. `GET /api/projects`
4. `GET /api/services`
5. `GET /api/knowledge`
6. `GET /api/changelog`
7. `GET /api/voices`
8. `GET /api/i18n/:lang`
9. `POST /api/feedback`

Admin (header `x-admin-token`)

1. `GET /admin/feedback?status=Pending|Approved|Published`
2. `PATCH /admin/feedback/:id`
3. `POST /admin/changelog`
4. `GET /admin/audit?limit=100`

## Payloads

`POST /api/feedback`
```json
{
  "name": "Jane",
  "email": "jane@example.com",
  "message": "Great work.",
  "budget": "1k-3k",
  "timeline": "2-4 weeks",
  "consent": true,
  "source": "site-footer"
}
```

`PATCH /admin/feedback/:id`
```json
{
  "status": "Approved",
  "note": "Reviewed and approved."
}
```

`POST /admin/changelog`
```json
{
  "title": "Release 0.1",
  "summary": "Initial backend scaffold.",
  "date": "2026-02-04",
  "tags": ["backend", "api"],
  "links": [
    { "label": "Notes", "url": "https://example.com/notes" }
  ]
}
```
