import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../services/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get("/admin/dashboard");
                setStats(data.stats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <Layout
            showHero
            heroTitle="Admin Dashboard"
            heroSubtitle="Overview of platform activity"
        >
            {loading ? (
                <div className="stats-grid">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="stat-card skeleton-card">
                            <div className="skeleton skeleton-line w-50" />
                            <div className="skeleton skeleton-line w-30" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">👥</span>
                        <div>
                            <p className="stat-value">{stats?.totalUsers ?? 0}</p>
                            <p className="stat-label">Total Users</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🏪</span>
                        <div>
                            <p className="stat-value">{stats?.totalStores ?? 0}</p>
                            <p className="stat-label">Total Stores</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">⭐</span>
                        <div>
                            <p className="stat-value">{stats?.totalRatings ?? 0}</p>
                            <p className="stat-label">Total Ratings</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="quick-actions">
                <Link to="/admin/users/new" className="action-card">
                    <span>➕</span>
                    <div>
                        <strong>Add User</strong>
                        <p>Create normal users, admins, or store owners</p>
                    </div>
                </Link>
                <Link to="/admin/stores/new" className="action-card">
                    <span>🏪</span>
                    <div>
                        <strong>Add Store</strong>
                        <p>Register a new store on the platform</p>
                    </div>
                </Link>
                <Link to="/admin/users" className="action-card">
                    <span>📋</span>
                    <div>
                        <strong>Manage Users</strong>
                        <p>View and filter all users</p>
                    </div>
                </Link>
                <Link to="/admin/stores" className="action-card">
                    <span>📊</span>
                    <div>
                        <strong>Manage Stores</strong>
                        <p>View and filter all stores</p>
                    </div>
                </Link>
                <Link to="/admin/store-requests" className="action-card">
                    <span>✓</span>
                    <div>
                        <strong>Store Requests</strong>
                        <p>Review and approve owner store requests</p>
                    </div>
                </Link>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
