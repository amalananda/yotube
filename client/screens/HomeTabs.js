import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
// import { useContext } from 'react'
import { AuthContext } from '../contexts/auth'
import { ActivityIndicator, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import HomeScreen from './HomeScreen'
import CreatePostScreen from './CreateScreen'

import SearchUsersScreen from './SearchScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Button } from 'react-native'


import ProfileScreen from './ProfileScreen'


const Tab = createBottomTabNavigator()

export function HomeTabs() {
  const navigation = useNavigation()
  const { signOut } = useContext(AuthContext)

  const handleLogout = () => {
    signOut()
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = focused
              ? 'home-sharp'
              : 'home-outline'
          }
          else if (route.name === 'Create Post') {
            iconName = focused ? 'add-circle-sharp' : 'add-circle-outline'
          }
          else if (route.name === 'Search User') {
            iconName = focused ? 'search' : 'search-outline'
          }
          else if (route.name === 'User Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        headerRight: () => (
          <Button title="Logout" onPress={handleLogout} color="#000" />
        ),
        headerStyle: {
          backgroundColor: '#f8f8f8'
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create Post" component={CreatePostScreen} />
      <Tab.Screen name="Search User" component={SearchUsersScreen} />
      <Tab.Screen name="User Profile" component={ProfileScreen} />

    </Tab.Navigator>
  )
}
