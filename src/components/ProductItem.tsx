import type React from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import type { Product } from "../types/api"

interface ProductItemProps {
  product: Product
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text>Price: ${product.price}</Text>
        <Text>Type: {product.type}</Text>
        <Text>Supplier: {product.supplier}</Text>
      </View>
    </View>
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
    width: 50,
    height: 50,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
})

