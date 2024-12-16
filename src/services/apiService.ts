import { retryWithBackoff } from './retryWithBackoff';
const BASE_URL = 'https://dummyjson.com';

export const apiService = {
    get: async (endpoint: string) => {
        return retryWithBackoff(async () => {
            const response = await fetch(`${BASE_URL}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
            }
            return response.json();
        });
    },

    post: async (endpoint: string, body: any) => {
        return retryWithBackoff(async () => {
            const response = await fetch(`${BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
            }
            return response.json();
        });
    },
    put: async (endpoint: string, body: any) => {
        return retryWithBackoff(async () => {
            const response = await fetch(`${BASE_URL}/${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
            }
            return response.json();
        });
    },
    delete: async (endpoint: string) => {
        return retryWithBackoff(async () => {
            const response = await fetch(`${BASE_URL}/${endpoint}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
            }
            return response.json();
        });
    }

};
