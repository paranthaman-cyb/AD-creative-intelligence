# Security Guidelines — Ad Creative Intelligence

## 1. Security posture
Treat uploaded CSVs and images as untrusted user input. The MVP should process files locally in the browser wherever practical. Do not transmit creative assets or performance data to external services without explicit user consent and clear disclosure.

## 2. Authentication and authorization
- **MVP:** No authentication if the app is a local single-user demo.
- **If deployed with accounts:** select an authentication provider only after deployment requirements are confirmed.
- Any backend must enforce authorization server-side; hiding a UI control is not authorization.
- A user may access only their own sessions and uploaded data.

## 3. Secrets
- Never hard-code credentials or commit production secrets.
- Use `.env` for local-only configuration and provide `.env.example` with names and safe placeholders.
- Never expose private keys or server credentials in Vite client variables. Client-exposed variables are public.
- Rotate credentials if they are exposed.

## 4. File upload security
- Accept only the documented formats: CSV, JPG/JPEG, PNG, WebP.
- Validate file extension, MIME type where available, size, and parseability; do not trust extension alone.
- Configure and document size limits before release.
- CSV parser must handle quoted delimiters/newlines and malformed rows safely.
- Treat cell contents as data, never as executable HTML or code.
- Avoid injecting CSV values into HTML. Escape content rendered in the UI.
- If backend image processing is added, limit dimensions/pixel count, guard against decompression bombs, and process files in an isolated temporary location.
- Do not execute uploaded files or parse them as code.

## 5. API security (if backend is added)
- Validate request bodies with Pydantic and enforce size/rate limits.
- Restrict CORS to known origins in deployment; do not use wildcard CORS with credentials.
- Use HTTPS in production.
- Separate authentication checks from resource ownership checks.
- Return safe, structured errors without stack traces or file-system paths.
- Apply rate limiting to costly analysis endpoints.

## 6. Data protection and privacy
- Avoid unnecessary persistence.
- Explain what is processed locally versus sent to a server.
- Do not send data to third-party AI or analytics providers by default.
- Provide a reset/clear-session action.
- Define retention and deletion before adding server storage.
- Do not place sensitive row values, file contents, tokens, or user data in logs or error reporting.

## 7. Logging
Never log passwords, API keys, tokens, full CSV rows, raw image contents, or unnecessary personal information.
Log only minimal diagnostic events such as validation failure category, analysis duration, and non-sensitive error codes.

## 8. Security checklist
- [ ] File types and size limits validated.
- [ ] CSV values rendered as text, not HTML.
- [ ] Invalid numeric values and oversized inputs handled.
- [ ] Secrets absent from source control and client bundle.
- [ ] API validation, CORS, ownership checks, and rate limits configured if backend exists.
- [ ] Errors reveal no secrets or stack traces.
- [ ] Uploaded data is not transmitted to unapproved third parties.
- [ ] Dependencies reviewed and updated before deployment.
