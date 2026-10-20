# Security (OWASP Top 10:2025)

Aligned with the [OWASP Top 10:2025](https://owasp.org/Top10/2025/), the latest released web application edition. Verified 2026-10-20. Category IDs below refer to this edition.

Report security findings encountered in the review even when unrelated to the change. Apply the shared engineering-workflow scope policy: introduced or worsened vulnerabilities and necessary task blockers are blocking; unrelated baseline issues stay visible without automatic remediation. Never mark a baseline failure as passing.

Citation format: `[SECURITY/<category>] <file>:<line> — <what the vulnerability is and why it is dangerous>`

---

## When Reviewing

Work through each category below for every changed file. You only need to cite a category if a violation is present — silence means clean.

### A01 — Broken Access Control
- Is every endpoint/action gated by an authorization check?
- Are authorization checks enforced server-side, never in client-controlled data (headers, query params, JWTs without verification)?
- Can a user access or modify another user's resources by changing an ID in a request?
- Are directory traversal paths possible via user input (e.g. `../../../etc/passwd`)?
- For server-side requests to user-controlled URLs, are schemes and destinations allowlisted, including resolved IP addresses and each redirect target, to prevent SSRF and access to internal services or cloud metadata?

### A02 — Security Misconfiguration
- Are default credentials, sample accounts, or debug endpoints present in production code paths?
- Are verbose error messages, stack traces, or internal paths returned to the client?
- Are CORS origins restricted to trusted origins for non-public APIs?
- Are unnecessary HTTP methods enabled (e.g. `DELETE`, `PUT` on endpoints that don't need them)?
- Are security headers set (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options)?

### A03 — Software Supply Chain Failures
- Do dependencies have known vulnerabilities or lack security support?
- Are dependency sources trusted, resolved versions locked where supported, and updates reviewed rather than blindly accepted?
- Are build pipelines and package publishing protected against unauthorized changes, untrusted pull-request code accessing secrets, and excessive token permissions?
- Are build dependencies and distributed artifacts verified using trusted provenance, signatures, or integrity metadata where available?
*(Review visible dependency, build, and distribution changes; this checklist does not replace a full dependency or supply-chain audit.)*

### A04 — Cryptographic Failures
- Is sensitive data (passwords, tokens, PII, secrets) ever logged, stored in plaintext, or included in error messages?
- Are passwords hashed with Argon2id or scrypt (or an appropriate alternative for legacy/compliance constraints, such as bcrypt or PBKDF2), with unique salts and suitable work factors? Never MD5, SHA-1, or plain SHA-256.
- Are secrets (API keys, DB passwords) hardcoded in source or config files committed to version control?
- Is TLS enforced for sensitive data in transit, with certificate chain and hostname validation against trusted authorities?

### A05 — Injection
- Is any user-controlled input concatenated into a SQL query, shell command, XML, LDAP expression, or template string?
- Are parameterized queries / prepared statements used for all database access?
- Is `eval()`, `exec()`, or equivalent used anywhere with externally influenced data?
- Are file paths constructed from user input without sanitization and path canonicalization?
- Is untrusted output contextually encoded, and is user-supplied HTML sanitized to prevent cross-site scripting (XSS)?

### A06 — Insecure Design
- Does the design assume that clients are trustworthy? (e.g. rate limiting only on the frontend, business rules only enforced in the UI)
- Is there a mechanism to limit authentication attempts (brute-force protection)?
- Are security constraints expressed as enforceable rules in the domain layer, or only as UI/UX guardrails?

### A07 — Authentication Failures
- Are session tokens / JWTs validated on every authenticated request (signature, expiry, audience)?
- Are session IDs regenerated after login (session fixation protection)?
- Are passwords subject to a minimum strength requirement?
- Is "remember me" or long-lived token storage implemented securely (HttpOnly, Secure cookies)?
- Are failed authentication attempts logged with enough context to detect brute force?

### A08 — Software or Data Integrity Failures
- Is deserialization of user-controlled data performed without type constraints? (e.g. `pickle.loads`, `unserialize`, `ObjectInputStream`)
- Are integrity checks (HMAC, signature verification) applied to data received from external systems before it is acted upon?

### A09 — Security Logging and Alerting Failures
- Are security-relevant events logged: authentication success/failure, authorization failures, privilege escalations, input validation failures?
- Are logs structured so they can be parsed by a SIEM or monitoring tool?
- Does any log statement include sensitive data (passwords, tokens, full credit card numbers, PII)?
- Do suspicious events trigger actionable alerts to responsible responders, and are alert delivery and response paths tested?

### A10 — Mishandling of Exceptional Conditions
- Do errors, timeouts, and dependency failures fail closed rather than bypass authentication, authorization, or validation?
- Are exceptions handled without silently ignoring failures or leaving partial writes and inconsistent state?
- Are transactions rolled back and resources released on every failure path?
- Are input sizes, resource consumption, retries, and execution time bounded to prevent exhaustion under abnormal conditions?
- Are failure paths tested, including unavailable dependencies and malformed or unexpected input?

---

## When Writing

Before submitting any implementation that handles external input, authentication, or data persistence, run through this checklist:

- [ ] No user input touches a query, command, path, or template without parameterization or strict allowlist validation
- [ ] No secret, credential, or sensitive value is hardcoded or logged
- [ ] Every state-changing action is authorized server-side, not just client-side
- [ ] Passwords use a suitable salted password hash and work factor; tokens are validated on every authenticated request
- [ ] Error responses reveal no internal paths, stack traces, or system details
- [ ] User-controlled URLs, resolved addresses, and redirects are validated against permitted destinations before fetching
- [ ] Deserialized data from external sources is constrained to known-safe types
- [ ] Dependency and build changes preserve trusted sources, artifact integrity, and least-privilege pipeline access
- [ ] Security-relevant events produce safe logs and actionable alerts
- [ ] Failure paths fail closed, preserve consistent state, and bound resource use
