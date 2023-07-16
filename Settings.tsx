import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';


type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

type SettingsScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const Settings = ({ navigation }: SettingsScreenProps) => {

  const handleLogoutPress = async () => {
    Alert.alert(
      "Confirm Logout",
      "This action is irreversible",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: "Log Out",
        onPress: async () => {
          await AsyncStorage.setItem('isLoggedIn', '0');
          await AsyncStorage.setItem('role', '');
          await AsyncStorage.setItem('code', '');
          await AsyncStorage.setItem("volTime", '');
          await AsyncStorage.setItem("installTime", '');
          messaging()
          .unsubscribeFromTopic('volunteerios')
          messaging()
          .unsubscribeFromTopic('volunteerandroid')
          messaging()
          .unsubscribeFromTopic('allios')
          messaging()
          .unsubscribeFromTopic('allandroid')
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],  // use the name of your home screen here
          });
        }
      }
    ],
    {cancelable: false}
    )
    
    
  };

  const handleDeletePress = async () => {
    Alert.alert(
      "Confirm Account Deletion",
      "This action is irreversible",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: "Delete",
        onPress: async () => {
          await AsyncStorage.setItem('isLoggedIn', '0');
          await AsyncStorage.setItem('role', '');
          await AsyncStorage.setItem('code', '');
          await AsyncStorage.setItem("volTime", '');
          await AsyncStorage.setItem("installTime", '');
          if(Platform.OS == "android") {
          messaging()
          .unsubscribeFromTopic('volunteerandroid')
          messaging()
          .unsubscribeFromTopic('allandroid')
          } else {
            messaging()
            .unsubscribeFromTopic('volunteerios')
            messaging()
            .unsubscribeFromTopic('allios')
          }
          await auth().currentUser?.delete();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],  // use the name of your home screen here
          });
        }
      }
    ],
    {cancelable: false}
    )
    
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
        <Icon name="sign-out" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleDeletePress}>
        <Icon name="trash" size={24} color="#fff" />
        <Text style={[styles.logoutButtonText]}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Settings;