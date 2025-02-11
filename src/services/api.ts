import type { Product, Warehouseman, Statistics } from "../types/api"

const API_URL = "http://192.168.0.176:3000" 

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`)
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    return response.json()
  },

  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch product with id ${id}`)
    }
    return response.json()
  },

  async getWarehousemen(): Promise<Warehouseman[]> {
    const response = await fetch(`${API_URL}/warehousemans`)
    if (!response.ok) {
      throw new Error("Failed to fetch warehousemen")
    }
    return response.json()
  },

  async getWarehousemanBySecretKey(secretKey: string): Promise<Warehouseman | null> {
    const warehousemen = await this.getWarehousemen()
    return warehousemen.find((w) => w.secretKey === secretKey) || null
  },

  async getStatistics(): Promise<Statistics> {
    const response = await fetch(`${API_URL}/statistics`)
    if (!response.ok) {
      throw new Error("Failed to fetch statistics")
    }
    return response.json()
  },

  async updateProduct(product: Product): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
    if (!response.ok) {
      throw new Error("Failed to update product")
    }
    return response.json()
  },
}

