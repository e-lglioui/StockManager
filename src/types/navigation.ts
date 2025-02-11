import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"

export type RootStackParamList = {
  Login: undefined
  ProductList: undefined
  ProductDetail: { productId: number }
}

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">
export type ProductListNavigationProp = NativeStackNavigationProp<RootStackParamList, "ProductList">
export type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, "ProductDetail">

export type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">

