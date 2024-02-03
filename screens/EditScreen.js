import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { database } from '../config/firebase';

const EditScreen = () => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const fetchCurrentUsername = async () => {
    const auth = getAuth();
    if (auth.currentUser) {
      try {
        const usersRef = collection(database, 'users');
        const userQuery = query(
          usersRef,
          where('email', '==', auth.currentUser.email)
        );
        const userQuerySnapshot = await getDocs(userQuery);

        if (!userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0].data();
          setCurrentUsername(userDoc.username);
        }
      } catch (error) {
        console.error('Error fetching current username:', error);
      }
    }
  };

  useEffect(() => {
    fetchCurrentUsername();
  }, []);

  const onUpdateUsername = async () => {
    if (newUsername.trim() !== '') {
      const auth = getAuth();
      if (auth.currentUser) {
        try {
          const usersRef = collection(database, 'users');
          const userQuery = query(
            usersRef,
            where('email', '==', auth.currentUser.email)
          );
          const userQuerySnapshot = await getDocs(userQuery);

          if (!userQuerySnapshot.empty) {
            const userDoc = userQuerySnapshot.docs[0];
            await updateDoc(doc(database, 'users', userDoc.id), {
              username: newUsername,
            });

            setCurrentUsername(newUsername);
            setNewUsername('');

            Alert.alert('Success', 'Username updated successfully');
          }
        } catch (error) {
          console.error('Error updating username:', error);
          Alert.alert('Error', 'Unable to update username');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <Text style={styles.usernameLabel}>Current Username: {currentUsername}</Text>
      <TextInput
        style={styles.input}
        placeholder="New Username"
        placeholderTextColor="#A480F2"
        value={newUsername}
        onChangeText={(text) => setNewUsername(text)}
      />
      <TouchableOpacity style={styles.button} onPress={onUpdateUsername}>
        <Text style={styles.buttonText}>Update Username</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  usernameLabel: {
    color: '#A480F2',
    fontSize: 18,
    marginBottom: 10,
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
});

export default EditScreen;
