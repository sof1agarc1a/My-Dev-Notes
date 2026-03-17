# Notes App

A full-stack notes application for documenting things I learn as a dev. For me myself and I.

## Stack

| Layer    | Tech                                                           |
| -------- | -------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Backend  | Express 5, TypeScript, Zod (validation + DTOs)                 |
| ORM      | Prisma 7                                                       |
| Database | PostgreSQL 16                                                  |

**Frontend packages**

| Packages                                  | Purpose                                   |
| ----------------------------------------- | ----------------------------------------- |
| `@base-ui/react`, shadcn                  | UI primitives                             |
| Tiptap                                    | Rich text editor                          |
| Lucide React                              | Icons                                     |
| `@hello-pangea/dnd`                       | Drag & drop                               |
| React Hook Form                           | Forms                                     |
| next-themes                               | Dark mode                                 |
| UploadThing + `browser-image-compression` | Image upload with client-side compression |
| highlight.js                              | Syntax highlighting in code blocks        |
| DOMPurify                                 | HTML sanitization                         |

**Dev tooling**

ESLint · Prettier · Lefthook (pre-commit hooks)

**AI**

Vibe-coded with Claude Code. Let's see how much spaghetti code I have to clean up. =)

## Music

Listened to while coding this.

- [Office Odyssey | Source Radio 📡](https://youtu.be/Ol_NpJQA9VU?si=zVZimOZAII3RCs2P&t=355)

- [The Mountain, The Moon Cave and The Sad God](https://youtu.be/ucRulNQsuYQ?si=KxH9YiuoniPI0Z1l)

- [One Ocean Way](https://www.youtube.com/watch?v=jP1_lp_0EEM&list=PLoVkfjDJTISiUAoyI7olMn2wPp4bKsKIU&index=98)

## Setup

### Prerequisites

- Node.js 20+
- Docker

### 1. Database

```bash
docker compose up -d
```

PostgreSQL runs on port `5434` (5432 and 5433 are reserved for other projects).

### 2. Backend

```bash
cd backend
npm install
npm run db:migrate   # creates tables
npm run dev          # starts on http://localhost:3001
```

Copy `.env.example` to `.env` if it doesn't exist and set your `DATABASE_URL`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev          # starts on http://localhost:3000
```

## Scripts

**Backend**

```bash
npm run dev           # development server with hot reload
npm run build         # compile TypeScript
npm run lint          # ESLint
npm run format        # Prettier
npm run db:migrate    # run migrations
npm run db:studio     # open Prisma Studio
```

**Frontend**

```bash
npm run dev           # development server
npm run build         # production build
npm run lint          # ESLint
npm run format        # Prettier
```
