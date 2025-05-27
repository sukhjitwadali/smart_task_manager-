"use client"

import { useState, useRef, useLayoutEffect, useMemo, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import { useResponsive } from "../hooks/useResponsive"

export function TaskList({ tasks, onToggleTask, onDeleteTask, onUpdateTask, onReorderTasks }) {
  const { colors, isDarkMode } = useTheme()
  const { isMobile, isTablet, isDesktop, breakpoints } = useResponsive()

  // useState: Use Case 2 - Toggle task completion (filter and sort state)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created")
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // useRef: Use Case 1 - Focus input (for latest task reference)
  const listRef = useRef(null)
  const latestTaskRef = useRef(null)

  // useMemo: Use Case 1 - Memoize filtered tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks

    // Apply filter
    switch (filter) {
      case "completed":
        filtered = tasks.filter((task) => task.completed)
        break
      case "pending":
        filtered = tasks.filter((task) => !task.completed)
        break
      case "high":
        filtered = tasks.filter((task) => task.priority === "high")
        break
      case "medium":
        filtered = tasks.filter((task) => task.priority === "medium")
        break
      case "low":
        filtered = tasks.filter((task) => task.priority === "low")
        break
      default:
        filtered = tasks
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "title":
          return a.title.localeCompare(b.title)
        case "completed":
          return a.completed - b.completed
        case "created":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return sorted
  }, [tasks, filter, sortBy])

  // useLayoutEffect: Use Case 1 - Scroll to latest task
  useLayoutEffect(() => {
    if (tasks.length > 0 && latestTaskRef.current) {
      latestTaskRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [tasks.length])

  // useCallback: Use Case 1 - Add/remove tasks (toggle and delete handlers)
  const handleToggleTask = useCallback(
    (id) => {
      onToggleTask(id)
    },
    [onToggleTask],
  )

  const handleDeleteTask = useCallback(
    (id) => {
      onDeleteTask(id)
    },
    [onDeleteTask],
  )

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", task.id.toString())
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragEnter = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null)
    }
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedTask) return

    const dragIndex = tasks.findIndex((task) => task.id === draggedTask.id)
    if (dragIndex === dropIndex) {
      setDraggedTask(null)
      setDragOverIndex(null)
      return
    }

    const newTasks = [...tasks]
    const [removed] = newTasks.splice(dragIndex, 1)
    newTasks.splice(dropIndex, 0, removed)

    onReorderTasks(newTasks)
    setDraggedTask(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverIndex(null)
  }

  const startEditing = (task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  const saveEdit = () => {
    if (editTitle.trim()) {
      onUpdateTask(editingId, { title: editTitle.trim() })
    }
    setEditingId(null)
    setEditTitle("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return colors.danger
      case "medium":
        return colors.warning
      case "low":
        return colors.success
      default:
        return colors.textSecondary
    }
  }

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: "2px",
        border: `1px solid ${colors.border}`,
        boxShadow: isDarkMode
          ? "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)"
          : "0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: breakpoints.md ? "row" : "column",
          gap: "12px",
          justifyContent: "space-between",
          alignItems: breakpoints.md ? "center" : "flex-start",
          padding: breakpoints.md ? "16px 24px" : "16px",
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.primaryLight,
        }}
      >
        <h2
          style={{
            color: colors.text,
            margin: 0,
            fontSize: breakpoints.md ? "20px" : "18px",
            fontWeight: "600",
            lineHeight: "1.2",
          }}
        >
          Tasks ({filteredAndSortedTasks.length})
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: breakpoints.md ? "row" : "column",
            gap: "8px",
            width: breakpoints.md ? "auto" : "100%",
          }}
        >
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "2px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.background,
              color: colors.text,
              fontSize: "13px",
              fontWeight: "400",
              cursor: "pointer",
              outline: "none",
              minWidth: "120px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "2px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.background,
              color: colors.text,
              fontSize: "13px",
              fontWeight: "400",
              cursor: "pointer",
              outline: "none",
              minWidth: "120px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <option value="created">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
            <option value="completed">Sort by Status</option>
          </select>
        </div>
      </div>

      <div ref={listRef} style={{ maxHeight: "500px", overflowY: "auto", padding: "8px" }}>
        {filteredAndSortedTasks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: colors.textSecondary,
            }}
          >
            <p style={{ fontSize: "14px", margin: 0, lineHeight: "1.4" }}>
              {filter === "all" ? "No tasks yet. Add one above!" : `No ${filter} tasks found.`}
            </p>
          </div>
        ) : (
          filteredAndSortedTasks.map((task, index) => (
            <div
              key={task.id}
              ref={index === filteredAndSortedTasks.length - 1 ? latestTaskRef : null}
              draggable={filter === "all" && sortBy === "created"}
              onDragStart={(e) => handleDragStart(e, task)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                display: "flex",
                flexDirection: breakpoints.md ? "row" : "column",
                gap: "12px",
                alignItems: breakpoints.md ? "center" : "flex-start",
                padding: "12px",
                marginBottom: "8px",
                backgroundColor: dragOverIndex === index ? colors.primaryLight : colors.background,
                borderRadius: "2px",
                borderTop: `1px solid ${task.completed ? colors.success : getPriorityColor(task.priority)}`,
                borderRight: `1px solid ${task.completed ? colors.success : getPriorityColor(task.priority)}`,
                borderBottom: `1px solid ${task.completed ? colors.success : getPriorityColor(task.priority)}`,
                borderLeft: `4px solid ${task.completed ? colors.success : getPriorityColor(task.priority)}`,
                opacity: task.completed ? 0.7 : draggedTask?.id === task.id ? 0.5 : 1,
                transition: "all 0.1s ease",
                cursor: filter === "all" && sortBy === "created" ? "grab" : "default",
                transform: draggedTask?.id === task.id ? "rotate(2deg)" : "none",
              }}
              onMouseEnter={(e) => {
                if (draggedTask?.id !== task.id) {
                  e.currentTarget.style.backgroundColor =
                    dragOverIndex === index ? colors.primaryLight : colors.surfaceHover
                }
              }}
              onMouseLeave={(e) => {
                if (draggedTask?.id !== task.id) {
                  e.currentTarget.style.backgroundColor =
                    dragOverIndex === index ? colors.primaryLight : colors.background
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: breakpoints.md ? "auto" : "100%",
                }}
              >
                {filter === "all" && sortBy === "created" && (
                  <div
                    style={{
                      cursor: "grab",
                      color: colors.textSecondary,
                      fontSize: "16px",
                      padding: "4px",
                      userSelect: "none",
                    }}
                  >
                    ⋮⋮
                  </div>
                )}

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  style={{
                    transform: "scale(1.1)",
                    cursor: "pointer",
                    accentColor: colors.primary,
                  }}
                />
              </div>

              {editingId === task.id ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: breakpoints.md ? "row" : "column",
                    gap: "8px",
                    width: "100%",
                    alignItems: breakpoints.md ? "center" : "stretch",
                  }}
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      borderRadius: "2px",
                      border: `1px solid ${colors.primary}`,
                      backgroundColor: colors.surface,
                      color: colors.text,
                      fontSize: "14px",
                      outline: "none",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    autoFocus
                  />
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      onClick={saveEdit}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: colors.success,
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "2px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: colors.danger,
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "2px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          color: colors.text,
                          textDecoration: task.completed ? "line-through" : "none",
                          fontSize: "14px",
                          fontWeight: "400",
                          wordBreak: "break-word",
                          lineHeight: "1.4",
                        }}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: colors.textSecondary,
                        display: "flex",
                        flexDirection: breakpoints.sm ? "row" : "column",
                        gap: breakpoints.sm ? "12px" : "2px",
                        alignItems: breakpoints.sm ? "center" : "flex-start",
                        lineHeight: "1.3",
                      }}
                    >
                      <span>Priority: {task.priority}</span>
                      {breakpoints.sm && <span>•</span>}
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <button
                      onClick={() => startEditing(task)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: colors.primary,
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "2px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                        transition: "all 0.1s ease",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = colors.primaryHover
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = colors.primary
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: colors.danger,
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "2px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                        transition: "all 0.1s ease",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
