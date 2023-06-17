import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const onSignUp = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      // Go to the main screen after successful sign up.
      navigation.navigate('Main');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PaperProvider
      theme={{
        colors: {
          primary: '#086c9c', // Change the primary color to your desired base color
        },
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          mode = "outlined"
          underlineColor='#086c9c'
          style={styles.input}
        />
        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          mode = "outlined"
          underlineColor='#086c9c'
          style={styles.input}
        />
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
          mode = "outlined"
          underlineColor='#086c9c'
          secureTextEntry
          style={styles.input}
        />
        <Button onPress={onSignUp} style={styles.button} mode="contained">
          Sign Up
        </Button>
        <Button onPress={() => navigation.navigate('Login')} style={styles.button} mode="text">
          Already have an account? Log In
        </Button>
      </View>
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

export default SignupScreen;
