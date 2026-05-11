---
name: clean-code-solid
description: The five SOLID principles applied to all code — functions, classes, modules, and systems. SOLID is not class-level design only; it governs every unit of code at every scale.
---

# SKILL: SOLID Principles

SOLID principles apply at every scale — a function, a class, a module, a service. The same question asked of a 10-line function and a 10-service system: does each unit have one reason to change? Can you add behaviour without editing existing code? Are dependencies on abstractions, not concretions?

---

## S — Single Responsibility Principle

**"A module should have one, and only one, reason to change."**

A *reason to change* is a person or role whose requirements drive the behaviour. A class that satisfies both the billing team and the report team has two reasons to change.

- At function level: a function that validates input *and* persists the result has two responsibilities — split it.
- At class level: if "and" is needed to describe what the class does, it does too much.
- At module/service level: if two distinct business capabilities share the same deployment unit, draw a boundary.

Symptom: a file is edited frequently for unrelated reasons.

---

## O — Open/Closed Principle

**"Software entities should be open for extension, closed for modification."**

Adding new behaviour should be possible by *writing new code*, not by editing working code. Existing logic, once tested and shipped, should be a stable platform to extend from.

- Design extension points: interfaces, abstract types, strategy objects, hooks.
- An `if/else` or `switch` chain inside existing logic that grows every time a new variant is added is a violation — replace with polymorphism.
- Applies to functions too: a function with a `type` or `mode` parameter that changes execution path should be two functions, or should delegate to a strategy.

Symptom: adding a new case requires editing every caller or conditional chain.

---

## L — Liskov Substitution Principle

**"Derived classes must be substitutable for their base classes."**

Any code that works correctly with a base type must work correctly with any subtype — without knowing or caring which concrete type it received.

- Never override a method to throw `NotImplementedException` or to silently no-op it. If a subtype cannot honour the full contract, the inheritance hierarchy is wrong.
- Strengthen postconditions (do at least what the parent promised), never weaken them.
- Never require preconditions narrower than what the parent accepts.
- If substituting a subtype breaks a caller, the hierarchy needs to be redesigned — use composition instead.

Symptom: callers type-check with `instanceof` before using a subtype.

---

## I — Interface Segregation Principle

**"Clients should not be forced to depend on interfaces they do not use."**

A fat interface forces every implementor to provide methods it may not need, and forces every caller to know about operations it will never call.

- Split interfaces by the distinct roles that consume them. A `UserRepository` used by the auth flow and the admin reporting flow should not share the same interface if their needs differ.
- Many narrow, focused interfaces beat one wide general-purpose one.
- Applies to function signatures too: a function that accepts a large object when it only uses one field has an interface segregation smell — pass the field.

Symptom: a class implements an interface but leaves several methods as stubs or empty bodies.

---

## D — Dependency Inversion Principle

**"High-level modules should not depend on low-level modules. Both should depend on abstractions."**

Business logic is the most valuable and least-changing part of a system. It must not be held hostage to infrastructure details like databases, HTTP clients, or third-party SDKs.

- High-level policy (use cases, domain rules) defines *interfaces* (ports) that express what it needs.
- Infrastructure code *implements* those interfaces. The arrow of dependency points toward the domain, always.
- Never instantiate a concrete infrastructure type (`new PostgresRepository()`, `new StripeClient()`) inside business logic. Inject it.
- Applies at every scale: a function that calls `Date.now()` directly is coupled to the system clock — inject a clock abstraction.

Symptom: a unit test for business logic requires a real database, HTTP server, or file system.

---

## When Writing

Before committing any unit of code, run through the five checks:

| Check | Question |
|---|---|
| **SRP** | Does this unit have exactly one reason to change? |
| **OCP** | Can I add a new variant or case without editing this code? |
| **LSP** | If this type is subclassed, can every subclass be dropped in without callers noticing? |
| **ISP** | Does every consumer of this interface/API use everything it exposes? |
| **DIP** | Does this unit depend on a concrete infrastructure type — database, clock, HTTP, SDK? |

Any "no" is a design problem to fix before the code is submitted.

---

## When Reviewing

Flag violations with the principle name and the concrete problem:

- **SRP**: `[SOLID/SRP] <file>:<line or class> — has two responsibilities: <A> and <B>. Separate by <suggested boundary>.`
- **OCP**: `[SOLID/OCP] <file>:<line> — adding a new case requires editing this existing if/else chain. Extract a <strategy/interface>.`
- **LSP**: `[SOLID/LSP] <file>:<line> — <Subtype> throws NotImplemented / weakens contract of <Base>. Use composition or redesign the hierarchy.`
- **ISP**: `[SOLID/ISP] <file>:<line> — <Consumer> only uses <X> of the interface but depends on the full contract. Split the interface.`
- **DIP**: `[SOLID/DIP] <file>:<line> — <BusinessClass> directly instantiates <ConcreteInfrastructure>. Depend on an interface; inject the implementation.`

Do not produce vague findings like "possible SRP issue". Every finding names the two distinct responsibilities or the concrete dependency that should be inverted.
