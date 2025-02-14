"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
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
  RefreshControl,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { api } from "../services/api"
import type { Product } from "../types/api"
import type { ProductListNavigationProp } from "../types/navigation"
import Navbar from "../components/Navbar"
import SearchAndFilter from "../components/SearchAndFilter"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useProductFiltering } from "../hooks/useProductFiltering"

const { width } = Dimensions.get("window")
const CARD_MARGIN = 8
const CARD_WIDTH = width / 2 - CARD_MARGIN * 3

const ProductListScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const navigation = useNavigation<ProductListNavigationProp>()

  const { filteredProducts, filters, setFilters, sortOption, setSortOption, searchQuery, setSearchQuery } =
    useProductFiltering(products)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const fetchedProducts = await api.getProducts()
      setProducts(fetchedProducts)
      setError(null)
    } catch (err) {
      setError("Failed to fetch data. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [fetchData])

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate("ProductDetail", { productId: product.id })
    },
    [navigation],
  )

  const getTotalStock = useCallback((product: Product) => {
    return product.stocks.reduce((sum, stock) => sum + stock.quantity, 0)
  }, [])

  const getStockStatus = useCallback(
    (product: Product) => {
      const totalStock = getTotalStock(product)
      if (totalStock <= 0) return "outOfStock"
      if (totalStock < 10) return "lowStock"
      return "inStock"
    },
    [getTotalStock],
  )

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => {
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
    },
    [getStockStatus, getTotalStock, handleProductPress],
  )

  if (loading && !refreshing) {
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Navbar onMenuPress={() => setIsMenuVisible(true)} onSearchPress={() => setIsSearchVisible(!isSearchVisible)} />
        <SearchAndFilter
          onSearch={setSearchQuery}
          onFilter={setFilters}
          onSort={setSortOption}
          filters={filters}
          sortOption={sortOption}
          searchQuery={searchQuery}
          isVisible={isSearchVisible}
        />
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyList}>Aucun produit disponible.</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
              <Text style={styles.menuItemText}>Accueil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Handle menu item press
                setIsMenuVisible(false)
              }}
            >
              <Icon name="category" size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>Catégories</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                // Handle menu item press
                setIsMenuVisible(false)
              }}
            >
              <Icon name="settings" size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>Paramètres</Text>
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
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

