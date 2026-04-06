"use client"

import { useExam } from "@/hooks/use-exam"
import { calculateResults } from "@/lib/exam/utils"
import {
  ExamHeader,
  StartScreen,
  QuestionCard,
  QuestionNav,
  ResultsScreen,
  NoQuestions,
} from "@/components/exam"

export default function ExamPlatform() {
  const {
    darkMode,
    setDarkMode,
    currentTheme,
    difficulty,
    setDifficulty,
    examMode,
    setExamMode,
    generationPrompt,
    setGenerationPrompt,
    questionCount,
    setQuestionCount,
    aiModel,
    allowedModels,
    remainingCredits,
    remainingQuestionsByModel,
    setAiModel,
    isModelConfigLoading,
    isGenerating,
    generationError,
    generationCooldownLeft,
    currentQuestion,
    selectedAnswers,
    showResults,
    timeLeft,
    questionTimeLeft,
    examStarted,
    showHint,
    setShowHint,
    bookmarkedQuestions,
    showExplanation,
    currentStreak,
    lastExam,
    questions,
    handleAnswerSelect,
    goToQuestion,
    startExam,
    submitExam,
    resetExam,
    toggleBookmark,
  } = useExam()

  const results = calculateResults(questions, selectedAnswers)
  const currentQuestionData = questions[currentQuestion]

  return (
    <div className={`min-h-screen text-foreground transition-all duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <ExamHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        examStarted={examStarted}
        showResults={showResults}
        examMode={examMode}
        timeLeft={timeLeft}
        questionTimeLeft={questionTimeLeft}
        currentStreak={currentStreak}
        hasTimeLimit={Boolean(currentQuestionData?.timeLimit)}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!examStarted ? (
          <StartScreen
            darkMode={darkMode}
            currentTheme={currentTheme}
            generationPrompt={generationPrompt}
            setGenerationPrompt={setGenerationPrompt}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            aiModel={aiModel}
            allowedModels={allowedModels}
            remainingCredits={remainingCredits}
            remainingQuestionsForModel={remainingQuestionsByModel[aiModel]}
            setAiModel={setAiModel}
            isModelConfigLoading={isModelConfigLoading}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            examMode={examMode}
            setExamMode={setExamMode}
            isGenerating={isGenerating}
            generationError={generationError}
            generationCooldownLeft={generationCooldownLeft}
            lastExam={lastExam}
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
        ) : questions.length === 0 ? (
          <NoQuestions darkMode={darkMode} />
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
      </main>
    </div>
  )
}
