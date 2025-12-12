import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme/theme';
import LoginScreen from './src/screens/LoginScreen';
import ApplicationFlow from './src/screens/ApplicationFlow';

export default function App() {
  const [showApplication, setShowApplication] = useState(false);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        {showApplication ? (
          <ApplicationFlow onComplete={() => setShowApplication(false)} />
        ) : (
          <LoginScreen onStartApplication={() => setShowApplication(true)} />
        )}
      </PaperProvider>
    </SafeAreaProvider>
  );
}
