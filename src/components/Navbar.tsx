import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface NavbarProps {
  onMenuPress: () => void
  onSearchPress: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onMenuPress, onSearchPress }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={24} color="#007AFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Products</Text>
      <TouchableOpacity onPress={onSearchPress}>
        <Icon name="search" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 20,  // Adjust the value as needed
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default Navbar
