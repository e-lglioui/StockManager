"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native"
import { useRoute } from "@react-navigation/native"
import { api } from "../services/api"
import type { Product } from "../types/api"
import type { ProductDetailRouteProp } from "../types/navigation"
import Icon from "react-native-vector-icons/MaterialIcons"

type ModalType = "restock" | "unload" | "addStock" | "editStock"

const ProductDetailScreen: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [quantity, setQuantity] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)
  const [modalType, setModalType] = useState<ModalType>("restock")
  const [newWarehouseName, setNewWarehouseName] = useState("")
  const [newWarehouseCity, setNewWarehouseCity] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [isEditHistoryExpanded, setIsEditHistoryExpanded] = useState(false)
  const route = useRoute<ProductDetailRouteProp>()
  const { productId } = route.params

  useEffect(() => {
    fetchProductDetails()
  }, [])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const fetchedProduct = await api.getProduct(productId)
      setProduct(fetchedProduct)
      setError(null)
    } catch (err) {
      setError("Failed to fetch product details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const totalStock = useMemo(
    () => (product ? product.stocks.reduce((sum, stock) => sum + stock.quantity, 0) : 0),
    [product],
  )

  const getStockStatus = (product: Product) => {
    if (totalStock === 0) return "Out of Stock"
    if (totalStock < 10) return "Low Stock"
    return "In Stock"
  }

  const openStockModal = (warehouseId: number, type: "restock" | "unload") => {
    setSelectedWarehouse(warehouseId)
    setModalType(type)
    setQuantity("")
    setModalVisible(true)
  }

  const openAddStockModal = () => {
    setModalType("addStock")
    setNewWarehouseName("")
    setNewWarehouseCity("")
    setLatitude("")
    setLongitude("")
    setQuantity("")
    setModalVisible(true)
  }

  const handleModalSubmit = async () => {
    if (!product) return

    if (modalType === "addStock" || modalType === "editStock") {
      if (!newWarehouseName || !newWarehouseCity || !quantity || !latitude || !longitude) {
        Alert.alert("Error", "Please fill in all fields")
        return
      }

      const parsedQuantity = Number.parseInt(quantity)
      const parsedLatitude = Number.parseFloat(latitude)
      const parsedLongitude = Number.parseFloat(longitude)

      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        Alert.alert("Error", "Please enter a valid non-negative number for quantity")
        return
      }

      if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
        Alert.alert("Error", "Please enter valid numbers for latitude and longitude")
        return
      }

      try {
        let updatedProduct
        if (modalType === "addStock") {
          updatedProduct = await api.addStock(
            product.id,
            newWarehouseName,
            newWarehouseCity,
            parsedQuantity,
            parsedLatitude,
            parsedLongitude,
          )
          Alert.alert("Success", "New stock location added successfully")
        } else {
          if (selectedWarehouse === null) return
          updatedProduct = await api.modifyStockLocation(product.id, selectedWarehouse, {
            name: newWarehouseName,
            city: newWarehouseCity,
            quantity: parsedQuantity,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
          })
          Alert.alert("Success", "Stock location updated successfully")
        }
        setProduct(updatedProduct)
        setModalVisible(false)
      } catch (error) {
        Alert.alert(
          "Error",
          `Failed to ${modalType === "addStock" ? "add" : "update"} stock location: ${error.message}`,
        )
      }
      return
    }

    if (selectedWarehouse === null) return

    const parsedQuantity = Number.parseInt(quantity)
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert("Error", "Please enter a valid positive number")
      return
    }

    try {
      const warehouseStock = product.stocks.find((stock) => stock.id === selectedWarehouse)

      if (modalType === "unload" && (!warehouseStock || warehouseStock.quantity < parsedQuantity)) {
        Alert.alert("Error", "Not enough stock to unload")
        return
      }

      const newQuantity =
        modalType === "restock"
          ? (warehouseStock?.quantity || 0) + parsedQuantity
          : (warehouseStock?.quantity || 0) - parsedQuantity

      const updatedProduct = await api.updateStock(product.id, selectedWarehouse, newQuantity)
      setProduct(updatedProduct)
      Alert.alert(
        "Success",
        `${modalType === "restock" ? "Restocked" : "Unloaded"} ${parsedQuantity} unit${parsedQuantity > 1 ? "s" : ""} of ${product.name}`,
      )
      setModalVisible(false)
    } catch (error) {
      Alert.alert("Error", `Failed to ${modalType} product: ${error.message}`)
    }
  }

  const handleEditStock = (stockId: number) => {
    if (!product) return

    const stockToEdit = product.stocks.find((stock) => stock.id === stockId)
    if (!stockToEdit) {
      Alert.alert("Error", "Stock location not found")
      return
    }

    setSelectedWarehouse(stockId)
    setNewWarehouseName(stockToEdit.name)
    setNewWarehouseCity(stockToEdit.localisation.city)
    setLatitude(stockToEdit.localisation.latitude.toString())
    setLongitude(stockToEdit.localisation.longitude.toString())
    setQuantity(stockToEdit.quantity.toString())
    setModalType("editStock")
    setModalVisible(true)
  }

  const handleDeleteStock = async (stockId: number) => {
    if (!product) return

    Alert.alert("Delete Stock Location", "Are you sure you want to delete this stock location?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const updatedProduct = await api.deleteStockLocation(product.id, stockId)
            setProduct(updatedProduct)
            Alert.alert("Success", "Stock location deleted successfully")
          } catch (error) {
            Alert.alert("Error", `Failed to delete stock location: ${error.message}`)
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || "Product not found"}</Text>
      </View>
    )
  }

  const stockStatus = getStockStatus(product)

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.type}>{product.type}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.solde && <Text style={styles.salePrice}>Sale: ${product.solde.toFixed(2)}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.stockContainer}>
            <Text style={styles.stockStatus}>Status: {stockStatus}</Text>
            <View style={[styles.stockIndicator, styles[stockStatus.toLowerCase().replace(" ", "")]]} />
          </View>
          <Text style={styles.totalStock}>Total Quantity: {totalStock}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.stockHeaderContainer}>
            <Text style={styles.sectionTitle}>Stock Details</Text>
            <TouchableOpacity style={styles.addStockButton} onPress={openAddStockModal}>
              <Text style={styles.addStockButtonText}>Add New Stock</Text>
            </TouchableOpacity>
          </View>

          {product.stocks.length === 0 ? (
            <Text style={styles.noStockText}>No stock locations available</Text>
          ) : (
            product.stocks.map((stock) => (
              <View key={stock.id} style={styles.stockItem}>
                <View style={styles.stockItemHeader}>
                  <Text style={styles.stockItemText}>Location: {stock.name}</Text>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => handleEditStock(stock.id)}>
                      <Icon name="edit" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteStock(stock.id)}>
                      <Icon name="delete" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.stockItemText}>Quantity: {stock.quantity}</Text>
                <Text style={styles.stockItemText}>City: {stock.localisation.city}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.restockButton]}
                    onPress={() => openStockModal(stock.id, "restock")}
                  >
                    <Text style={styles.buttonText}>Restock</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.unloadButton]}
                    onPress={() => openStockModal(stock.id, "unload")}
                  >
                    <Text style={styles.buttonText}>Unload</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Product Information</Text>
          <Text style={styles.infoText}>Supplier: {product.supplier}</Text>
          <Text style={styles.infoText}>Barcode: {product.barcode}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.editHistoryHeader}
            onPress={() => setIsEditHistoryExpanded(!isEditHistoryExpanded)}
          >
            <Text style={styles.sectionTitle}>Edit History</Text>
            <Icon
              name={isEditHistoryExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#007AFF"
            />
          </TouchableOpacity>
          {isEditHistoryExpanded && (
            <View style={styles.editHistoryContent}>
              {product.editedBy.map((edit, index) => (
                <View key={index} style={styles.editItem}>
                  <Text style={styles.editItemText}>Edited by: Warehouseman ID {edit.warehousemanId}</Text>
                  <Text style={styles.editItemText}>Date: {new Date(edit.at).toLocaleDateString()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "addStock"
                ? "Add New Stock Location"
                : modalType === "editStock"
                  ? "Edit Stock Location"
                  : `${modalType === "restock" ? "Restock" : "Unload"} Quantity`}
            </Text>

            {(modalType === "addStock" || modalType === "editStock") && (
              <>
                <TextInput
                  style={styles.input}
                  value={newWarehouseName}
                  onChangeText={setNewWarehouseName}
                  placeholder="Warehouse Name"
                  autoFocus
                />
                <TextInput
                  style={styles.input}
                  value={newWarehouseCity}
                  onChangeText={setNewWarehouseCity}
                  placeholder="City"
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="Latitude"
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="Longitude"
                />
              </>
            )}

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Enter quantity"
              autoFocus={modalType !== "addStock" && modalType !== "editStock"}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleModalSubmit}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 12,
  },
  detailsContainer: {
    marginTop: 16,
  },
  sectionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  type: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  salePrice: {
    fontSize: 18,
    color: "#FF3B30",
    marginBottom: 8,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stockStatus: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  stockIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  instock: {
    backgroundColor: "#34C759",
  },
  lowstock: {
    backgroundColor: "#FFCC00",
  },
  outofstock: {
    backgroundColor: "#FF3B30",
  },
  totalStock: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  stockHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addStockButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addStockButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  stockItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    paddingVertical: 12,
  },
  stockItemText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  stockItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  restockButton: {
    backgroundColor: "#34C759",
  },
  unloadButton: {
    backgroundColor: "#FF9500",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  editHistoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editHistoryContent: {
    marginTop: 8,
  },
  editItem: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  editItemText: {
    fontSize: 14,
    marginBottom: 4,
    color: "#666",
  },
  error: {
    color: "#FF3B30",
    textAlign: "center",
    marginHorizontal: 20,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#8E8E93",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  modalButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  noStockText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 16,
  },
})

export default ProductDetailScreen

