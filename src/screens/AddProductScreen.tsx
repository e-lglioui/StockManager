"use client"

import type React from "react"
import { useState } from "react"
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { api } from "../services/api"
import * as ImagePicker from 'expo-image-picker';


type NavigationProps = {
  navigate: (screen: string, params: { productId: number }) => void
}

type RouteParams = {
  barcode: string
}

const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute()
  const { barcode } = route.params as RouteParams

  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [price, setPrice] = useState("")
  const [solde, setSolde] = useState("")
  const [supplier, setSupplier] = useState("")
  const [image, setImage] = useState("")

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleAddProduct = async () => {
    if (!name || !type || !price || !supplier) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    try {
      const newProduct = await api.addProduct({
        name,
        type,
        price: Number.parseFloat(price),
        solde: solde ? Number.parseFloat(solde) : undefined,
        supplier,
        barcode,
        image,
      })
      Alert.alert("Success", "Product added successfully")
      navigation.navigate("ProductDetail", { productId: newProduct.id })
    } catch (error) {
      Alert.alert("Error", "Failed to add product. Please try again.")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>
      <Text style={styles.label}>Barcode: {barcode}</Text>

      <Text style={styles.label}>Name*</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter product name" />

      <Text style={styles.label}>Type*</Text>
      <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="Enter product type" />

      <Text style={styles.label}>Price*</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Sale Price</Text>
      <TextInput
        style={styles.input}
        value={solde}
        onChangeText={setSolde}
        placeholder="Enter sale price (optional)"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Supplier*</Text>
      <TextInput style={styles.input} value={supplier} onChangeText={setSupplier} placeholder="Enter supplier name" />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Select Product Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 15,
  },
})

export default AddProductScreen

