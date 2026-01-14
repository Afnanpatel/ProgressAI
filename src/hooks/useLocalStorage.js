import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

function useLocalStorage(key, initialValue) {
    const { user } = useAuth();
    // Create a user-specific key if a user is logged in
    const userKey = user ? `${key}_${user.id}` : key;

    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(userKey);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    // Update storedValue when user/userKey changes (e.g., login/logout)
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(userKey);
            // If we have data for this user, use it; otherwise use initialValue
            setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
            console.error('Error syncing localStorage on user change:', error);
            setStoredValue(initialValue);
        }
    }, [userKey, initialValue]);

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(userKey, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
