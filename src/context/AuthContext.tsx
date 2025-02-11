"use client"

import type React from "react"
import { createContext, useState, useEffect, type ReactNode } from "react"
import type { Warehouseman } from "../types/api"
import { getData } from "../utils/asyncStorage"
import { api } from "../services/api"

interface AuthContextType {
  user: Warehouseman | null
  setUser: React.Dispatch<React.SetStateAction<Warehouseman | null>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Warehouseman | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const userId = await getData("userId")
      if (userId) {
        try {
          const warehousemen = await api.getWarehousemen()
          const user = warehousemen.find((w) => w.id.toString() === userId)
          if (user) {
            setUser(user)
          }
        } catch (err) {
          console.error("Erreur lors de la vérification de l'authentification:", err)
        }
      }
    }

    checkAuth()
  }, [])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

