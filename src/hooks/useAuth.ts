"use client"

import { useState } from "react"
import { api } from "../services/api"
import type { Warehouseman } from "../types/api"

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (secretKey: string): Promise<Warehouseman | null> => {
    try {
      setLoading(true)
      setError(null)
      const user = await api.getWarehousemanBySecretKey(secretKey)
      if (!user) {
        setError("Code secret invalide")
        return null
      }
      return user
    } catch (err) {
      setError("Une erreur s'est produite lors de la connexion")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}

