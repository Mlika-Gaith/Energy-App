import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Tabs from './navigation/tabs';
import AddNew from './screens/AddNew';
import Details from './screens/Details';
import Measure from './screens/Measure';
import Report from './screens/Report';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './stores/rootReducer';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import notifee, {AndroidImportance} from '@notifee/react-native';
import SplashScreen from 'react-native-splash-screen';
const Stack = createStackNavigator();
const store = createStore(rootReducer, applyMiddleware(thunk));

async function onDisplayNotification(title, text) {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'important',
    name: 'important',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: text,
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
}

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}
async function onAppStart() {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  try {
    let result = await axios.post('http://192.168.1.13:8082/tokens/token', {
      token,
    });
  } catch (error) {
    console.log(error);
  }
}
async function onMessageReceived(message) {
  console.log(`Hello ${message.data.title}`);
  onDisplayNotification(message.data.title, message.data.body);
}
const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);
  messaging().onMessage(onMessageReceived);
  onAppStart();
  requestUserPermission();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'MainLayout'}>
          <Stack.Screen name="MainLayout" component={Tabs} />
          <Stack.Screen name="AddNew" component={AddNew} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="Measure" component={Measure} />
          <Stack.Screen name="Report" component={Report} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
