import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormField from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { validateRegistration } from "../utils/validation";

const Register = () => {
    const { register, loading } = useAuth();
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

        const result = await register(form);
        if (result.success) {
            navigate("/login", { state: { message: "Registration successful! Please sign in." } });
        } else {
            setMessage(result.message);
            if (result.errors) setErrors(result.errors);
        }
    };

    return (
        <Layout>
            <div className="auth-page auth-page-split">
                <aside className="auth-showcase">
                    <p className="auth-kicker">JOIN THE COMMUNITY</p>
                    <h1>Find places worth coming back to.</h1>
                    <p>Create your RateNest account to discover local stores and help others choose better.</p>
                    <div className="auth-showcase-stat"><strong>1–5</strong><span>Simple, meaningful ratings for every store</span></div>
                </aside>
                <div className="auth-card auth-card-wide">
                    <p className="auth-kicker auth-kicker-dark">GET STARTED</p>
                    <h2>Create your account</h2>
                    <p className="auth-subtitle">Choose your account type and create your RateNest account.</p>

                    {message && <div className="alert alert-error">{message}</div>}

                    <div className="login-role-picker" role="group" aria-label="Choose account type">
                        {[
                            { role: "NORMAL_USER", label: "User", description: "Discover and rate stores" },
                            { role: "STORE_OWNER", label: "Store Owner", description: "Track store feedback" },
                        ].map((option) => (
                            <button
                                key={option.role}
                                type="button"
                                className={`login-role-option ${form.role === option.role ? "selected" : ""}`}
                                onClick={() => handleChange("role", option.role)}
                            >
                                <strong>{option.label}</strong>
                                <span>{option.description}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <FormField label="Full Name" name="name" error={errors.name} hint="20–60 characters">
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Your full name"
                            />
                        </FormField>

                        <FormField label="Email" name="email" error={errors.email}>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="you@example.com"
                            />
                        </FormField>

                        <FormField label="Address" name="address" error={errors.address} hint="Max 400 characters">
                            <textarea
                                id="address"
                                className="form-input form-textarea"
                                value={form.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                placeholder="Your address"
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
                                placeholder="Create a password"
                            />
                        </FormField>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
