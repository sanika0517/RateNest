const {
    registerUser,
    loginUser,
    updatePassword
} = require("../services/authService");

const {
    validateRegistration,
    validatePassword
} = require("../validators/authValidator");

// ============================================
// REGISTER
// ============================================

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            password,
            role = "NORMAL_USER"
        } = req.body;

        // Validate registration data
        const validation = validateRegistration({
            name,
            email,
            address,
            password
        });

        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: validation.errors
            });
        }

        const allowedRoles = ["NORMAL_USER", "STORE_OWNER"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Public registration is available for users and store owners only." });
        }

        const user = await registerUser({
            name,
            email,
            address,
            password,
            role
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            user
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Registration failed."
        });
    }
};


// ============================================
// LOGIN
// ============================================

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const result = await loginUser({
            email,
            password
        });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            ...result
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Login failed."
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }

        const validation = validatePassword(newPassword);

        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: validation.errors
            });
        }

        await updatePassword({
            userId: req.user.userId,
            currentPassword,
            newPassword
        });

        return res.json({
            success: true,
            message: "Password updated successfully."
        });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update password."
        });
    }
};

module.exports = {
    register,
    login,
    changePassword
};
