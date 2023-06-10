import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const Settings = () => {
  const navigation = useNavigation();

  const handleLogoutPress = () => {
    
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
    backgroundColor: '#fff',
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