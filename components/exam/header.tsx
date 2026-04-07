"use client"

import {
  Moon,
  Sun,
  Clock,
  Zap,
  Target,
  Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/lib/exam/utils"

interface ExamHeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  examStarted: boolean
  showResults: boolean
  examMode: "practice" | "timed" | "survival"
  timeLeft: number
  questionTimeLeft: number
  currentStreak: number
  hasTimeLimit: boolean
}

export function ExamHeader({
  darkMode,
  setDarkMode,
  examStarted,
  showResults,
  examMode,
  timeLeft,
  questionTimeLeft,
  currentStreak,
  hasTimeLimit,
}: ExamHeaderProps) {
  return (
    <header
      className={`border-b backdrop-blur-sm ${
        darkMode ? "border-gray-700 bg-gray-800/90" : "border-gray-200 bg-white/90"
      } sticky top-0 z-50`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className={`h-8 w-8 ${darkMode ? "text-cyan-400" : "text-blue-500"}`} />
              <h1
                className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  darkMode ? "from-cyan-400 to-blue-400" : "from-blue-500 to-cyan-500"
                }`}
              >
                Demo Examination Platform
              </h1>
            </div>
            {examStarted && !showResults && (
              <div className="flex items-center gap-4">
                {examMode === "timed" && (
                  <div className={`flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    <Clock className="h-5 w-5" />
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                  </div>
                )}
                {hasTimeLimit && (
                  <div
                    className={`flex items-center gap-2 ${
                      questionTimeLeft <= 10 ? "text-red-500" : darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Target className="h-4 w-4" />
                    <span className="font-mono text-sm">{formatTime(questionTimeLeft)}</span>
                  </div>
                )}
                <div className={`flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">Streak: {currentStreak}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className={darkMode ? "border-gray-600 hover:bg-gray-700" : ""}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
