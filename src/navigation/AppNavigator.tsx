import type React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import ProductListScreen from "../screens/ProductListScreen"
import ProductDetailScreen from "../screens/ProductDetailScreen"
import { LoginScreen } from "../screens/LoginScreen"
import type { RootStackParamList } from "../types/navigation"

const RootStack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="ProductList" component={ProductListScreen} options={{ title: "Products" }} />
        <RootStack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Product Details" }} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

