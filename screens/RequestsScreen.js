import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where, deleteDoc, doc, setDoc } from 'firebase/firestore'; // Import doc and setDoc functions
import { Auth, database } from '../config/firebase';

export default function RequestScreen() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const requestsCollectionRef = collection(database, 'requests');
      const q = query(requestsCollectionRef, where('receiver', '==', Auth.currentUser.email));
      const querySnapshot = await getDocs(q);

      const requestsData = [];

      querySnapshot.forEach((doc) => {
        const requestData = doc.data();
        requestsData.push({ id: doc.id, sender: requestData.sender });
      });

      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId, sender) => {
    try {
      await deleteDoc(doc(database, 'requests', requestId));

      // Add the friend to the friends collection
      const friendsCollectionRef = collection(database, 'friends');
      await setDoc(doc(friendsCollectionRef), {
        user: Auth.currentUser.email,
        friendEmail: sender,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Image
        source={require('../assets/profile.png')} // Replace with your image source
        style={styles.profileImage}
      />
      <Text style={styles.requestName}>{item.sender}</Text>
      <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptRequest(item.id, item.sender)}>
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
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
  requestItem: {
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
  requestName: {
    fontSize: 16,
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#3897f0', // Change the color as needed
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 'auto',
    marginRight: 10,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
