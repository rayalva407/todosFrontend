// app/(app)/index.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    TextInput,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../api/client';

interface TodoList {
    id: number;
    title: string;
}

export default function TodoListsScreen() {
    const [lists, setLists] = useState<TodoList[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchTodoLists();
    }, []);

    const fetchTodoLists = async () => {
        try {
            const data = await apiFetch<TodoList[]>('/todo-lists');
            setLists(data);
        } catch (error: any) {
            console.error('Failed to load todo lists:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateList = async () => {
        if (!newTitle.trim()) {
            Alert.alert('Error', 'Please enter a list title');
            return;
        }

        setIsCreating(true);
        try {
            const newList = await apiFetch<TodoList>('/todo-lists', {
                method: 'POST',
                body: JSON.stringify({ title: newTitle.trim() }),
            });

            setLists((prev) => [newList, ...prev]);
            setNewTitle('');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not create todo list');
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.createContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="New list title..."
                    value={newTitle}
                    onChangeText={setNewTitle}
                />
                <Button
                    title={isCreating ? 'Adding...' : 'Add List'}
                    onPress={handleCreateList}
                    disabled={isCreating || !newTitle.trim()}
                />
            </View>

            <View style={styles.gridContainer}>
                {lists.map((item) => (
                    <Pressable
                        key={item.id}
                        style={styles.squareCard}
                        onPress={() => router.push(`/(app)/list/${item.id}`)}
                    >
                        <Text style={styles.title} numberOfLines={3}>
                            {item.title}
                        </Text>
                    </Pressable>
                ))}

                {lists.length === 0 && (
                    <Text style={styles.emptyText}>
                        No todo lists found. Create your first one above!
                    </Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    squareCard: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
    },
    emptyText: {
        width: '100%',
        textAlign: 'center',
        marginTop: 24,
        color: '#666',
    },
});