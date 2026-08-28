---
name: clean-code-security
description: Use when reviewing or implementing code that could affect security boundaries to apply an OWASP Top 10 checklist to implementation artifacts and flag any vulnerability as BLOCKING.
---

# SKILL: Security (OWASP Top 10)

Security findings are always **BLOCKING**. There is no such thing as a non-blocking security issue in production code.

Citation format: `[SECURITY/<category>] <file>:<line> — <what the vulnerability is and why it is dangerous>`

---

## When Reviewing

Work through each category below for every changed file. You only need to cite a category if a violation is present — silence means clean.

### A01 — Broken Access Control
- Is every endpoint/action gated by an authorization check?
- Are authorization checks enforced server-side, never in client-controlled data (headers, query params, JWTs without verification)?
- Can a user access or modify another user's resources by changing an ID in a request?
- Are directory traversal paths possible via user input (e.g. `../../../etc/passwd`)?

### A02 — Cryptographic Failures
- Is sensitive data (passwords, tokens, PII, secrets) ever logged, stored in plaintext, or included in error messages?
- Are passwords hashed with a memory-hard algorithm (bcrypt, argon2, scrypt)? Never MD5, SHA-1, or unsalted SHA-256.
- Are secrets (API keys, DB passwords) hardcoded in source or config files committed to version control?
- Is HTTPS enforced for all external data transmission? Are self-signed certificates accepted in non-test code?

### A03 — Injection
- Is any user-controlled input concatenated into a SQL query, shell command, XML, LDAP expression, or template string?
- Are parameterized queries / prepared statements used for all database access?
- Is `eval()`, `exec()`, or equivalent used anywhere with externally influenced data?
- Are file paths constructed from user input without sanitization and path canonicalization?

### A04 — Insecure Design
- Does the design assume that clients are trustworthy? (e.g. rate limiting only on the frontend, business rules only enforced in the UI)
- Is there a mechanism to limit authentication attempts (brute-force protection)?
- Are security constraints expressed as enforceable rules in the domain layer, or only as UI/UX guardrails?

### A05 — Security Misconfiguration
- Are default credentials, sample accounts, or debug endpoints present in production code paths?
- Are verbose error messages, stack traces, or internal paths returned to the client?
- Are CORS origins set to `*` in non-public APIs?
- Are unnecessary HTTP methods enabled (e.g. `DELETE`, `PUT` on endpoints that don't need them)?
- Are security headers set (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options)?

### A06 — Vulnerable and Outdated Components
- Are dependencies pinned to specific versions or ranges that include known CVEs?
- Are deprecated APIs or libraries used that have known security advisories?
*(Note: full dependency audit is out of scope for a single code review — flag only what is visible in the changed files.)*

### A07 — Identification and Authentication Failures
- Are session tokens / JWTs validated on every authenticated request (signature, expiry, audience)?
- Are session IDs regenerated after login (session fixation protection)?
- Are passwords subject to a minimum strength requirement?
- Is "remember me" or long-lived token storage implemented securely (HttpOnly, Secure cookies)?
- Are failed authentication attempts logged with enough context to detect brute force?

### A08 — Software and Data Integrity Failures
- Is deserialization of user-controlled data performed without type constraints? (e.g. `pickle.loads`, `unserialize`, `ObjectInputStream`)
- Are integrity checks (HMAC, signature verification) applied to data received from external systems before it is acted upon?

### A09 — Security Logging and Monitoring Failures
- Are security-relevant events logged: authentication success/failure, authorization failures, privilege escalations, input validation failures?
- Are logs structured so they can be parsed by a SIEM or monitoring tool?
- Does any log statement include sensitive data (passwords, tokens, full credit card numbers, PII)?

### A10 — Server-Side Request Forgery (SSRF)
- Does any code fetch a URL derived from user input?
- If yes: is the target URL validated against an allowlist of permitted destinations?
- Is the response from a user-influenced URL ever reflected back to the client without sanitization?

---

## When Writing

Before submitting any implementation that handles external input, authentication, or data persistence, run through this checklist:

- [ ] No user input touches a query, command, path, or template without parameterization or strict allowlist validation
- [ ] No secret, credential, or sensitive value is hardcoded or logged
- [ ] Every state-changing action is authorized server-side, not just client-side
- [ ] Passwords use a memory-hard hash; tokens are validated on every request
- [ ] Error responses reveal no internal paths, stack traces, or system details
- [ ] User-controlled URLs are validated against an allowlist before fetching
- [ ] Deserialized data from external sources is constrained to known-safe types
