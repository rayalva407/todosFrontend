// app/_layout.tsx
import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(app)';

    if (!user && inAuthGroup) {
      router.replace('/login');
    } else if (user && !inAuthGroup) {
      router.replace('/(app)');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
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

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});