import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Auth, database } from '../config/firebase';

const background = require('../assets/background.png');

export default function Search({ navigation }) {
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (username.trim() !== '') {
      try {
        const usersCollectionRef = collection(database, 'users');
        const q = query(usersCollectionRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        const searchResults = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          searchResults.push(userData);
        });

        setSearchResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  const handleAddFriend = async (receiver) => {
    if (Auth.currentUser.email === receiver) {
      Alert.alert('Unable to Add Friend', 'You cannot add yourself as a friend.');
    } else {
      try {
        const requestsCollectionRef = collection(database, 'requests');
        const newRequestDocRef = doc(requestsCollectionRef);
  
        // Create a request document with sender and receiver emails
        await setDoc(newRequestDocRef, {
          sender: Auth.currentUser.email,
          receiver: receiver,
        });
  
        Alert.alert('Friend Request Sent', 'Your friend request has been sent.');
      } catch (error) {
        console.error('Error sending friend request:', error);
      }
    }
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.whiteSheet}>
          <Text style={styles.title}>Search</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#A480F2"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          {searchResults.length > 0 && (
            <View>
              <Text style={styles.resultsHeader}>Search Results:</Text>
              {searchResults.map((user) => (
                <View key={user.email} style={styles.resultItem}>
                  <Text>{user.username}</Text>
                  <TouchableOpacity
                    style={styles.addFriendButton}
                    onPress={() => handleAddFriend(user.email)}
                  >
                    <Text style={styles.addFriendButtonText}>Add Friend</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#A480F2',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 5,
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(176, 196, 222, 0.2)',
    color: '#A480F2',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  whiteSheet: {
    backgroundColor: 'white',
    width: '80%',
    padding: 30,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: '#A480F2',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  resultsHeader: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#B0C4DE',
    padding: 10,
  },
  addFriendButton: {
    backgroundColor: '#A480F2',
    padding: 5,
    borderRadius: 5,
  },
  addFriendButtonText: {
    color: 'white',
  },
});
