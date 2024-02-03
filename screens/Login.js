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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from '../config/firebase';

const background = require('../assets/background.png');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onHandleLogin = () => {
    if (email !== '' && password !== '') {
      signInWithEmailAndPassword(Auth, email, password)
        .then(() => {
          console.log('Login Successful');
          // You can navigate to the next screen upon successful login here
        })
        .catch((err) => Alert.alert('Login error', err.message));
    }
  };

  const navigateToSignup = () => {
    // Navigate to the signup screen when the "Sign up" text is pressed
    navigation.navigate('Signup'); // Adjust the screen name as needed
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.whiteSheet}>
          <Text style={styles.title}>Login</Text>
          <View style={styles.form}>
          <TextInput
              style={styles.input}
              placeholder="Username"
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
            <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.dontHaveAccountText}>
              Don't have an account?{' '}
              <Text
                style={styles.signupText}
                onPress={navigateToSignup} // Make "Sign up" a touchable link
              >
                Sign up
              </Text>
            </Text>
          </View>
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
    color: 'black', // "Don't have an account?" text color
  },
  signupText: {
    color: '#445EF2', // "Sign up" text color
    textDecorationLine: 'underline', // Add an underline for better visibility
  },
});
