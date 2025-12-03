"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

interface AuthContextValue {
  isAuthenticated: boolean
  isReady: boolean
  isSubmitting: boolean
  userEmail: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const AUTH_FLAG_KEY = "seo-space-authenticated"
const AUTH_EMAIL_KEY = "seo-space-auth-email"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_FLAG_KEY)
    const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY)
    setIsAuthenticated(storedAuth === "true")
    setUserEmail(storedEmail)
    setIsReady(true)
  }, [])

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email and password are required.")
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    localStorage.setItem(AUTH_FLAG_KEY, "true")
    localStorage.setItem(AUTH_EMAIL_KEY, email)
    setUserEmail(email)
    setIsAuthenticated(true)
    setIsSubmitting(false)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_FLAG_KEY)
    localStorage.removeItem(AUTH_EMAIL_KEY)
    setIsAuthenticated(false)
    setUserEmail(null)
    setIsSubmitting(false)
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      isReady,
      isSubmitting,
      userEmail,
      login,
      logout,
    }),
    [isAuthenticated, isReady, isSubmitting, userEmail],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
