import { Play, Trophy, Zap, Target, Star, Award } from "lucide-react"
import { Theme, Achievement } from "./types"

export const THEMES: Theme[] = [
  { name: "Blue", primary: "blue", secondary: "slate", accent: "cyan", background: "slate" },
  { name: "Purple", primary: "purple", secondary: "violet", accent: "fuchsia", background: "slate" },
  { name: "Green", primary: "green", secondary: "emerald", accent: "teal", background: "slate" },
  { name: "Orange", primary: "orange", secondary: "amber", accent: "yellow", background: "slate" },
  { name: "Pink", primary: "pink", secondary: "rose", accent: "red", background: "slate" },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_exam", name: "Getting Started", description: "Complete your first exam", icon: Play },
  { id: "perfect_score", name: "Perfectionist", description: "Score 100% on an exam", icon: Trophy },
  { id: "speed_demon", name: "Speed Demon", description: "Complete an exam in under 5 minutes", icon: Zap },
  { id: "streak_5", name: "On Fire", description: "Get 5 questions correct in a row", icon: Target },
  { id: "category_master", name: "Category Master", description: "Score 90%+ in all categories", icon: Star },
  { id: "hundred_questions", name: "Century Club", description: "Answer 100 questions correctly", icon: Award },
]

export const DEFAULT_STATS = {
  totalExams: 0,
  averageScore: 0,
  bestScore: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  streak: 0,
  achievements: [],
  categoryStats: {},
}
