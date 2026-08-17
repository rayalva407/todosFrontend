// app/(app)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { Button, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
    const { user, logout } = useAuth();

    return (
        <Stack
            screenOptions={{
                headerRight: () => (
                    <View style={styles.headerContainer}>
                        {user && <Text style={styles.userText}>{user}</Text>}
                        <Button title="Logout" onPress={logout} color="#d9534f" />
                    </View>
                ),
            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: 'My Todo Lists' }}
            />
            <Stack.Screen
                name="list/[id]"
                options={{ title: 'Todo Items' }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginRight: 8,
    },
    userText: {
        fontWeight: '600',
    },
});