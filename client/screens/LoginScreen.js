import React, { useContext, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@apollo/client'
import * as SecureStore from 'expo-secure-store'
import { LOGIN } from '../operations/auth' // Pastikan LOGIN terdefinisi dengan benar
import AuthContext from '../contexts/auth'

const LoginScreen = () => {
  const navigation = useNavigation()
  const { setIsSignedIn, setUser } = useContext(AuthContext)
  // const { isSignedIn, setIsSignedIn, user, setUser } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { loading }] = useMutation(LOGIN)

  const handleLogin = async () => {
    setIsSignedIn(true)
    setUser({})
    if (!email.trim() || !password.trim()) {
      return Alert.alert("Input Error", "Email dan password tidak boleh kosong.")
    }

    try {
      const { data } = await login({
        variables: { email, password }
      })

      // Periksa jika akses token ada dalam data loginUser
      if (data?.loginUser?.access_token) {
        await SecureStore.setItemAsync('access_token', data.loginUser.access_token)
        console.log("Token saved:", await SecureStore.getItemAsync('access_token'))

        // Set status login ke authContext
        setIsSignedIn(true)

        // Navigasi ke halaman Home
        navigation.replace('Home')
      } else {
        throw new Error("Invalid login response.")
      }
    } catch (error) {
      console.error("Login Error:", error)
      Alert.alert(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/aikon.png")}
        style={styles.logo}
      />

      <TextInput
        placeholder="Email or Username"
        placeholderTextColor="#aaa"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.loginButton, loading && styles.disabledButton]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    borderRadius: 10,
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#fff",
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#000",
    marginBottom: 15,
  },
  loginButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#4D9FF2",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#A9CCE3",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  signupText: {
    color: "#888",
    fontSize: 14,
  },
  signupLink: {
    color: "#1a73e8",
    fontSize: 14,
    fontWeight: "bold",
  },
})

export default LoginScreen
