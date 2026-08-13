import { useEffect, useState } from "react";
import api from "../services/api";
import StoreCard from "../components/StoreCard";

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/stores");

            setStores(response.data.stores);
        } catch (error) {
            console.error(error);
            setError("Unable to load stores.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleRate = (store) => {
        alert(`You selected ${store.name}`);
    };

    return (
        <div>
            <h1>Discover Stores</h1>

            {loading && <p>Loading stores...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && stores.length === 0 && (
                <p>No stores found.</p>
            )}

            {!loading && !error && stores.length > 0 && (
                <div>
                    {stores.map((store) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            onRate={handleRate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Stores;