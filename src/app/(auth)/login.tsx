import {useState} from "react";
import {Alert, Pressable, Text, TextInput, View} from "react-native";
import {Link} from "expo-router";

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password!');
            return;
        }

        console.log("Logging in as " + username);
    }

    return (
        <View>
            <Text>Welcome to Todos!</Text>
            <Text>Sign in to access you todos</Text>

            <TextInput
                placeholder={"Username"}
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                placeholder={"Password"}
                value={password}
                onChangeText={setPassword}
            />

            <Pressable onPress={handleLogin}>
                <Text>Log In</Text>
            </Pressable>

            <View>
                <Text>Don't have an account?</Text>
                <Link href="/register">
                    Sign Up
                </Link>
            </View>
        </View>
    )
}