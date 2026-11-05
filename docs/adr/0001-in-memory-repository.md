# ADR-0001: In-memory repository behind an interface

**Status:** Accepted · 2026-09

**Context.** We need to iterate on the triage UX before the data platform team provisions Postgres.

**Decision.** Implement `TicketRepository` in memory with deterministic seed data. Services depend only on the interface.

**Consequences.** Fast tests and reproducible demos. Swapping to Postgres touches one file per module. Data resets on restart.
