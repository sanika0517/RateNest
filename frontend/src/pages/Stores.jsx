import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import StoreCard from "../components/StoreCard";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("name");
    const [minRating, setMinRating] = useState("");
    const { user } = useAuth();

    const fetchStores = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const params = { sort };
            if (search.trim()) params.search = search.trim();
            if (minRating) params.minRating = minRating;

            const { data } = await api.get("/stores", { params });
            setStores(data.stores ?? []);
        } catch (err) {
            console.error(err);
            setError("Unable to load stores. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    }, [search, sort, minRating]);

    useEffect(() => {
        const timer = setTimeout(fetchStores, search ? 350 : 0);
        return () => clearTimeout(timer);
    }, [fetchStores, search]);

    const handleSubmitRating = async (storeId, rating) => {
        await api.post("/ratings", { storeId, rating });
        await fetchStores();
    };

    const handleUpdateRating = async (storeId, rating) => {
        await api.put(`/ratings/${storeId}`, { rating });
        await fetchStores();
    };

    return (
        <Layout
            showHero
            heroTitle="Discover Stores"
            heroSubtitle="Browse stores, check ratings, and share your experience"
        >
            <div className="filters-bar">
                <div className="search-wrap">
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input
                        type="search"
                        className="search-input"
                        placeholder="Search by store name or address..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search stores"
                    />
                </div>

                <select
                    className="filter-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort stores"
                >
                    <option value="name">Name (A–Z)</option>
                    <option value="rating">Top rated</option>
                    <option value="rating_asc">Lowest rated</option>
                </select>
                <select className="filter-select" value={minRating} onChange={(e) => setMinRating(e.target.value)} aria-label="Minimum rating">
                    <option value="">Any rating</option>
                    <option value="4">4 stars & up</option>
                    <option value="3">3 stars & up</option>
                    <option value="2">2 stars & up</option>
                    <option value="1">1 star & up</option>
                </select>
            </div>

            {loading && (
                <div className="store-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="skeleton-card" aria-hidden="true">
                            <div className="skeleton skeleton-avatar" />
                            <div className="skeleton skeleton-line w-70" />
                            <div className="skeleton skeleton-line w-50" />
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="state-message state-error" role="alert">
                    <span className="state-icon">⚠</span>
                    <div>
                        <p className="state-title">Something went wrong</p>
                        <p className="state-desc">{error}</p>
                    </div>
                    <button type="button" className="btn-retry" onClick={fetchStores}>Try again</button>
                </div>
            )}

            {!loading && !error && stores.length === 0 && (
                <div className="state-message state-empty">
                    <span className="state-icon">🏪</span>
                    <div>
                        <p className="state-title">No stores found</p>
                        <p className="state-desc">Try adjusting your search.</p>
                    </div>
                </div>
            )}

            {!loading && !error && stores.length > 0 && (
                <div className="store-grid">
                    {stores.map((store) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            onSubmitRating={handleSubmitRating}
                            onUpdateRating={handleUpdateRating}
                            canRate={user.role === "NORMAL_USER"}
                        />
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Stores;
