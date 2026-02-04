import {
  Code,
  Atom,
  Calculator,
  Globe,
  Play,
  Trophy,
  Zap,
  Target,
  Star,
  Award,
} from "lucide-react"
import { Theme, Achievement, CategoryData } from "./types"

export const THEMES: Theme[] = [
  { name: "Blue", primary: "blue", secondary: "slate", accent: "cyan", background: "slate" },
  { name: "Purple", primary: "purple", secondary: "violet", accent: "fuchsia", background: "slate" },
  { name: "Green", primary: "green", secondary: "emerald", accent: "teal", background: "slate" },
  { name: "Orange", primary: "orange", secondary: "amber", accent: "yellow", background: "slate" },
  { name: "Pink", primary: "pink", secondary: "rose", accent: "red", background: "slate" },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_exam", name: "Getting Started", description: "Complete your first exam", icon: Play },
  { id: "perfect_score", name: "Perfectionist", description: "Score 100% on an exam", icon: Trophy },
  { id: "speed_demon", name: "Speed Demon", description: "Complete an exam in under 5 minutes", icon: Zap },
  { id: "streak_5", name: "On Fire", description: "Get 5 questions correct in a row", icon: Target },
  { id: "category_master", name: "Category Master", description: "Score 90%+ in all categories", icon: Star },
  { id: "hundred_questions", name: "Century Club", description: "Answer 100 questions correctly", icon: Award },
]

export const EXAM_DATA: { categories: Record<string, CategoryData> } = {
  categories: {
    "Computer Science": {
      icon: Code,
      color: "text-blue-500",
      questions: [
        {
          id: 1,
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language",
          ],
          correctAnswer: 0,
          explanation:
            "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.",
          difficulty: "easy" as const,
          category: "Computer Science",
          points: 10,
          timeLimit: 30,
          hint: "Think about web development and markup",
        },
        {
          id: 2,
          question: "Which of the following is NOT a programming paradigm?",
          options: ["Object-Oriented", "Functional", "Procedural", "Circular"],
          correctAnswer: 3,
          explanation:
            "Circular is not a recognized programming paradigm. The main paradigms include Object-Oriented, Functional, and Procedural programming.",
          difficulty: "medium" as const,
          category: "Computer Science",
          points: 20,
          timeLimit: 45,
        },
        {
          id: 3,
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correctAnswer: 1,
          explanation:
            "Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step.",
          difficulty: "hard" as const,
          category: "Computer Science",
          points: 30,
          timeLimit: 60,
        },
      ],
    },
    Science: {
      icon: Atom,
      color: "text-green-500",
      questions: [
        {
          id: 4,
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "NaCl", "O2"],
          correctAnswer: 0,
          explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.",
          difficulty: "easy" as const,
          category: "Science",
          points: 10,
          timeLimit: 20,
        },
        {
          id: 5,
          question: "Which planet is closest to the Sun?",
          options: ["Venus", "Earth", "Mercury", "Mars"],
          correctAnswer: 2,
          explanation: "Mercury is the closest planet to the Sun in our solar system.",
          difficulty: "easy" as const,
          category: "Science",
          points: 10,
          timeLimit: 25,
        },
        {
          id: 6,
          question: "What is the speed of light in vacuum?",
          options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"],
          correctAnswer: 0,
          explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second.",
          difficulty: "hard" as const,
          category: "Science",
          points: 30,
          timeLimit: 45,
        },
      ],
    },
    Mathematics: {
      icon: Calculator,
      color: "text-purple-500",
      questions: [
        {
          id: 7,
          question: "What is 15% of 200?",
          options: ["25", "30", "35", "40"],
          correctAnswer: 1,
          explanation: "15% of 200 = 0.15 × 200 = 30",
          difficulty: "easy" as const,
          category: "Mathematics",
          points: 10,
          timeLimit: 30,
        },
        {
          id: 8,
          question: "What is the derivative of x²?",
          options: ["x", "2x", "x²", "2x²"],
          correctAnswer: 1,
          explanation: "The derivative of x² is 2x using the power rule.",
          difficulty: "medium" as const,
          category: "Mathematics",
          points: 20,
          timeLimit: 40,
        },
      ],
    },
    Geography: {
      icon: Globe,
      color: "text-orange-500",
      questions: [
        {
          id: 9,
          question: "What is the capital of Australia?",
          options: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correctAnswer: 2,
          explanation: "Canberra is the capital city of Australia, not Sydney or Melbourne as commonly thought.",
          difficulty: "medium" as const,
          category: "Geography",
          points: 20,
          timeLimit: 35,
        },
        {
          id: 10,
          question: "Which is the longest river in the world?",
          options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
          correctAnswer: 1,
          explanation: "The Nile River is generally considered the longest river in the world at about 6,650 km.",
          difficulty: "medium" as const,
          category: "Geography",
          points: 20,
          timeLimit: 40,
        },
      ],
    },
  },
}

export const DEFAULT_STATS = {
  totalExams: 0,
  averageScore: 0,
  bestScore: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  streak: 0,
  achievements: [],
  categoryStats: {},
}
