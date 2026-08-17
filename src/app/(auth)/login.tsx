import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Validation Error', 'Please enter both username and password.');
            return;
        }

        try {
            await login(username, password);
            // Route guard in app/_layout.tsx handles redirection automatically!
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Invalid username or password');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to access your todo lists</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                </Pressable>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href="/register" style={styles.link}>
                        Sign Up
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    innerContainer: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 32 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 14, borderRadius: 8, marginBottom: 16, fontSize: 16 },
    button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: '#666' },
    link: { color: '#007AFF', fontWeight: 'bold' },
});