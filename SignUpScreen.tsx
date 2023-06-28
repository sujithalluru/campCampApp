import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

type SignupScreenNavigationProp = NavigationProp<RootStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16, marginRight: -40 }}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const onSignUp = async () => {
    if (firstName === '' || lastName === '' || password === "" || email === "") {
      Alert.alert('Please fill in all text boxes.');
      return;
    }
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      // Go to the main screen after successful sign up.
      const currentTime = firestore.Timestamp.now().toDate();
      await AsyncStorage.setItem("installTime", JSON.stringify(currentTime));
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', error.message.includes("weak-password") ? "Your password is too weak, please include a Capital letter, special character, a number, and at least 8 characters" :
        error.message.includes("invalid-email") ? "Please provide a valid email" : error.message);
    }
  };

  return (
    <PaperProvider
      theme={{
        colors: {
          primary: '#003479', // Change the primary color to your desired base color
        },
      }}
    >
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          mode = "outlined"
          underlineColor='#003479'
          style={styles.input}
        />
        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          mode = "outlined"
          underlineColor='#003479'
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode = "outlined"
          underlineColor='#003479'
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode = "outlined"
          underlineColor='#003479'
          secureTextEntry
          style={styles.input}
        />
        <Button onPress={onSignUp} style={styles.button} labelStyle={styles.buttonText} mode="contained">
          Sign Up
        </Button>
        <Button onPress={() => navigation.navigate('Login')} style={styles.button} mode="text">
          Already have an account? Log In
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
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default SignupScreen;
