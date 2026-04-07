# Demo Examination Platform

An interactive examination platform built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

Questions are generated through **OpenRouter** and saved to **Supabase** via server API routes.

Live Demo: https://demo-examination-platform.vercel.app/

## Features

- Practice, timed, and survival exam modes
- AI-generated multiple-choice questions (OpenRouter)
- Automatic model retry and fallback on rate limits
- Generated question persistence in Supabase
- Local exam stats and achievements (`localStorage`)
- Dark/light mode with theme-reactive favicon

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: React 19, shadcn/ui, Tailwind CSS
- Icons: lucide-react
- Notifications: sonner
- Storage: Supabase REST API
- LLM Gateway: OpenRouter

## Required Services

- OpenRouter account with an API key
- Supabase project with a table named `generated_questions_rows`

## Getting Started

### Prerequisites

- Node.js (modern LTS recommended)

### Install

```bash
npm install
```

### Environment Setup

Create local env file:

```bash
cp .env.example .env
```

Set these keys in `.env`:

- `OPENROUTER_API_KEY` (required): used by `/api/questions/generate`.
- `OPENROUTER_DEFAULT_MODEL` (optional): backend default model.
- `OPENROUTER_ALLOWED_MODELS` (optional): comma-separated allowlist enforced by backend.
- `SUPABASE_URL` (required): your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` (required): server-only key for writes.
- `APP_URL` (optional): sent to OpenRouter as `HTTP-Referer` (local default: `http://localhost:3000`).

Important:

- Never commit real secrets in `.env`.
- Keep `.env.example` as placeholders only.
- Rotate keys immediately if they were ever committed.

### Supabase Table Setup

Create `generated_questions_rows` in Supabase SQL editor:

```sql
create table if not exists public.generated_questions_rows (
  id bigserial primary key,
  topic text not null,
  difficulty text not null,
  model text not null,
  question text not null,
  options jsonb not null,
  correct_answer integer not null,
  explanation text not null,
  hint text,
  category text not null,
  points integer not null,
  time_limit integer,
  created_at timestamptz not null default now()
);
```

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build and Start

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## API Flow

- `GET /api/config/openrouter`
  - Returns `defaultModel` and `allowedModels` from env configuration.
- `POST /api/questions/generate`
  - Validates requested model against allowlist.
  - Calls OpenRouter Chat Completions.
  - Retries up to 3 times per model on `429`.
  - Falls back to next allowed model when needed.
  - Sanitizes generated questions.
  - Stores rows in Supabase `generated_questions_rows`.

## Project Structure

- `app/page.tsx`: main app shell and exam flow
- `hooks/use-exam.ts`: exam state machine and API calls
- `app/api/config/openrouter/route.ts`: model config endpoint
- `app/api/questions/generate/route.ts`: generation + persistence endpoint
- `components/exam/*`: exam UI components
- `lib/exam/data.ts`: themes, achievements, default stats
- `lib/exam/utils.ts`: scoring and utility helpers

## Deployment Checklist

Before deploying:

- Set all required env vars in your host.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is configured as a server secret only.
- Ensure `generated_questions_rows` exists in Supabase.
- Confirm `APP_URL` matches your deployed domain.

## Troubleshooting

- Hydration mismatch in dev:
  - Stop dev server, delete `.next`, restart, and hard refresh.
- Favicon not updating:
  - Hard refresh (`Ctrl+Shift+R`) or clear browser cache.
- `Server storage is not configured.`:
  - Missing `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY`.
- `Requested model is not allowed by backend configuration.`:
  - Add model to `OPENROUTER_ALLOWED_MODELS` or choose an allowed model.
- `All available models are currently rate-limited.`:
  - Retry after about a minute or use less congested models.

## Notes

- Stats are saved in browser `localStorage` (`examStats`).
- Bookmarks are currently in-memory only.
