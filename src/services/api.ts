import type { Product, Warehouseman ,DashboardData} from "../types/api"

const API_URL = "http://172.16.9.32:3000"

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`)
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    return response.json()
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch product")
    }
    return response.json()
  },

  updateStock: async (productId: number, warehouseId: number, quantity: number): Promise<Product> => {
    try {
      // 1. Récupérer l'état actuel du produit
      const currentProduct = await api.getProduct(productId)

      // 2. Trouver le stock existant ou créer un nouveau
      const existingStockIndex = currentProduct.stocks.findIndex((stock) => stock.id === warehouseId)

      let updatedStocks
      if (existingStockIndex >= 0) {
        // Mettre à jour le stock existant
        updatedStocks = currentProduct.stocks.map((stock) =>
          stock.id === warehouseId ? { ...stock, quantity: Math.max(0, quantity) } : stock,
        )
      } else {
        // Ajouter un nouveau stock
        const newStock = {
          id: warehouseId,
          quantity: Math.max(0, quantity),
        }
        updatedStocks = [...currentProduct.stocks, newStock]
      }

      // 3. Mettre à jour le produit avec les nouveaux stocks
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentProduct,
          stocks: updatedStocks,
          editedBy: [
            {
              warehousemanId: warehouseId,
              at: new Date().toISOString(),
            },
            ...currentProduct.editedBy,
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update stock")
      }

      return response.json()
    } catch (error) {
      console.error("Error updating stock:", error)
      throw error
    }
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

  
  async addStock(
    productId: number,
    name: string,
    city: string,
    quantity: number,
    longitude: number,
    latitude: number,
  ): Promise<Product> {
    try {
      // Vérification des paramètres
      if (!productId || !name || !city || quantity < 0 || !longitude || !latitude) {
        throw new Error("Paramètres invalides : Vérifiez les valeurs passées.")
      }

      // Récupération du produit actuel
      const currentProduct = await api.getProduct(productId)
      if (!currentProduct) {
        throw new Error(`Produit avec ID ${productId} introuvable.`)
      }

      // Création du nouveau stock
      const newStock = {
        id: currentProduct.stocks.length + 1,
        quantity: Math.max(0, quantity),
        name,
        localisation: {
          latitude,
          longitude,
          city,
        },
      }

      // Mise à jour du stock
      const updatedStocks = [...currentProduct.stocks, newStock]

      // Envoi de la mise à jour au serveur
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentProduct,
          stocks: updatedStocks,
          editedBy: [
            {
              warehousemanId: 1,
              at: new Date().toISOString(),
            },
            ...currentProduct.editedBy,
          ],
        }),
      })

      // Vérification de la réponse
      if (!response.ok) {
        const errorMessage = `Échec de la mise à jour du stock. Code: ${response.status}`
        console.error(errorMessage, await response.text())
        throw new Error(errorMessage)
      }

      console.log("Stock ajouté avec succès :", await response.json())
      return response.json()
    } catch (error) {
      console.error("Erreur dans addStock :", error)
      throw new Error( "Une erreur inconnue s'est produite.")
    }
  },
  deleteStockLocation: async (productId: number, stockId: number): Promise<Product> => {
    try {
      const currentProduct = await api.getProduct(productId)
      const updatedStocks = currentProduct.stocks.filter((stock) => stock.id !== stockId)

      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentProduct,
          stocks: updatedStocks,
          editedBy: [
            {
              warehousemanId: 1, // This should be the actual warehouseman ID
              at: new Date().toISOString(),
            },
            ...currentProduct.editedBy,
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete stock location")
      }

      return response.json()
    } catch (error) {
      console.error("Error deleting stock location:", error)
      throw error
    }
  },

  modifyStockLocation: async (
    productId: number,
    stockId: number,
    updates: {
      name?: string
      city?: string
      quantity?: number
      latitude?: number
      longitude?: number
    },
  ): Promise<Product> => {
    try {
      const currentProduct = await api.getProduct(productId)
      const updatedStocks = currentProduct.stocks.map((stock) => {
        if (stock.id === stockId) {
          return {
            ...stock,
            ...updates,
            localisation: {
              ...stock.localisation,
              ...(updates.city && { city: updates.city }),
              ...(updates.latitude && { latitude: updates.latitude }),
              ...(updates.longitude && { longitude: updates.longitude }),
            },
          }
        }
        return stock
      })

      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentProduct,
          stocks: updatedStocks,
          editedBy: [
            {
              warehousemanId: 1, // This should be the actual warehouseman ID
              at: new Date().toISOString(),
            },
            ...currentProduct.editedBy,
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to modify stock location")
      }

      return response.json()
    } catch (error) {
      console.error("Error modifying stock location:", error)
      throw error
    }
  },

  getProductByBarcode: async (barcode: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_URL}/products?barcode=${barcode}`)
      if (!response.ok) {
        throw new Error("Failed to fetch product by barcode")
      }
      const products = await response.json()
      return products.length > 0 ? products[0] : null
    } catch (error) {
      console.error("Error fetching product by barcode:", error)
      return null
    }
  },

  addProduct: async (productData: Partial<Product>): Promise<Product> => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...productData,
          id: Date.now().toString(), // Generate a unique ID
          stocks: [],
          editedBy: [
            {
              warehousemanId: 1, // This should be the actual warehouseman ID
              at: new Date().toISOString(),
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add new product")
      }

      return response.json()
    } catch (error) {
      console.error("Error adding new product:", error)
      throw error
    }
  },
   updateProduct: async (product: Product): Promise<Product> => {
    try {
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
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    }
  },
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      // Récupérer tous les produits
      const products = await api.getProducts()
      
      // Set pour tracker les villes uniques
      const cities = new Set<string>()
      
      // Calculer les statistiques de base
      let totalStockValue = 0
      let outOfStockProducts = 0
      
      // Tracker les mouvements de produits dans les 30 derniers jours
      const productMovements = new Map()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      products.forEach(product => {
        // Tracker les villes
        product.stocks.forEach(stock => {
          if (stock.localisation?.city) {
            cities.add(stock.localisation.city)
          }
          
          // Calculer la valeur totale du stock
          totalStockValue += (stock.quantity * (product.price || 0))
        })
        
        // Vérifier les produits en rupture de stock
        const totalQuantity = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0)
        if (totalQuantity === 0) {
          outOfStockProducts++
        }
        
        // Analyser les mouvements de stock depuis l'historique editedBy
        const recentEdits = product.editedBy
          .filter(edit => new Date(edit.at) > thirtyDaysAgo)
          .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
          
        if (recentEdits.length >= 2) {
          // Comparer les éditions consécutives
          for (let i = 0; i < recentEdits.length - 1; i++) {
            const currentTotalStock = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0)
            
            const movement = {
              productId: product.id,
              productName: product.name,
              quantity: Math.abs(currentTotalStock),
              type: currentTotalStock > 0 ? 'added' : 'removed',
              date: new Date(recentEdits[i].at)
            }
            
            productMovements.set(product.id, movement)
          }
        }
      })
      
      // Trier les mouvements pour obtenir les produits les plus ajoutés/retirés
      const sortedMovements = Array.from(productMovements.values())
        .sort((a, b) => b.quantity - a.quantity)
        
      const mostAddedProducts = sortedMovements
        .filter(m => m.type === 'added')
        .slice(0, 5)
        .map(m => ({
          name: m.productName,
          quantity: m.quantity
        }))
        
      const mostRemovedProducts = sortedMovements
        .filter(m => m.type === 'removed')
        .slice(0, 5)
        .map(m => ({
          name: m.productName,
          quantity: m.quantity
        }))

      return {
        totalProducts: products.length,
        totalCities: cities.size,
        outOfStockProducts,
        totalStockValue,
        mostAddedProducts,
        mostRemovedProducts
      }
    } catch (error) {
      console.error("Error calculating dashboard data:", error)
      throw new Error("Failed to fetch dashboard data")
    }
  },
}

