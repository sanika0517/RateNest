import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getHomeRoute } from "../utils/validation";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={getHomeRoute(user.role)} replace />;
    }

    return children;
};

export default ProtectedRoute;
