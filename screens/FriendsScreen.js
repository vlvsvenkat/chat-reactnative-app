import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { Auth, database } from '../config/firebase';

export default function FriendsScreen() {
  const [friends, setFriends] = useState([]); // Initialize friends as an empty array

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const friendsCollectionRef = collection(database, 'friends');
      const q1 = query(friendsCollectionRef, where('user', '==', Auth.currentUser.email));
      const q2 = query(friendsCollectionRef, where('friendEmail', '==', Auth.currentUser.email));
      
      const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const uniqueFriendsSet = new Set();

      querySnapshot1.forEach((doc) => {
        const friendData = doc.data();
        uniqueFriendsSet.add(friendData.friendEmail);
      });

      querySnapshot2.forEach((doc) => {
        const friendData = doc.data();
        uniqueFriendsSet.add(friendData.user);
      });

      const uniqueFriendsArray = Array.from(uniqueFriendsSet);

      setFriends(uniqueFriendsArray);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleUnfriend = async (friendEmail) => {
    try {
      const friendDocQuery = query(
        collection(database, 'friends'),
        where('user', '==', Auth.currentUser.email),
        where('friendEmail', '==', friendEmail)
      );

      const friendDocSnapshot = await getDocs(friendDocQuery);

      friendDocSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      fetchFriends();
    } catch (error) {
      console.error('Error unfriending:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Image
        source={require('../assets/profile.png')} // Replace with your image source
        style={styles.profileImage}
      />
      <Text style={styles.friendName}>{item}</Text>
      <TouchableOpacity style={styles.unfriendButton} onPress={() => handleUnfriend(item)}>
        <Text style={styles.unfriendButtonText}>Unfriend</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 10,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
  },
  unfriendButton: {
    backgroundColor: 'red', // Change the color as needed
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 'auto',
    marginRight: 10,
  },
  unfriendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
