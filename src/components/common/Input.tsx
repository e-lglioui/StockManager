import type React from "react"
import { TextInput, View, Text, StyleSheet } from "react-native"

interface InputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ value, onChangeText, placeholder, secureTextEntry, label, error }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
})

