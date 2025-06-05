"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getCurrentUser, isAuthenticated, signInWithMetaMask, signOut } from "@/lib/auth"
import type { UserProfile } from "@/lib/supabase"

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  signIn: () => Promise<{ success: boolean; error: any }>
  logout: () => Promise<boolean>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false, error: "AuthContext not initialized" }),
  logout: async () => false,
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    if (isAuthenticated()) {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser()
      setLoading(false)
    }

    initAuth()
  }, [])

  const signIn = async () => {
    try {
      const { user, error } = await signInWithMetaMask()
      if (error) throw error
      setUser(user)
      return { success: true, error: null }
    } catch (error) {
      console.error("Failed to sign in:", error)
      return { success: false, error }
    }
  }

  const logout = async () => {
    await signOut()
    setUser(null)
    return true
  }

  return <AuthContext.Provider value={{ user, loading, signIn, logout, refreshUser }}>{children}</AuthContext.Provider>
}
