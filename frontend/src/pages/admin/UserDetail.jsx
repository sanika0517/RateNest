import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../services/api";
import { ROLE_LABELS } from "../../utils/validation";

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get(`/admin/users/${id}`);
                setUser(data.user);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load user.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    return (
        <Layout showHero heroTitle="User Details" heroSubtitle="View user information">
            <div className="page-card narrow">
                <Link to="/admin/users" className="back-link">← Back to Users</Link>

                {loading && <p className="loading-text">Loading...</p>}
                {error && <div className="alert alert-error">{error}</div>}

                {user && (
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Name</span>
                            <span className="detail-value">{user.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{user.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Address</span>
                            <span className="detail-value">{user.address}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Role</span>
                            <span className="detail-value role-badge">{ROLE_LABELS[user.role]}</span>
                        </div>

                        {user.role === "STORE_OWNER" && user.stores?.length > 0 && (
                            <div className="detail-section">
                                <h3>Store Ratings</h3>
                                {user.stores.map((store) => (
                                    <div key={store.id} className="store-rating-item">
                                        <strong>{store.name}</strong>
                                        <span>
                                            {Number(store.average_rating) > 0
                                                ? `${Number(store.average_rating).toFixed(1)} ★ (${store.total_ratings} ratings)`
                                                : "No ratings yet"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {user.role === "STORE_OWNER" && (!user.stores || user.stores.length === 0) && (
                            <div className="detail-section">
                                <p className="field-hint">This store owner has no registered stores yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UserDetail;
