# Demo Examination Platform

A client-side, interactive examination/quiz experience built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

It supports multiple exam modes (practice/timed/survival), category & difficulty filters, per-question hints/explanations, bookmarking, achievements, and statistics persisted to `localStorage`.

## Features

- **Exam modes**
  - **Practice**: instant feedback + explanation after each answer
  - **Timed**: overall countdown (defaults to **1 minute per question**) + optional per-question time limits
  - **Survival**: keep going until the first incorrect answer
- **Question experience**: navigation panel, bookmarking, optional hints, optional explanations
- **Progress & gamification**: streak tracking, achievements, score breakdown
- **Statistics dashboard**: history counters and per-category performance (saved in `localStorage`)
- **Theming**: dark mode + accent theme presets
- **Accessible UI primitives**: shadcn/ui built on Radix UI

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 19, shadcn/ui (Radix UI), Tailwind CSS + `tailwindcss-animate`
- **Forms & validation (available)**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: lucide-react
- **Theming**: next-themes (plus app-level dark mode handling)
- **Analytics**: @vercel/analytics
- **Notifications**: sonner

## Getting Started

### Prerequisites

- Node.js (recommend a modern LTS)
- pnpm

### Install

```bash
pnpm install
```

### Run the dev server

```bash
pnpm dev
```

Then open `http://localhost:3000`.

### Build / Start

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## Where Things Live

- `app/page.tsx`: main exam platform UI (tabs, start flow, question flow, results)
- `hooks/use-exam.ts`: core state machine (timers, filters, selection, stats, achievements)
- `lib/exam/data.ts`: **question bank**, themes, achievements, default stats
- `lib/exam/utils.ts`: scoring, achievements checks, timers, sound
- `components/exam/*`: exam UI building blocks
- `components/ui/*`: shadcn/ui components

## Customizing Questions

Questions currently come from `lib/exam/data.ts` via `EXAM_DATA`.

Each question supports:

- `difficulty`: `"easy" | "medium" | "hard"`
- `category`: string (must match the category key/name you want to filter by)
- `points`: scoring weight
- optional `timeLimit` (seconds)
- optional `hint`

Minimal example:

```ts
{
  id: 123,
  question: "What does CSS stand for?",
  options: ["Cascading Style Sheets", "Computer Style System", "Creative Style Syntax", "Colorful Style Sheets"],
  correctAnswer: 0,
  explanation: "CSS stands for Cascading Style Sheets.",
  difficulty: "easy",
  category: "Computer Science",
  points: 10,
  timeLimit: 30,
  hint: "It styles web pages"
}
```

Note: there is also a sample dataset at `data/questions.json`, but it is not currently wired into the app.

## Notes

- `next.config.mjs` is configured with `typescript.ignoreBuildErrors: true`, meaning production builds won’t fail on TypeScript errors. If you want stricter CI/builds, consider turning that off.
- Stats are saved in the browser (`localStorage` key: `examStats`). Bookmarks are currently in-memory only.

## Deployment

This is a standard Next.js app; it deploys cleanly to Vercel and most Node-compatible hosts.

---

If you want, I can also add a “Screenshots” section and update the app metadata (title/description) to match the project name.
