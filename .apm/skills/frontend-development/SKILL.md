---
name: frontend-development
description: Use when designing, implementing, refactoring, or reviewing JavaScript or TypeScript frontend features, including React, Vue, and Angular applications.
---

# Frontend Development

## Mental model

Use MVC as a separation-of-responsibilities guide, not as a demand for framework-specific MVC classes. Components, templates, hooks, composables, and framework controllers are the UI/controller boundary: they render state, capture user intent, coordinate UI state, and invoke services. Hooks are UI code too; moving business logic into a hook does not move it out of the UI.

The usual flow is:

```text
form → UI or state-management update → service → data manipulation and/or API
```

Services return results or errors to the caller, which updates presentation state. A state update is optional; do not add a store or indirection for a simple interaction.

## Responsibilities

- Keep rendering, event handling, form state, presentation-only validation, loading and error display, and framework lifecycle coordination in the UI. Keep components and hooks thin; delegate business decisions, domain validation, data transformations, and API orchestration to services or domain functions.
- Keep state where it is needed: local component state for local concerns, a hook or composable for reusable UI coordination, and shared state management only when multiple consumers need it. Stores coordinate state; they are not a substitute for a service layer.
- Put reusable business behavior in framework-independent services or pure functions. Isolate transport details in an API client or adapter when warranted; do not create layers for their own sake. Preserve the project's established boundaries unless the task calls for changing them.
- Model domain data and service contracts independently of framework components. Validate untrusted API and user input at the appropriate boundary; client-side validation does not replace server-side validation or authorization.
- Handle asynchronous loading, failures, cancellation or stale responses where relevant, and cleanup in the UI lifecycle. Do not hide service errors or let obsolete responses overwrite newer state.

## Dependencies in JavaScript and TypeScript

- Apply dependency inversion and interface segregation: express the small capabilities a consumer needs as contracts, and keep business behavior independent of framework and transport details. In TypeScript, structural types or interfaces can express these contracts; in JavaScript, use clear module contracts. Introduce abstractions for real boundaries or variation, not every function.
- Prefer importing a concrete, contract-conforming service instance or module at the composition boundary over introducing a dependency-injection container. Mock or replace imports in tests when the tooling supports it. Use explicit injection when it makes a real boundary, configuration, lifecycle, or test materially simpler; module mocking is not universal.
- Do not add a singleton class merely to get one shared instance: module imports are normally shared within a module registry. This is not a guarantee of one instance across server requests, workers, bundles, or test registries. Avoid shared mutable user or request state in module-level instances, especially with server-side rendering; create scoped instances when isolation is needed.

## Verification

- Test business rules and transformations directly without rendering a framework component. Test UI behavior through user-visible interactions, including loading and error states, while controlling service or API boundaries as appropriate.
- Check that business rules are not duplicated in components, hooks, stores, or API adapters; verify that the service remains usable without a UI framework. Apply the relevant [clean-design](../clean-design/SKILL.md) references and the project's existing quality gates.
