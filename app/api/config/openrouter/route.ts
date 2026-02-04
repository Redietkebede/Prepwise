import { NextResponse } from "next/server"

interface OpenRouterAuthKeyResponse {
  data?: Record<string, unknown>
}

interface OpenRouterModelsResponse {
  data?: Array<{
    id?: string
    pricing?: {
      prompt?: string | number
      completion?: string | number
    }
  }>
}

const ESTIMATED_PROMPT_TOKENS_PER_QUESTION = 150
const ESTIMATED_COMPLETION_TOKENS_PER_QUESTION = 450
const DEFAULT_COST_PER_QUESTION = 0.002

function numberOrNull(value: unknown): number | null {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function extractRemainingCredits(payload: OpenRouterAuthKeyResponse): number | null {
  const data = payload.data || {}
  const directCandidates = [
    data.credits_remaining,
    data.remaining_credits,
    data.limit_remaining,
    data.remaining,
  ]

  for (const candidate of directCandidates) {
    const value = numberOrNull(candidate)
    if (value !== null) return value
  }

  const limit = numberOrNull(data.limit)
  const usage = numberOrNull(data.usage)
  if (limit !== null && usage !== null) {
    return Math.max(limit - usage, 0)
  }

  return null
}

function getModelCostPerQuestion(
  modelId: string,
  modelsPayload: OpenRouterModelsResponse | null
): number {
  const model = modelsPayload?.data?.find((entry) => entry.id === modelId)
  const promptPrice = numberOrNull(model?.pricing?.prompt)
  const completionPrice = numberOrNull(model?.pricing?.completion)

  if (promptPrice === null || completionPrice === null) {
    return DEFAULT_COST_PER_QUESTION
  }

  return (
    promptPrice * ESTIMATED_PROMPT_TOKENS_PER_QUESTION +
    completionPrice * ESTIMATED_COMPLETION_TOKENS_PER_QUESTION
  )
}

export async function GET() {
  const defaultModel = process.env.OPENROUTER_DEFAULT_MODEL || "openai/gpt-4o-mini"
  const envAllowedModels = (process.env.OPENROUTER_ALLOWED_MODELS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
  const allowedModels = envAllowedModels.length > 0 ? envAllowedModels : [defaultModel]

  const apiKey = process.env.OPENROUTER_API_KEY
  let remainingCredits: number | null = null
  let remainingQuestionsByModel: Record<string, number> = {}

  if (apiKey) {
    try {
      const [authResponse, modelsResponse] = await Promise.all([
        fetch("https://openrouter.ai/api/v1/auth/key", {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        }),
        fetch("https://openrouter.ai/api/v1/models", {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        }),
      ])

      const authPayload = authResponse.ok
        ? ((await authResponse.json()) as OpenRouterAuthKeyResponse)
        : null
      const modelsPayload = modelsResponse.ok
        ? ((await modelsResponse.json()) as OpenRouterModelsResponse)
        : null

      if (authPayload) {
        remainingCredits = extractRemainingCredits(authPayload)
      }

      if (remainingCredits !== null) {
        remainingQuestionsByModel = Object.fromEntries(
          allowedModels.map((modelId) => {
            const costPerQuestion = getModelCostPerQuestion(modelId, modelsPayload)
            const estimate = Math.max(Math.floor(remainingCredits / Math.max(costPerQuestion, 0.000001)), 0)
            return [modelId, estimate]
          })
        )
      }
    } catch {
      // Keep config endpoint resilient even if OpenRouter usage endpoints fail.
    }
  }

  return NextResponse.json({
    defaultModel,
    allowedModels,
    remainingCredits,
    remainingQuestionsByModel,
  })
}
