# Analysis

Planned charts and features for session analysis. All analysis is **on-demand** — computed
at view time from localStorage data, no precomputation or caching.

CSV export for external tools (R, Python, Excel, etc.) will live in the Analysis view,
distinct from the JSON import/export in Options which is for device transfer and testing.

---

## Single-session views

### Timeline
Horizontal axis = elapsed session time (0 → session duration). Each observation is a
colored dot at its timestamp. Clustering is immediately visible.

### Behavior ring chart
Two-ring chart: outer ring = behavior occurrence counts, inner ring = tag breakdown per
behavior. With the schema capped at 6 behaviors × 4 tags, this is always small and
readable.

### Rollup stats
Summary figures for the session: total duration, total observations, observations/minute
rate, per-behavior counts, longest gap between observations.

---

## Multi-session views

All multi-session views operate over a user-selected range of sessions.

### Aggregate pie
Sum behavior counts across sessions. Trivial extension of the single-session ring chart.

### Aggregate timeline
Normalize sessions to percentage-of-duration (bin into deciles). Plot behavior density
per bin. Opacity or band width encodes how many sessions contribute to each bin — useful
for signalling where sessions diverge in length.

Alternative: normalize to absolute minutes from session start. More intuitive for
fixed-duration walks but breaks down when session lengths vary significantly.
**Decision needed** before implementation.

### Time-of-day breakdown
X axis = hour of day (or 2-hour buckets). Y axis = behavior frequency. Reveals whether
morning vs. evening walks have different behavioral character.

Requires `session.timezone` (IANA string, captured since 2026-03-15). Sessions recorded
before this field was added can be repaired via Options → Dev Tools.

### Time-in-session breakdown
X axis = session decile (0–10%). Y axis = behavior frequency. Answers questions like
"does my dog sniff more at the beginning or end of a walk?".

Same normalization approach as the aggregate timeline.

### Transition / sequence matrix
Counts how often behavior A is directly followed by behavior B across a set of sessions.
Rendered as a heatmap. Surfaces non-obvious behavioral chains (e.g. sustained sniff → mark).

Optional refinement: time-windowed transitions — only count B as following A if it occurs
within a configurable window (e.g. 60 seconds).

No ML required; pure bigram counting over the ordered observations array.

---

## Data notes

- All observations are **point events** (timestamp only, no duration). Analysis reflects
  event frequency and clustering, not time-spent-in-state.
- Behavior and tag identity should be resolved by name (not ID) in any user-facing output,
  requiring a join against the session's schema.
- `session.schemaVersion` records which version of the schema was active at recording time,
  useful for filtering out sessions recorded under an incompatible schema definition.
