import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"
import { ParamListBase } from '@react-navigation/native';
export type RootStackParamList = {
  Login: undefined
  ProductList: undefined
  // ProductDetail: { productId: number }
  BarcodeScanner: undefined
  // AddProduct: { barcode: string }
  ProductDetail: { productId: number };
  AddProduct: { barcode: string };
}

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">
export type ProductListNavigationProp = NativeStackNavigationProp<RootStackParamList, "ProductList">
export type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, "ProductDetail">
export type BarcodeScannerNavigationProp = NativeStackNavigationProp<RootStackParamList, "BarcodeScanner">
export type AddProductNavigationProp = NativeStackNavigationProp<RootStackParamList, "AddProduct">

export type AddProductRouteProp = RouteProp<RootStackParamList, "AddProduct">
export type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">

