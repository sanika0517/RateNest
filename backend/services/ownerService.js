const pool = require("../config/db");

const getOwnerDashboard = async (ownerId) => {
    const [stores] = await pool.query(
        `SELECT id, name, email, address
         FROM stores
         WHERE owner_id = ?`,
        [ownerId]
    );

    if (stores.length === 0) {
        return {
            store: null,
            averageRating: 0,
            totalRatings: 0,
            raters: []
        };
    }

    const [summary] = await pool.query(
        `SELECT
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
            COUNT(r.id) AS total_ratings
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = ?`,
        [ownerId]
    );

    const [raters] = await pool.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            u.address,
            s.name AS store_name,
            r.rating,
            r.created_at
         FROM ratings r
         INNER JOIN stores s ON r.store_id = s.id
         INNER JOIN users u ON r.user_id = u.id
         WHERE s.owner_id = ?
         ORDER BY r.created_at DESC`,
        [ownerId]
    );

    return {
        store: stores[0],
        stores,
        averageRating: Number(summary[0].average_rating),
        totalRatings: Number(summary[0].total_ratings),
        raters
    };
};

module.exports = { getOwnerDashboard };
