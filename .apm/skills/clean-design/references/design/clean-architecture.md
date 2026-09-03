# Clean Architecture

## Rules

### Layer Model
Four layers, dependency always flows **inward**:

```
Infrastructure  →  Application (Use Cases)  →  Domain  →  (nothing)
     ↑ depends on          ↑ depends on           (no outward deps)
```

- **Domain layer**: pure business entities and invariants. Zero framework, ORM, or SDK imports. Testable with plain unit tests — no mocks needed.
- **Application layer (use cases)**: orchestrates domain objects to fulfil one use case. Depends on *interfaces* (ports) defined in this layer. Each use case is one class or function with one public method.
- **Infrastructure layer**: implements the interfaces defined by the application layer. DB repositories, HTTP clients, message brokers, email adapters, SDKs. Easily swappable without touching business logic.
- **Interface layer (controllers, handlers, CLI, jobs)**: thin entry points only. Parse input → call use case → format output. Zero business logic permitted here.

### Dependency Inversion at Boundaries
- Every boundary (persistence, external service, API) is crossed through an **interface defined in the inner layer, implemented in the outer layer**.
- No ORM type, SQL, vendor type, or HTTP model crosses a layer boundary into domain or application code.
- The domain defines `UserRepository` (interface); infrastructure provides `PostgresUserRepository` (implementation).

### The Swap Test
Before approving any design, ask: *can I swap the database for in-memory, or swap the HTTP transport for a CLI interface, by changing only files in the infrastructure/interface layer?* If no, the boundary is not properly drawn.

### Screaming Architecture
Top-level folder structure must reflect **business capabilities**, not technical layers or framework names. A visitor reading the project root should understand what the system *does*, not what language or database it uses.

### Controller / Handler Discipline
Controller methods contain three operations only: parse input, call use case, format output. If any business logic, conditional branching on domain data, or validation rules appear in a controller, extract them to a use case or domain service.

### Persistence Boundary
- Repository interfaces are application-layer types. They accept and return only domain types.
- An `InMemoryRepository` must be trivially writable. If it is complex, the repository interface is too wide.

### API Boundary
- Use-case input/output types are plain domain objects. Controllers map between protocol shapes (HTTP, GraphQL, CLI) and those domain types.
- A protocol change or version bump touches only the controller/adapter layer — zero use-case changes.

### External Service Boundary
Never call third-party SDKs (payment, email, storage, analytics) directly from use cases. Depend on a narrow domain interface; the infrastructure adapter wraps the SDK. Switching vendors = one new adapter file, nothing else.

## When Writing

Before committing any cross-layer code:
1. Does this domain/application file import anything from infrastructure or framework?
2. Does this use case depend on a concrete class or on an interface?
3. Is this controller doing anything beyond parse → call → format?
4. Could I write an `InMemoryRepository` in under 20 lines from the current interface?
5. Do my top-level folders reflect business capabilities, not technical constructs?

Fix any "no" before committing.

## When Reviewing

Flag any code that:
- Has domain or application code importing a framework, ORM, SDK, or infrastructure type
- Has a use case that instantiates a concrete infrastructure class directly (e.g., `new PostgresUserRepository()`)
- Has a controller method containing business logic, loops over domain data, or domain-level conditionals
- Has a repository interface that accepts or returns ORM entities or raw query types
- Has infrastructure-layer types bleeding into domain models or use-case signatures
- Has a folder structure named after technical constructs (`controllers/`, `repositories/`, `services/`) as the top-level entry points rather than business capabilities

Cite: `[LAYER BOUNDARY] <file>:<line or class name> — <which layer is violated, what is bleeding where>`
