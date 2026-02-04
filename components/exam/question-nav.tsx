"use client"

import { CheckCircle, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Question, Theme } from "@/lib/exam/types"
import { getThemeClasses } from "@/lib/exam/theme-classes"

interface QuestionNavProps {
  questions: Question[]
  currentQuestion: number
  selectedAnswers: { [key: number]: number }
  bookmarkedQuestions: Set<number>
  darkMode: boolean
  currentTheme: Theme
  currentStreak: number
  onQuestionSelect: (index: number) => void
}

export function QuestionNav({
  questions,
  currentQuestion,
  selectedAnswers,
  bookmarkedQuestions,
  darkMode,
  currentTheme,
  currentStreak,
  onQuestionSelect,
}: QuestionNavProps) {
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredCount = Object.keys(selectedAnswers).length
  const themeClasses = getThemeClasses(currentTheme)

  return (
    <Card className={`sticky top-24 ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
      <CardHeader>
        <CardTitle className={`text-lg ${darkMode ? "text-white" : ""}`}>Progress</CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {currentQuestion + 1} of {questions.length}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 lg:grid-cols-3 gap-2">
          {questions.map((question, index) => (
            <Button
              key={index}
              variant={currentQuestion === index ? "default" : "outline"}
              size="sm"
              onClick={() => onQuestionSelect(index)}
              className={`relative ${
                selectedAnswers[index] !== undefined
                  ? currentQuestion === index
                    ? ""
                    : darkMode
                      ? "bg-green-900 border-green-700 text-green-100 hover:bg-green-800"
                      : "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                  : ""
              }`}
            >
              {index + 1}
              {selectedAnswers[index] !== undefined && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-2 w-2 text-white" />
                </div>
              )}
              {bookmarkedQuestions.has(question.id) && (
                <Bookmark className="absolute -bottom-1 -right-1 h-3 w-3 text-yellow-500" />
              )}
            </Button>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Answered</span>
            <span className={`font-medium ${darkMode ? "text-white" : ""}`}>
              {answeredCount} / {questions.length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Current Streak</span>
            <span className={`font-medium ${themeClasses.accent.text500}`}>{currentStreak}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
