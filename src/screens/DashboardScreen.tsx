"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { api } from "../services/api"
import Icon from "react-native-vector-icons/MaterialIcons"
import type { DashboardData } from "../types/api"
import {DashboardNavigationProp }
from "../types/navigation"
const DashboardScreen: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation<DashboardNavigationProp >()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await api.getDashboardData()
      setDashboardData(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    navigation.navigate("BarcodeScanner")
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error || !dashboardData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || "No data available"}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tableau de Bord</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dashboardData.totalProducts}</Text>
          <Text style={styles.statLabel}>Produits Totaux</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dashboardData.totalCities}</Text>
          <Text style={styles.statLabel}>Villes Totales</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dashboardData.outOfStockProducts}</Text>
          <Text style={styles.statLabel}>Produits en Rupture</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${dashboardData.totalStockValue.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Valeur Totale des Stocks</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Produits les Plus Ajoutés</Text>
      {dashboardData.mostAddedProducts.map((product, index) => (
        <View key={index} style={styles.productItem}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productQuantity}>+{product.quantity}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Produits les Plus Retirés</Text>
      {dashboardData.mostRemovedProducts.map((product, index) => (
        <View key={index} style={styles.productItem}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productQuantity}>-{product.quantity}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Icon name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Ajouter un produit</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    width: "48%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 16,
  },
  productQuantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginHorizontal: 20,
  },
  addButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
})

export default DashboardScreen

