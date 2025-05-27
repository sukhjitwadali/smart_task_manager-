"use client"

import { useState, useEffect } from "react"

export function useResponsive() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = screenSize.width < 640
  const isTablet = screenSize.width >= 640 && screenSize.width < 1024
  const isDesktop = screenSize.width >= 1024

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints: {
      sm: screenSize.width >= 640,
      md: screenSize.width >= 768,
      lg: screenSize.width >= 1024,
      xl: screenSize.width >= 1280,
    },
  }
}
