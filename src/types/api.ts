export interface Product {
  id: number
  name: string
  type: string
  barcode: string
  price: number
  solde?: number
  supplier: string
  image: string
  stocks: Array<any>; 
  editedBy: Array<any>
}

export interface Stock {
  id: number
  name: string
  quantity: number
  localisation: {
    city: string
    latitude: number
    longitude: number
  }
}

export interface EditHistory {
  warehousemanId: number
  at: string
}

export interface Warehouse {
  id: number
  name: string
  city: string
}

export interface Warehouseman {
  id: number
  name: string
  dob: string
  city: string
  secretKey: string
  warehouseId: number
}
export interface FilterOptions {
  name?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  supplier?: string
}

export interface SortOption {
  field: 'name' | 'price' | 'quantity'
  direction: 'asc' | 'desc'
}
export interface ApiError {
  message: string
}