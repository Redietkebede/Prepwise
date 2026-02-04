"use client"

import { BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface NoQuestionsProps {
  darkMode: boolean
}

export function NoQuestions({ darkMode }: NoQuestionsProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <Card className={`max-w-md ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
        <CardContent className="p-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : ""}`}>
            No Questions Available
          </h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Generate questions first from the Exam tab.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
