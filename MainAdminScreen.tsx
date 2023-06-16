import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from '@react-native-community/netinfo';
import CalendarEvent from './ToDo';
// import { ScrollView } from 'react-native-gesture-handler';
import Settings from './Settings';
import Feedback from './Feedback';
import HomeAdminScreen from './HomeAdminScreen';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationFormScreen from './NotifcationSendScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const icons = {
  ToDo: 'list',
  Home: 'home',
  Notifs: 'bell',
  Feedback: 'pencil',
  Settings: 'cog',
};


  const SettingsScreen = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      // navigation.setOptions({
      //   headerRight: () => <SettingsDropdown handleLogout={handleLogout} />,
      // });
      NetInfo.fetch().then((state: { isConnected: boolean | ((prevState: boolean) => boolean) | null; }) => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      const unsubscribe = NetInfo.addEventListener((state: { isConnected: boolean | ((prevState: boolean) => boolean) | null; }) => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      return () => {
        unsubscribe();
      };
    }, [navigation]);
  
    return (
      <>
        {isConnected ? (
          <View >
            <Settings/>
        </View>
        ) : (
          <View >
            <Icon name="wifi" size={32} color="#888" />
            <Text>No Internet Connection</Text>
          </View>
        )}
      </>
    );
  };

  const NotificationsScreen = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      // navigation.setOptions({
      //   headerRight: () => <SettingsDropdown handleLogout={handleLogout} />,
      // });
      NetInfo.fetch().then((state: { isConnected: boolean | ((prevState: boolean) => boolean) | null; }) => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      const unsubscribe = NetInfo.addEventListener((state: { isConnected: boolean | ((prevState: boolean) => boolean) | null; }) => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      return () => {
        unsubscribe();
      };
    }, [navigation]);
  
    return (
      <>
        {isConnected ? (
          
          <ScrollView>
            <Text style={styles.work}>
                Admin Dashboard
              </Text>
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          <CalendarEvent id={1} summary={"Item 1"} start={""} end={""} />
          </ScrollView>
        
        ) : (
          <View >
            <Icon name="wifi" size={32} color="#888" />
            <Text>No Internet Connection</Text>
          </View>
        )}
      </>
    );
  };
  const FeedbackScreen = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      // navigation.setOptions({
      //   headerRight: () => <SettingsDropdown handleLogout={handleLogout} />,
      // });
      NetInfo.fetch().then((state: { isConnected: boolean | ((prevState: boolean) => boolean) | null; }) => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      const unsubscribe = NetInfo.addEventListener((state: { isConnected: boolean | ((prevState: boolean) => boolean) | null; }) => {
        if (state.isConnected !== null) {
          setIsConnected(state.isConnected);
        }
      });
      return () => {
        unsubscribe();
      };
    }, [navigation]);
  
    return (
      <>
        {isConnected ? (
          <View style = {styles.container}>
          <Feedback/>
        </View>
        ) : (
          <View >
            <Icon name="wifi" size={32} color="#888" />
            <Text>No Internet Connection</Text>
          </View>
        )}
      </>
    );
  };
const Tabs =() => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = icons[route.name as keyof typeof icons];
        return <Icon name={iconName} size={24} color={color} />;
      },
      tabBarStyle: { height: 80 },
      tabBarLabelStyle: { fontSize: 12 }, // Increase font size
      headerShown: false,
      tabBarActiveTintColor: '#086c9c', // previously: tabBarOptions.activeTintColor
      tabBarInactiveTintColor: '#666666', // previously: tabBarOptions.inactiveTintColor
    })}
  
>
  <Tab.Screen name="Home" component={HomeAdminScreen} options = {{ headerShown: false}}/>
  <Tab.Screen name="Notifs" component={NotificationsScreen} options = {{ headerShown: false}} />
  <Tab.Screen name="Settings" component={SettingsScreen} options = {{ headerShown: false}} />
</Tab.Navigator>

  );
}
/* const tabBarOptions = {
  headerTitle: () => (
  <View style={{ alignItems: 'center' }}>
  <Image source={require('../assets/lisd_white_2.jpg')} style={{ width: 258, height: 68, marginBottom: 12, marginLeft: 10,}} />
  </View>
  ),
  headerStyle: {
  backgroundColor: '#005a87',
  height: 125,
  // marginBottom: 0,
  },
  }; */
const MainAdminScreen = () => {
  return (
    <Stack.Navigator
  screenOptions={{
    headerTitle: () => (
      <View style={{ alignItems: 'center', flexDirection: 'row'}}>
        <Text style={[styles.title]}>Camp CAMP</Text>
        <Image source={require('/Users/sujithalluru/campCampApp/assets/ColorCAMP.png')} style={{ width: 60, height: 60, marginBottom: 20, marginRight: -5,}} />
      </View>
    ),
    headerStyle: {
      backgroundColor: '#086c9c',
      height: 130,
    },
  }}
>
      <Stack.Screen name ="HomeScreen" component={Tabs} options={{ headerShown: true}}/>
      {/* <Stack.Screen name="NewsScreen" component={NewsScreen} options={{ headerShown: true }}/> */}
      <Stack.Screen name ="NotifSendScreen" component={NotificationFormScreen} options={{ headerShown: true}}/>

  </Stack.Navigator>

  );
};

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
  title: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '700',
    fontSize: 40,
    marginRight: 10,
    marginLeft: -20,
    marginBottom: 10,
    color: '#ffffff',
    },
});

export default MainAdminScreen;