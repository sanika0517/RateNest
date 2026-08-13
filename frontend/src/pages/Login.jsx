import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import FormField from "../components/FormField";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
            setError("Email and password are required.");
            return;
        }

        const result = await login(form.email, form.password);
        if (result.success) {
            navigate(result.redirect);
        } else {
            setError(result.message);
        }
    };

    return (
        <Layout>
            <div className="auth-page auth-page-split">
                <aside className="auth-showcase">
                    <p className="auth-kicker">RATE WITH CONFIDENCE</p>
                    <h1>Every great choice starts with a trusted rating.</h1>
                    <p>Discover places people recommend, share your experience, and make local choices with clarity.</p>
                    <div className="auth-showcase-stat"><strong>★★★★★</strong><span>Built around genuine customer feedback</span></div>
                </aside>
                <div className="auth-card">
                    <p className="auth-kicker auth-kicker-dark">WELCOME BACK</p>
                    <h2>Sign in to RateNest</h2>
                    <p className="auth-subtitle">Enter your credentials to continue to your dashboard.</p>

                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <FormField label="Email" name="email">
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </FormField>

                        <FormField label="Password" name="password">
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                        </FormField>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in securely"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don&apos;t have an account? <Link to="/register">Sign up</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
