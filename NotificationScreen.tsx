import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import CalendarEvent from "./ToDo";
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { firebase } from '@react-native-firebase/firestore';
import { AppState } from 'react-native';  // <-- Import AppState here


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
    const [allLoaded, setAllLoaded] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);
    const [launchTime, setLaunchTime] = useState(Date.now());
   
    const fetchTime = async () => {
      let storedTime;
    
      if(isNotGeneral) {
        storedTime = await AsyncStorage.getItem("volTime");
      } else {
        storedTime = await AsyncStorage.getItem("installTime");
      }
    
      console.log('Stored time:', storedTime); // Add this line


      if (storedTime !== null) {
        // Convert the stored time back into a number
        setTime(Number(storedTime));
      }
    };
    const handleAppStateChange = (nextAppState) => {
      const currentTime = Date.now();
      const oneDay = 5000; // one day in milliseconds
    
      if (appState.match(/active|inactive/) && nextAppState === 'background') {
        if (currentTime - launchTime >= oneDay) {
          console.log('App has been open for more than a day!');
          setLoading(false);
          setAllLoaded(false);
          if (time !== null) {
            loadEvents();
          }
          setLaunchTime(currentTime);
        }
      }
      setAppState(nextAppState);
    };
    
    useEffect(() => {
      const appStateSub = AppState.addEventListener('change', handleAppStateChange);
      return () => {
        appStateSub.remove();
      };
    }, [])

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
      
    
      fetchTime();
    }, [isNotGeneral]);
    
    useEffect(() => {
      if(time !== null) {
        loadEvents();
      }
    }, [isConnected, time]);
    
    const loadEvents = async () => {
      if (loading || allLoaded) {
        return;
      }
    
      setLoading(true);
      const eventRef = firestore().collection(isNotGeneral ? 'allNotifications' : "notifications");
      let query = eventRef.orderBy('createdAt', 'desc').limit(20);
    
      try {
        let snapshot;
        if (time) {
          snapshot = await query.get();
          snapshot = snapshot.docs.filter(doc => {
            const data = doc.data();
            // Convert the createdAt Timestamp to milliseconds since the epoch
            const createdAtMillis = data.createdAt.toMillis();
            // Only include the document if createdAt is after time
            return createdAtMillis > time;
          });
        } else {
          snapshot = await query.get();
        }
    
        const newEvents = snapshot.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            body: data.body,
            createdAt: data.createdAt.toDate(),
          };
        });
    
        if (newEvents.length > 0) {
          const lastDoc = snapshot[snapshot.length - 1];
          const lastDocTime = lastDoc.data().createdAt.toMillis();
          setTime(lastDocTime);
          setEvents(prevEvents => [...prevEvents, ...newEvents]);
        }
    
        // If the last fetched batch of notifications is smaller than the limit, set allLoaded to true
        if (newEvents.length < 20) {
          setAllLoaded(true);
        }
    
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    
    
    
    
    
    
    const renderEvent = ({ item }: { item: CalendarEventItem }) => (
      <CalendarEvent summary={item.title} description={item.body} id = {item.id} createdAt={item.createdAt} />
  );

    return (
        <>
          {isConnected ? (
            <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={item => item.id}
            onEndReached={loadEvents}
            onEndReachedThreshold={0.5}
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
