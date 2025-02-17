import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { DashboardData, Product } from "../types/api";
import {api }from "../services/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  
  // Animations
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.95);

  useEffect(() => {
    fetchDashboardData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError("Échec du chargement des données. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToProducts = (filter?: string) => {
    navigation.navigate("ProductList", { filter });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !dashboardData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || "Aucune donnée disponible"}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchDashboardData}
        >
          <Icon name="refresh" size={20} color="#FFF" />
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Text style={styles.title}>Tableau de Bord</Text>
        <Text style={styles.subtitle}>Aperçu de votre inventaire</Text>
      </Animated.View>

      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => navigateToProducts("all")}
        >
          <View style={[styles.iconContainer, { backgroundColor: "#E3F2FD" }]}>
            <Icon name="inventory" size={24} color="#1976D2" />
          </View>
          <Text style={styles.statValue}>{dashboardData.totalProducts}</Text>
          <Text style={styles.statLabel}>Produits Totaux</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => navigateToProducts("outOfStock")}
        >
          <View style={[styles.iconContainer, { backgroundColor: "#FFEBEE" }]}>
            <Icon name="error-outline" size={24} color="#D32F2F" />
          </View>
          <Text style={styles.statValue}>{dashboardData.outOfStockProducts}</Text>
          <Text style={styles.statLabel}>Rupture de Stock</Text>
        </TouchableOpacity>

        <View style={styles.statCard}>
          <View style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}>
            <Icon name="location-city" size={24} color="#388E3C" />
          </View>
          <Text style={styles.statValue}>{dashboardData.totalCities}</Text>
          <Text style={styles.statLabel}>Villes</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconContainer, { backgroundColor: "#E0F7FA" }]}>
            <Icon name="euro" size={24} color="#0097A7" />
          </View>
          <Text style={styles.statValue}>${dashboardData.totalStockValue.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Valeur Stocks</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produits les Plus Ajoutés</Text>
          <TouchableOpacity onPress={() => navigateToProducts("mostAdded")}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        {dashboardData.mostAddedProducts.map((product, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.productCard}
            onPress={() => navigation.navigate("ProductDetail", { productId: product.id })}
          >
            <View style={styles.productInfo}>
              <Icon name="add-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.productName}>{product.name}</Text>
            </View>
            <Text style={[styles.productQuantity, styles.positiveChange]}>
              +{product.quantity}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produits les Plus Retirés</Text>
          <TouchableOpacity onPress={() => navigateToProducts("mostRemoved")}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        {dashboardData.mostRemovedProducts.map((product, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.productCard}
            onPress={() => navigation.navigate("ProductDetail", { productId: product.id })}
          >
            <View style={styles.productInfo}>
              <Icon name="remove-circle-outline" size={24} color="#F44336" />
              <Text style={styles.productName}>{product.name}</Text>
            </View>
            <Text style={[styles.productQuantity, styles.negativeChange]}>
              -{product.quantity}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate("BarcodeScanner")}
      >
        <Icon name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Ajouter un produit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFF",
    margin: "1%",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#FFF",
    margin: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  seeAll: {
    fontSize: 14,
    color: "#007AFF",
  },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    marginLeft: 12,
    color: "#1A1A1A",
  },
  productQuantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  positiveChange: {
    color: "#4CAF50",
  },
  negativeChange: {
    color: "#F44336",
  },
  addButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  error: {
    color: "#D32F2F",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    marginLeft: 8,
  },
});

export default DashboardScreen;