"use client"

import { createContext, useContext, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // useState: Toggle theme state
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => setIsDarkMode((prev) => !prev)

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Outlook Primary Colors
      primary: "#0078d4", // Outlook Blue
      primaryHover: "#106ebe",
      primaryLight: "#deecf9",

      // Outlook Status Colors
      success: "#107c10", // Outlook Green
      warning: "#ff8c00", // Outlook Orange
      danger: "#d13438", // Outlook Red
      info: "#0078d4",

      // Outlook Background Colors
      background: isDarkMode ? "#201f1e" : "#ffffff",
      surface: isDarkMode ? "#292827" : "#faf9f8",
      surfaceHover: isDarkMode ? "#323130" : "#f3f2f1",

      // Outlook Text Colors
      text: isDarkMode ? "#ffffff" : "#323130",
      textSecondary: isDarkMode ? "#c8c6c4" : "#605e5c",
      textTertiary: isDarkMode ? "#a19f9d" : "#8a8886",

      // Outlook Border Colors
      border: isDarkMode ? "#484644" : "#edebe9",
      borderHover: isDarkMode ? "#605e5c" : "#c8c6c4",

      // Outlook Accent Colors
      accent: "#0078d4",
      accentLight: "#c7e0f4",
      accentDark: "#004578",
    },
  }

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
