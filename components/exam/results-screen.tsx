"use client"

import { useState } from "react"
import {
  CheckCircle,
  XCircle,
  Trophy,
  Award,
  Target,
  Lightbulb,
  Bookmark,
  RotateCcw,
  Share2,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Question, Theme, ExamResults } from "@/lib/exam/types"
import { getDifficultyBadgeColor } from "@/lib/exam/utils"
import { getThemeClasses } from "@/lib/exam/theme-classes"

interface ResultsScreenProps {
  questions: Question[]
  selectedAnswers: { [key: number]: number }
  results: ExamResults
  currentStreak: number
  darkMode: boolean
  currentTheme: Theme
  bookmarkedQuestions: Set<number>
  onToggleBookmark: (id: number) => void
  onReset: () => void
}

export function ResultsScreen({
  questions,
  selectedAnswers,
  results,
  currentStreak,
  darkMode,
  currentTheme,
  bookmarkedQuestions,
  onToggleBookmark,
  onReset,
}: ResultsScreenProps) {
  const [actionMessage, setActionMessage] = useState("")
  const themeClasses = getThemeClasses(currentTheme)

  const shareText = `I scored ${results.percentage}% (${results.correct}/${results.total}) on Prepwise.`

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Exam Results",
          text: shareText,
        })
        setActionMessage("Results shared.")
        return
      }

      await navigator.clipboard.writeText(shareText)
      setActionMessage("Results copied to clipboard.")
    } catch {
      setActionMessage("Sharing was cancelled or unavailable.")
    }
  }

  const handleExportPdf = () => {
    setActionMessage("Opening print dialog for PDF export.")
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} relative overflow-hidden`}>
        <div
          className={`absolute inset-0 bg-gradient-to-r ${themeClasses.primary.from500_10} ${themeClasses.accent.to500_10}`}
        />
        <CardHeader className="relative text-center">
          <div className="flex justify-center mb-4">
            {results.percentage >= 90 ? (
              <Trophy className="h-16 w-16 text-yellow-500" />
            ) : results.percentage >= 70 ? (
              <Award className="h-16 w-16 text-blue-500" />
            ) : (
              <Target className="h-16 w-16 text-gray-500" />
            )}
          </div>
          <CardTitle className={`text-4xl ${darkMode ? "text-white" : ""}`}>
            {results.percentage >= 90
              ? "Excellent!"
              : results.percentage >= 70
                ? "Well Done!"
                : "Keep Practicing!"}
          </CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${themeClasses.primary.text500}`}>
                {results.percentage}%
              </div>
              <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Score</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${darkMode ? "text-white" : ""}`}>
                {results.correct}/{results.total}
              </div>
              <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Correct</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${themeClasses.accent.text500}`}>
                {results.earnedPoints}
              </div>
              <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{currentStreak}</div>
              <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Best Streak</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Results */}
      <div className="space-y-4">
        {questions.map((question, index) => {
          const userAnswer = selectedAnswers[index]
          const isCorrect = userAnswer === question.correctAnswer
          const isBookmarked = bookmarkedQuestions.has(question.id)

          return (
            <Card
              key={question.id}
              className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} ${
                isCorrect ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${darkMode ? "text-white" : ""}`}>
                        Question {index + 1}: {question.question}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyBadgeColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">+{question.points}pts</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleBookmark(question.id)}
                          className={isBookmarked ? themeClasses.primary.text500 : ""}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                        <span className="font-medium">Your answer:</span>{" "}
                        {userAnswer !== undefined ? question.options[userAnswer] : "Not answered"}
                      </p>
                      <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                        <span className="font-medium">Correct answer:</span>{" "}
                        {question.options[question.correctAnswer]}
                      </p>
                      <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={onReset} size="lg">
          <RotateCcw className="h-5 w-5 mr-2" />
          Take Again
        </Button>
        <Button variant="outline" size="lg" onClick={handleShare}>
          <Share2 className="h-5 w-5 mr-2" />
          Share Results
        </Button>
        <Button variant="outline" size="lg" onClick={handleExportPdf}>
          <Download className="h-5 w-5 mr-2" />
          Export PDF
        </Button>
      </div>
      {actionMessage ? <p className={`text-sm text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{actionMessage}</p> : null}
    </div>
  )
}
