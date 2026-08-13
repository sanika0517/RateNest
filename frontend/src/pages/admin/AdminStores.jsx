import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const AdminStores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchStores = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/admin/stores", {
                params: { search, sort: sortField, order: sortOrder },
            });
            setStores(data.stores ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, sortField, sortOrder]);

    useEffect(() => {
        const timer = setTimeout(fetchStores, search ? 350 : 0);
        return () => clearTimeout(timer);
    }, [fetchStores, search]);

    const columns = [
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "address", label: "Address", sortable: true },
        {
            key: "average_rating",
            label: "Rating",
            sortable: true,
            render: (row) =>
                Number(row.average_rating) > 0
                    ? Number(row.average_rating).toFixed(1)
                    : "—",
        },
        { key: "owner_name", label: "Owner" },
    ];

    return (
        <Layout showHero heroTitle="Stores" heroSubtitle="Manage all registered stores">
            <div className="page-toolbar">
                <div className="search-wrap">
                    <input
                        type="search"
                        className="search-input"
                        placeholder="Filter by name, email, or address..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Link to="/admin/stores/new" className="btn-primary btn-sm">
                    + Add Store
                </Link>
            </div>

            {loading ? (
                <div className="page-card"><p className="loading-text">Loading stores...</p></div>
            ) : (
                <div className="page-card flush">
                    <DataTable
                        columns={columns}
                        data={stores}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={(field, order) => {
                            setSortField(field);
                            setSortOrder(order);
                        }}
                    />
                </div>
            )}
        </Layout>
    );
};

export default AdminStores;
