"use client"
import { useTheme } from "../context/ThemeContext"
import { useTaskStats } from "../context/TaskStatsContext"
import { useResponsive } from "../hooks/useResponsive"

export function TaskStats() {
  const { colors, isDarkMode } = useTheme()
  const { breakpoints } = useResponsive()

  // useContext: Use Case 2 - Task stats context
  const { total, completed, pending, completionRate, priorityStats } = useTaskStats()

  const StatCard = ({ title, value, color }) => (
    <div
      style={{
        backgroundColor: colors.background,
        padding: breakpoints.md ? "16px" : "12px",
        borderRadius: "2px",
        textAlign: "center",
        borderTop: `1px solid ${colors.border}`,
        borderRight: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${color}`,
        transition: "all 0.1s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.surfaceHover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.background
      }}
    >
      <div
        style={{
          fontSize: breakpoints.md ? "24px" : "20px",
          fontWeight: "600",
          color,
          marginBottom: "4px",
          lineHeight: "1.2",
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: colors.textSecondary,
          fontSize: breakpoints.md ? "13px" : "12px",
          fontWeight: "400",
          lineHeight: "1.3",
        }}
      >
        {title}
      </div>
    </div>
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
        Statistics
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: breakpoints.md ? "12px" : "8px",
          marginBottom: "16px",
        }}
      >
        <StatCard title="Total Tasks" value={total} color={colors.primary} />
        <StatCard title="Completed" value={completed} color={colors.success} />
        <StatCard title="Pending" value={pending} color={colors.warning} />
        <StatCard title="Success Rate" value={`${completionRate}%`} color={colors.info} />
      </div>

      <div
        style={{
          padding: breakpoints.md ? "16px" : "12px",
          backgroundColor: colors.background,
          borderRadius: "2px",
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3
          style={{
            color: colors.text,
            marginBottom: "12px",
            fontSize: breakpoints.md ? "16px" : "14px",
            fontWeight: "600",
            lineHeight: "1.2",
          }}
        >
          Priority Breakdown
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
              borderRadius: "2px",
              backgroundColor: colors.surfaceHover,
              borderTop: `1px solid ${colors.border}`,
              borderRight: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`,
              borderLeft: `3px solid ${colors.danger}`,
            }}
          >
            <span style={{ color: colors.text, fontWeight: "400", fontSize: "13px" }}>High Priority</span>
            <span
              style={{
                color: colors.danger,
                fontWeight: "600",
                fontSize: breakpoints.md ? "14px" : "13px",
              }}
            >
              {priorityStats.high || 0}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
              borderRadius: "2px",
              backgroundColor: colors.surfaceHover,
              borderTop: `1px solid ${colors.border}`,
              borderRight: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`,
              borderLeft: `3px solid ${colors.warning}`,
            }}
          >
            <span style={{ color: colors.text, fontWeight: "400", fontSize: "13px" }}>Medium Priority</span>
            <span
              style={{
                color: colors.warning,
                fontWeight: "600",
                fontSize: breakpoints.md ? "14px" : "13px",
              }}
            >
              {priorityStats.medium || 0}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
              borderRadius: "2px",
              backgroundColor: colors.surfaceHover,
              borderTop: `1px solid ${colors.border}`,
              borderRight: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`,
              borderLeft: `3px solid ${colors.success}`,
            }}
          >
            <span style={{ color: colors.text, fontWeight: "400", fontSize: "13px" }}>Low Priority</span>
            <span
              style={{
                color: colors.success,
                fontWeight: "600",
                fontSize: breakpoints.md ? "14px" : "13px",
              }}
            >
              {priorityStats.low || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
