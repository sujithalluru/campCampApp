import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import CalendarEvent from "./ToDo";
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { firebase } from '@react-native-firebase/firestore';

type Props = {
    isNotGeneral: boolean;
}
interface CalendarEventItem {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
}

const NotificationsScreen = ({ isNotGeneral }: Props) => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);
    const [time, setTime] = useState();
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<{ id: string, title: string, body: string, createdAt: Date }[]>([]);

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
    useEffect(() => {
      const fetchTime = async () => {
        let storedTime;
    
        if(isNotGeneral) {
          storedTime = await AsyncStorage.getItem("volTime");
        } else {
          storedTime = await AsyncStorage.getItem("installTime");
        }
    
        if (storedTime !== null) {
          // Make sure to convert the stored time to a number
          setTime(Number(JSON.parse(storedTime)));
        }
      };
    
      fetchTime();
    }, [isNotGeneral]);
    
    useEffect(() => {
      if(time !== null) {
        loadEvents();
      }
    }, [isConnected, time]);
    
    const loadEvents = async () => {
      setLoading(true);
      const eventRef = firestore().collection(isNotGeneral ? 'allNotifications' : "notifications");
      let query = eventRef.orderBy('createdAt', 'desc').limit(20);
    
      if (time) {
        Alert.alert(firebase.firestore.Timestamp.fromMillis(time).toString())
        query = query.where('createdAt', '>', firebase.firestore.Timestamp.fromMillis(time));
      }
    
      try {
        const snapshot = await query.get();
        const newEvents = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            body: data.body,
            createdAt: data.createdAt.toDate(), // convert Timestamp to JavaScript Date
          };
        });
    
        if (snapshot.docs.length > 0) {
          const lastDoc = snapshot.docs[snapshot.docs.length - 1];
          const lastDocTime = lastDoc.data().createdAt.toMillis();
          setTime(lastDocTime);
        }
    
        setEvents(prevEvents => [...prevEvents, ...newEvents]);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    const renderEvent = ({ item }: { item: CalendarEventItem }) => (
      <CalendarEvent summary={item.title} description={item.body} id = {item.id}  />
  );

    return (
        <>
          {isConnected ? (
            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={item => item.id}
                onEndReached={loadEvents}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                ListHeaderComponent={<Text style={styles.work}>Previous Notifications</Text>}
            />
          ) : (
            <View>
              <Icon name="wifi" size={32} color="#888" />
              <Text>No Internet Connection</Text>
            </View>
          )}
        </>
      );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      width: "100%",
      height: "100%"
    },
    work:{
      fontSize: 24,
      alignSelf: "center",
      marginVertical: 8,
      marginBottom: 12,
    },
});
