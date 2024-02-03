import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from './config/firebase'; // Import your Firebase configuration here
import colors from './Colors';
import Chat from './screens/Chat';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import Search from './screens/Search'; 
import EditScreen from './screens/EditScreen';
import RequestsScreen from './screens/RequestsScreen';
import FriendsScreen from './screens/FriendsScreen';

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext();

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function LoginScreen({ navigation }) {
  return <Login navigation={navigation} />;
}

function SignupScreen({ navigation }) {
  return <Signup navigation={navigation} />;
}

function Chatstack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ 
        title: 'LetsChat',
        headerTitleAlign: 'center',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#90EE90', // Set the header background color
        },
        headerTintColor:'#445EF2', // Set the text color
      }} />
      <Stack.Screen name="Chat" component={Chat} options={{
        title: 'Chat',
        headerTitleAlign: 'center',
        headerShown: true,
        headerStyle: {
          backgroundColor: 'none', // Set the header background color
        },
        headerTintColor: colors.secondary,
        headerTitleStyle: {
          fontSize: 24, // Set the font size for the title
        },
      }} />
      <Stack.Screen name="EditScreen" component={EditScreen} options={{ 
      }} />
      <Stack.Screen name="RequestsScreen" component={RequestsScreen} options={{
      }} />
      <Stack.Screen name="FriendsScreen" component={FriendsScreen} options={{
      }} />
      <Stack.Screen name="Search" component={Search} options={{ // Add the Search screen navigation
        title: 'Search',
        headerTitleAlign: 'center',
        headerShown:true,
        headerStyle: {
          backgroundColor: 'none', // Set the header background color
        },
        headerTintColor: colors.secondary, // Set the text color
      }} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: 'Sign Up',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (authenticatedUser) => {
      setUser(authenticatedUser); // Firebase auth state listener automatically updates user state
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // No need to include user in dependencies

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <Chatstack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
