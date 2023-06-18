import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Button, TextInput, Menu, Divider, PaperProvider, Text } from 'react-native-paper';
import functions from '@react-native-firebase/functions';

const CheckInScreen = () => {
  const [role, setRole] = useState("volunteer");
  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);

  const validateCode = functions().httpsCallable('validateCode');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSubmit = () => {
    if (!role || code === '') {
      Alert.alert('Please select a role and enter a code.');
      return;
    }

    validateCode({ role: role, code: Number(code) })
      .then((result) => {
        // The code was valid
        // Proceed with registration...
        Alert.alert('Code validated successfully.');
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
          primary: '#086c9c',
          secondary:  '#086d9b42'// Change the primary color to your desired base color
        },
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Check In</Text>

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button mode="outlined" onPress={openMenu}>Select role: {role || 'none'}</Button>}
        >
          <Menu.Item onPress={() => { setRole('admin'); closeMenu(); }} title="Admin" />
          <Divider />
          <Menu.Item onPress={() => { setRole('volunteer'); closeMenu(); }} title="Volunteer" />
        </Menu>
        <TextInput
          label='Enter your code'
          value={code}
          onChangeText={text => setCode(text)}
          keyboardType='numeric'
          mode='outlined'
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit
        </Button>
      </View>
    </PaperProvider>
  );
}

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

export default CheckInScreen;
