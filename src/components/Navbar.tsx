import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../types/navigation"

type NavbarNavigationProp = NativeStackNavigationProp<RootStackParamList>

interface NavbarProps {
  onMenuPress: () => void
  onSearchPress: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onMenuPress, onSearchPress }) => {
  const navigation = useNavigation<NavbarNavigationProp>()

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={24} color="#007AFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Products</Text>
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
          <Icon name="search" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            if (navigation && navigation.navigate) {
              navigation.navigate("BarcodeScanner")
            } else {
              console.warn("Navigation object or navigate function is undefined")
            }
          }}
        >
          <Icon name="qr-code-scanner" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
  },
})

export default Navbar

