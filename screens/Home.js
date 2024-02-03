import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { Auth, database } from '../config/firebase';
import colors from '../Colors';
import { signOut } from 'firebase/auth';

const profileImage = require('../assets/profile.png');
const CustomSidebar = ({ closeSidebar, navigate,OnSignOut }) => {
  return (
    <View style={styles.sidebar}>
      <Image source={profileImage} style={styles.profileImage} />
      <Text style={styles.profileText}>Your Profile</Text>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigate('EditScreen')}>
        <FontAwesome name="edit" size={20} color={colors.primary} style={styles.sidebarIcon} />
        <Text style={styles.sidebarText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigate('RequestsScreen')}>
        <FontAwesome name="users" size={20} color={colors.primary} style={styles.sidebarIcon} />
        <Text style={styles.sidebarText}>Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigate('FriendsScreen')}>
        <FontAwesome name="handshake-o" size={20} color={colors.primary} style={styles.sidebarIcon} />
        <Text style={styles.sidebarText}>Friends</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={OnSignOut}>
        <FontAwesome name="sign-out" size={20} color={colors.primary} style={styles.sidebarIcon} />
        <Text style={[styles.sidebarText, { color: colors.primary }]}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar}>
        <FontAwesome name="times" size={20} color={colors.primary} style={styles.sidebarIcon} />
        <Text style={styles.sidebarText}>Close Sidebar</Text>
      </TouchableOpacity>
    </View>
  );
};
const Home = () => {
  const navigation = useNavigation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [friends, setFriends] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  const OnSignOut = () => {
    signOut(Auth).catch((error) => console.log(error));
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsCollectionRef = collection(database, 'friends');
        const user = Auth.currentUser.email;
        const q1 = query(friendsCollectionRef, where('user', '==', user));
        const q2 = query(friendsCollectionRef, where('friendEmail', '==', user));
        const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        const userFriends = [];

        querySnapshot1.forEach((doc) => {
          const friendData = doc.data();
          userFriends.push(friendData.friendEmail);
        });

        querySnapshot2.forEach((doc) => {
          const friendData = doc.data();
          userFriends.push(friendData.user);
        });

        setFriends(userFriends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={toggleSidebar}>
          <View style={styles.profileContainer}>
            <Image source={profileImage} style={styles.profileImage} />
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <FontAwesome name="search" size={24} color={colors.primary} style={styles.headerIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        // Navigate to the Chat screen with the friend's information
        navigation.navigate('Chat', {
          friend: item, // Pass the friend's email or any relevant information
        });
      }}
    >
      <View style={styles.friendItem}>
        <Image source={profileImage} style={styles.friendImage} />
        <Text style={styles.friendName}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        renderItem={renderFriendItem}
      />


      {isSidebarOpen && <CustomSidebar closeSidebar={closeSidebar} navigate={navigation.navigate} OnSignOut={OnSignOut}/>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    margin: 16,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerIcon: {
    marginRight: 16,
    fontSize: 24,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.border,
    padding: 16,
    backgroundColor: 'white', // Add a white background
    marginVertical: 5, // Add some vertical margin
    borderRadius: 10, // Add rounded corners
    elevation: 2, // Add a slight shadow
  },
  friendImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 16,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 16, // Adjust the margin
    color: colors.primary, // Change the text color
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: '100%',
    backgroundColor: colors.third, // Change the background color
    borderRightWidth: 1,
    borderColor: 'lightgray',
    paddingTop: 50,
    paddingHorizontal: 16, // Add horizontal padding
  },
  sidebarItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
});


export default Home;
