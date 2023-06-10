import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Input, Button, Divider } from 'react-native-elements';


import axios from 'axios';

const ClubHub = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleFeedbackMessageChange = (value: React.SetStateAction<string>) => {
    setFeedbackMessage(value);
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log(feedbackMessage);

    // Send data to Google Forms API
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScmwbfHnGpKL6zs-FWPp78hmm6Uj2-o3yXxcfhMwIdi1-9AFA/formResponse';
    const fieldId = '1949163526';
    const formData = {
      'entry.1949163526': feedbackMessage,
    };

    axios.post(formUrl, new URLSearchParams(formData).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    

    // Clear form fields
    setFeedbackMessage('');
  };

  return (
    <View style={styles.container}>
      <Input
        label="Feedback Message"
        placeholder="Enter your feedback here"
        value={feedbackMessage}
        onChangeText={handleFeedbackMessageChange}
        multiline
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#F5FCFF',
    padding: 20,
    width: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});

export default ClubHub;