import type React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import type { Product } from "../types/api"

interface ProductItemProps {
  product: Product
  onPress: (product: Product) => void
}

export const ProductItem: React.FC<ProductItemProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(product)}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.type}>{product.type}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.supplier}>Supplier: {product.supplier}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: "cover",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 2,
  },
  supplier: {
    fontSize: 12,
    color: "#888",
  },
})

