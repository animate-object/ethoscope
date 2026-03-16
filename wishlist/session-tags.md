# Session Tags

## Summary

A lightweight mechanism for attaching contextual labels to a session, primarily to support post-hoc filtering in analysis (e.g. exclude sessions where it was snowing, or where the dog was in an unusual mood).

Note: time-of-day and day-of-week filtering are already covered by the session's start timestamp.

## Design

- Tags are **scoped to the schema**, not global — encourages reuse within a context without polluting other schemas.
- Tags are **defined in advance** on the schema, but new ones can be created at session end and are immediately added to the schema's tag set (sticky).
- End-of-session flow: present existing tags as quick-tap chips + small input to define a new one.
- Schema editing screen would surface the tag set for management, though this can come after the session-end flow since tags are addable inline.

## Naming note

Behavior sub-categories are already called "tags" — use distinct terminology here to avoid confusion. Candidates: **session labels**, **session context**.

## Data model sketch

Session record gains an optional field, e.g. `labels: string[]`. The schema record gains a corresponding `sessionLabels: string[]` to store the known set.

## Why deferred

Nice-to-have. The core observation model is clean without it and the filtering use case isn't critical for v1. Can be layered on later without touching existing data structures in a breaking way.
