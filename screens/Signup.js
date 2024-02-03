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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../config/firebase';

const background = require('../assets/background.png');

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Add username state

  const onHandleSignup = async () => {
    if (email !== '' && password !== '') {
      try {
        const auth = getAuth();
        // Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create a unique user document ID based on a custom identifier (e.g., username)
        const userDocRef = collection(database, 'users');
        const newUserDoc = {
          email: user.email,
          username: username,
        };
        if (username) {
          newUserDoc.username = username;
        }

        await addDoc(userDocRef, newUserDoc);

        console.log('User signed up and added to Firestore "users" collection');
      } catch (error) {
        console.error('Signup error:', error);
        Alert.alert('Signup error', error.message);
      }
    }
  }

  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.whiteSheet}>
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A480F2"
            keyboardType='email-address'
            textContentType='emailAddress'
            autoFocus={true}
            value={email}
            onChangeText={(text)=> setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A480F2"
            autoCapitalize='none'
            secureTextEntry={true}
            autoCorrect={false}
            textContentType='password'
            value={password}
            onChangeText={(text)=> setPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username" // Add username input
            placeholderTextColor="#A480F2"
            value={username}
            onChangeText={(text)=> setUsername(text)}
          />
          <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={styles.dontHaveAccountText}>
            Already have an account?{' '}
            <Text
              style={styles.signupText}
              onPress={() => navigation.navigate('Login')}
            >
              Log in
            </Text>
          </Text>
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
  form: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  dontHaveAccountText: {
    marginTop: 10,
    color: 'black',
  },
  signupText: {
    color: '#445EF2',
    textDecorationLine: 'underline',
  },
});
