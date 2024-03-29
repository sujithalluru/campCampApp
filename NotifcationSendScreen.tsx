import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, Switch, ScrollView} from 'react-native';
import { Button, TextInput, List, Divider, Provider as PaperProvider, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const NotificationFormScreen = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [recipient, setRecipient] = useState(' ');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isSupportMessage, setIsSupportMessage] = useState(false);
 

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuSelect = (selectedRecipient: React.SetStateAction<string>) => {
    setRecipient(selectedRecipient);
    setMenuVisible(false);
  };

  const handleSendNotification = async () => {
    if (title === ' ' || body === '' || recipient === " ") {
      Alert.alert('Please select a role and enter a title and body.');
      return;
    }
  
    Alert.alert(
      'Confirm Notification',
      `Are you sure you want to send the notification to ${recipient}? This action is irreversible.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: async () => {
            if (recipient === "general") {
              // Sending notification to general collection
              try {
                await firestore()
                  .collection('notifications')
                  .add({
                    title: title,
                    body: body,
                    createdAt: firestore.Timestamp.now()
                  });
                  await firestore()
                  .collection('volnotifications')
                  .add({
                    title: title,
                    body: body,
                    createdAt: firestore.Timestamp.now()
                  });
                await firestore()
                  .collection('allNotifications')
                  .add({
                    title: title,
                    body: body,
                    createdAt: firestore.Timestamp.now()
                  });
                console.log('Notification sent successfully');
                Alert.alert('Notification Sent', 'The notification was sent successfully.');
                setTitle('');
                setBody('');
              } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error', 'An error occurred while sending the notification.');
              }
            } else {
              // Sending notification to volnotifications collection and allNotifications collection
              try {
                await firestore()
                  .collection('volnotifications')
                  .add({
                    title: title,
                    body: body,
                    createdAt: firestore.Timestamp.now()
                  });
                await firestore()
                  .collection('allNotifications')
                  .add({
                    title: title,
                    body: body,
                    createdAt: firestore.Timestamp.now()
                  });
                console.log('Notification sent successfully');
                Alert.alert('Notification Sent', 'The notification was sent successfully.');
                setTitle('');
                setBody('');
              } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error', 'An error occurred while sending the notification.');
              }
            }
  
            if (isSupportMessage) {
              // Saving gratitudeMessage
              try {
                await firestore()
                  .collection('gratitudeMessage')
                  .doc('gratitude')
                  .set({
                    title: title,
                    body: body,
                    createdAt: firestore.Timestamp.now()
                  });
                
                setTitle('');
                setBody('');
              } catch (error) {
                console.error('Error:', error);
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16}}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <PaperProvider
    theme={{
      colors: {
        primary: '#003479',// Change the primary color to your desired base color
      },
    }}
  >
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Send Notification</Text>
      <Button mode="outlined" onPress={handleMenuToggle} style={{margin: 10}}>
          Select recipient: {recipient || 'none'}
        </Button>
      {menuVisible && (
          <View style={styles.menu}>
            <List.Item
              title="General"
              onPress={() => handleMenuSelect('general')}
              style={{backgroundColor: "#6c9bd9"}}
            />
            <Divider />
            <List.Item
              title="Volunteers Only"
              onPress={() => handleMenuSelect('volunteer')}
              style={{backgroundColor: "#6c9bd9"}}
            />
          </View>
        )}
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
      {recipient === 'volunteer' && (
        <View style={styles.switchContainer}>
        <Text style={{fontSize: 20}}>Is it a support message? </Text>
        <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isSupportMessage ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={setIsSupportMessage}
        value={isSupportMessage}
        />
    </View>
)}
      <Button 
        mode="contained" 
        onPress={handleSendNotification}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Send Notification
      </Button>
    </View>
    </ScrollView>
    </PaperProvider>
  );
}

export default NotificationFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  menu: {
    marginTop: 8,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    marginTop: 5,
  },
  button: {
    margin: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});
