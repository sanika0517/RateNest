const { getOwnerDashboard } = require("../services/ownerService");

const dashboard = async (req, res) => {
    try {
        const data = await getOwnerDashboard(req.user.userId);

        return res.json({
            success: true,
            ...data
        });
    } catch (error) {
        console.error("Owner dashboard error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch owner dashboard."
        });
    }
};

module.exports = { dashboard };
