import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../store/AppContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="trail/[id]"
            options={{
              headerShown: true,
              headerBackTitle: 'Back',
              headerTitle: '',
              headerStyle: { backgroundColor: '#FAFAF8' },
              headerShadowVisible: false,
              headerTintColor: '#F5A623',
            }}
          />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
