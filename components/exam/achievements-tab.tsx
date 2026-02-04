"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExamStats } from "@/lib/exam/types"
import { ACHIEVEMENTS } from "@/lib/exam/data"

interface AchievementsTabProps {
  stats: ExamStats
  darkMode: boolean
}

export function AchievementsTab({ stats, darkMode }: AchievementsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = stats.achievements.includes(achievement.id)

        return (
          <Card
            key={achievement.id}
            className={`${darkMode ? "bg-gray-800 border-gray-700" : ""} ${
              isUnlocked ? "ring-2 ring-yellow-500" : "opacity-60"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    isUnlocked ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <achievement.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? "text-white" : ""}`}>{achievement.name}</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {achievement.description}
                  </p>
                  {isUnlocked && <Badge className="mt-2 bg-yellow-100 text-yellow-800">Unlocked!</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
