"use client"

import { useState, useRef, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import { useResponsive } from "../hooks/useResponsive"

export function TaskInput({ onAddTask }) {
  const { colors, isDarkMode } = useTheme()
  const { breakpoints } = useResponsive()

  // useState: Use Case 1 - Store task list (input values)
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")

  // useRef: Use Case 1 - Focus input
  const titleInputRef = useRef(null)

  // useCallback: Use Case 1 - Add/remove tasks
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (title.trim()) {
        onAddTask({
          id: Date.now(),
          title: title.trim(),
          priority,
          completed: false,
          createdAt: new Date().toISOString(),
        })
        setTitle("")
        setPriority("medium")
        // useRef: Use Case 1 - Focus input after adding
        titleInputRef.current?.focus()
      }
    },
    [title, priority, onAddTask],
  )

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        padding: breakpoints.md ? "24px" : "16px",
        borderRadius: "2px",
        border: `1px solid ${colors.border}`,
        boxShadow: isDarkMode
          ? "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)"
          : "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
        transition: "all 0.1s ease",
      }}
    >
      <h2
        style={{
          color: colors.text,
          margin: "0 0 16px 0",
          fontSize: breakpoints.md ? "20px" : "18px",
          fontWeight: "600",
          lineHeight: "1.2",
        }}
      >
        Add New Task
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "2px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.background,
              color: colors.text,
              fontSize: "14px",
              fontWeight: "400",
              transition: "all 0.1s ease",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              lineHeight: "1.4",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary
              e.target.style.boxShadow = `0 0 0 1px ${colors.primary}`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border
              e.target.style.boxShadow = "none"
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: breakpoints.sm ? "row" : "column",
            gap: "12px",
            alignItems: breakpoints.sm ? "center" : "stretch",
          }}
        >
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "2px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.background,
              color: colors.text,
              fontSize: "14px",
              fontWeight: "400",
              cursor: "pointer",
              transition: "all 0.1s ease",
              outline: "none",
              minWidth: "140px",
              flex: breakpoints.sm ? "0 0 auto" : "1",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border
            }}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button
            type="submit"
            disabled={!title.trim()}
            style={{
              backgroundColor: title.trim() ? colors.primary : colors.border,
              color: title.trim() ? "#ffffff" : colors.textSecondary,
              padding: "8px 16px",
              borderRadius: "2px",
              border: `1px solid ${title.trim() ? colors.primary : colors.border}`,
              cursor: title.trim() ? "pointer" : "not-allowed",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.1s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: breakpoints.sm ? "auto" : "100%",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              lineHeight: "1.4",
            }}
            onMouseEnter={(e) => {
              if (title.trim()) {
                e.target.style.backgroundColor = colors.primaryHover
                e.target.style.borderColor = colors.primaryHover
              }
            }}
            onMouseLeave={(e) => {
              if (title.trim()) {
                e.target.style.backgroundColor = colors.primary
                e.target.style.borderColor = colors.primary
              }
            }}
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  )
}
