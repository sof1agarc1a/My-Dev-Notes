# Project Rules

## Code Style

- **Indentation**: 2 spaces everywhere (TS, TSX, CSS)
- **Quotes**: single quotes in TS/TSX, double quotes in JSX attributes
- **Semicolons**: none (the project uses no-semicolon style)
- **Braces**: always use curly braces for `if` statements — never inline, even for a single return or empty body

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

Exception: use a raw `<label>` or `<select>` when no component exists for it.

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
