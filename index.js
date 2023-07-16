/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', JSON.stringify(remoteMessage));
    const channelId = await notifee.createChannel({
        id: 'highPriorityChannel',
        name: 'High Priority',
        importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
        title: remoteMessage.data.title,  
        body: remoteMessage.data.body,    
        android: {
            channelId,
            importance: AndroidImportance.HIGH
        },
    });
});

AppRegistry.registerComponent(appName, () => App);
