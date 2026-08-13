import { createContext, useState } from "react";
import api from "../services/api";
import { getHomeRoute } from "../utils/validation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!token) return null;
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, user: data.user, redirect: getHomeRoute(data.user.role) };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Login failed.",
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        setLoading(true);
        try {
            const { data } = await api.post("/auth/register", formData);
            return { success: true, user: data.user };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Registration failed.",
                errors: err.response?.data?.errors || {},
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const updatePassword = async (currentPassword, newPassword) => {
        try {
            await api.put("/auth/password", { currentPassword, newPassword });
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Failed to update password.",
                errors: err.response?.data?.errors || {},
            };
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, updatePassword, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
