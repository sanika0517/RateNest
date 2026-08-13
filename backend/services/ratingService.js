const pool = require("../config/db");


// ============================================
// CREATE RATING
// ============================================

const createRating = async ({ userId, storeId, rating }) => {

    if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
        const error = new Error(
            "Rating must be an integer between 1 and 5."
        );
        error.statusCode = 400;
        throw error;
    }

    const [stores] = await pool.query(
        `SELECT id
         FROM stores
         WHERE id = ?`,
        [storeId]
    );

    if (stores.length === 0) {
        const error = new Error("Store not found.");
        error.statusCode = 404;
        throw error;
    }

    const [existingRatings] = await pool.query(
        `SELECT id
         FROM ratings
         WHERE user_id = ?
         AND store_id = ?`,
        [userId, storeId]
    );

    if (existingRatings.length > 0) {
        const error = new Error(
            "You have already rated this store."
        );
        error.statusCode = 409;
        throw error;
    }

    const [result] = await pool.query(
        `INSERT INTO ratings
            (user_id, store_id, rating)
         VALUES (?, ?, ?)`,
        [
            userId,
            storeId,
            Number(rating)
        ]
    );

    return {
        id: result.insertId,
        user_id: userId,
        store_id: Number(storeId),
        rating: Number(rating)
    };
};


// ============================================
// UPDATE RATING
// ============================================

const updateRating = async ({
    userId,
    storeId,
    rating
}) => {

    if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
        const error = new Error(
            "Rating must be an integer between 1 and 5."
        );
        error.statusCode = 400;
        throw error;
    }

    const [existingRatings] = await pool.query(
        `SELECT id
         FROM ratings
         WHERE user_id = ?
         AND store_id = ?`,
        [userId, storeId]
    );

    if (existingRatings.length === 0) {
        const error = new Error(
            "You have not rated this store yet."
        );
        error.statusCode = 404;
        throw error;
    }

    await pool.query(
        `UPDATE ratings
         SET rating = ?
         WHERE user_id = ?
         AND store_id = ?`,
        [
            Number(rating),
            userId,
            storeId
        ]
    );

    const [ratingSummary] = await pool.query(
        `SELECT
            ROUND(AVG(rating), 1) AS average_rating,
            COUNT(*) AS total_ratings
         FROM ratings
         WHERE store_id = ?`,
        [storeId]
    );

    return {
        store_id: Number(storeId),
        rating: Number(rating),
        average_rating: Number(
            ratingSummary[0].average_rating
        ),
        total_ratings: Number(
            ratingSummary[0].total_ratings
        )
    };
};


module.exports = {
    createRating,
    updateRating
};