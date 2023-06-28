import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from '@react-native-community/netinfo';
import CalendarEvent from './ToDo';
// import { ScrollView } from 'react-native-gesture-handler';
import Settings from './Settings';
import Feedback from './Feedback';
import HomeScreen from './HomeScreen';
import NotificationsScreen from './NotificationScreen';
import { Dimensions } from 'react-native';

const Tab = createBottomTabNavigator();

const icons = {
  ToDo: 'list',
  Home: 'home',
  Notifs: 'bell',
  Feedback: 'pencil',
  Settings: 'cog',
};

type Props = {
  isAdmin: boolean;
  isVolunteer: boolean;
}

  const SettingsScreen = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);

  
    useEffect(() => {
      // navigation.setOptions({
      //   headerRight: () => <SettingsDropdown handleLogout={handleLogout} />,
      // });
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
  
    return (
      <>
        {isConnected ? (
          <View >
            <Settings navigation={navigation}/>
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


  const FeedbackScreen = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      // navigation.setOptions({
      //   headerRight: () => <SettingsDropdown handleLogout={handleLogout} />,
      // });
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

const MainScreen = ({isAdmin, isVolunteer}: Props) => {  
  const screenHeight = Dimensions.get('window').height;
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName = icons[route.name as keyof typeof icons];
      return <Icon name={iconName} size={24} color={color} />;
    },
    tabBarStyle: { height: screenHeight*0.1},
    tabBarLabelStyle: { fontSize: 12 }, // Increase font size
    headerShown: false,
    tabBarActiveTintColor: '#003479', // previously: tabBarOptions.activeTintColor
    tabBarInactiveTintColor: '#666666', // previously: tabBarOptions.inactiveTintColor
  })}
>
<Tab.Screen name="Home">
        {props => <HomeScreen {...props} isAdmin={isAdmin} isVolunteer={isVolunteer} />}
  </Tab.Screen> 
  <Tab.Screen name="Notifs">
        {props => <NotificationsScreen {...props} isNotGeneral={isAdmin||isVolunteer} />}
  </Tab.Screen>   
  <Tab.Screen name="Settings" component={SettingsScreen} />
</Tab.Navigator>

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
});

export default MainScreen;