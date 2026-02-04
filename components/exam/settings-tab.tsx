"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface SettingsTabProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (value: boolean) => void
  onResetStats: () => void
}

export function SettingsTab({
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  onResetStats,
}: SettingsTabProps) {
  return (
    <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
      <CardHeader>
        <CardTitle className={`${darkMode ? "text-white" : ""}`}>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className={`font-medium ${darkMode ? "text-white" : ""}`}>Sound Effects</label>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Play sounds for correct/incorrect answers
            </p>
          </div>
          <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className={`font-medium ${darkMode ? "text-white" : ""}`}>Dark Mode</label>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Toggle dark/light theme
            </p>
          </div>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>

        <div className="pt-6 border-t">
          <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : ""}`}>Data Management</h3>
          <Button variant="destructive" onClick={onResetStats}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All Progress
          </Button>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            This will clear all your statistics and achievements.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
