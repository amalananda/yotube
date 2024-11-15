import React, { useState, useEffect } from 'react'
import { ApolloProvider } from '@apollo/client'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Alert } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import client from './config/apollo'
import HomeScreen from './screens/HomeScreen'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import PostDetailScreen from './screens/PostDetailScreen'
import { AuthContextProvider } from './contexts/auth'


const Stack = createNativeStackNavigator()

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('access_token')
      if (token) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    }
    checkToken()
  }, [])

  if (isLoggedIn === null) {
    return null
  }
  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#0077B5" />
            <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
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
                name="Home"
                component={HomeScreen}
                options={{ title: "Welcome", headerShown: false }}
              />
              {/* <Stack.Screen
              name="CreatePost"
              component={CreatePost}
              options={{ title: "Create New Post", headerShown: false }}
            /> */}
              <Stack.Screen
                name="PostDetail"
                component={PostDetailScreen}
                options={{ title: "Detail", headerShown: false }}
              />
              {/* <Stack.Screen
              name="SearchUser"
              component={SearchScreen}
              options={{ title: "Search", headerShown: false }}
            /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </AuthContextProvider>
    </ApolloProvider>
  )
}
