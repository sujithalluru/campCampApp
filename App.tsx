import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen1';
import MainScreen from './MainScreen';
import MainAdminScreen from './MainAdminScreen';
import { Image, View, StyleSheet, Platform, Text} from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import SignupScreen from './SignUpScreen';
import QuickLinks from './QuickLinks';
import SummerNewsletter from './SummerNewsletter';
import Handbook from './Handbook';
import CheckInScreen from './CheckInScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import functions from '@react-native-firebase/functions';
import NotificationFormScreen from './NotifcationSendScreen';
import firestore from "@react-native-firebase/firestore";
import GoogleFeedback from './GoogleFeedback';
// ...
// require('dotenv').config();

const Stack = createStackNavigator();




const App = () => {
  const [isLogIn, setLogIn] = useState(false);
  const [role, setRole] = useState("general");
  const [loading, setLoading] = useState(true);
  const validateCode = functions().httpsCallable('validateCode');

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    }

    requestUserPermission();
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      
      // Display notification with notifee
      // await notifee.displayNotification({
      //   title: remoteMessage.notification.title,
      //   body: remoteMessage.notification.body,
      //   android: {
      //     channelId: 'your-channel-id', // make sure you create this channel in your app
      //   },
      // });
  });

  // When a message arrives while the app is in the background or quit
  messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', JSON.stringify(remoteMessage));
      
      // Display notification with notifee
      // await notifee.displayNotification({
      //   title: remoteMessage.notification.title,
      //   body: remoteMessage.notification.body,
      //   android: {
      //     channelId: 'your-channel-id', // make sure you create this channel in your app
      //   },
      // });
  });
    messaging().subscribeToTopic('all');
    const checkLogIn = async () => {
      
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      console.log(isLoggedIn);
      const role = await AsyncStorage.getItem("role")
      const code = await AsyncStorage.getItem("code")
      if (isLoggedIn == '1') {
      setLogIn(true);
      validateCode({ role: role, code: Number(code) })
      .then(async (result) => {
        // The code was valid
        // Proceed with registration...
        // Alert.alert('Code validated successfully.');
        setRole(role ? role : "");
        setLoading(false);
      })
      .catch((error) => {
        // The code was invalid
        // Show an error message...
        setRole("general");
        setLoading(false);
      });
      } else {
      setLogIn(false);
      setLoading(false);
      }
    }
    checkLogIn();
  }, []);

  return (
    <NavigationContainer>
      {loading ? (
      // Render a View with a splash screen, for example:
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('/Users/sujithalluru/campCampApp/assets/ColorCAMP.png')} style={{ width: 300, height: 300, margin:20, }} />
      </View>
    ) : (
      <Stack.Navigator
        initialRouteName={isLogIn ? (role === 'admin' ? 'MainAdmin' : role === 'volunteer' ? 'MainVolunteer' : 'Main') : 'Login'}
        screenOptions={{
          headerTitle: () => (
            // <View style={{ alignItems: 'center' }}>
              <Text style={styles.title}>Camp CAMP</Text>
                            
            // </View>
          ),
          headerStyle: {
            backgroundColor: '#086c9c',
            height: 120, // Adjust the height based on your needs
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{
            headerShown: true
          }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{
            headerShown: true
          }} />
        <Stack.Screen 
          name="Main"
          options={{ headerShown: true }}>
          {props => <MainScreen {...props} isAdmin={false} isVolunteer={false} />}
        </Stack.Screen>
        <Stack.Screen 
          name="MainVolunteer"
          options={{ headerShown: true }}>
          {props => <MainScreen {...props} isAdmin={false} isVolunteer={true} />}
        </Stack.Screen>
        <Stack.Screen 
          name="MainAdmin"
          options={{ headerShown: true }}>
          {props => <MainScreen {...props} isAdmin={true} isVolunteer={false} />}
        </Stack.Screen>
        <Stack.Screen 
          name="QuickLinks" 
          component={QuickLinks} 
          options={{
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="SummerNewsletter" 
          component={SummerNewsletter} 
          options={{
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="Handbook" 
          component={Handbook} 
          options={{
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="CheckInScreen" 
          component={CheckInScreen} 
          options={{
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="NotificationFormScreen" 
          component={NotificationFormScreen} 
          options={{
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="GoogleFeedback" 
          component={GoogleFeedback} 
          options={{
            headerShown: true
          }} 
        />

      </Stack.Navigator>
    )}
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
title: {
  fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  fontWeight: '700',
  fontSize: 40,
  // marginRight: -15,
  //marginLeft: 50,
  marginBottom: 10,
  color: '#ffffff',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  logoContainer: {
    width: 60,
    height: 60,
    marginRight: 10,
    // Add right margin to separate the logo from the text
  },
  logo: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
  },
});

export default App;