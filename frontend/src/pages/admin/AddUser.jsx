import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import FormField from "../../components/FormField";
import api from "../../services/api";
import { validateRegistration } from "../../utils/validation";

const AddUser = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "NORMAL_USER",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const validation = validateRegistration(form);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);
        try {
            await api.post("/admin/users", form);
            navigate("/admin/users", { state: { message: "User created successfully!" } });
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to create user.");
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout showHero heroTitle="Add User" heroSubtitle="Create a new user account">
            <div className="page-card narrow">
                {message && <div className="alert alert-error">{message}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <FormField label="Full Name" name="name" error={errors.name} hint="20–60 characters">
                        <input
                            id="name"
                            className="form-input"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </FormField>

                    <FormField label="Email" name="email" error={errors.email}>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </FormField>

                    <FormField label="Address" name="address" error={errors.address} hint="Max 400 characters">
                        <textarea
                            id="address"
                            className="form-input form-textarea"
                            value={form.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            rows={3}
                        />
                    </FormField>

                    <FormField label="Password" name="password" error={errors.password} hint="8–16 chars, 1 uppercase, 1 special">
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={form.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                        />
                    </FormField>

                    <FormField label="Role" name="role">
                        <select
                            id="role"
                            className="form-input"
                            value={form.role}
                            onChange={(e) => handleChange("role", e.target.value)}
                        >
                            <option value="NORMAL_USER">Normal User</option>
                            <option value="ADMIN">System Administrator</option>
                            <option value="STORE_OWNER">Store Owner</option>
                        </select>
                    </FormField>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/admin/users")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AddUser;
