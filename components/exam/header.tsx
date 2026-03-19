"use client"

import {
  Moon,
  Sun,
  Clock,
  Zap,
  Target,
  Brain,
  Palette,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Theme } from "@/lib/exam/types"
import { THEMES } from "@/lib/exam/data"
import { formatTime } from "@/lib/exam/utils"
import { getThemeClasses } from "@/lib/exam/theme-classes"

interface ExamHeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  currentTheme: Theme
  setCurrentTheme: (theme: Theme) => void
  soundEnabled: boolean
  setSoundEnabled: (value: boolean) => void
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
  currentTheme,
  setCurrentTheme,
  soundEnabled,
  setSoundEnabled,
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
              <Brain className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
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
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={darkMode ? "border-gray-600 hover:bg-gray-700" : ""}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            <Select
              value={currentTheme.name}
              onValueChange={(value: string) => setCurrentTheme(THEMES.find((t) => t.name === value) || THEMES[0])}
            >
              <SelectTrigger className="w-24">
                <Palette className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((theme) => (
                  <SelectItem key={theme.name} value={theme.name}>
                    <div className="flex items-center gap-2">
                      <div className={["w-3 h-3 rounded-full", getThemeClasses(theme).primary.bg500].join(" ")} />
                      {theme.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
