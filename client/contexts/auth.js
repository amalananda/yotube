
import React, { createContext, useState, useContext, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'

const AuthContext = createContext({
  isSignedIn: false,
  signIn: () => { },
  signOut: () => { },
  isLoading: false

})

const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token')
        setIsSignedIn(!!token) // true jika token ada
      } catch (err) {
        console.error('Error fetching login status:', err)
      } finally {
        setIsLoading(false)
      }
    }

    checkLoginStatus()
  }, [])

  const signIn = async (token, userId) => {
    try {
      await SecureStore.setItemAsync('access_token', token)


      setIsSignedIn(true)
    } catch (err) {
      console.error('Error during sign-in:', err)
    }
  }

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('access_token')

      setIsSignedIn(false)

    } catch (err) {
      console.error('Error during sign-out:', err)
    }
  }

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
export { AuthContext, AuthProvider }
