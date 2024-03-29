import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Button, TextInput, List, Divider, Provider as PaperProvider, Text } from 'react-native-paper';
import functions from '@react-native-firebase/functions';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from "@react-native-firebase/firestore";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  MainAdmin: undefined;
  MainVolunteer: undefined;
};

type Props = {
  navigation: NavigationProp<RootStackParamList, 'Main'>;

}
const CheckInScreen = () => {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16}}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const [role, setRole] = useState(' ');
  const [code, setCode] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const validateCode = functions().httpsCallable('validateCode');

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuSelect = (selectedRole: React.SetStateAction<string>) => {
    setRole(selectedRole);
    setMenuVisible(false);
  };

  const handleSubmit = () => {
    if (role === ' ' || code === '') {
      Alert.alert('Please select a role and enter a code.');
      return;
    }

    validateCode({ role: role=="Staff & Volunteer"?"volunteer":role=="Admin"? "admin": "" , code: Number(code) })
      .then(async (result) => {
        // The code was valid
        // Proceed with registration...
        // Alert.alert('Code validated successfully.');
        const currentTime = firestore.Timestamp.now().toMillis();
        await AsyncStorage.setItem("volTime", JSON.stringify(currentTime));
        if(role === "Staff & Volunteer"){
          if (Platform.OS === "ios") {
            messaging().subscribeToTopic("volunteerios");
          } else {
            messaging().subscribeToTopic("volunteerandroid");
          }
          const token = await messaging().getToken();
          if(Platform.OS == "android"){
            firestore().collection('tokens').doc(token).set({ topic: 'volunteerandroid' });
          } else {
            firestore().collection('tokens').doc(token).set({ topic: 'volunteerios' });
          }
          await AsyncStorage.setItem('role', 'volunteer');
          await AsyncStorage.setItem('code', code)
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainVolunteer' }], 
          });
        }
        if(role === "Admin"){
          if (Platform.OS == "ios") {
            messaging().subscribeToTopic("volunteerios");
          } else {
            messaging().subscribeToTopic("volunteerandroid");
          }
          const token = await messaging().getToken();
          if(Platform.OS == "android"){
            firestore().collection('tokens').doc(token).set({ topic: 'volunteerandroid' });
          } else {
            firestore().collection('tokens').doc(token).set({ topic: 'volunteerios' });
          }          
          await AsyncStorage.setItem('role', 'admin');
          await AsyncStorage.setItem('code', code)
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainAdmin' }], 
          });
        }
      })
      .catch((error) => {
        // The code was invalid
        // Show an error message...
        Alert.alert('Invalid code.');
      });
  };

  return (
    <PaperProvider
    theme={{
      colors: {
        primary: '#003479',
      },
    }}
  >
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Check In</Text>

        <Button mode="outlined" onPress={handleMenuToggle} style={{margin: 10}}>
          Select role: {role || 'none'}
        </Button>

        {menuVisible && (
          <View style={styles.menu}>
            <List.Item
              title="Admin"
              onPress={() => handleMenuSelect('Admin')}
              style={{backgroundColor: "#6c9bd9"}}
            />
            <Divider />
            <List.Item
              title="Staff & Volunteer"
              onPress={() => handleMenuSelect('Staff & Volunteer')}
              style={{backgroundColor: "#6c9bd9"}}
            />
          </View>
        )}

        <TextInput
          label='Enter your code'
          value={code}
          onChangeText={text => setCode(text)}
          keyboardType='numeric'
          mode='outlined'
          style={styles.input}
        />

        <Button mode="contained" onPress={handleSubmit} style={styles.button} labelStyle={styles.buttonText}>
          Submit
        </Button>
      </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  menu: {
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  titleX: {
    fontFamily: Platform.OS == 'ios' ? 'System' : 'Roboto',
    fontWeight: '700',
    fontSize: 40,
    // marginRight: -15,
    //marginLeft: 50,
    marginBottom: 10,
    color: '#ffffff',
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
    },
});

export default CheckInScreen;
