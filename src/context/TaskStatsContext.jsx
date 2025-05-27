"use client"

import { createContext, useContext, useMemo } from "react"

const TaskStatsContext = createContext()

export function TaskStatsProvider({ children, tasks }) {
  // useMemo: Use Case 2 - Memoize completion stats
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    const priorityStats = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {})

    return {
      total,
      completed,
      pending,
      completionRate,
      priorityStats,
    }
  }, [tasks])

  return <TaskStatsContext.Provider value={stats}>{children}</TaskStatsContext.Provider>
}

export function useTaskStats() {
  const context = useContext(TaskStatsContext)
  if (!context) {
    throw new Error("useTaskStats must be used within a TaskStatsProvider")
  }
  return context
}
