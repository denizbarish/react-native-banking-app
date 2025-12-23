import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme/theme';
import LoginScreen from './src/screens/LoginScreen';
import ApplicationFlow from './src/screens/ApplicationFlow';
import HomeScreen from './src/screens/HomeScreen';
import AdminPanel from './src/screens/AdminPanel';

export default function App() {
  const [showApplication, setShowApplication] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
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
