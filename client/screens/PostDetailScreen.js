import React, { useState } from 'react'
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useQuery, useMutation, gql } from '@apollo/client'

const GET_POST_DETAIL = gql`
query getPostDetail($postId: ID!) {
  postById(id: $postId) {
    _id
    content
    tags
    imgUrl
    authorId
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

const ADD_COMMENT = gql`
  mutation CommentPost($postId: ID!, $comment: CommentInput!) {
  commentPost(postId: $postId, comment: $comment) {
    _id
    content
    comments {
      content
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}`



const PostDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const postId = route.params?.postId

  const { data, loading, error } = useQuery(GET_POST_DETAIL, {
    variables: { postId }
  })

  const [newComment, setNewComment] = useState('')
  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: (data) => {
      setNewComment('')
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const handleAddComment = () => {
    if (newComment.trim() === '') return
    addComment({
      variables: {
        postId,
        comment: newComment,
      }
    })
  }

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  const { postById: post } = data

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}
          activeOpacity={0.8}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.postHeader}>
          <Image source={{ uri: post.authorDetails.imgUrl }} style={styles.authorImage} />
          <Text style={styles.username}>{post.authorDetails.username}</Text>
        </View>
        <Image source={{ uri: post.imgUrl }} style={styles.postImage} />
        <Text style={styles.content}>{post.content}</Text>

        <FlatList
          data={post.comments}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Text style={styles.commentUsername}>{item.username}</Text>
              <Text style={styles.commentAuthor}>{item.authorId}</Text>
              <Text>{item.content}</Text>
              <Text style={styles.commentDate}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          )}
          keyExtractor={(item) => item.createdAt}
        />

        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.commentButton}>
          <Text style={styles.commentButtonText}>Post Comment</Text>
        </TouchableOpacity>


        <Text style={styles.likes}>Likes: {post.likes.length}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4D9FF2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 70,
    marginRight: 0,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 0,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  content: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 15,
    marginTop: 5,
    borderRadius: 5,
  },
  commentContainer: {
    marginBottom: 0,
    padding: 0,
  },
  commentUsername: {
    fontWeight: 'bold',
    margin: 0,
    marginBottom: 0,
    padding: 0,
  },
  commentAuthor: {
    margin: 0,
    fontWeight: 'bold',
    color: "#aaa",
    padding: 0,
  },
  commentDate: {
    fontSize: 11,
    color: '#888',
  },
  commentButton: {
    backgroundColor: "#4D9FF2",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  commentButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  likes: {
    marginTop: 10,
    fontWeight: 'bold',
  },
})

export default PostDetailScreen
