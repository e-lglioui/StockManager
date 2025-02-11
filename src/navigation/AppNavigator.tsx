import type { FC } from "react" // Correction de l'import React
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useAuth } from "../hooks/useAuth"
import { LoginScreen } from "../screens/LoginScreen"
// import { DashboardScreen } from "../screens/DashboardScreen"
// import { ProductListScreen } from "../screens/ProductListScreen"
// import { ProfileScreen } from "../screens/ProfileScreen"
import { Ionicons } from "@expo/vector-icons"
import { ThemeProvider } from 'styled-components/native'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const MainTabs: FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home' // Type par défaut

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Products") {
            iconName = focused ? "list" : "list-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      {/* Décommentez ces lignes une fois que vous aurez créé les composants
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      */}
    </Tab.Navigator>
  )
}

export const AppNavigator: FC = () => {
  const { user } = useAuth()

  return (
  
      <Stack.Navigator>
        {user ? (
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }} 
          />
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
   
  )
}