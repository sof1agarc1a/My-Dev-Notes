# Notes App

A full-stack notes application for documenting things you learn. Posts are composed of a title and ordered sections, each with a headline and content.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI |
| Backend | Express 5, TypeScript, Zod (validation + DTOs) |
| ORM | Prisma 7 |
| Database | PostgreSQL 16 |
| DnD | @hello-pangea/dnd 

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

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts` | List all posts |
| POST | `/api/posts` | Create post |
| GET | `/api/posts/:id` | Get post with sections |
| PUT | `/api/posts/:id` | Update post title |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/sections` | Add section |
| PUT | `/api/posts/:id/sections/:sectionId` | Update section |
| DELETE | `/api/posts/:id/sections/:sectionId` | Delete section |
| PUT | `/api/posts/:id/sections/reorder` | Reorder sections |

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
