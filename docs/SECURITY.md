# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.1.x | ✅ |
| 1.0.x | ❌ |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities via GitHub Issues.**

Instead, email the team at: `security@arclight-ai.example.com`

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your contact information (optional)

We will acknowledge within 48 hours and aim to remediate within 14 days.

## Security Practices

### Backend
- File type validation (content-type whitelist: JPG, PNG, JPEG)
- Maximum 10 files per request (DoS prevention)
- No file storage — stateless inference only
- No PII collected or stored
- CORS configured (restrict `allow_origins` in production)

### Frontend
- No API keys exposed in client code
- Environment variables via Vite `.env` (not committed)
- Content Security Policy recommended for production

### Model Security
- Model weights loaded once at startup (no dynamic loading)
- Input tensor shape validated before inference
- No model extraction endpoint

## Known Limitations
- CORS is set to `*` in development — must be restricted before production deployment
- No rate limiting implemented — add via FastAPI middleware or API gateway in production
- No authentication — add JWT or API key authentication for production
