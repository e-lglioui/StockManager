import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";

// export type MainTabParamList = {
//   Dashboard: undefined;
//   ProductList: undefined;
// };

export type RootStackParamList = {
  Login: undefined
  Main: undefined
  ProductList: undefined
  BarcodeScanner: undefined
  ProductDetail: { productId: number }
  AddProduct: { barcode: string }
  Dashboard: undefined
}

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">
export type ProductListNavigationProp = NativeStackNavigationProp<RootStackParamList, "ProductList">
export type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, "ProductDetail">
export type BarcodeScannerNavigationProp = NativeStackNavigationProp<RootStackParamList, "BarcodeScanner">
export type AddProductNavigationProp = NativeStackNavigationProp<RootStackParamList, "AddProduct">
export type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, "Dashboard">

export type AddProductRouteProp = RouteProp<RootStackParamList, "AddProduct">
export type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">
// export type MainTabNavigationProp = CompositeNavigationProp<
//   BottomTabNavigationProp<MainTabParamList>,
//   NativeStackNavigationProp<RootStackParamList>
// >;
