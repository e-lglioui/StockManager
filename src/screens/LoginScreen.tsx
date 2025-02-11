"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Input } from "../components/common/Input"
import { Button } from "../components/common/Button"
import { useAuth } from "../hooks/useAuth"
import type { LoginScreenNavigationProp } from "../types/navigation"

export const LoginScreen: React.FC = () => {
  const [secretCode, setSecretCode] = useState("")
  const { login, error, loading } = useAuth()
  const navigation = useNavigation<LoginScreenNavigationProp>()

  const handleLogin = async () => {
    const success = await login(secretCode)
    if (!success) {
      navigation.replace("ProductList")
    }
  }

  return (
    <View style={styles.container}>
      <Input value={secretCode} onChangeText={setSecretCode} placeholder="Entrez votre code secret" 
       />
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

