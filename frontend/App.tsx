import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// AI Pathshala Theme (Slate 950 base, Orange accents)
export const AIPathshalaTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#f97316', // Orange 500
    background: '#020617', // Slate 950
    card: '#0f172a', // Slate 900
    text: '#f8fafc', // Slate 50
    border: '#1e293b', // Slate 800
    notification: '#ea580c', // Orange 600
  },
};

import DashboardScreen from './src/screens/Dashboard';
import MagicCameraScreen from './src/screens/MagicCamera';
import SmartKunjiScreen from './src/screens/SmartKunji';
import MasteryMapScreen from './src/screens/MasteryMap';
import TapasyaModeScreen from './src/screens/TapasyaMode';

// Placeholder Screens
// DashboardScreen moved to src/screens/Dashboard.tsx
// MagicCameraScreen moved to src/screens/MagicCamera.tsx

// SmartKunjiScreen moved to src/screens/SmartKunji.tsx
// MasteryMapScreen moved to src/screens/MasteryMap.tsx
// TapasyaModeScreen moved to src/screens/TapasyaMode.tsx

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={AIPathshalaTheme}>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: { backgroundColor: AIPathshalaTheme.colors.card },
          headerTintColor: AIPathshalaTheme.colors.text,
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'AI Pathshala' }} />
        <Stack.Screen name="MagicCamera" component={MagicCameraScreen} options={{ title: 'Magic Camera' }} />
        <Stack.Screen name="SmartKunji" component={SmartKunjiScreen} options={{ title: 'Smart Kunji' }} />
        <Stack.Screen name="MasteryMap" component={MasteryMapScreen} options={{ title: 'Mastery Map' }} />
        <Stack.Screen name="TapasyaMode" component={TapasyaModeScreen} options={{ title: 'Tapasya Mode' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617', // Slate 950
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#94a3b8', // Slate 400
  }
});
