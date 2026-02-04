# Deploy Checklist (CmLayer)

## 1. Backend environment
- `ADMIN_TOKEN` set and stored securely.
- `CORS_ORIGIN` set to your site domain(s) or `*` during testing.
- `DATA_DIR` points to the repo `data/` directory on the server.
- `PORT` and `HOST` configured for the platform.

## 2. Data files
- `data/content/projects.json` populated.
- `data/content/services.json` populated.
- `data/content/knowledge.json` populated.
- `data/content/changelog.json` updated with latest release.
- `data/i18n/en.json` + `data/i18n/es.json` present.

## 3. Frontend API base
- If backend is same domain and path `/api`, keep:
  - `assets/js/config.js` -> `window.CMLAYER_API_BASE = "";`
- If backend is a different domain, set:
  - `window.CMLAYER_API_BASE = "https://api.your-domain.com";`

## 4. Endpoint smoke tests
Run after deploy (replace domain):

```
curl -s https://your-domain.com/api/health
curl -s https://your-domain.com/api/status
curl -s https://your-domain.com/api/projects
curl -s https://your-domain.com/api/services
curl -s https://your-domain.com/api/knowledge
curl -s https://your-domain.com/api/i18n/en
```

Feedback test:
```
curl -s -X POST https://your-domain.com/api/feedback \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","message":"Test feedback","consent":true,"source":"deploy"}'
```

Admin check (replace token):
```
curl -s https://your-domain.com/admin/feedback -H 'x-admin-token: YOUR_TOKEN'
```

## 5. UI verification
- `/projects/` shows cards from JSON.
- `/services/` renders service cards from JSON.
- `/knowledge-hub/` renders library from JSON.
- `/voices-experiences/` shows health + latest release (Status block).
- Language toggle loads from `/api/i18n/:lang`.
- Feedback form sends and shows success message.

## 6. Logging
- Confirm `data/audit/audit-log.jsonl` is writing entries.
