import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import FormField from "../../components/FormField";
import api from "../../services/api";

const AddStore = () => {
    const navigate = useNavigate();
    const [owners, setOwners] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const { data } = await api.get("/admin/users", {
                    params: { role: "STORE_OWNER" },
                });
                setOwners(data.users ?? []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOwners();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        const fieldErrors = {};

        if (!form.name.trim()) fieldErrors.name = "Store name is required.";
        if (!form.email.trim()) fieldErrors.email = "Email is required.";
        if (!form.address.trim()) fieldErrors.address = "Address is required.";
        if (!form.ownerId) fieldErrors.ownerId = "Please select a store owner.";

        if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);
        try {
            await api.post("/admin/stores", {
                name: form.name,
                email: form.email,
                address: form.address,
                ownerId: Number(form.ownerId),
            });
            navigate("/admin/stores", { state: { message: "Store created successfully!" } });
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to create store.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout showHero heroTitle="Add Store" heroSubtitle="Register a new store">
            <div className="page-card narrow">
                {message && <div className="alert alert-error">{message}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <FormField label="Store Name" name="name" error={errors.name}>
                        <input
                            id="name"
                            className="form-input"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </FormField>

                    <FormField label="Email" name="email" error={errors.email}>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </FormField>

                    <FormField label="Address" name="address" error={errors.address}>
                        <textarea
                            id="address"
                            className="form-input form-textarea"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            rows={3}
                        />
                    </FormField>

                    <FormField label="Store Owner" name="ownerId" error={errors.ownerId}>
                        <select
                            id="ownerId"
                            className="form-input"
                            value={form.ownerId}
                            onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                        >
                            <option value="">Select a store owner</option>
                            {owners.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name} ({owner.email})
                                </option>
                            ))}
                        </select>
                    </FormField>

                    {owners.length === 0 && (
                        <p className="field-hint">
                            No store owners found. Create a user with Store Owner role first.
                        </p>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/admin/stores")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Creating..." : "Create Store"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AddStore;
