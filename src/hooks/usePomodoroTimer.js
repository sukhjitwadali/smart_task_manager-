"use client"

import { useReducer, useRef, useCallback } from "react"

const TIMER_ACTIONS = {
  START: "START",
  PAUSE: "PAUSE",
  RESET: "RESET",
  TICK: "TICK",
  SET_DURATION: "SET_DURATION",
}

function timerReducer(state, action) {
  switch (action.type) {
    case TIMER_ACTIONS.START:
      return { ...state, isRunning: true }
    case TIMER_ACTIONS.PAUSE:
      return { ...state, isRunning: false }
    case TIMER_ACTIONS.RESET:
      return { ...state, timeLeft: state.duration, isRunning: false }
    case TIMER_ACTIONS.TICK:
      return {
        ...state,
        timeLeft: Math.max(0, state.timeLeft - 1),
        isRunning: state.timeLeft > 1 ? state.isRunning : false,
      }
    case TIMER_ACTIONS.SET_DURATION:
      return {
        ...state,
        duration: action.payload,
        timeLeft: action.payload,
        isRunning: false,
      }
    default:
      return state
  }
}

export function useTaskTimer(initialDuration = 25 * 60) {
  // useReducer: Handle timer logic
  const [state, dispatch] = useReducer(timerReducer, {
    duration: initialDuration,
    timeLeft: initialDuration,
    isRunning: false,
  })

  // useRef: Track timer interval ID
  const intervalRef = useRef(null)

  // useCallback: Control timer functions
  const startTimer = useCallback(() => {
    dispatch({ type: TIMER_ACTIONS.START })
    intervalRef.current = setInterval(() => {
      dispatch({ type: TIMER_ACTIONS.TICK })
    }, 1000)
  }, [])

  const pauseTimer = useCallback(() => {
    dispatch({ type: TIMER_ACTIONS.PAUSE })
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resetTimer = useCallback(() => {
    dispatch({ type: TIMER_ACTIONS.RESET })
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const setDuration = useCallback((duration) => {
    dispatch({ type: TIMER_ACTIONS.SET_DURATION, payload: duration })
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
  }
}
