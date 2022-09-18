/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
messaging().setBackgroundMessageHandler(async message => {
  const channelId = await notifee.createChannel({
    id: 'important',
    name: 'importatnt',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: message.data.title,
    body: message.data.body,
    android: {
      channelId,
      smallIcon: 'ic_energy',
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'important',
      },
      timestamp: Date.now(),
      showTimestamp: true,
    },
  });
});
AppRegistry.registerComponent(appName, () => App);
