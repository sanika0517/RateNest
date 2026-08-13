import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const UserDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data: response } = await api.get("/user/dashboard");
                setData(response);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load your dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const columns = [
        { key: "store_name", label: "Store" },
        { key: "store_address", label: "Address" },
        { key: "rating", label: "Your Rating", render: (row) => `${row.rating} / 5` },
    ];

    return (
        <Layout showHero heroTitle="Your Dashboard" heroSubtitle="Keep track of the stores you have rated">
            {loading && <div className="page-card"><p className="loading-text">Loading your dashboard...</p></div>}

            {error && <div className="state-message state-error"><div><p className="state-title">Unable to load dashboard</p><p className="state-desc">{error}</p></div></div>}

            {!loading && !error && (
                <>
                    <div className="stats-grid stats-grid-2">
                        <div className="stat-card stat-card-highlight">
                            <span className="stat-icon">★</span>
                            <div><p className="stat-value">{data.averageRating || "—"}</p><p className="stat-label">Average Rating Given</p></div>
                        </div>
                        <div className="stat-card">
                            <span className="stat-icon">✓</span>
                            <div><p className="stat-value">{data.totalRatings}</p><p className="stat-label">Stores Rated</p></div>
                        </div>
                    </div>

                    <div className="page-card flush dashboard-table">
                        <div className="dashboard-table-header">
                            <h2 className="section-title">Your Recent Ratings</h2>
                            <Link to="/stores" className="btn-primary btn-sm">Discover Stores</Link>
                        </div>
                        <DataTable columns={columns} data={data.recentRatings} emptyMessage="You have not rated a store yet. Start exploring to share your experience." />
                    </div>
                </>
            )}
        </Layout>
    );
};

export default UserDashboard;
