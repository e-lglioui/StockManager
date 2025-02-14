import type React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/MaterialIcons"

import ProductListScreen from "../screens/ProductListScreen"
import ProductDetailScreen from "../screens/ProductDetailScreen"
import { LoginScreen } from "../screens/LoginScreen"
import BarcodeScanner from "../components/BarcodeScanner"
import AddProductScreen from "../screens/AddProductScreen"
import DashboardScreen from "../screens/DashboardScreen"
import type { RootStackParamList } from "../types/navigation"

const RootStack = createNativeStackNavigator<RootStackParamList>()
// const MainTab = createBottomTabNavigator<MainTabParamList>()

// const MainTabNavigator: React.FC = () => {
//   return (
//     <MainTab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName: string

//           if (route.name === "Dashboard") {
//             iconName = "dashboard"
//           } else if (route.name === "ProductList") {
//             iconName = "list"
//           } else {
//             iconName = "error"
//           }

//           return <Icon name={iconName} size={size} color={color} />
//         },
//       })}
//     >
//       <MainTab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Dashboard" }} />
//       <MainTab.Screen name="ProductList" component={ProductListScreen} options={{ title: "Products" }} />
//     </MainTab.Navigator>
//   )
// }

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Dashboard" component={DashboardScreen} />
        <RootStack.Screen name="ProductList" component={ProductListScreen} />
        <RootStack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            headerShown: true,
            title: "Product Details",
          }}
        />
        <RootStack.Screen name="BarcodeScanner" component={BarcodeScanner} options={{ headerShown: false }} />
        <RootStack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            headerShown: true,
            title: "Add Product",
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

