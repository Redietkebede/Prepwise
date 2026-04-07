import { NextResponse } from "next/server"

export async function GET() {
  const defaultModel = process.env.OPENROUTER_DEFAULT_MODEL || "openai/gpt-4o-mini"
  const envAllowedModels = (process.env.OPENROUTER_ALLOWED_MODELS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
  const allowedModels = envAllowedModels.length > 0 ? envAllowedModels : [defaultModel]

  return NextResponse.json({
    defaultModel,
    allowedModels,
  })
}
