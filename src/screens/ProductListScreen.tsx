"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { api } from "../services/api"
import type { Product } from "../types/api"
import type { ProductListNavigationProp } from "../types/navigation"
import Navbar from "../components/Navbar"
import SearchAndFilter from "../components/SearchAndFilter"
import Icon from "react-native-vector-icons/MaterialIcons"

const { width } = Dimensions.get("window")
const CARD_MARGIN = 8
const CARD_WIDTH = width / 2 - CARD_MARGIN * 3

const ProductListScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const navigation = useNavigation<ProductListNavigationProp>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const fetchedProducts = await api.getProducts()
      setProducts(fetchedProducts)
      setFilteredProducts(fetchedProducts)
      setError(null)
    } catch (err) {
      setError("Failed to fetch data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetail", { productId: product.id })
  }

  const getTotalStock = (product: Product) => {
    return product.stocks.reduce((sum, stock) => sum + stock.quantity, 0)
  }

  const getStockStatus = (product: Product) => {
    const totalStock = getTotalStock(product)
    if (totalStock <= 0) return "outOfStock"
    if (totalStock < 10) return "lowStock"
    return "inStock"
  }

  const handleSearch = (query: string) => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.type.toLowerCase().includes(query.toLowerCase()) ||
        product.supplier.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }

  const handleFilter = (filter: string) => {
    // Implement filter logic here
    // For now, we'll just log the filter
    console.log("Filter by:", filter)
  }

  const handleSort = (sortBy: string) => {
    let sorted: Product[]
    if (sortBy === "price") {
      sorted = [...filteredProducts].sort((a, b) => {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price
      })
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else if (sortBy === "name") {
      sorted = [...filteredProducts].sort((a, b) => {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      })
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Default to sorting by quantity
      sorted = [...filteredProducts].sort((a, b) => {
        const totalStockA = getTotalStock(a)
        const totalStockB = getTotalStock(b)
        return sortOrder === "asc" ? totalStockA - totalStockB : totalStockB - totalStockA
      })
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }
    setFilteredProducts(sorted)
  }

  const renderProductItem = ({ item }: { item: Product }) => {
    const stockStatus = getStockStatus(item)
    const totalStock = getTotalStock(item)

    return (
      <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
          <View style={[styles.stockBadge, styles[stockStatus]]}>
            <Text style={styles.stockText}>{totalStock <= 0 ? "Out of Stock" : `${totalStock} in stock`}</Text>
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text numberOfLines={2} style={styles.productName}>
            {item.name}
          </Text>
          <Text style={styles.productType}>{item.type}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            {item.solde && <Text style={styles.salePrice}>${item.solde.toFixed(2)}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Navbar onMenuPress={() => setIsMenuVisible(true)} onSearchPress={() => setIsSearchVisible(!isSearchVisible)} />
        {isSearchVisible && <SearchAndFilter onSearch={handleSearch} onFilter={handleFilter} onSort={handleSort} />}
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyList}>No products available.</Text>}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Handle menu item press
                setIsMenuVisible(false)
              }}
            >
              <Icon name="home" size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Handle menu item press
                setIsMenuVisible(false)
              }}
            >
              <Icon name="category" size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Handle menu item press
                setIsMenuVisible(false)
              }}
            >
              <Icon name="settings" size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContainer: {
    flex: 1,
    marginTop: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: CARD_MARGIN,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: CARD_MARGIN * 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: CARD_WIDTH,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  stockBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inStock: {
    backgroundColor: "rgba(52, 199, 89, 0.9)",
  },
  lowStock: {
    backgroundColor: "rgba(255, 204, 0, 0.9)",
  },
  outOfStock: {
    backgroundColor: "rgba(255, 59, 48, 0.9)",
  },
  stockText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1c1c1e",
    height: 40,
  },
  productType: {
    fontSize: 12,
    color: "#8e8e93",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },
  salePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF3B30",
    textDecorationLine: "line-through",
  },
  error: {
    color: "#FF3B30",
    textAlign: "center",
    marginHorizontal: 20,
  },
  emptyList: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#8e8e93",
  },
  menuContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menu: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
})

export default ProductListScreen

