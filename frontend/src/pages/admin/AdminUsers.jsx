import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";
import { ROLE_LABELS } from "../../utils/validation";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/admin/users", {
                params: { search, role, sort: sortField, order: sortOrder },
            });
            setUsers(data.users ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, role, sortField, sortOrder]);

    useEffect(() => {
        const timer = setTimeout(fetchUsers, search ? 350 : 0);
        return () => clearTimeout(timer);
    }, [fetchUsers, search]);

    const columns = [
        {
            key: "name",
            label: "Name",
            sortable: true,
            render: (row) => (
                <Link to={`/admin/users/${row.id}`} className="table-link">
                    {row.name}
                </Link>
            ),
        },
        { key: "email", label: "Email", sortable: true },
        { key: "address", label: "Address", sortable: true },
        {
            key: "role",
            label: "Role",
            sortable: true,
            render: (row) => ROLE_LABELS[row.role] || row.role,
        },
        {
            key: "store_average_rating",
            label: "Store Rating",
            render: (row) =>
                row.role === "STORE_OWNER" && row.store_average_rating
                    ? Number(row.store_average_rating).toFixed(1)
                    : "—",
        },
    ];

    return (
        <Layout showHero heroTitle="Users" heroSubtitle="Manage all platform users">
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
                <select
                    className="filter-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">All roles</option>
                    <option value="NORMAL_USER">Normal User</option>
                    <option value="ADMIN">System Administrator</option>
                    <option value="STORE_OWNER">Store Owner</option>
                </select>
                <Link to="/admin/users/new" className="btn-primary btn-sm">
                    + Add User
                </Link>
            </div>

            {loading ? (
                <div className="page-card"><p className="loading-text">Loading users...</p></div>
            ) : (
                <div className="page-card flush">
                    <DataTable
                        columns={columns}
                        data={users}
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

export default AdminUsers;
