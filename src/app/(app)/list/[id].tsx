import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    Alert, Pressable,
} from 'react-native';
import {useLocalSearchParams, Stack, useRouter} from 'expo-router';
import { apiFetch } from '../../api/client';
import {HeaderBackButton} from "expo-router/build/react-navigation";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export default function TodoListDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (id) fetchTodos();
    }, [id]);

    const fetchTodos = async () => {
        try {
            // Calls GET /todo-lists/{id}/todos
            const data = await apiFetch<Todo[]>(`/todo-lists/${id}/todos`);
            setTodos(data);
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not load todos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTodo = async () => {
        if (!newItemTitle.trim()) return;

        setIsAdding(true);
        try {
            const newTodo = await apiFetch<Todo>(`/todo-lists/${id}/todos`, {
                method: 'POST',
                body: JSON.stringify({ title: newItemTitle.trim(), completed: false }),
            });

            setTodos((prev) => [...prev, newTodo]);
            setNewItemTitle('');
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not create todo');
        } finally {
            setIsAdding(false);
        }
    };

    const toggleTodo = async (todo: Todo) => {
        const updatedStatus = !todo.completed;

        setTodos((prev) =>
            prev.map((t) => (t.id === todo.id ? { ...t, completed: updatedStatus } : t))
        );

        try {
            await apiFetch(`/todos/${todo.id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ completed: updatedStatus }),
            });
        } catch {
            fetchTodos();
            Alert.alert('Error', 'Failed to update todo');
        }
    };

    if (loading) return <ActivityIndicator style={styles.center} size="large" />;

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Todos',
                    headerLeft: (props) => (
                        <HeaderBackButton
                            {...props}
                            onPress={() => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace('/(app)')
                                }
                            }}
                        />
                    )
                }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a new task..."
                    value={newItemTitle}
                    onChangeText={setNewItemTitle}
                />
                <Pressable
                    style={[styles.addButton, isAdding && styles.disabledButton]}
                    onPress={handleCreateTodo}
                    disabled={isAdding || !newItemTitle.trim()}
                >
                    <Text style={styles.addText}>{isAdding ? '...' : '+'}</Text>
                </Pressable>
            </View>

            {/* Todo items list */}
            <FlatList
                data={todos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable style={styles.todoItem} onPress={() => toggleTodo(item)}>
                        <View style={[styles.checkbox, item.completed && styles.checked]} />
                        <Text style={item.completed ? styles.completedText : styles.todoText}>
                            {item.title}
                        </Text>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tasks found. Add one above!</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
    center: { flex: 1, justifyContent: 'center' },
    inputContainer: { flexDirection: 'row', marginBottom: 20 },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 18,
        borderRadius: 8,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: { backgroundColor: '#aaa' },
    addText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#007AFF',
        marginRight: 12,
    },
    checked: { backgroundColor: '#007AFF' },
    todoText: { fontSize: 16, color: '#333' },
    completedText: { fontSize: 16, textDecorationLine: 'line-through', color: '#aaa' },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 24 },
});