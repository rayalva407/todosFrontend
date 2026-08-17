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

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('Validation Error', 'Username and password are required.');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Validation Error', 'Password must be at least 8 characters long.');
            return;
        }

        try {
            await register(username, password);
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message || 'Could not create account');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password (min 8 characters)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Link href="/login" style={styles.link}>
                        Log In
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
    button: { backgroundColor: '#34C759', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: '#666' },
    link: { color: '#007AFF', fontWeight: 'bold' },
});