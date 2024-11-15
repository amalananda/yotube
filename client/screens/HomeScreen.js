import React, { useContext } from 'react'
import { SafeAreaView, FlatList, Text, View, Image, ActivityIndicator, Button } from 'react-native'
import { useQuery, gql } from '@apollo/client'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'

const GET_POSTS = gql`
  query findAllPosts {
    posts {
      _id
      content
      tags
      imgUrl
      authorDetails {
        _id
        username
        imgUrl
      }
      comments {
        content
        username
        createdAt
      }
      likes {
        username
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`

const HomeScreen = () => {
  const { loading, error, data } = useQuery(GET_POSTS)
  const navigation = useNavigation()
  if (loading) return <ActivityIndicator size="large" color="#00ff00" />
  if (error) return <Text>Error loading posts</Text>

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token')
    navigation.replace('Login')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />

      <FlatList
        data={data.posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.content}>{item.content}</Text>
            {item.authorDetails && item.authorDetails.username ? (
              <Text style={styles.authorDetails}>By: {item.authorDetails.username}</Text>
            ) : (
              <Text style={styles.authorDetails}>By: Unknown</Text>
            )}
            {item.imgUrl ? (
              <Image source={{ uri: item.imgUrl }} style={styles.image} />
            ) : (
              <Text>No image available</Text>
            )}

            <Text style={styles.date}>Posted on: {new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  authorDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
}

export default HomeScreen
