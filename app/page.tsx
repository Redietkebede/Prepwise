"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useExam } from "@/hooks/use-exam"
import { calculateResults } from "@/lib/exam/utils"
import {
  ExamHeader,
  StartScreen,
  QuestionCard,
  QuestionNav,
  ResultsScreen,
  StatsTab,
  AchievementsTab,
  SettingsTab,
  NoQuestions,
} from "@/components/exam"

export default function ExamPlatform() {
  const {
    darkMode,
    setDarkMode,
    currentTheme,
    setCurrentTheme,
    selectedCategory,
    setSelectedCategory,
    difficulty,
    setDifficulty,
    examMode,
    setExamMode,
    currentQuestion,
    selectedAnswers,
    showResults,
    timeLeft,
    questionTimeLeft,
    examStarted,
    showHint,
    setShowHint,
    bookmarkedQuestions,
    soundEnabled,
    setSoundEnabled,
    showExplanation,
    currentStreak,
    stats,
    questions,
    activeTab,
    setActiveTab,
    handleAnswerSelect,
    goToQuestion,
    startExam,
    submitExam,
    resetExam,
    toggleBookmark,
    resetStats,
  } = useExam()

  if (questions.length === 0) {
    return <NoQuestions darkMode={darkMode} />
  }

  const results = calculateResults(questions, selectedAnswers)
  const currentQuestionData = questions[currentQuestion]

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <ExamHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        examStarted={examStarted}
        showResults={showResults}
        examMode={examMode}
        timeLeft={timeLeft}
        questionTimeLeft={questionTimeLeft}
        currentStreak={currentStreak}
        hasTimeLimit={Boolean(currentQuestionData?.timeLimit)}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="exam">Exam</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="exam" className="space-y-6">
            {!examStarted ? (
              <StartScreen
                darkMode={darkMode}
                currentTheme={currentTheme}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                examMode={examMode}
                setExamMode={setExamMode}
                questionsCount={questions.length}
                stats={stats}
                onStart={startExam}
              />
            ) : showResults ? (
              <ResultsScreen
                questions={questions}
                selectedAnswers={selectedAnswers}
                results={results}
                currentStreak={currentStreak}
                darkMode={darkMode}
                currentTheme={currentTheme}
                bookmarkedQuestions={bookmarkedQuestions}
                onToggleBookmark={toggleBookmark}
                onReset={resetExam}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <QuestionNav
                    questions={questions}
                    currentQuestion={currentQuestion}
                    selectedAnswers={selectedAnswers}
                    bookmarkedQuestions={bookmarkedQuestions}
                    darkMode={darkMode}
                    currentTheme={currentTheme}
                    currentStreak={currentStreak}
                    onQuestionSelect={goToQuestion}
                  />
                </div>
                <div className="lg:col-span-3">
                  <QuestionCard
                    question={currentQuestionData}
                    questionIndex={currentQuestion}
                    totalQuestions={questions.length}
                    selectedAnswer={selectedAnswers[currentQuestion]}
                    darkMode={darkMode}
                    currentTheme={currentTheme}
                    examMode={examMode}
                    showHint={showHint}
                    showExplanation={showExplanation}
                    questionTimeLeft={questionTimeLeft}
                    isBookmarked={bookmarkedQuestions.has(currentQuestionData.id)}
                    onAnswerSelect={handleAnswerSelect}
                    onToggleHint={() => setShowHint(!showHint)}
                    onToggleBookmark={() => toggleBookmark(currentQuestionData.id)}
                    onPrevious={() => goToQuestion(currentQuestion - 1)}
                    onNext={() => goToQuestion(currentQuestion + 1)}
                    onSubmit={submitExam}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <StatsTab stats={stats} darkMode={darkMode} />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementsTab stats={stats} darkMode={darkMode} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              onResetStats={resetStats}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
