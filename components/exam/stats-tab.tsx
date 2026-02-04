"use client"

import { Trophy, TrendingUp, Target, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ExamStats } from "@/lib/exam/types"
import { EXAM_DATA } from "@/lib/exam/data"

interface StatsTabProps {
  stats: ExamStats
  darkMode: boolean
}

export function StatsTab({ stats, darkMode }: StatsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : ""}`}>{stats.bestScore}%</p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Best Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : ""}`}>{stats.averageScore}%</p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : ""}`}>{stats.totalExams}</p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Total Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Zap className="h-8 w-8 text-orange-500" />
              <div>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : ""}`}>{stats.streak}</p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
        <CardHeader>
          <CardTitle className={`${darkMode ? "text-white" : ""}`}>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(EXAM_DATA.categories).map(([name, data]) => {
              const categoryStats = stats.categoryStats[name] || { correct: 0, total: 0 }
              const percentage =
                categoryStats.total > 0 ? Math.round((categoryStats.correct / categoryStats.total) * 100) : 0

              return (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <data.icon className={`h-5 w-5 ${data.color}`} />
                    <span className={darkMode ? "text-white" : ""}>{name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? "text-white" : ""}`}>
                      {percentage}% ({categoryStats.correct}/{categoryStats.total})
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
