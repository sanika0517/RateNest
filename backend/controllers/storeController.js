const {
    createStore
} = require("../services/storeService");

const create = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            ownerId
        } = req.body;

        if (!name || !email || !address || !ownerId) {
            return res.status(400).json({
                success: false,
                message: "Name, email, address and ownerId are required."
            });
        }

        const store = await createStore({
            name,
            email,
            address,
            ownerId
        });

        return res.status(201).json({
            success: true,
            message: "Store created successfully.",
            store
        });

    } catch (error) {
        console.error("Create store error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to create store."
        });
    }
};

module.exports = {
    create
};