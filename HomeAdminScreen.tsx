import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from '@react-native-community/netinfo';
import { ScrollView } from 'react-native-gesture-handler';
import Settings from './Settings';
import Feedback from './Feedback';
import { Image } from 'react-native-elements';
import analytics from '@react-native-firebase/analytics';


const Tab = createBottomTabNavigator();
const HomeAdminScreen = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      NetInfo.fetch().then(state => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      return () => {
        unsubscribe();
      };
    }, [navigation]);
    
    const handleSendNotification = async () => {
      // Add your logic for sending notification here
      // analytics().logEvent('Notification_Sent', {
      //   id: 12345,
      //   description: 'notification_sent',
      // });
      // await analytics().logEvent('product_view', {
      //   id: '1234',
      // });
      console.log("Sending Notification...");
    }
    // const user = firebase.auth().currentUser;

    return (
        <>
          {isConnected ? (
            <View style={{alignItems: 'center'}}>
              <Text style={styles.work}>
                Admin Dashboard
              </Text>
              {/* <Text>Welcome {user ? user.email : "no user"}</Text> */}
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
    work:{
      fontSize: 24,
      alignSelf: "center",
      marginVertical: 8,
      marginBottom: 4,
    },
    qrContainer: {
        backgroundColor: 'white',
        margin: 20,
        marginTop: 0,
        borderWidth: 2,
        borderColor: '#ebe8e8',
        borderRadius: 15,
        overflow: 'hidden',
        alignSelf: 'center',
        padding: 20, 
    },
    button: {
        width: '90%',
        height: 90,
        backgroundColor: '#841584',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 40,
    }
  });
