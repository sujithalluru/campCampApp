import React, { useEffect } from 'react';
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
// ...
// require('dotenv').config();

const Stack = createStackNavigator();

// const config = {
//   clientId: '580880783847-4593v45hoq45rcfh6eusst0uaibum5l5.apps.googleusercontent.com',
//   appId: '1:580880783847:ios:77f195868081495d818542',
//   apiKey: 'AIzaSyBAWYqugVCaoPa0SZu5r20PDfllQCmw1H8',
//   databaseURL: '',
//   storageBucket: 'campapp-388922.appspot.com',
//   messagingSenderId: '580880783847',
//   projectId: 'campapp-388922',
// };
// try {
//   firebase.initializeApp(config);
// } catch (error) {
//   console.log("error w firebase")
// }


const App = () => {
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
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{
    headerTitle: () => (
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <Text style={[styles.title]}>Camp CAMP</Text>
        <Image source={require('/Users/sujithalluru/campCampApp/assets/ColorCAMP.png')} style={{ width: 60, height: 60, marginBottom: 20, marginRight: -5, }} />
      </View>
    ),
    headerStyle: {
      backgroundColor: '#086c9c',
      height: 130,
    },
  }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{
            headerShown: true
          }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{
            headerShown: true
          }} />
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="MainAdmin" 
          component={MainAdminScreen} 
          options={{
            headerShown: true
          }} 
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
title: {
  fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  fontWeight: '700',
  fontSize: 40,
  marginRight: 15,
  marginLeft: 50,
  marginBottom: 10,
  color: '#ffffff',
  }
});

export default App;