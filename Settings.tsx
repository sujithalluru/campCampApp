import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, NavigationProp } from '@react-navigation/native';

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

  const handleLogoutPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],  // use the name of your home screen here
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
        <Icon name="sign-out" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Log Out</Text>
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
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Settings;