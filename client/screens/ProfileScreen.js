import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useQuery, gql } from "@apollo/client"
import * as SecureStore from 'expo-secure-store'

const GET_USER_PROFILE = gql`
  query UserById($id: ID!) {
    userById(id: $id) {
      _id
      name
      username
      email
      followers {
        username
        _id
      }
      followings {
        username
        _id
      }
    }
  }
`

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [userId, setUserId] = useState("")
  const [activeTab, setActiveTab] = useState("followings")

  useEffect(() => {
    const getUserId = async () => {
      const id = await SecureStore.getItemAsync("userId")
      if (id) {
        setUserId(id)
      } else {
        console.log("User ID tidak ditemukan. Harap login terlebih dahulu.")
      }
    }
    getUserId()
  }, [])

  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { id: userId },
    // skip: !userId,
    fetchPolicy: "no-cache",
  })

  if (loading) return <Text style={styles.loading}>Loading...</Text>
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>

  const user = data?.userById


  const handleActiveTab = (tabName) => {
    setActiveTab(tabName)
  }

  const renderFollowersOrFollowings = () => {
    if (activeTab && user) {
      const userList = user[activeTab]

      if (userList && userList.length) {
        return (
          <View style={styles.listContainer}>
            <Text style={{ ...styles.usernameText, marginBottom: 20, textTransform: "capitalize" }}>
              {activeTab}
            </Text>
            {userList
              .filter(item => item && item._id)
              .map((item) => (
                <View key={item._id} style={styles.userCard}>
                  <Text style={styles.usernameText}>@{item.username}</Text>
                </View>
              ))}
          </View>
        )
      }
    }
    return (
      <Text style={styles.noDataText}>
        No {activeTab === "followers" ? "Followers" : "Following"}
      </Text>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.username}>@{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <TouchableOpacity
          onPress={() => handleActiveTab("followers")}
          style={styles.statsBox}
        >
          <Text style={styles.statsNumber}>{user?.followers?.length}</Text>
          <Text style={styles.statsLabel}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleActiveTab("followings")}
          style={styles.statsBox}
        >
          <Text style={styles.statsNumber}>{user?.followings?.length}</Text>
          <Text style={styles.statsLabel}>Following</Text>
        </TouchableOpacity>
      </View>
      {/* {renderFollowersOrFollowings()} */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileInfo: {
    justifyContent: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10
  },
  username: {
    fontSize: 18,
    color: "#000",
    marginTop: 10
  },
  email: {
    fontSize: 16,
    color: "#000",
    marginTop: 10
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  statsBox: {
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  statsLabel: {
    fontSize: 14,
    color: "#aaaaaa",
  },
  loading: {
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  listContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#3A3A3C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#AAAAAA",
    marginTop: 10,
  },
})

export default ProfileScreen
