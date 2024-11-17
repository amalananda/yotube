import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native'

const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      _id
      name
      username
    }
  }
`

const SearchUsersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [triggerSearch, setTriggerSearch] = useState(false)

  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { query: searchQuery },
    skip: !triggerSearch,
  })

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      Alert.alert('Error', 'Please enter a search query')
      return
    }
    setTriggerSearch(true)
  }

  const handleFollow = (userId) => {

    console.log(`Follow user dengan ID: ${userId}`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Users</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter name or username"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <Button title="Search" onPress={handleSearch} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

      {data && data.searchUsers.length === 0 && (
        <Text style={styles.noResultsText}>No users found</Text>
      )}

      {data && data.searchUsers.length > 0 && (
        <FlatList
          data={data.searchUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text>{item.username}</Text>

              <Button
                title="Follow"
                onPress={() => handleFollow(item._id)}
              />
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  userCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 16,
  },
})

export default SearchUsersScreen
