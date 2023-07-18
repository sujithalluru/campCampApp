import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import CalendarEvent from "./ToDo";
import { useNetInfo } from "@react-native-community/netinfo";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Home: undefined;
  UploadPhotos: undefined;
  SummerNewsletter: undefined;
  CallWhenInNeed: undefined;
  GoogleFeedback: undefined;
  CompleteCAMPSurvey: undefined;
  QuickLinks: undefined;
  Handbook: undefined;
  CheckInScreen: undefined;
  NotificationFormScreen: undefined;
  NotificationsScreen: undefined;
  Details: { id: number };
  ContactAdminsScreen: undefined;
  MainVolunteer: undefined;
  MainAdmin: undefined;
  Main: undefined;
};

type Props = {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
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
  const netInfo = useNetInfo();
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [lastDoc, setLastDoc] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | undefined>(undefined);
  const [time, setTime] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState("general");
    const [isRefreshing, setIsRefreshing] = useState(false);


  const fetchTime = async () => {
    let storedTime;
    let r;
    r = await AsyncStorage.getItem("role");
    setRole(r);
    if(isNotGeneral) {
      storedTime = await AsyncStorage.getItem("volTime");
    } else {
      storedTime = await AsyncStorage.getItem("installTime");
    }

    if (storedTime !== null) {
      setTime(Number(storedTime));
    }

    await loadEvents();
  };

  useEffect(() => {
    if(netInfo.isConnected && !events.length) {
      fetchTime();
    }
  }, [netInfo.isConnected, events.length]);

  const loadEvents = async () => {
    if (!netInfo.isConnected) {
      return;
    }
    if (isRefreshing) return;
    setIsRefreshing(true);


    const eventRef = firestore().collection(isNotGeneral ? 'allNotifications' : "notifications");
    let query = eventRef.orderBy('createdAt', 'desc').limit(20);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();

    if (!snapshot.empty) {
      const newEvents = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          body: data.body,
          createdAt: data.createdAt.toDate(),
        };
      }).filter(newEvent => !events.some(event => event.id === newEvent.id));

      setEvents(prevEvents => [...prevEvents, ...newEvents]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setIsLoading(false);
      setIsRefreshing(false); // End the refreshing status after fetching data

    }
  };


  const onRefresh = () => {
    // Return if a refresh is already ongoing
    if (isRefreshing) return;

    setEvents([]); // Clear the events
    setLastDoc(undefined); // Clear the last document
    loadEvents(); // Reload the events
  };

  const renderEvent = ({ item }: { item: CalendarEventItem }) => (
    <CalendarEvent summary={item.title} description={item.body} id={item.id} createdAt={item.createdAt} />
  );

  return (
    <>
      {isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : netInfo.isConnected ? (
        <View>
          <Text style={styles.work}>Previous Notifications</Text>
          <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={item => item.id}
            onEndReached={loadEvents}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </View>
      ) : (
        <View style={styles.container}>
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
