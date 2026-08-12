import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if the current visible route is inside the (auth) folder
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
  );
}