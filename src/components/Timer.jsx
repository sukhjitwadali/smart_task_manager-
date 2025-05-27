"use client"

import { useState, useLayoutEffect, useRef, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import { useResponsive } from "../hooks/useResponsive"
import { useTaskTimer } from "../hooks/usePomodoroTimer"

export function Timer() {
  const { colors, isDarkMode } = useTheme()
  const { breakpoints } = useResponsive()

  // useState: Use Case 2 - Toggle task completion (timer settings)
  const [customDuration, setCustomDuration] = useState(25)

  // useReducer: Use Case 2 - Handle timer logic (from custom hook)
  const { timeLeft, isRunning, duration, startTimer, pauseTimer, resetTimer, setDuration } = useTaskTimer()

  // useRef: Use Case 2 - Track timer interval ID (timer display reference)
  const timerDisplayRef = useRef(null)

  // useLayoutEffect: Use Case 2 - Layout adjustment
  useLayoutEffect(() => {
    if (timerDisplayRef.current) {
      // Adjust font size based on container width
      const container = timerDisplayRef.current
      const containerWidth = container.offsetWidth
      const fontSize = Math.min(containerWidth / 6, 48)
      container.style.fontSize = `${fontSize}px`
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // useCallback: Use Case 2 - Control timer
  const handleDurationChange = useCallback(() => {
    const newDuration = customDuration * 60
    setDuration(newDuration)
  }, [customDuration, setDuration])

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        padding: breakpoints.md ? "24px" : "16px",
        borderRadius: "2px",
        textAlign: "center",
        border: `1px solid ${colors.border}`,
        boxShadow: isDarkMode
          ? "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)"
          : "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
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
        Task Timer
      </h2>

      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: breakpoints.sm ? "row" : "column",
            gap: "8px",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: colors.background,
            borderRadius: "2px",
            border: `1px solid ${colors.border}`,
          }}
        >
          <input
            type="number"
            value={customDuration}
            onChange={(e) => setCustomDuration(Number(e.target.value))}
            min="1"
            max="120"
            style={{
              width: "60px",
              padding: "6px 8px",
              borderRadius: "2px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
              color: colors.text,
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "400",
              outline: "none",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          />
          <span style={{ color: colors.text, fontWeight: "400", fontSize: "14px" }}>minutes</span>
          <button
            onClick={handleDurationChange}
            disabled={isRunning}
            style={{
              padding: "6px 12px",
              backgroundColor: isRunning ? colors.border : colors.primary,
              color: isRunning ? colors.textSecondary : "#ffffff",
              border: "none",
              borderRadius: "2px",
              cursor: isRunning ? "not-allowed" : "pointer",
              fontWeight: "600",
              transition: "all 0.1s ease",
              fontSize: "13px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Set Timer
          </button>
        </div>
      </div>

      <div
        ref={timerDisplayRef}
        style={{
          color: timeLeft === 0 ? colors.success : colors.text,
          fontWeight: "600",
          fontFamily: "'Consolas', 'Courier New', monospace",
          marginBottom: "16px",
          minHeight: breakpoints.md ? "80px" : "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          borderRadius: "2px",
          borderTop: `2px solid ${timeLeft === 0 ? colors.success : colors.border}`,
          borderRight: `2px solid ${timeLeft === 0 ? colors.success : colors.border}`,
          borderBottom: `2px solid ${timeLeft === 0 ? colors.success : colors.border}`,
          borderLeft: `4px solid ${timeLeft === 0 ? colors.success : colors.primary}`,
          padding: "16px",
        }}
      >
        {formatTime(timeLeft)}
      </div>

      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: colors.background,
          borderRadius: "2px",
          marginBottom: "16px",
          overflow: "hidden",
          borderTop: `1px solid ${colors.border}`,
          borderRight: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
          borderLeft: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: colors.primary,
            transition: "width 1s linear",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: breakpoints.sm ? "row" : "column",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          style={{
            padding: "8px 16px",
            backgroundColor: isRunning ? colors.warning : colors.success,
            color: "#ffffff",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.1s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          style={{
            padding: "8px 16px",
            backgroundColor: colors.danger,
            color: "#ffffff",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.1s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Reset
        </button>
      </div>

      {timeLeft === 0 && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: colors.success,
            color: "#ffffff",
            borderRadius: "2px",
            fontWeight: "400",
            fontSize: breakpoints.md ? "14px" : "13px",
            lineHeight: "1.4",
            borderTop: `1px solid ${colors.success}`,
            borderRight: `1px solid ${colors.success}`,
            borderBottom: `1px solid ${colors.success}`,
            borderLeft: `1px solid ${colors.success}`,
          }}
        >
          Task time completed! Great work! Ready for the next task?
        </div>
      )}
    </div>
  )
}
