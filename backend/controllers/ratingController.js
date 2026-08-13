const {
    createRating,
    updateRating
} = require("../services/ratingService");


// ============================================
// CREATE RATING
// ============================================

const create = async (req, res) => {

    try {

        const {
            storeId,
            rating
        } = req.body;

        if (!storeId || rating === undefined) {
            return res.status(400).json({
                success: false,
                message: "storeId and rating are required."
            });
        }

        const result = await createRating({
            userId: req.user.userId,
            storeId,
            rating
        });

        return res.status(201).json({
            success: true,
            message: "Rating submitted successfully.",
            rating: result
        });

    } catch (error) {

        console.error(
            "Create rating error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message ||
                "Failed to submit rating."
        });
    }
};


// ============================================
// UPDATE RATING
// ============================================

const update = async (req, res) => {

    try {

        const {
            storeId
        } = req.params;

        const {
            rating
        } = req.body;

        if (rating === undefined) {
            return res.status(400).json({
                success: false,
                message: "Rating is required."
            });
        }

        const result = await updateRating({
            userId: req.user.userId,
            storeId,
            rating
        });

        return res.status(200).json({
            success: true,
            message: "Rating updated successfully.",
            rating: result
        });

    } catch (error) {

        console.error(
            "Update rating error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message ||
                "Failed to update rating."
        });
    }
};


module.exports = {
    create,
    update
};