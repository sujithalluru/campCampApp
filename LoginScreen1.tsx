import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Go to the main screen after successful login.
      await AsyncStorage.setItem('isLoggedIn', '1');
      const currentTime = firestore.Timestamp.now().toMillis();
      await AsyncStorage.setItem("installTime", JSON.stringify(currentTime));
      messaging().subscribeToTopic('all');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }], 
      });
    } catch (error) {
      Alert.alert('Error', error.message.includes("formatted") ? "Email formatted incorrectly" : "Your username or password may be incorrect")
    }
  };

  const onPasswordReset = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Password reset link sent to your email');
    } catch (error) {
      Alert.alert('Error', error.message.includes("provided") ? "Please provide an email address above" : error.message.includes("formatted") ? "Email formatted incorreclty": error.message.includes("deleted") ? "This user does not exist, please check the spelling of your email": "Unknown error occured, please make a new account")
    }
  };

  return (
    <PaperProvider
      theme={{
        colors: {
          primary: '#086c9c',
          secondary:  '#086d9b42'// Change the primary color to your desired base color
        },
      }}
    >
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode = "outlined"
          underlineColor='#086c9c'
          style={styles.input}
          
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          underlineColor='#086c9c'
          mode = "outlined"
          style={styles.input}
        />
        <Button onPress={onLogin} style={styles.button} mode="contained">
          Log In
        </Button>
        <Button onPress={onPasswordReset} style={styles.button} mode="text">
          Forgot Password?
        </Button>
        <Button onPress={() => navigation.navigate('Signup')} style={styles.button} mode="text">
          Don't have an account? Sign Up
        </Button>
      </View>
      </ScrollView>
    </PaperProvider>
  );
};

// Style according to your preference
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    
  },
  button: {
    marginTop: 10,
  },
});

export default LoginScreen;
