import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from '@react-native-community/netinfo';
import CalendarEvent from './ToDo';
import { ScrollView } from 'react-native-gesture-handler';
import Settings from './Settings';
import Feedback from './Feedback';
import { Image } from 'react-native-elements';



const Tab = createBottomTabNavigator();
const HomeScreen = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
      // navigation.setOptions({
      //   headerRight: () => <SettingsDropdown handleLogout={handleLogout} />,
      // });
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
    
    
  
    return (
        <>
          {isConnected ? (
            <View style={{alignItems: 'center'}}>
              <Text style={styles.work}>
                Dashboard
              </Text>
              <CalendarEvent id={1} summary={'Top Notification'} start={''} end={''}/>
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

  export default HomeScreen;
  const styles = StyleSheet.create({
    work:{
      fontSize: 24,
      alignSelf: "center",
      marginVertical: 8,
      marginBottom: 12,
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
        padding: 20, // you can adjust this value as per your need
      },
    
  });
