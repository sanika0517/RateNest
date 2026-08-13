const pool = require("../config/db");

const getUserDashboard = async (userId) => {
    const [[summary], [recentRatings]] = await Promise.all([
        pool.query(
            `SELECT
                COUNT(*) AS total_ratings,
                COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating
             FROM ratings
             WHERE user_id = ?`,
            [userId]
        ),
        pool.query(
            `SELECT
                r.id,
                r.rating,
                r.created_at,
                s.id AS store_id,
                s.name AS store_name,
                s.address AS store_address
             FROM ratings r
             INNER JOIN stores s ON s.id = r.store_id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC
             LIMIT 5`,
            [userId]
        )
    ]);

    return {
        totalRatings: Number(summary[0].total_ratings),
        averageRating: Number(summary[0].average_rating),
        recentRatings
    };
};

module.exports = { getUserDashboard };
