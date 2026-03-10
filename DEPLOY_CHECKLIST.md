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

## 4. Analytics config
- In `assets/js/config.js`, set:
  - `window.CMLAYER_ANALYTICS.provider = "ga4"`
  - `window.CMLAYER_ANALYTICS.ga4.measurementId = "G-XXXXXXXXXX"`
- If using Plausible, set `provider = "plausible"` and `plausible.domain`.

## 5. Endpoint smoke tests
Run after deploy (replace domain):

```
curl -s https://your-domain.com/api/health
curl -s https://your-domain.com/api/status
curl -s https://your-domain.com/api/projects
curl -s https://your-domain.com/api/services
curl -s https://your-domain.com/api/knowledge
curl -s https://your-domain.com/api/i18n/en
curl -s https://your-domain.com/api/voices
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

## 6. UI verification
- `/projects/` shows cards from JSON.
- `/services/`, `/about/`, `/knowledge/`, `/contact/` show hero + beige base section.
- `/knowledge/` renders the module infrastructure correctly.
- `/changelog/` shows release history.
- Language toggle loads from `/api/i18n/:lang`.
- Feedback form sends and shows success message.
- Home contact form sends and shows success message.

## 7. SEO & indexing
- `robots.txt` reachable.
- `sitemap.xml` reachable and valid.
- Canonical tags present on all pages.
- Submit sitemap to Google Search Console.

## 8. Analytics
- GA4 loads and shows page_view + CTA events.
- Track `cta_click`, `outbound_click`, `form_submit`, `form_success`, `form_error`.

## 9. Logging
- Confirm `data/audit/audit-log.jsonl` is writing entries.
