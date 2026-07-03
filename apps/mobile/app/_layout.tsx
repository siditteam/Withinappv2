import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { ensureSession } from '@/data/auth';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [sessionReady, setSessionReady] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    ensureSession().finally(() => setSessionReady(true));
  }, []);

  useEffect(() => {
    if (loaded && sessionReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, sessionReady]);

  if (!loaded || !sessionReady) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="practice/index" options={{ title: 'Guided Practices' }} />
        <Stack.Screen name="practice/[id]/index" options={{ title: 'Practice' }} />
        <Stack.Screen name="practice/[id]/session" options={{ title: '' }} />
        <Stack.Screen name="practice/[id]/complete" options={{ title: '', headerShown: false }} />
        <Stack.Screen name="silence/index" options={{ title: 'Silence' }} />
        <Stack.Screen name="silence/session" options={{ title: '' }} />
        <Stack.Screen name="inquiry/index" options={{ title: 'Inquiry' }} />
        <Stack.Screen name="library/index" options={{ title: 'Library' }} />
        <Stack.Screen name="rooms/[id]" options={{ title: 'Common Space' }} />
        <Stack.Screen name="learn/[seriesId]/index" options={{ title: 'Learn' }} />
        <Stack.Screen name="learn/[seriesId]/[episodeId]" options={{ title: '' }} />
        <Stack.Screen name="talks/[id]" options={{ title: 'Audio Talk' }} />
        <Stack.Screen name="feeling-checkin" options={{ presentation: 'modal', title: 'Feeling Check-in' }} />
      </Stack>
    </ThemeProvider>
  );
}
