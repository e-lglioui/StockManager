"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from "expo-camera"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { api } from "../services/api"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../types/navigation"

type BarcodeScannerNavigationProp = StackNavigationProp<RootStackParamList, "ProductDetail">

const BarcodeScanner: React.FC = () => {
  const navigation = useNavigation<BarcodeScannerNavigationProp>()
  const [permission, requestPermission] = useCameraPermissions()
  const [isScanning, setIsScanning] = useState(true)

  useEffect(() => {
    requestPermission()
  }, [requestPermission]) // Added requestPermission to dependencies

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (!isScanning) return
    setIsScanning(false)

    try {
      const product = await api.getProductByBarcode(result.data)
      if (product) {
        navigation.navigate("ProductDetail", { productId: product.id })
      } else {
        Alert.alert("Produit non trouvé", "Ce produit n'existe pas dans la base de données. Voulez-vous l'ajouter ?", [
          {
            text: "Annuler",
            onPress: () => setIsScanning(true),
            style: "cancel",
          },
          {
            text: "Ajouter le produit",
            onPress: () => navigation.navigate("AddProduct", { barcode: result.data }),
          },
        ])
      }
    } catch (error) {
      Alert.alert("Erreur", "Échec de la vérification du produit. Veuillez réessayer.")
      setIsScanning(true)
    }
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Demande de permission pour la caméra...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Accès à la caméra refusé</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "upc_a"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="close" size={30} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(true)}>
          <Text style={styles.scanButtonText}>Scan Again</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "transparent",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  scanButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  scanButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default BarcodeScanner

