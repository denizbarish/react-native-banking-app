import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { theme } from './src/theme/theme';
import LoginScreen from './src/screens/LoginScreen';
import ApplicationFlow from './src/screens/ApplicationFlow';
import HomeScreen from './src/screens/HomeScreen';
import AdminPanel from './src/screens/AdminPanel';
import { authService } from './src/services/authService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas?.projectId })).data;
    console.log("Expo Push Token:", token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export default function App() {
  const [showApplication, setShowApplication] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
     // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification Received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🔔 Notification Clicked:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleLoginSuccess = async (userData) => {
    setUser(userData);
    setIsLoggedIn(true);

    // Register for push notifications
    try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
            await authService.updateProfile(userData.tcNo || userData.tc_kimlik, { expo_push_token: token });
        }
    } catch(e) {
        console.warn('Token registration failed:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        {isLoggedIn ? (
          <HomeScreen user={user} onLogout={handleLogout} />
        ) : showAdmin ? (
          <AdminPanel onLogout={() => setShowAdmin(false)} />
        ) : showApplication ? (
          <ApplicationFlow onComplete={() => setShowApplication(false)} />
        ) : (
          <LoginScreen 
            onStartApplication={() => setShowApplication(true)}
            onLoginSuccess={handleLoginSuccess}
            onAdminLogin={() => setShowAdmin(true)}
          />
        )}
      </PaperProvider>
    </SafeAreaProvider>
  );
}
