import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import CalendarEvent from "./ToDo";
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from '@react-native-firebase/firestore';

type Props = {
    isNotGeneral: boolean;
}

const NotificationsScreen = ({ isNotGeneral }: Props) => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);
    const [time, setTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [events, setEvents] = useState([]);

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
        loadEvents();
    }, [isConnected, time]);

    const loadEvents = async () => {
        if(isNotGeneral) {
            const nTime = await AsyncStorage.getItem("volTime");
            setTime(JSON.parse(nTime));
        } else {
            const aTime = await AsyncStorage.getItem("installTime");
            setTime(JSON.parse(aTime));
        }
        setLoading(true);
        const eventRef = firestore().collection(isNotGeneral ? 'allNotifications' : "notifications");
        let query = eventRef.orderBy('createdAt', 'desc').limit(20);
        if (lastVisible && !loading) {
          query = query.startAfter(lastVisible);
        }
        if (time) {
          query = query.where('createdAt', '>', new firestore.Timestamp(time.seconds, time.nanoseconds));
        }
    
        try {
          const snapshot = await query.get();
          const newEvents = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
          setEvents(prevEvents => [...prevEvents, ...newEvents]);
          if (snapshot.docs.length < 20) {
            setLoading(false);
          } else {
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
    };
    

    return (
        <>
          {isConnected ? (
            <ScrollView onMomentumScrollEnd={loadEvents}>
              <Text style={styles.work}>
                Previous Notifications
              </Text>
              {events.map(event => (
                <CalendarEvent key={event.id} summary={event.title} description={event.body} />
              ))}
              {loading && <ActivityIndicator size="large" color="#0000ff" />}
            </ScrollView>
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
