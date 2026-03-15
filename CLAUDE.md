# Ethoscope — Engineering Notes

## Screen layout

**First principle: navigation at the top, actions at the bottom.**

Every non-root screen uses the `Screen` component (`src/components/Screen/`) as its
outermost element. It provides three zones:

| Zone | Content | Implementation |
|------|---------|----------------|
| Header (top) | Screen title + optional back button | Always visible, never scrolls |
| Content (middle) | Primary screen content | Scrollable, fills available space |
| Action bar (bottom) | Primary screen-level actions (e.g. Save) | Always visible, never scrolls; omit if no actions |

**Rationale:** On mobile, thumbs reach the bottom of the screen naturally. Navigation
and location context belong at the top where they orient the user. Destructive or
committing actions belong at the bottom where they require intentional reach.

### Usage

```tsx
// Screen with a back button and a primary action
<Screen title="Schema Name" backTo="/" actions={<button>Save</button>}>
  {/* content */}
</Screen>

// Root screen — no back button, no actions
<Screen title="Ethoscope">
  {/* content */}
</Screen>
```

`actions` accepts any ReactNode. The action bar renders only when `actions` is
provided. Full-width single buttons are the default pattern for primary actions.

---

## Timestamps

All timestamps are ISO 8601 strings in UTC unless explicitly noted otherwise.
The global type `ISODateString` (see `src/global.d.ts`) is used to brand these values.
