---
name: test-plan
description: Defines a structured process for creating thorough, traceable test plans for features and artifacts.
---

# SKILL: Test Plan

## Purpose & Scope
Aims to systematize the creation of robust, detailed, and clear test plans for every meaningful artifact. Guarantees that every requirement, design, or implementation can be objectively and reliably validated.

## Application
- The Team Leader or implementing engineer starts a test plan before code/implementation for each new spec/design/feature.
- Test artifacts follow a structured format: what is tested, methodology, expected outcome, edge/negative cases.
- Test owners and approval history are tracked.

## Major Capabilities
- Template includes: Feature/area, test types (unit/integration/E2E/manual), acceptance criteria, edge cases, negative testing.
- Provides examples for different software layers (API, UI, data, background tasks).
- Linked to requirement/design artifact.

## Robustness Protocols
- Updates to test plans require versioning/history.
- Every deployed feature requires Team Leader sign-off linked to the recorded verification plan.

## Example Test Plan Structure
```
Feature: Password reset
Test Types: Unit (token validation), Integration (email sent, DB update), E2E (user journey)
Acceptance Criteria: Token is single-use, expires in 1hr, delivers email, disables old token
Edge Cases: Expired token, reused token, invalid input
Negative Testing: Brute-force token attempts, missing/incorrect email
```
