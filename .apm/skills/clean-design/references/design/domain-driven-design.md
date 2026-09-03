# Domain-Driven Design

## Strategic Design

### Bounded Contexts
Every model lives inside a bounded context — a boundary where a model has a single, unambiguous meaning. The same word can mean different things in different contexts. Define explicit context boundaries. Never share a model across contexts — translate.

### Ubiquitous Language
Within a bounded context, use the exact same terms in code, conversation, and docs as the domain experts use. If a term is ambiguous, the context boundary is wrong. Rename code to match the language — never let the language drift from the code.

### Core Domain
Identify what differentiates the business. Invest the best effort in the core domain. Outsource or buy generic subdomains (e.g., auth, billing, notifications). Supporting subdomains are necessary but not differentiating — build them adequately, don't over-invest.

### Context Mapping
Explicitly declare relationships between bounded contexts:

| Relationship | When |
|---|---|
| **Partnership** | Two teams cooperate, align on interfaces |
| **Shared Kernel** | Share a small, stable subset of the model |
| **Customer-Supplier** | Upstream dictates; downstream negotiates |
| **Conformist** | Downstream accepts upstream model as-is |
| **Anti-Corruption Layer** | Downstream translates upstream model to protect its own context |
| **Open Host Service** | Upstream exposes a protocol for all integrators |
| **Published Language** | Shared language for integration (e.g., standard schemas) |
| **Separate Ways** | No integration — cheaper to duplicate |

## Tactical Design

### Entities
Objects defined by identity — not attributes. Identity persists through state changes. Equality by ID alone. Keep entities focused on identity and lifecycle.

### Value Objects
Objects defined by attributes — no identity. Immutable. Equality by all attributes. Replace, never mutate. Push behavior into value objects — they're the workhorses of the domain.

### Aggregates
A cluster of entities and value objects treated as a single unit. One entity is the aggregate root — the only entry point. External objects reference the root only, never nested entities. Invariants span the aggregate boundary; consistency is transactional within the aggregate, eventual across aggregates. Small aggregates are better — design for transactional boundaries, not object graphs.

### Repositories
Retrieve and persist aggregates. Act like an in-memory collection — client code never sees persistence mechanics. One repository per aggregate root only. Never expose query methods that leak aggregate internals.

### Domain Services
Stateless operations that don't naturally belong to an entity or value object. Used when the operation spans multiple aggregates or the concept is fundamentally a process, not a thing. Keep them focused — if a service grows, a missing domain concept is hiding.

### Domain Events
Something important happened in the domain. Named in past tense (`OrderPlaced`, `PaymentReceived`). Immutable. Capture what happened, not how to react. Use for cross-aggregate and cross-context communication.

### Factories
Encapsulate complex creation logic for aggregates or entities. The factory's output must satisfy all invariants — never allow partially-constructed objects to escape. Simple construction stays in constructors; factories are for the complex cases only.

### Anti-Corruption Layer
Isolate your bounded context from external/legacy models. Translate foreign concepts into your ubiquitous language at the boundary. The ACL is a one-way filter — protect your context, don't fix theirs.

## When Designing

Before finalizing any module or boundary design:
1. What bounded context does this model belong to?
2. Is the ubiquitous language consistent between code and domain conversation?
3. Is this the core domain, a supporting subdomain, or generic?
4. What is the context map relationship with each adjacent context?
5. Is every object classified as entity, value object, or aggregate — with clear rationale?
6. Are aggregates sized for transactional consistency, not object modelling convenience?
7. Does every cross-context interaction pass through an explicit boundary (ACL, OHS, published language)?

Fix any "no" before finalizing.

## When Reviewing

Flag any design or code that:
- Blurs context boundaries — same class serving two meanings
- Uses different terms for the same concept or same term for different concepts within a context
- Exposes aggregate internals (direct references to non-root entities)
- Has entities with setters for every property — anemic domain model
- Has value objects that are mutable
- Has repositories that leak persistence concerns (query languages, ORM types)
- Calls external systems directly from aggregates or domain services without an ACL
- Treats generic subdomains as core domain (over-engineering)

Cite: `[DDD] <file>:<line> — <which principle violated, why>`
