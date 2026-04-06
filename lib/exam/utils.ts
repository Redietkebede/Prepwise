import { Question, ExamResults, ExamStats } from "./types"

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "easy":
      return "text-green-500"
    case "medium":
      return "text-yellow-500"
    case "hard":
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

export const getDifficultyBadgeColor = (difficulty: string): string => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "hard":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const calculateResults = (
  questions: Question[],
  selectedAnswers: { [key: number]: number }
): ExamResults => {
  if (questions.length === 0) {
    return { score: 0, percentage: 0, correct: 0, total: 0, totalPoints: 0, earnedPoints: 0 }
  }

  const total = questions.length
  let correct = 0
  let earnedPoints = 0
  let totalPoints = 0

  questions.forEach((question, index) => {
    totalPoints += question.points
    if (selectedAnswers[index] === question.correctAnswer) {
      correct++
      earnedPoints += question.points
    }
  })

  return {
    score: correct,
    percentage: Math.round((correct / total) * 100),
    correct,
    total,
    totalPoints,
    earnedPoints,
  }
}

export const checkAchievements = (
  prevStats: ExamStats,
  results: ExamResults,
  duration: number,
  currentStreak: number
): string[] => {
  const newAchievements = [...prevStats.achievements]

  if (!newAchievements.includes("first_exam") && prevStats.totalExams === 0) {
    newAchievements.push("first_exam")
  }

  if (!newAchievements.includes("perfect_score") && results.percentage === 100) {
    newAchievements.push("perfect_score")
  }

  if (!newAchievements.includes("speed_demon") && duration < 300) {
    newAchievements.push("speed_demon")
  }

  if (!newAchievements.includes("streak_5") && currentStreak >= 5) {
    newAchievements.push("streak_5")
  }

  if (!newAchievements.includes("hundred_questions") && prevStats.correctAnswers + results.correct >= 100) {
    newAchievements.push("hundred_questions")
  }

  return newAchievements
}
