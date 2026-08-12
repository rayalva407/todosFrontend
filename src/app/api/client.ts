import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        let errorMessage: string;

        try {
            const errorText = await response.text();
            errorMessage = errorText || response.statusText;
        } catch {
            errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}