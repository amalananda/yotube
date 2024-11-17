import React, { useState, useEffect, useContext } from 'react'
import { ApolloProvider } from '@apollo/client'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import client from './config/apollo'
import HomeScreen from './screens/HomeScreen'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import PostDetailScreen from './screens/PostDetailScreen'
import { useAuth, AuthProvider, AuthContext } from './contexts/auth'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import CreatePostScreen from './screens/CreateScreen'
import SearchUsersScreen from './screens/SearchScreen'
import { ActivityIndicator, View } from 'react-native'
// import { Touchable, TouchableOpacity } from 'react-native'
import { HomeTabs } from './screens/HomeTabs'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()


export default function App() {

  const { isSignedIn } = useContext(AuthContext)
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#0077B5" />
            <Stack.Navigator>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: "Create Account", headerShown: false }}
              />
              <Stack.Screen
                name="HomeTabs"
                component={HomeTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PostDetail"
                component={PostDetailScreen}
                options={{ title: "Detail", headerShown: false }}
              />

            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </AuthProvider>
    </ApolloProvider>
  )
}
