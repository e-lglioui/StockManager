"use client"

import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { api } from "../services/api"
import { storeData, getData } from "../utils/asyncStorage"

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  const { user, setUser } = context

  const login = async (secretKey: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const warehouseman = await api.getWarehousemanBySecretKey(secretKey)
      if (warehouseman) {
        await storeData("userId", warehouseman.id.toString())
        setUser(warehouseman)
      } else {
        setError("Code secret incorrect")
      }
    } catch (err) {
        
        console.error("Erreur détaillée:", err)
    
        // Message d'erreur plus spécifique
        if (err instanceof Error) {
          setError(`Erreur: ${err.message}`)
        } else {
          setError("Erreur lors de la connexion")
        }
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    await storeData("userId", "")
    setUser(null)
  }

  const checkAuth = async (): Promise<void> => {
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

  return { user, login, logout, checkAuth, error, loading }
}

