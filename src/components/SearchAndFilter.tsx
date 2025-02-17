"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, ScrollView, Animated } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import type { FilterOptions, SortOption } from "../types/api"

interface SearchAndFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: FilterOptions) => void
  onSort: (sortOption: SortOption) => void
  filters: FilterOptions
  sortOption: SortOption
  searchQuery: string
  isVisible: boolean
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilter,
  onSort,
  filters,
  sortOption,
  searchQuery,
  isVisible,
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters)
  const [animation] = useState(new Animated.Value(isVisible ? 1 : 0))

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [isVisible, animation])

  const handleSearch = (text: string) => {
    onSearch(text)
  }

  const handleApplyFilters = () => {
    onFilter(tempFilters)
    setShowFilterModal(false)
  }

  const handleSortSelect = (field: SortOption["field"]) => {
    const direction = sortOption.field === field && sortOption.direction === "asc" ? "desc" : "asc"
    onSort({ field, direction })
    setShowSortModal(false)
  }

  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  })

  return (
    <Animated.View style={[styles.container, { height: containerHeight }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher produits..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
          <Icon name="search" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSortContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setShowFilterModal(true)}>
          <Icon name="filter-list" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Filtrer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setShowSortModal(true)}>
          <Icon name="sort" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Trier</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtres</Text>

            <ScrollView>
              <Text style={styles.label}>Nom du produit</Text>
              <TextInput
                style={styles.input}
                placeholder="Filtrer par nom"
                value={tempFilters.name}
                onChangeText={(value) => setTempFilters((prev) => ({ ...prev, name: value }))}
              />

              <Text style={styles.label}>Type de produit</Text>
              <TextInput
                style={styles.input}
                placeholder="Filtrer par type"
                value={tempFilters.type}
                onChangeText={(value) => setTempFilters((prev) => ({ ...prev, type: value }))}
              />

              <Text style={styles.label}>Prix minimum</Text>
              <TextInput
                style={styles.input}
                placeholder="Prix min"
                keyboardType="numeric"
                value={tempFilters.minPrice?.toString()}
                onChangeText={(value) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    minPrice: value ? Number(value) : undefined,
                  }))
                }
              />

              <Text style={styles.label}>Prix maximum</Text>
              <TextInput
                style={styles.input}
                placeholder="Prix max"
                keyboardType="numeric"
                value={tempFilters.maxPrice?.toString()}
                onChangeText={(value) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    maxPrice: value ? Number(value) : undefined,
                  }))
                }
              />

              <Text style={styles.label}>Fournisseur</Text>
              <TextInput
                style={styles.input}
                placeholder="Filtrer par fournisseur"
                value={tempFilters.supplier}
                onChangeText={(value) => setTempFilters((prev) => ({ ...prev, supplier: value }))}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowFilterModal(false)}>
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApplyFilters}>
                <Text style={styles.buttonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={showSortModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trier par</Text>

            <TouchableOpacity style={styles.sortOption} onPress={() => handleSortSelect("name")}>
              <Text>Nom</Text>
              {sortOption.field === "name" && (
                <Icon
                  name={sortOption.direction === "asc" ? "arrow-upward" : "arrow-downward"}
                  size={20}
                  color="#007AFF"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.sortOption} onPress={() => handleSortSelect("price")}>
              <Text>Prix</Text>
              {sortOption.field === "price" && (
                <Icon
                  name={sortOption.direction === "asc" ? "arrow-upward" : "arrow-downward"}
                  size={20}
                  color="#007AFF"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.sortOption} onPress={() => handleSortSelect("quantity")}>
              <Text>Quantité</Text>
              {sortOption.field === "quantity" && (
                <Icon
                  name={sortOption.direction === "asc" ? "arrow-upward" : "arrow-downward"}
                  size={20}
                  color="#007AFF"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowSortModal(false)}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    overflow: "hidden",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterSortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.79)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 8,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#ff3b30",
  },
  applyButton: {
    backgroundColor: "#34c759",
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
})

export default SearchAndFilter

