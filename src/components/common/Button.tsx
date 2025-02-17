import type React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface ButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity style={[styles.button, disabled && styles.disabledButton]} onPress={onPress} disabled={disabled}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

