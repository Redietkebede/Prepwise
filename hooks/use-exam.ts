"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Question, ExamStats, Theme } from "@/lib/exam/types"
import { THEMES, EXAM_DATA, DEFAULT_STATS } from "@/lib/exam/data"
import { calculateResults, checkAchievements, playSound } from "@/lib/exam/utils"

export function useExam() {
  const hasFinalizedRef = useRef(false)
  const [darkMode, setDarkMode] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [difficulty, setDifficulty] = useState<string>("all")
  const [examMode, setExamMode] = useState<"practice" | "timed" | "survival">("practice")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [examStartTime, setExamStartTime] = useState<number>(0)
  const [stats, setStats] = useState<ExamStats>(DEFAULT_STATS)
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeTab, setActiveTab] = useState("exam")

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem("examStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem("examStats", JSON.stringify(stats))
  }, [stats])

  // Generate questions based on filters
  useEffect(() => {
    let allQuestions: Question[] = []

    Object.entries(EXAM_DATA.categories).forEach(([categoryName, categoryData]) => {
      if (selectedCategory === "all" || selectedCategory === categoryName) {
        allQuestions = [...allQuestions, ...categoryData.questions]
      }
    })

    if (difficulty !== "all") {
      allQuestions = allQuestions.filter((q) => q.difficulty === difficulty)
    }

    allQuestions = allQuestions.sort(() => Math.random() - 0.5)
    setQuestions(allQuestions)
  }, [selectedCategory, difficulty])

  const updateStats = useCallback(() => {
    const results = calculateResults(questions, selectedAnswers)
    const examDuration = (Date.now() - examStartTime) / 1000
    const categoryStatsDelta: ExamStats["categoryStats"] = {}

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
      averageScore: Math.round(
        (prevStats.averageScore * prevStats.totalExams + results.percentage) / (prevStats.totalExams + 1)
      ),
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
  }, [questions, selectedAnswers, examStartTime, currentStreak])

  const finalizeExam = useCallback((playCompletionSound = true) => {
    if (hasFinalizedRef.current) return

    hasFinalizedRef.current = true
    setShowResults(true)
    if (playCompletionSound) {
      playSound("complete", soundEnabled)
    }
    updateStats()
  }, [soundEnabled, updateStats])

  // Main timer
  useEffect(() => {
    if (examStarted && timeLeft > 0 && !showResults && examMode === "timed") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finalizeExam(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [examStarted, timeLeft, showResults, examMode, finalizeExam])

  // Question timer
  useEffect(() => {
    if (examStarted && questionTimeLeft > 0 && !showResults && questions[currentQuestion]?.timeLimit) {
      const timer = setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1)
              setQuestionTimeLeft(questions[currentQuestion + 1]?.timeLimit || 0)
            } else {
              finalizeExam(false)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [examStarted, questionTimeLeft, showResults, currentQuestion, questions, finalizeExam])

  // Set question timer when question changes
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
          playSound("correct", soundEnabled)
        } else {
          setCurrentStreak(0)
          playSound("incorrect", soundEnabled)
          finalizeExam(false)
        }
      }

      if (examMode === "practice") {
        if (isCorrect) {
          setCurrentStreak((prev) => prev + 1)
          playSound("correct", soundEnabled)
        } else {
          setCurrentStreak(0)
          playSound("incorrect", soundEnabled)
        }
        setShowExplanation(true)
      }
    }
  }, [showResults, currentQuestion, examMode, questions, soundEnabled, finalizeExam])

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestion(index)
    setShowExplanation(false)
    setShowHint(false)
  }, [])

  const startExam = useCallback(() => {
    hasFinalizedRef.current = false
    setExamStarted(true)
    setExamStartTime(Date.now())
    if (examMode === "timed") {
      setTimeLeft(questions.length * 60)
    }
    if (questions[0]?.timeLimit) {
      setQuestionTimeLeft(questions[0].timeLimit)
    }
  }, [examMode, questions])

  const submitExam = useCallback(() => {
    finalizeExam(true)
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

  const resetStats = useCallback(() => {
    hasFinalizedRef.current = false
    setStats(DEFAULT_STATS)
    localStorage.removeItem("examStats")
  }, [])

  return {
    // State
    darkMode,
    currentTheme,
    selectedCategory,
    difficulty,
    examMode,
    currentQuestion,
    selectedAnswers,
    showResults,
    timeLeft,
    questionTimeLeft,
    examStarted,
    showHint,
    bookmarkedQuestions,
    soundEnabled,
    showExplanation,
    currentStreak,
    stats,
    questions,
    activeTab,
    // Setters
    setDarkMode,
    setCurrentTheme,
    setSelectedCategory,
    setDifficulty,
    setExamMode,
    setSoundEnabled,
    setShowHint,
    setActiveTab,
    // Actions
    handleAnswerSelect,
    goToQuestion,
    startExam,
    submitExam,
    resetExam,
    toggleBookmark,
    resetStats,
  }
}
