import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getHomeRoute, ROLE_LABELS } from "../utils/validation";

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = () => {
        if (!user) return null;

        switch (user.role) {
            case "ADMIN":
                return (
                    <>
                        <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/admin/users" className="nav-link">Users</Link>
                        <Link to="/admin/stores" className="nav-link">Stores</Link>
                        <Link to="/admin/store-requests" className="nav-link">Requests</Link>
                    </>
                );
            case "STORE_OWNER":
                return (
                    <>
                        <Link to="/owner/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/stores" className="nav-link">Stores</Link>
                        <Link to="/change-password" className="nav-link">Password</Link>
                    </>
                );
            default:
                return (
                    <>
                        <Link to="/user/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/stores" className="nav-link">Stores</Link>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <Link to="/change-password" className="nav-link">Password</Link>
                    </>
                );
        }
    };

    return (
        <header className="site-header">
            <div className="header-inner">
                <Link to={isAuthenticated ? getHomeRoute(user.role) : "/login"} className="logo">
                    <span className="logo-icon">★</span>
                    <span className="logo-text">
                        Rate<span className="logo-accent">Nest</span>
                    </span>
                </Link>

                <nav className="header-nav">
                    {isAuthenticated ? (
                        <>
                            {navLinks()}
                            <div className="user-menu">
                                <span className="user-badge">
                                    {user.name.split(" ")[0]}
                                    <small>{ROLE_LABELS[user.role]}</small>
                                </span>
                                <button type="button" className="btn-logout" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link nav-link-cta">Sign Up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
