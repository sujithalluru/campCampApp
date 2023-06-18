import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Text, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, CommonActions } from '@react-navigation/native';
import firestore from "@react-native-firebase/firestore";

const options = [
  { id: '1', title: 'Check In', description: 'Sign in when you arrive!⛺️', iconName: 'flag', route: 'CheckInScreen' },
  { id: '2', title: 'Upload Pictures', description: 'Send us camper pics!😃', iconName: 'camera-retro', route: 'QuickLinksScreen' },
  { id: '3', title: 'Summer Newsletter', description: 'CAMP Chronicles!🤩', iconName: 'newspaper-o', route: 'SummerNewsletter'},
  { id: '4', title: 'Call When in Need', description: 'Emergencies!!☎️', iconName: 'phone', route: 'ContactTeachers' },
  { id: '5', title: 'Quick Links', description: 'Important Shortcuts!👏', iconName: 'link', route: 'VirtualAssistant'},
  { id: '6', title: 'Complete CAMP Survey', description: 'Tell us your experience!🤠', iconName: 'phone', route: 'News'},
  { id: '7', title: 'Feedback', description: 'We value your opinion!👍', iconName: 'pencil', route: 'GoogleFeedback'},
  { id: '8', title: 'CAMP Handbook', description: 'Check if you have questions!🤔', iconName: 'book', route: 'Handbook'},  
];

type RootStackParamList = {
  Home: undefined;
  UploadPhotos: undefined;
  SummerNewsletter: undefined;
  CallWhenInNeed: undefined;
  GoogleFeedback: undefined;
  CompleteCAMPSurvey: undefined;
  QuickLinks: undefined
  Handbook: undefined;
  CheckInScreen: undefined;
  Details: { id: number };
};

type Props = {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
}
const HomeScreen = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [gratitudeMessage, setGratitudeMessage] = useState("Thank you so much for your work today!!!");

  useEffect(() => {
    const fetchGratitudeMessage = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('gratitudeMessage')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();
  
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const gratitudeMessage = doc.data().body;
          setGratitudeMessage(gratitudeMessage);
        }
      } catch (error) {
        console.log('Error fetching gratitude message:', error);
      }
    };
  
    fetchGratitudeMessage();
    const date = new Date();
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);
  

  

  const navigation = useNavigation();

  const handleOptionPress = (option: { id: string; title: string; description: string; iconName: string; route?: string; webLink?: string;}) => {
    if (option.webLink) {
      Linking.openURL(option.webLink);
    } else if(option.title == "Summer Newsletter"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "SummerNewsletter",
        }
        )
        
      );
      
    } 
    else if(option.title == "Quick Links"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "QuickLinks",
        }
        )
        
      );
      
    } 
    else if(option.title == "Check In"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "CheckInScreen",
        }
        )
        
      );
      
    } 
    else if(option.title == "CAMP Handbook"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "Handbook",
        }
        )
        
      );
      
    } 
    else if(option.title == "Virtual Assistant"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "VirtualAssistant",
        }
        )
        
      );
      
    } 
    else if(option.title == "Feedback"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "GoogleFeedback",
        }
        )
        
      );
      
    } 
    else if(option.title == "Contact Us"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "ContactUs",
        }
        )
        
      );
      
    } 
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.headerText}>Dashboard</Text>
        
      </View>
      <Text style = {styles.gratitude}>{gratitudeMessage}</Text>
      {options.map((option) => (
        <TouchableOpacity key={option.id} onPress={() => handleOptionPress(option)}>
          <View style={styles.box}>
            <ListItem>
              <Icon name={option.iconName} size={20} color="#005987" />
              <ListItem.Content>
                <ListItem.Title>{option.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.descriptionText}>{option.description}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon name="chevron-right" size={20} color="gray" style={styles.chevronIcon} />
            </ListItem>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 5,
  },
  headerText: {
    fontSize: 40,
    marginLeft: -98,
    marginBottom:10,
    marginTop: -13,
    color: "#005987",
    fontWeight: "600",
    
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
    marginTop:40,
    marginLeft: 5,
  },
  box: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    marginVertical: 5,
    overflow: 'hidden', // Needed to apply border radius to ListItem
  },
  descriptionText: {
    color: 'gray',
  },
  chevronIcon: {
    marginLeft: 'auto',
    paddingLeft: 10,
  },
  gratitude: {
    fontSize: 20,
    marginLeft: 6,
    marginBottom:10,
    marginTop: 3,
    color: "#4c9134",
    fontWeight: "600",
  }
});

export default HomeScreen;
