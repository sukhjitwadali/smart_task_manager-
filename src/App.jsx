"use client"

import { useReducer, useCallback, useEffect } from "react"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import { TaskStatsProvider } from "./context/TaskStatsContext"
import { TaskInput } from "./components/TaskInput"
import { TaskList } from "./components/TaskList"
import { TaskStats } from "./components/TaskStats"
import { Timer } from "./components/Timer"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { useResponsive } from "./hooks/useResponsive"

const TASK_ACTIONS = {
  ADD_TASK: "ADD_TASK",
  TOGGLE_TASK: "TOGGLE_TASK",
  DELETE_TASK: "DELETE_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  LOAD_TASKS: "LOAD_TASKS",
  REORDER_TASKS: "REORDER_TASKS",
}

// useReducer: Use Case 1 - Manage task list
function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.ADD_TASK:
      return [...state, action.payload]
    case TASK_ACTIONS.TOGGLE_TASK:
      return state.map((task) => (task.id === action.payload ? { ...task, completed: !task.completed } : task))
    case TASK_ACTIONS.DELETE_TASK:
      return state.filter((task) => task.id !== action.payload)
    case TASK_ACTIONS.UPDATE_TASK:
      return state.map((task) => (task.id === action.payload.id ? { ...task, ...action.payload.updates } : task))
    case TASK_ACTIONS.LOAD_TASKS:
      return action.payload
    case TASK_ACTIONS.REORDER_TASKS:
      return action.payload
    default:
      return state
  }
}

function AppContent() {
  const { colors, isDarkMode, toggleTheme } = useTheme()
  const { isMobile, isTablet, isDesktop, breakpoints } = useResponsive()

  // useState: Use Case 1 - Store task list
  // useReducer: Use Case 1 - Manage task list
  const [tasks, dispatch] = useReducer(taskReducer, [])

  // Custom Hook: Use Case 1 - useLocalStorage
  const [storedTasks, setStoredTasks] = useLocalStorage("tasks", [])

  // useEffect: Use Case 2 - Load tasks on mount
  useEffect(() => {
    if (storedTasks.length > 0 && tasks.length === 0) {
      dispatch({ type: TASK_ACTIONS.LOAD_TASKS, payload: storedTasks })
    }
  }, []) // Load tasks on mount only

  // useEffect: Use Case 1 - Sync tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0 || storedTasks.length > 0) {
      setStoredTasks(tasks)
    }
  }, [tasks, setStoredTasks]) // Sync tasks to localStorage

  // useCallback: Use Case 1 - Add/remove tasks
  const addTask = useCallback((task) => {
    dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: task })
  }, [])

  const removeTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id })
  }, [])

  const toggleTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.TOGGLE_TASK, payload: id })
  }, [])

  const updateTask = useCallback((id, updates) => {
    dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: { id, updates } })
  }, [])

  const reorderTasks = useCallback((newTasks) => {
    dispatch({ type: TASK_ACTIONS.REORDER_TASKS, payload: newTasks })
  }, [])

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        color: colors.text,
        transition: "all 0.3s ease",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: breakpoints.md ? "24px" : "16px",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: breakpoints.md ? "row" : "column",
            gap: "16px",
            justifyContent: "space-between",
            alignItems: breakpoints.md ? "center" : "flex-start",
            marginBottom: breakpoints.md ? "32px" : "24px",
            padding: breakpoints.md ? "20px 24px" : "16px",
            backgroundColor: colors.surface,
            borderRadius: "2px",
            border: `1px solid ${colors.border}`,
            boxShadow: isDarkMode
              ? "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)"
              : "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: breakpoints.md ? "28px" : "24px",
                fontWeight: "600",
                color: colors.text,
                margin: 0,
                lineHeight: "1.2",
              }}
            >
              Smart Task Manager
            </h1>
            <p
              style={{
                color: colors.textSecondary,
                margin: "8px 0 0 0",
                fontSize: breakpoints.md ? "14px" : "13px",
                fontWeight: "400",
                lineHeight: "1.4",
              }}
            >
              React Hooks Demonstration with Outlook Styling
            </p>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              padding: breakpoints.md ? "8px 16px" : "6px 12px",
              backgroundColor: colors.primary,
              color: "#ffffff",
              border: `1px solid ${colors.primary}`,
              borderRadius: "2px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.1s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              alignSelf: "flex-start",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primaryHover
              e.target.style.borderColor = colors.primaryHover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.primary
              e.target.style.borderColor = colors.primary
            }}
          >
            {breakpoints.sm && <span>{isDarkMode ? "Light" : "Dark"} Theme</span>}
          </button>
        </header>

        {/* useContext: Use Case 2 - Task stats context */}
        <TaskStatsProvider tasks={tasks}>
          <div
            style={{
              display: isDesktop ? "grid" : "flex",
              flexDirection: isDesktop ? "initial" : "column",
              gridTemplateColumns: isDesktop ? "2fr 1fr" : "initial",
              gap: breakpoints.lg ? "24px" : "16px",
              alignItems: "start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                order: isDesktop ? 1 : 2,
              }}
            >
              <TaskInput onAddTask={addTask} />
              <TaskList
                tasks={tasks}
                onToggleTask={toggleTask}
                onDeleteTask={removeTask}
                onUpdateTask={updateTask}
                onReorderTasks={reorderTasks}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                order: isDesktop ? 2 : 1,
              }}
            >
              <TaskStats />
              <Timer />
            </div>
          </div>
        </TaskStatsProvider>
      </div>
    </div>
  )
}

function App() {
  return (
    // useContext: Use Case 1 - Theme context
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
