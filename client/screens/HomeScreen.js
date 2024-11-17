import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, FlatList, Text, View, Image, ActivityIndicator, Button, Alert } from 'react-native'
import { useQuery, gql, useMutation } from '@apollo/client'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../contexts/auth'


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

const ADD_LIKE = gql`
mutation AddLike($postId: ID!, $like: LikeInput!) {
  addLike(postId: $postId, like: $like) {
    _id
    likes {
      username
      createdAt
    }
  }
}
`

const HomeScreen = () => {
  const [token, setToken] = useState(null)
  const { signOut, isSignedIn } = useContext(AuthContext)
  const { loading, error, data } = useQuery(GET_POSTS)
  const [addLike] = useMutation(ADD_LIKE)

  const navigation = useNavigation()

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await SecureStore.getItemAsync('access_token')
      setToken(storedToken)
    }

    fetchToken()
  }, [])

  useEffect(() => {
    if (!isSignedIn) {
      navigation.replace('Login')
    }
  }, [isSignedIn, navigation])

  if (loading) return <ActivityIndicator size="large" color="#00ff00" />
  if (error) return <Text>Error loading posts</Text>

  const handlePostClick = (postId) => {
    navigation.navigate('PostDetail', { postId })
  }

  const handleLike = async (postId) => {
    try {

      const user = await SecureStore.getItemAsync('userId')


      if (!user) {
        Alert.alert("Error", "You need to be logged in to like a post.")
        return
      }

      const newLike = {
        username: user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { data } = await addLike({
        variables: {
          postId: postId,
          like: newLike,
        },
      })

      Alert.alert("Liked!", "You have liked the post.")
    } catch (error) {
      console.log("Error liking post:", error)
      Alert.alert("Error", "Failed to like post. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data.posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.content}>{item.content}</Text>
            {item.authorDetails && item.authorDetails.username ? (
              <Text style={styles.authorDetails}>Author: {item.authorDetails.username}</Text>
            ) : (
              <Text style={styles.authorDetails}>Author: Unknown</Text>
            )}
            {item.imgUrl ? (
              <Image source={{ uri: item.imgUrl }} style={styles.image} />
            ) : (
              <Text>No image available</Text>
            )}
            <Text style={styles.actionText}>
              Like ({item.likes.length})
            </Text>
            <Text style={styles.actionText}>
              Comment ({item.comments.length})
            </Text>
            <Text style={styles.date}>Posted on: {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Button title="Like" onPress={() => handleLike(item._id)} />
            <Button title="View Post" onPress={() => handlePostClick(item._id)} />
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
  actionText: {
    fontSize: 14,
    marginTop: 10,
  },
}

export default HomeScreen
