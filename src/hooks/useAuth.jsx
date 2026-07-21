import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => api.getCurrentUser());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Keep user state in sync with localStorage
    useEffect(() => {
        const stored = api.getCurrentUser();
        if (stored) setUser(stored);
    }, []);

    async function login(email, password, role) {
        setLoading(true);
        setError(null);
        try {
            const data = await api.login(email, password, role);
            setUser({ fullName: data.fullName, email: data.email, role: data.role, userId: data.userId });
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function register(fullName, email, password, role) {
        setLoading(true);
        setError(null);
        try {
            const data = await api.register(fullName, email, password, role);
            setUser({ fullName: data.fullName, email: data.email, role: data.role, userId: data.userId });
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        api.logout();
        setUser(null);
    }

    function clearError() {
        setError(null);
    }

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
