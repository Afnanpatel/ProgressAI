import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('auth_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading] = useState(false);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const foundUser = users.find(u => u.email === email);

        if (!foundUser) {
            throw new Error('User not found. Please sign up first.');
        }

        // Mock password check - in real app, we would hash and compare
        if (foundUser.password !== password) {
            throw new Error('Invalid password.');
        }

        const mockUser = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
        setUser(mockUser);
        sessionStorage.setItem('auth_user', JSON.stringify(mockUser));
        return true;
    };

    const signup = (name, email, password) => {
        const users = JSON.parse(localStorage.getItem('registered_users') || '[]');

        if (users.some(u => u.email === email)) {
            throw new Error('Email already registered. Please sign in.');
        }

        const newUser = { id: email, name, email, password };
        const updatedUsers = [...users, newUser];

        localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

        const mockUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        setUser(mockUser);
        sessionStorage.setItem('auth_user', JSON.stringify(mockUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('auth_user');
    };

    const updateUser = (updates) => {
        const newUser = { ...user, ...updates };
        setUser(newUser);
        sessionStorage.setItem('auth_user', JSON.stringify(newUser));

        // Also update in registered_users for persistence across logins
        const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const updatedUsers = users.map(u => u.email === user.email ? { ...u, ...updates } : u);
        localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
