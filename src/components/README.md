# Components

Reusable UI components for Ethoscope.

## Conventions

1. **This is where reusable components live.** If a component is used in more than one place, or is likely to be, it belongs here rather than co-located with a view.

2. **Prefer shadcn/ui as the base layer.** Reusable components should be composed from shadcn primitives (`src/components/ui/`) or other reusable components in this directory. This keeps styling consistent and leverages the design system.

3. **Build custom only when genuinely necessary.** If shadcn doesn't cover a use case — a highly domain-specific control, a layout primitive, or something that would require significant overriding — a custom component is appropriate. Document why at the top of the file.

## Structure

```
src/components/
├── ui/            # shadcn/ui primitives (Button, Input, etc.) — do not edit directly
├── Screen/        # App-level screen template (layout primitive, custom — see CLAUDE.md)
└── ...            # Composed reusable components go here
```

## Adding shadcn components

```sh
npx shadcn@latest add <component-name>
```

Components are added to `src/components/ui/` and can be imported via `@/components/ui/<name>`.
