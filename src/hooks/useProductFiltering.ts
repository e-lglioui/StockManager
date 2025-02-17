"use client"

import { useState, useMemo } from "react"
import type { Product, FilterOptions, SortOption } from "../types/api"

export function useProductFiltering(products: Product[]) {
  const [filters, setFilters] = useState<FilterOptions>({})
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "name",
    direction: "asc",
  })
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          !searchQuery ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.supplier.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesName = !filters.name || product.name.toLowerCase().includes(filters.name.toLowerCase())

        const matchesType = !filters.type || product.type.toLowerCase() === filters.type.toLowerCase()

        const matchesSupplier = !filters.supplier || product.supplier.toLowerCase() === filters.supplier.toLowerCase()

        const matchesPrice =
          (!filters.minPrice || product.price >= filters.minPrice) &&
          (!filters.maxPrice || product.price <= filters.maxPrice)

        return matchesSearch && matchesName && matchesType && matchesSupplier && matchesPrice
      })
      .sort((a, b) => {
        switch (sortOption.field) {
          case "name":
            return sortOption.direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
          case "price":
            return sortOption.direction === "asc" ? a.price - b.price : b.price - a.price
          case "quantity":
            const totalA = a.stocks.reduce((sum, stock) => sum + stock.quantity, 0)
            const totalB = b.stocks.reduce((sum, stock) => sum + stock.quantity, 0)
            return sortOption.direction === "asc" ? totalA - totalB : totalB - totalA
          default:
            return 0
        }
      })
  }, [products, filters, sortOption, searchQuery])

  return {
    filteredProducts,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
  }
}

