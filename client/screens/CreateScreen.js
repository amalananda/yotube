import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import { useMutation, gql } from '@apollo/client'
import * as SecureStore from 'expo-secure-store'


const CREATE_POST = gql`
  mutation CreatePost($post: PostInput!) {
    addPost(post: $post) {
      _id
      content
      tags
      imgUrl
      authorId
    }
  }
`

const CreatePost = ({ navigation }) => {
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [imgUrl, setImgUrl] = useState("")

  const [createPost, { loading, error }] = useMutation(CREATE_POST)

  const handleCreatePost = async () => {
    try {
      // Ambil userId dari SecureStore
      const userId = await SecureStore.getItemAsync("userId")
      if (!userId) {
        Alert.alert("Error", "User is not logged in")
        return
      }

      const { data } = await createPost({
        variables: {
          post: {
            content,
            tags: tags.split(","),
            imgUrl,
            authorId: userId,
          },
        },
      })

      Alert.alert(
        "Post Success! Refresh.",
        "Go Check Your Home Screen",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Main"),
          },
        ],
        { cancelable: false }
      )
    } catch (err) {
      console.log("Error creating post", err)
      Alert.alert("Error", "Failed to create post. Please try again.")
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={styles.input}
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Tags"
        value={tags}
        onChangeText={setTags}
        style={styles.input}
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Image URL"
        value={imgUrl}
        onChangeText={setImgUrl}
        style={styles.input}
        placeholderTextColor="#bbb"
      />

      <TouchableOpacity onPress={handleCreatePost} style={styles.createButton}>
        <Text style={styles.createButtonText}>
          {loading ? "Creating..." : "Create Post"}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#555",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: "#000",
  },
  createButton: {
    backgroundColor: "#4D9FF2",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
})

export default CreatePost
