import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from '@react-native-community/netinfo';
import { ScrollView } from 'react-native-gesture-handler';
import Settings from './Settings';
import Feedback from './Feedback';
import { Image } from 'react-native-elements';
import analytics from '@react-native-firebase/analytics';
import firestore from '@react-native-firebase/firestore';


type RootStackParamList = {
  HomeScreen: undefined;
  NotifSendScreen: undefined;
};

type Props = {
  navigation: NavigationProp<RootStackParamList, 'HomeScreen'>;
}
const HomeAdminScreen = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      NetInfo.fetch().then((state: { isConnected: boolean | ((prevState: boolean) => boolean) | null; }) => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      const unsubscribe = NetInfo.addEventListener((state: { isConnected: boolean | ((prevState: boolean) => boolean) | null; }) => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      return () => {
        unsubscribe();
      };
    }, [navigation]);
    
    const handleSendNotification = async () => {
      
      // console.log("Sending Notification...");
      // const title = "Your notification title";
      // const body = "Your notification body";
      navigation.dispatch(
        CommonActions.navigate({
          name: "NotifSendScreen",
        }
        )
        
      );
      // Add a new document to the "notifications" collection
      // firestore()
      //   .collection('notifications')
      //   .add({
      //     title: title,
      //     body: body
      //   })
      //   .then(() => {
      //     console.log('Notification sent successfully');
      //   })
      //   .catch((error) => {
      //     console.error('Error:', error);
      //   });
    }
    // const user = firebase.auth().currentUser;

    return (
        <>
          {isConnected ? (
            <ScrollView>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.work}>
                Admin Dashboard
              </Text>
              <TouchableOpacity style={styles.button} onPress={handleSendNotification}>
                <Text style={styles.buttonText}>Send Notification</Text>
              </TouchableOpacity>
              <Text style={styles.work}>
                Upload Photos Below!!!
              </Text>
              <TouchableOpacity  
              onPress={() => Linking.openURL('https://www.google.com')}
              style={styles.qrContainer}>
                <Image source={require('./assets/upload_qr.jpeg')} style={{width: 300, height: 300}} />
              </TouchableOpacity>
              <TouchableOpacity  
              disabled
              style={styles.qrContainer}>
                <Image source={require('./assets/theme_days.jpeg')} style={{width: 350, height: 35}} />
              </TouchableOpacity>
            </View>
            </ScrollView>
          ) : (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <Icon name="wifi" size={32} color="#888" />
              <Text>No Internet Connection</Text>
            </View>
          )}
        </>
      );
      
  };

  export default HomeAdminScreen;
  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      backgroundColor: '#841584',
      borderRadius: 15,
      justifyContent: 'center',
      marginVertical: '3%',
      padding: '4%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      width: '90%',
    },
    buttonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    qrContainer: {
      alignSelf: 'center',
      backgroundColor: 'white',
      borderColor: '#ebe8e8',
      borderWidth: 1,
      borderRadius: 15,
      margin: '2%',
      overflow: 'hidden',
      padding: '2%', 
    },
    work: {
      alignSelf: "center",
      fontSize: 24,
      marginVertical: '2%',
      fontWeight: '500',
    },
  });
  
  
