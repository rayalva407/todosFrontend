import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome, {user}!</Text>
            <Text style={styles.subtitle}>You are securely logged in.</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    welcome: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
    logoutButton: { backgroundColor: '#FF3B30', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
    logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});