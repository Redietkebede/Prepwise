import { NextRequest, NextResponse } from "next/server"
import type { Question } from "@/lib/exam/types"

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

interface GeneratePayload {
  prompt?: string
  count?: number
  difficulty?: string
  model?: string
}

interface OpenRouterErrorBody {
  error?: {
    message?: string
    code?: number | string
    metadata?: {
      raw?: string
    }
  }
}

const MAX_ATTEMPTS_PER_MODEL = 3
const RETRY_DELAYS_MS = [1200, 2500, 5000]

class PublicApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function sanitizeQuestions(raw: unknown, requestedCount: number, fallbackDifficulty: string): Question[] {
  const container = raw as { questions?: unknown }
  const source = Array.isArray(container?.questions) ? container.questions : Array.isArray(raw) ? raw : []

  return source
    .slice(0, requestedCount)
    .map((item, index) => {
      const q = item as Record<string, unknown>
      const options = Array.isArray(q.options) ? q.options.map((opt) => String(opt)).slice(0, 4) : []
      const normalizedOptions = options.length === 4 ? options : ["Option A", "Option B", "Option C", "Option D"]

      const rawCorrect = typeof q.correctAnswer === "number" ? q.correctAnswer : Number(q.correctAnswer)
      const correctAnswer = Number.isInteger(rawCorrect) && rawCorrect >= 0 && rawCorrect < normalizedOptions.length ? rawCorrect : 0

      const rawDifficulty = String(q.difficulty || fallbackDifficulty || "medium").toLowerCase()
      const difficulty = rawDifficulty === "easy" || rawDifficulty === "medium" || rawDifficulty === "hard" ? rawDifficulty : "medium"

      const points = difficulty === "easy" ? 10 : difficulty === "hard" ? 30 : 20
      const timeLimit = difficulty === "easy" ? 30 : difficulty === "hard" ? 60 : 45

      return {
        id: index + 1,
        question: String(q.question || "Generated question"),
        options: normalizedOptions,
        correctAnswer,
        explanation: String(q.explanation || "No explanation provided."),
        difficulty,
        category: String(q.category || "General"),
        points,
        timeLimit,
        hint: q.hint ? String(q.hint) : undefined,
      } as Question
    })
    .filter((q) => q.question.trim().length > 0)
}

function parseJsonFromModel(text: string): unknown {
  const trimmed = text.trim()

  try {
    return JSON.parse(trimmed)
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getModelCandidates(requestedModel: string, allowedModels: string[]) {
  if (allowedModels.length === 0) return [requestedModel]
  return [requestedModel, ...allowedModels.filter((model) => model !== requestedModel)]
}

function parseOpenRouterError(text: string, status: number): { code: number; message: string } {
  try {
    const parsed = JSON.parse(text) as OpenRouterErrorBody
    const rawCode = parsed.error?.code
    const parsedCode = typeof rawCode === "string" ? Number(rawCode) : rawCode
    const code = typeof parsedCode === "number" && Number.isFinite(parsedCode) ? parsedCode : status
    const message =
      parsed.error?.metadata?.raw ||
      parsed.error?.message ||
      "OpenRouter request failed"
    return { code, message }
  } catch {
    return { code: status, message: text || "OpenRouter request failed" }
  }
}

async function saveToSupabase(questions: Question[], topic: string, difficulty: string, model: string) {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new PublicApiError("Server storage is not configured.", 500)
  }

  const payload = questions.map((question) => ({
    topic,
    difficulty,
    model,
    question: question.question,
    options: question.options,
    correct_answer: question.correctAnswer,
    explanation: question.explanation,
    hint: question.hint ?? null,
    category: question.category,
    points: question.points,
    time_limit: question.timeLimit ?? null,
  }))

  const response = await fetch(`${supabaseUrl}/rest/v1/generated_questions`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new PublicApiError("Failed to save generated questions.", 500)
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as GeneratePayload

  const prompt = String(body.prompt || "General knowledge").trim()
  const count = Math.min(50, Math.max(1, Number(body.count) || 10))
  const difficulty = String(body.difficulty || "mixed")
  const requestedModel = String(body.model || process.env.OPENROUTER_DEFAULT_MODEL || "openai/gpt-4o-mini")

  const allowedModels = (process.env.OPENROUTER_ALLOWED_MODELS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

  if (allowedModels.length > 0 && !allowedModels.includes(requestedModel)) {
    return NextResponse.json({ error: "Requested model is not allowed by backend configuration." }, { status: 400 })
  }

  const openRouterApiKey = process.env.OPENROUTER_API_KEY
  if (!openRouterApiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 500 })
  }

  try {
    const modelCandidates = getModelCandidates(requestedModel, allowedModels)

    for (const model of modelCandidates) {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
        const completion = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterApiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "Demo Examination Platform",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "Return strict JSON only. Format: {\"questions\":[{\"question\":string,\"options\":[string,string,string,string],\"correctAnswer\":number,\"explanation\":string,\"difficulty\":\"easy\"|\"medium\"|\"hard\",\"category\":string,\"hint\":string}]}",
              },
              {
                role: "user",
                content: `Generate ${count} multiple-choice exam questions. Topic: ${prompt}. Difficulty: ${difficulty}. Ensure exactly 4 options and zero-based correctAnswer index.`,
              },
            ],
            temperature: 0.7,
          }),
        })

        if (completion.ok) {
          const completionJson = (await completion.json()) as OpenRouterResponse
          const modelText = completionJson.choices?.[0]?.message?.content || ""
          const parsed = parseJsonFromModel(modelText)
          const questions = sanitizeQuestions(parsed, count, difficulty)

          if (questions.length === 0) {
            return NextResponse.json({ error: "AI returned invalid question format. Please retry." }, { status: 502 })
          }

          await saveToSupabase(questions, prompt, difficulty, model)

          return NextResponse.json({
            questions,
            modelUsed: model,
            fallbackUsed: model !== requestedModel,
          })
        }

        const errorText = await completion.text()
        const parsedError = parseOpenRouterError(errorText, completion.status)
        const isRateLimited = parsedError.code === 429

        if (!isRateLimited) {
          return NextResponse.json({ error: "The selected model failed. Please try another model." }, { status: 502 })
        }

        if (attempt < MAX_ATTEMPTS_PER_MODEL) {
          await sleep(RETRY_DELAYS_MS[attempt - 1] ?? 5000)
          continue
        }

        break
      }
    }

    return NextResponse.json(
      {
        error: "All available models are currently rate-limited. Please retry in about a minute.",
      },
      { status: 429 }
    )
  } catch (error) {
    if (error instanceof PublicApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    // Do not leak internal exception details (URLs, credentials, or tokens) to UI.
    return NextResponse.json({ error: "Unexpected server error while generating questions." }, { status: 500 })
  }
}
