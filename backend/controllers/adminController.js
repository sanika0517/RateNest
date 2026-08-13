const {
    getDashboardStats,
    getUsers,
    getUserById,
    createUser,
    getAdminStores
} = require("../services/adminService");

const {
    validateRegistration
} = require("../validators/authValidator");

const dashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        return res.json({ success: true, stats });
    } catch (error) {
        console.error("Admin dashboard error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats."
        });
    }
};

const listUsers = async (req, res) => {
    try {
        const {
            search = "",
            role = "",
            sort = "name",
            order = "asc"
        } = req.query;

        const users = await getUsers({ search, role, sort, order });

        return res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error("List users error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users."
        });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        return res.json({ success: true, user });
    } catch (error) {
        console.error("Get user error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch user."
        });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, address, password, role } = req.body;

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

        const allowedRoles = ["NORMAL_USER", "ADMIN", "STORE_OWNER"];

        if (!role || !allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "A valid role is required (NORMAL_USER, ADMIN, or STORE_OWNER)."
            });
        }

        const user = await createUser({
            name,
            email,
            address,
            password,
            role
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            user
        });
    } catch (error) {
        console.error("Add user error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to create user."
        });
    }
};

const listStores = async (req, res) => {
    try {
        const {
            search = "",
            sort = "name",
            order = "asc"
        } = req.query;

        const stores = await getAdminStores({ search, sort, order });

        return res.json({
            success: true,
            count: stores.length,
            stores
        });
    } catch (error) {
        console.error("Admin list stores error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch stores."
        });
    }
};

module.exports = {
    dashboard,
    listUsers,
    getUser,
    addUser,
    listStores
};
