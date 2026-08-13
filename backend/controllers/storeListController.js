const {
    getStores
} = require("../services/storeListService");

const list = async (req, res) => {
    try {

        const {
            search = "",
            minRating = 0,
            sort = "name"
        } = req.query;

        const userId = req.user?.userId ?? null;

        const stores = await getStores({
            search,
            minRating,
            sort,
            userId
        });

        return res.json({
            success: true,
            count: stores.length,
            stores
        });

    } catch (error) {

        console.error(
            "Get stores error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch stores."
        });
    }
};

module.exports = {
    list
};