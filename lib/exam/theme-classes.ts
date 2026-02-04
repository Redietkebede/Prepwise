import { Theme } from "./types"

const PRIMARY_THEME_CLASSES = {
  blue: {
    text500: "text-blue-500",
    border500: "border-blue-500",
    border400: "border-blue-400",
    bg50: "bg-blue-50",
    bg500: "bg-blue-500",
    bg900_20: "bg-blue-900/20",
    text100: "text-blue-100",
    from500_10: "from-blue-500/10",
  },
  purple: {
    text500: "text-purple-500",
    border500: "border-purple-500",
    border400: "border-purple-400",
    bg50: "bg-purple-50",
    bg500: "bg-purple-500",
    bg900_20: "bg-purple-900/20",
    text100: "text-purple-100",
    from500_10: "from-purple-500/10",
  },
  green: {
    text500: "text-green-500",
    border500: "border-green-500",
    border400: "border-green-400",
    bg50: "bg-green-50",
    bg500: "bg-green-500",
    bg900_20: "bg-green-900/20",
    text100: "text-green-100",
    from500_10: "from-green-500/10",
  },
  orange: {
    text500: "text-orange-500",
    border500: "border-orange-500",
    border400: "border-orange-400",
    bg50: "bg-orange-50",
    bg500: "bg-orange-500",
    bg900_20: "bg-orange-900/20",
    text100: "text-orange-100",
    from500_10: "from-orange-500/10",
  },
  pink: {
    text500: "text-pink-500",
    border500: "border-pink-500",
    border400: "border-pink-400",
    bg50: "bg-pink-50",
    bg500: "bg-pink-500",
    bg900_20: "bg-pink-900/20",
    text100: "text-pink-100",
    from500_10: "from-pink-500/10",
  },
} as const

const ACCENT_THEME_CLASSES = {
  cyan: {
    text500: "text-cyan-500",
    to500_10: "to-cyan-500/10",
  },
  fuchsia: {
    text500: "text-fuchsia-500",
    to500_10: "to-fuchsia-500/10",
  },
  teal: {
    text500: "text-teal-500",
    to500_10: "to-teal-500/10",
  },
  yellow: {
    text500: "text-yellow-500",
    to500_10: "to-yellow-500/10",
  },
  red: {
    text500: "text-red-500",
    to500_10: "to-red-500/10",
  },
} as const

export function getThemeClasses(theme: Theme) {
  const primary = PRIMARY_THEME_CLASSES[theme.primary as keyof typeof PRIMARY_THEME_CLASSES] ?? PRIMARY_THEME_CLASSES.blue
  const accent = ACCENT_THEME_CLASSES[theme.accent as keyof typeof ACCENT_THEME_CLASSES] ?? ACCENT_THEME_CLASSES.cyan
  return { primary, accent }
}
