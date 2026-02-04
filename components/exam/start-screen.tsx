"use client"

import { BookOpen, Clock, Target, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Theme, ExamStats } from "@/lib/exam/types"
import { EXAM_DATA } from "@/lib/exam/data"
import { getThemeClasses } from "@/lib/exam/theme-classes"

interface StartScreenProps {
  darkMode: boolean
  currentTheme: Theme
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  difficulty: string
  setDifficulty: (value: string) => void
  examMode: "practice" | "timed" | "survival"
  setExamMode: (value: "practice" | "timed" | "survival") => void
  questionsCount: number
  stats: ExamStats
  onStart: () => void
}

const EXAM_MODES = [
  { value: "practice" as const, label: "Practice", desc: "Immediate feedback", icon: BookOpen },
  { value: "timed" as const, label: "Timed", desc: "Race against time", icon: Clock },
  { value: "survival" as const, label: "Survival", desc: "One mistake ends it", icon: Target },
]

export function StartScreen({
  darkMode,
  currentTheme,
  selectedCategory,
  setSelectedCategory,
  difficulty,
  setDifficulty,
  examMode,
  setExamMode,
  questionsCount,
  stats,
  onStart,
}: StartScreenProps) {
  const themeClasses = getThemeClasses(currentTheme)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardHeader>
            <CardTitle className={`text-3xl ${darkMode ? "text-white" : ""}`}>
              Configure Your Exam
            </CardTitle>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Customize your learning experience
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : ""}`}>
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(EXAM_DATA.categories).map(([name, data]) => (
                      <SelectItem key={name} value={name}>
                        <div className="flex items-center gap-2">
                          <data.icon className={`h-4 w-4 ${data.color}`} />
                          {name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : ""}`}>
                  Difficulty
                </label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : ""}`}>
                Exam Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {EXAM_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setExamMode(mode.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      examMode === mode.value
                        ? `${themeClasses.primary.border500} ${themeClasses.primary.bg50} ${darkMode ? "bg-opacity-20" : ""}`
                        : darkMode
                          ? "border-gray-600 bg-gray-700 hover:border-gray-500"
                          : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <mode.icon
                      className={`h-6 w-6 mx-auto mb-2 ${
                        examMode === mode.value ? themeClasses.primary.text500 : "text-gray-400"
                      }`}
                    />
                    <div className={`font-medium ${darkMode ? "text-white" : ""}`}>{mode.label}</div>
                    <div className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                      {mode.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={onStart} size="lg" className="w-full">
              <Play className="h-5 w-5 mr-2" />
              Start Exam ({questionsCount} questions)
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${darkMode ? "text-white" : ""}`}>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Best Score</span>
              <span className={`font-bold ${themeClasses.primary.text500}`}>{stats.bestScore}%</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Average</span>
              <span className={darkMode ? "text-white" : ""}>{stats.averageScore}%</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Total Exams</span>
              <span className={darkMode ? "text-white" : ""}>{stats.totalExams}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Best Streak</span>
              <span className={`font-bold ${themeClasses.accent.text500}`}>{stats.streak}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${darkMode ? "text-white" : ""}`}>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(EXAM_DATA.categories).map(([name, data]) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <data.icon className={`h-4 w-4 ${data.color}`} />
                  <span className={`text-sm ${darkMode ? "text-white" : ""}`}>{name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {data.questions.length}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
