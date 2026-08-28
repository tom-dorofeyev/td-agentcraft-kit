---
name: notify
description: Send a notification to the user.
---

# SKILL: Notify

## Purpose

Provide a single mechanism for sending a user-facing notification. This skill does not decide when a notification should be sent or what event triggered it. The caller decides that.

## How to send a notification

`notify.mjs` is in the same directory as this `SKILL.md` file. Find that directory and run:

```bash
node "<path-to-skill-dir>/notify.mjs" "<message>"
```

You already know the path to this skill file because you loaded it — use that to resolve the directory. The script handles delivery internally. If no delivery channel is configured, it exits silently — notifications are optional.

## Usage

- Use this skill whenever the active policy or workflow requires a user notification.
- The caller is responsible for deciding the message content and the moment of delivery.
- This skill is notification-only. It does not define stop conditions, input requirements, permission rules, or workflow state.

Message format: caller-defined.
