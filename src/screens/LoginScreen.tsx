"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { Input } from "../components/common/Input"
import { Button } from "../components/common/Button"
import { useAuth } from "../hooks/useAuth"

export const LoginScreen: React.FC = () => {
  const [secretCode, setSecretCode] = useState("")
  const { login, error, loading } = useAuth()

  const handleLogin = () => {
    console.log("secretCode", secretCode)
    login(secretCode)
  }

  return (
    <View style={styles.container}>
      <Input value={secretCode} onChangeText={setSecretCode} placeholder="Entrez votre code secret" secureTextEntry />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Se connecter" onPress={handleLogin} />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
})

