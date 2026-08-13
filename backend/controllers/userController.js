const { getUserDashboard } = require("../services/userService");

const dashboard = async (req, res) => {
    try {
        const data = await getUserDashboard(req.user.userId);
        return res.json({ success: true, ...data });
    } catch (error) {
        console.error("User dashboard error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your dashboard."
        });
    }
};

module.exports = { dashboard };
