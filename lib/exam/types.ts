import { type LucideIcon } from "lucide-react"

export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  points: number
  timeLimit?: number
  hint?: string
  image?: string
}

export interface ExamStats {
  totalExams: number
  averageScore: number
  bestScore: number
  totalQuestions: number
  correctAnswers: number
  streak: number
  achievements: string[]
  categoryStats: { [key: string]: { correct: number; total: number } }
}

export interface Theme {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: LucideIcon
}

export interface CategoryData {
  icon: LucideIcon
  color: string
  questions: Question[]
}

export interface ExamMode {
  value: "practice" | "timed" | "survival"
  label: string
  desc: string
  icon: LucideIcon
}

export interface ExamResults {
  score: number
  percentage: number
  correct: number
  total: number
  totalPoints: number
  earnedPoints: number
}
