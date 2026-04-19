# Flowmind

## Overview

Flowmind is an AI-first productivity workspace — a sidegrade to Notion/Obsidian with built-in prioritization and focus control. Users write notes (meetings, ideas, planning) and the AI extracts tasks, finds deadlines, prioritizes work, and suggests next actions. Includes a focus layer (browser extension concept) that blocks distracting websites during focus sessions.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifact: `flowmind`, previewPath: `/`)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **AI**: OpenAI via Replit AI Integrations (gpt-5-mini for note analysis and action planning)
- **Build**: esbuild (CJS bundle)

## Architecture

```
artifacts/
  flowmind/        # React + Vite frontend (previewPath: /)
  api-server/      # Express 5 backend (previewPath: /api)
lib/
  db/              # PostgreSQL schema (notes, tasks, focus_sessions, blocked_sites)
  api-spec/        # OpenAPI spec → codegen
  api-client-react/# Generated React Query hooks
  api-zod/         # Generated Zod validators
  integrations-openai-ai-server/  # OpenAI integration
```

## Features

### Notes
- Write and store notes with type classification (general, meeting, idea, planning)
- Tag support and search/filter
- AI analysis: extract tasks, key insights, suggested next actions

### Tasks
- Full CRUD with status (todo/in_progress/done) and priority (critical/high/medium/low)
- Tasks can be AI-generated from note analysis or manually created
- Linked back to source notes

### Focus Sessions
- Start timed focus sessions with a goal
- Configure blocked sites per session
- Session history with completion tracking

### Dashboard
- AI-generated action plan using OpenAI (top priorities + insights)
- Productivity summary stats
- Recent activity feed

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/flowmind run dev` — run frontend locally

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI API proxy base URL (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI API key (auto-provisioned)
- `SESSION_SECRET` — Session secret

## DB Schema Tables

- `notes` — user notes with type, tags, content, analyzed_at
- `tasks` — tasks with status, priority, due_date, linked note, ai_generated flag
- `focus_sessions` — timed focus sessions with goal, duration, blocked_sites, status
- `blocked_sites` — site patterns to block during focus sessions

## OpenAPI Notes

The api-zod index.ts is auto-corrected after codegen runs to avoid duplicate exports:
```
pnpm --filter @workspace/api-spec run codegen
```
This runs orval, then overwrites `lib/api-zod/src/index.ts` to export only from `./generated/api`.
