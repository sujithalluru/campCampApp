import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const NotificationFormScreen = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSendNotification = async () => {
    console.log('Sending Notification...');
    // here you could add the logic to send the notification
    firestore()
        .collection('notifications')
        .add({
          title: title,
          body: body
        })
        .then(() => {
          console.log('Notification sent successfully');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    console.log(title, body);
  }
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <TextInput
        label="Notification Title"
        value={title}
        onChangeText={text => setTitle(text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Notification Body"
        value={body}
        onChangeText={text => setBody(text)}
        style={styles.input}
        mode="outlined"
        multiline
      />
      <Button 
        mode="contained" 
        onPress={handleSendNotification}
        style={styles.button}
      >
        Send Notification
      </Button>
    </View>
  );
}

export default NotificationFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: '4%',
  },
  input: {
    marginBottom: '4%',
  },
  button: {
    padding: '2%',
  },
});
