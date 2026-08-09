import {useState} from "react";
import {Alert, Pressable, Text, TextInput, View} from "react-native";
import {Link} from "expo-router";

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegistration = () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password!');
            return;
        }

        console.log("Registering " + username);
    }

    return (
        <View>
            <Text>Welcome to Todos!</Text>
            <Text>Create an account to start using the app!</Text>

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

            <Pressable onPress={handleRegistration}>
                <Text>Register</Text>
            </Pressable>

            <View>
                <Text>Already have an account?</Text>
                <Link href="/login">
                    Log In
                </Link>
            </View>
        </View>
    )
}