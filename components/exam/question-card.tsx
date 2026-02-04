"use client"

import {
  CheckCircle,
  XCircle,
  Lightbulb,
  Bookmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Question, Theme } from "@/lib/exam/types"
import { formatTime, getDifficultyBadgeColor } from "@/lib/exam/utils"
import { getThemeClasses } from "@/lib/exam/theme-classes"

interface QuestionCardProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  selectedAnswer: number | undefined
  darkMode: boolean
  currentTheme: Theme
  examMode: "practice" | "timed" | "survival"
  showHint: boolean
  showExplanation: boolean
  questionTimeLeft: number
  isBookmarked: boolean
  onAnswerSelect: (index: number) => void
  onToggleHint: () => void
  onToggleBookmark: () => void
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  darkMode,
  currentTheme,
  examMode,
  showHint,
  showExplanation,
  questionTimeLeft,
  isBookmarked,
  onAnswerSelect,
  onToggleHint,
  onToggleBookmark,
  onPrevious,
  onNext,
  onSubmit,
}: QuestionCardProps) {
  const themeClasses = getThemeClasses(currentTheme)

  return (
    <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={`text-xl ${darkMode ? "text-white" : ""}`}>
              Question {questionIndex + 1}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getDifficultyBadgeColor(question.difficulty)}>
                {question.difficulty}
              </Badge>
              <Badge variant="outline">+{question.points} points</Badge>
              <Badge variant="outline" className="text-slate-600 dark:text-slate-200">
                {question.category}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {question.timeLimit && (
              <div
                className={`text-sm ${
                  questionTimeLeft <= 10 ? "text-red-500" : darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {formatTime(questionTimeLeft)}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleBookmark}
              className={isBookmarked ? themeClasses.primary.text500 : ""}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <h2 className={`text-lg font-medium ${darkMode ? "text-white" : ""}`}>
          {question.question}
        </h2>

        {question.image && (
          <div className="flex justify-center">
            <img
              src={question.image || "/placeholder.svg"}
              alt="Question illustration"
              className="max-w-md rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onAnswerSelect(index)}
              disabled={showExplanation && examMode === "practice"}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? darkMode
                    ? `${themeClasses.primary.border500} ${themeClasses.primary.bg900_20} ${themeClasses.primary.text100}`
                    : `${themeClasses.primary.border500} ${themeClasses.primary.bg50} text-gray-900`
                  : darkMode
                    ? "border-gray-600 bg-gray-700 text-gray-200 hover:border-gray-500 hover:bg-gray-600"
                    : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
              } ${showExplanation && examMode === "practice" ? "cursor-not-allowed opacity-75" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? darkMode
                        ? `${themeClasses.primary.border400} ${themeClasses.primary.bg500}`
                        : `${themeClasses.primary.border500} ${themeClasses.primary.bg500}`
                      : darkMode
                        ? "border-gray-500"
                        : "border-gray-300"
                  }`}
                >
                  {selectedAnswer === index && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Hint */}
        {question.hint && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleHint}
              className="flex items-center gap-2 bg-transparent"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
          </div>
        )}

        {showHint && question.hint && (
          <div
            className={`p-4 rounded-lg border-l-4 border-l-yellow-500 ${
              darkMode ? "bg-yellow-900/20" : "bg-yellow-50"
            }`}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className={`text-sm ${darkMode ? "text-yellow-100" : "text-yellow-800"}`}>
                {question.hint}
              </p>
            </div>
          </div>
        )}

        {/* Explanation */}
        {showExplanation && examMode === "practice" && selectedAnswer !== undefined && (
          <div
            className={`p-4 rounded-lg border-l-4 ${
              selectedAnswer === question.correctAnswer
                ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-l-red-500 bg-red-50 dark:bg-red-900/20"
            }`}
          >
            <div className="flex items-start gap-2">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p
                  className={`font-medium text-sm mb-1 ${
                    selectedAnswer === question.correctAnswer
                      ? "text-green-800 dark:text-green-100"
                      : "text-red-800 dark:text-red-100"
                  }`}
                >
                  {selectedAnswer === question.correctAnswer ? "Correct!" : "Incorrect"}
                </p>
                <p
                  className={`text-sm ${
                    selectedAnswer === question.correctAnswer
                      ? "text-green-700 dark:text-green-200"
                      : "text-red-700 dark:text-red-200"
                  }`}
                >
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={questionIndex === 0}
            className={darkMode ? "border-gray-600 hover:bg-gray-700" : ""}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {questionIndex === totalQuestions - 1 ? (
              <Button onClick={onSubmit} className="px-8">
                Submit Exam
              </Button>
            ) : (
              <Button onClick={onNext}>Next</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
