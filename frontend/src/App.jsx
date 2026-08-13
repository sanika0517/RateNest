import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import { getHomeRoute } from "./utils/validation";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Stores from "./pages/Stores";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import AddUser from "./pages/admin/AddUser";
import AddStore from "./pages/admin/AddStore";
import UserDetail from "./pages/admin/UserDetail";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import UserDashboard from "./pages/user/UserDashboard";
import StoreRequests from "./pages/admin/StoreRequests";

const HomeRedirect = () => {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Landing />;
    return <Navigate to={getHomeRoute(user.role)} replace />;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomeRedirect />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/stores"
                        element={
                            <ProtectedRoute allowedRoles={["NORMAL_USER", "ADMIN", "STORE_OWNER"]}>
                                <Stores />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/user/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["NORMAL_USER"]}>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute allowedRoles={["NORMAL_USER"]}>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/change-password"
                        element={
                            <ProtectedRoute allowedRoles={["NORMAL_USER", "STORE_OWNER"]}>
                                <ChangePassword />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AdminUsers />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users/new"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AddUser />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users/:id"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <UserDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/stores"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AdminStores />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/stores/new"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AddStore />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/store-requests"
                        element={<ProtectedRoute allowedRoles={["ADMIN"]}><StoreRequests /></ProtectedRoute>}
                    />

                    <Route
                        path="/owner/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
                                <OwnerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
