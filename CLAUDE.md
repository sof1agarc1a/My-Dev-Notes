# Project Rules

## Code Style

- **Indentation**: 2 spaces everywhere (TS, TSX, CSS)
- **Quotes**: single quotes in TS/TSX, double quotes in JSX attributes
- **Semicolons**: none (the project uses no-semicolon style)
- **Braces**: always use curly braces for `if` statements — never inline, even for a single return or empty body
- **Naming**: Don't name any variables with only one letter, like sections to s. Use section as naming instead, whole words to make it readable. Exception: use `e` for event parameters (e.g. `(e: React.ChangeEvent<...>) => ...`).
- **Functions**: Extract inline JSX functions to named `const` declarations above the return statement **only when they contain logic** (if statements, conditions, multiple statements). Simple one-liner setters like `onChange={(e) => setName(e.target.value)}` are fine to keep inline.
- **JSX expressions**: Keep simple data display inline — fallbacks like `{text || 'default'}` or `{value ?? 'placeholder'}` are fine in JSX. Extract to a named `const` only when the expression involves real logic (function calls, chained lookups, ternaries with computation). `className` strings (including conditional Tailwind via template literals or `cn()`) always stay inline.

```tsx
// Fine inline — simple fallback
<span>{selectedGroupName ?? 'Select group'}</span>

// Extract — complex lookup logic
const selectedGroupName = groupId !== null ? groups.find((g) => g.id === groupId)?.name ?? null : null
<span>{selectedGroupName ?? 'Select group'}</span>
```

```ts
// Bad
if (!post) return
if (!post) { return }

// Good
if (!post) {
  return
}
```

## Frontend — Component Rules

### Always use the component library
Never use raw HTML elements when a component exists for it:
- Text → `<Text as="p|span" size="xs|sm|md|lg" />` from `@/components/typography/Text`
- Headings → `<Heading as="h1-h6" size="xs|sm|md|lg|xl" />` from `@/components/typography/Heading`
- Buttons → `<Button variant="default|outline|secondary|ghost|destructive|link" size="xs|sm|default|lg|icon|..." />` from `@/components/ui/button`
- Inputs → `<Input />` from `@/components/ui/input`
- Textareas → `<Textarea />` from `@/components/ui/textarea`
- Cards → `<Card>`, `<CardHeader>`, `<CardContent>` from `@/components/ui/card`
- Dividers → `<Separator />` from `@/components/ui/separator`
- Selects → `<Select>`, `<SelectTrigger>`, `<SelectValue>`, `<SelectContent>`, `<SelectItem>` from `@/components/ui/select`

This rule applies **everywhere** — including small helper/utility components, toolbar buttons, icon wrappers, etc. Do not use raw `<button>`, `<p>`, `<h1>`–`<h6>`, `<input>`, `<textarea>`, or `<select>` anywhere in the codebase when the component library covers it.

Exception: use a raw `<label>` when no component exists for it.

### Tailwind
- Use Tailwind utility classes only — no inline styles
- Use `cn()` from `@/lib/utils` for conditional classes
- Prefer existing CSS variables (`text-sidebar-foreground`, `bg-sidebar`, etc.) over hardcoded colors
- Use rgb or hex values only when matching the existing design colors

### Next.js (App Router)
- Page components are `async` server components by default
- `params` must be typed as `Promise<{ ... }>` and awaited (Next.js 15)
- Use `force-dynamic` export when the page fetches data that should not be cached
- Client components get `'use client'` at the top

## Backend — Rules

- Use Zod DTOs for all request body validation via the `validate` middleware
- Always use `AppError` for known error cases (not raw `res.status(...)`)
- Controllers follow the pattern: validate → find existing → operate → respond
- All Prisma queries go through `prisma` from `../lib/prisma`

## Stack Reference

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS v4 |
| UI primitives | Base UI (`@base-ui/react`) |
| Backend | Express, TypeScript |
| ORM | Prisma + PostgreSQL |
| Validation | Zod |
| Icons | Lucide React |
| Drag & drop | @hello-pangea/dnd |
