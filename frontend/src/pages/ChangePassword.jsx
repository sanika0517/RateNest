import { useState } from "react";
import Layout from "../components/Layout";
import FormField from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { validatePassword } from "../utils/validation";

const ChangePassword = () => {
    const { updatePassword } = useAuth();
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setSuccess(false);
        const fieldErrors = {};

        if (!form.currentPassword) {
            fieldErrors.currentPassword = "Current password is required.";
        }

        const pwValidation = validatePassword(form.newPassword);
        if (!pwValidation.isValid) {
            fieldErrors.newPassword = pwValidation.errors.password;
        }

        if (form.newPassword !== form.confirmPassword) {
            fieldErrors.confirmPassword = "Passwords do not match.";
        }

        if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        const result = await updatePassword(form.currentPassword, form.newPassword);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            setMessage(result.message);
            if (result.errors?.password) {
                setErrors({ newPassword: result.errors.password });
            }
        }
    };

    return (
        <Layout
            showHero
            heroTitle="Update Password"
            heroSubtitle="Change your account password securely"
        >
            <div className="page-card narrow">
                {success && (
                    <div className="alert alert-success">
                        Password updated successfully!
                    </div>
                )}
                {message && <div className="alert alert-error">{message}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <FormField label="Current Password" name="currentPassword" error={errors.currentPassword}>
                        <input
                            id="currentPassword"
                            type="password"
                            className="form-input"
                            value={form.currentPassword}
                            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                        />
                    </FormField>

                    <FormField label="New Password" name="newPassword" error={errors.newPassword} hint="8–16 chars, 1 uppercase, 1 special">
                        <input
                            id="newPassword"
                            type="password"
                            className="form-input"
                            value={form.newPassword}
                            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                        />
                    </FormField>

                    <FormField label="Confirm New Password" name="confirmPassword" error={errors.confirmPassword}>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-input"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        />
                    </FormField>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ChangePassword;
