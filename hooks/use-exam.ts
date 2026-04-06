"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Question, ExamStats, LastExamStats } from "@/lib/exam/types"
import { THEMES, DEFAULT_STATS } from "@/lib/exam/data"
import { calculateResults, checkAchievements } from "@/lib/exam/utils"
import { toast } from "sonner"

interface GenerateQuestionsResponse {
  questions: Question[]
  error?: string
  details?: string
  modelUsed?: string
  fallbackUsed?: boolean
}

interface OpenRouterConfigResponse {
  defaultModel?: string
  allowedModels?: string[]
  remainingCredits?: number | null
  remainingQuestionsByModel?: Record<string, number>
}

export function useExam() {
  const hasFinalizedRef = useRef(false)
  const [darkMode, setDarkMode] = useState(false)
  const currentTheme = THEMES[0]
  const [difficulty, setDifficulty] = useState<string>("mixed")
  const [examMode, setExamMode] = useState<"practice" | "timed" | "survival">("practice")
  const [generationPrompt, setGenerationPrompt] = useState("General knowledge")
  const [questionCount, setQuestionCount] = useState(10)
  const [aiModel, setAiModel] = useState("")
  const [allowedModels, setAllowedModels] = useState<string[]>([])
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null)
  const [remainingQuestionsByModel, setRemainingQuestionsByModel] = useState<Record<string, number>>({})
  const [isModelConfigLoading, setIsModelConfigLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState("")
  const [generationCooldownLeft, setGenerationCooldownLeft] = useState(0)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set())
  const [showExplanation, setShowExplanation] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [examStartTime, setExamStartTime] = useState<number>(0)
  const [stats, setStats] = useState<ExamStats>(DEFAULT_STATS)
  const [lastExam, setLastExam] = useState<LastExamStats | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (generationCooldownLeft <= 0) return
    const timer = setInterval(() => {
      setGenerationCooldownLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [generationCooldownLeft])

  useEffect(() => {
    const loadModelConfig = async () => {
      try {
        const response = await fetch("/api/config/openrouter")
        const data = (await response.json()) as OpenRouterConfigResponse
        if (response.ok) {
          const backendDefaultModel = data.defaultModel || "openai/gpt-4o-mini"
          const backendAllowedModels =
            Array.isArray(data.allowedModels) && data.allowedModels.length > 0
              ? data.allowedModels
              : [backendDefaultModel]

          setAllowedModels(backendAllowedModels)
          setAiModel(
            backendAllowedModels.includes(backendDefaultModel)
              ? backendDefaultModel
              : backendAllowedModels[0]
          )
          setRemainingCredits(
            typeof data.remainingCredits === "number" ? data.remainingCredits : null
          )
          setRemainingQuestionsByModel(data.remainingQuestionsByModel || {})
        } else {
          setAiModel("openai/gpt-4o-mini")
          setAllowedModels(["openai/gpt-4o-mini"])
        }
      } catch {
        setAiModel("openai/gpt-4o-mini")
        setAllowedModels(["openai/gpt-4o-mini"])
      } finally {
        setIsModelConfigLoading(false)
      }
    }

    void loadModelConfig()
  }, [])

  const updateStats = useCallback(() => {
    const results = calculateResults(questions, selectedAnswers)
    const examDuration = (Date.now() - examStartTime) / 1000
    const categoryStatsDelta: ExamStats["categoryStats"] = {}

    setLastExam({
      percentage: results.percentage,
      correct: results.correct,
      total: results.total,
      earnedPoints: results.earnedPoints,
      mode: examMode,
      completedAt: Date.now(),
    })

    questions.forEach((question, index) => {
      if (!categoryStatsDelta[question.category]) {
        categoryStatsDelta[question.category] = { correct: 0, total: 0 }
      }
      categoryStatsDelta[question.category].total += 1

      if (selectedAnswers[index] === question.correctAnswer) {
        categoryStatsDelta[question.category].correct += 1
      }
    })

    setStats((prevStats) => ({
      ...prevStats,
      totalExams: prevStats.totalExams + 1,
      totalQuestions: prevStats.totalQuestions + questions.length,
      correctAnswers: prevStats.correctAnswers + results.correct,
      averageScore: Math.round((prevStats.averageScore * prevStats.totalExams + results.percentage) / (prevStats.totalExams + 1)),
      bestScore: Math.max(prevStats.bestScore, results.percentage),
      streak: Math.max(prevStats.streak, currentStreak),
      categoryStats: Object.entries(categoryStatsDelta).reduce(
        (acc, [category, delta]) => {
          const existing = prevStats.categoryStats[category] || { correct: 0, total: 0 }
          acc[category] = {
            correct: existing.correct + delta.correct,
            total: existing.total + delta.total,
          }
          return acc
        },
        { ...prevStats.categoryStats } as ExamStats["categoryStats"]
      ),
      achievements: checkAchievements(prevStats, results, examDuration, currentStreak),
    }))
  }, [questions, selectedAnswers, examStartTime, currentStreak, examMode])

  const finalizeExam = useCallback(() => {
    if (hasFinalizedRef.current) return

    hasFinalizedRef.current = true
    setShowResults(true)
    updateStats()
  }, [updateStats])

  useEffect(() => {
    if (examStarted && timeLeft > 0 && !showResults && examMode === "timed") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finalizeExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [examStarted, timeLeft, showResults, examMode, finalizeExam])

  useEffect(() => {
    if (examStarted && questionTimeLeft > 0 && !showResults && questions[currentQuestion]?.timeLimit) {
      const timer = setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1)
              setQuestionTimeLeft(questions[currentQuestion + 1]?.timeLimit || 0)
            } else {
              finalizeExam()
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [examStarted, questionTimeLeft, showResults, currentQuestion, questions, finalizeExam])

  useEffect(() => {
    if (examStarted && questions[currentQuestion]?.timeLimit) {
      setQuestionTimeLeft(questions[currentQuestion].timeLimit)
    }
  }, [currentQuestion, examStarted, questions])

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion]: answerIndex,
      }))

      const isCorrect = answerIndex === questions[currentQuestion].correctAnswer

      if (examMode === "survival") {
        if (isCorrect) {
          setCurrentStreak((prev) => prev + 1)
        } else {
          setCurrentStreak(0)
          finalizeExam()
        }
      }

      if (examMode === "practice") {
        if (isCorrect) {
          setCurrentStreak((prev) => prev + 1)
        } else {
          setCurrentStreak(0)
        }
        setShowExplanation(true)
      }
    }
  }, [showResults, currentQuestion, examMode, questions, finalizeExam])

  const goToQuestion = useCallback((index: number) => {
    if (index < 0 || index >= questions.length) return
    setCurrentQuestion(index)
    setShowExplanation(false)
    setShowHint(false)
  }, [questions.length])

  const startExam = useCallback(async () => {
    if (generationCooldownLeft > 0) {
      toast.error(`Please wait ${generationCooldownLeft}s before generating again.`)
      return
    }

    setIsGenerating(true)
    setGenerationError("")

    try {
      const response = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: generationPrompt,
          count: questionCount,
          difficulty,
          model: aiModel,
        }),
      })

      const data = (await response.json()) as GenerateQuestionsResponse
      if (!response.ok) {
        if (response.status === 429) {
          setGenerationCooldownLeft(20)
        }
        throw new Error(data.error || "Failed to generate questions")
      }

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No questions returned from AI")
      }

      hasFinalizedRef.current = false
      setQuestions(data.questions)
      setCurrentQuestion(0)
      setSelectedAnswers({})
      setShowResults(false)
      setCurrentStreak(0)
      setShowExplanation(false)
      setShowHint(false)
      setBookmarkedQuestions(new Set())
      setExamStarted(true)
      setExamStartTime(Date.now())

      if (examMode === "timed") {
        setTimeLeft(data.questions.length * 60)
      } else {
        setTimeLeft(0)
      }

      if (data.questions[0]?.timeLimit) {
        setQuestionTimeLeft(data.questions[0].timeLimit)
      } else {
        setQuestionTimeLeft(0)
      }

      if (data.fallbackUsed && data.modelUsed) {
        toast.message(`Rate limit avoided: switched to ${data.modelUsed}`)
      } else {
        toast.success("Questions generated successfully.")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate questions"
      setGenerationError(message)
      toast.error(message)
      setExamStarted(false)
      setQuestions([])
    } finally {
      setIsGenerating(false)
    }
  }, [generationPrompt, questionCount, difficulty, aiModel, examMode, generationCooldownLeft])

  const submitExam = useCallback(() => {
    finalizeExam()
  }, [finalizeExam])

  const resetExam = useCallback(() => {
    hasFinalizedRef.current = false
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setExamStarted(false)
    setCurrentStreak(0)
    setShowExplanation(false)
    setShowHint(false)
    setTimeLeft(0)
    setQuestionTimeLeft(0)
  }, [])

  const toggleBookmark = useCallback((questionId: number) => {
    setBookmarkedQuestions((prev) => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(questionId)) {
        newBookmarks.delete(questionId)
      } else {
        newBookmarks.add(questionId)
      }
      return newBookmarks
    })
  }, [])

  return {
    darkMode,
    currentTheme,
    difficulty,
    examMode,
    generationPrompt,
    questionCount,
    aiModel,
    allowedModels,
    remainingCredits,
    remainingQuestionsByModel,
    isModelConfigLoading,
    isGenerating,
    generationError,
    generationCooldownLeft,
    currentQuestion,
    selectedAnswers,
    showResults,
    timeLeft,
    questionTimeLeft,
    examStarted,
    showHint,
    bookmarkedQuestions,
    showExplanation,
    currentStreak,
    stats,
    lastExam,
    questions,
    setDarkMode,
    setDifficulty,
    setExamMode,
    setGenerationPrompt,
    setQuestionCount,
    setAiModel,
    setShowHint,
    handleAnswerSelect,
    goToQuestion,
    startExam,
    submitExam,
    resetExam,
    toggleBookmark,
  }
}
