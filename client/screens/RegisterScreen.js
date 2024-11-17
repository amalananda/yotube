import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native"
import { useMutation, gql } from "@apollo/client"

const userRegister = gql`
  mutation RegisterUser($user: UserInput!) {
    registerUser(user: $user) {
      _id
      name
      username
      email
    }
  }
`

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [registerUser, { loading, error }] = useMutation(userRegister, {
    onCompleted: () => navigation.navigate("Login"),
  })

  const handleRegister = () => {
    if (!name || !username || !email || !password) {
      alert("Please fill out all fields")
      return
    }
    registerUser({ variables: { user: { name, username, email, password } } })
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/aikon.png")}
        style={styles.logo}
      />
      <TextInput
        placeholder="Name"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Username"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry={true}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>
          {loading ? "Loading..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
      {error && <Text style={{ color: "red" }}>{error.message}</Text>}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signupLink}> Log In</Text>
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
    width: 100,
    height: 100,
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
  registerButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#4D9FF2",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  registerButtonText: {
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

export default RegisterScreen
