const pool = require("../config/db");

const getStores = async ({
    search = "",
    minRating = 0,
    sort = "name",
    userId = null
}) => {

    const conditions = [];
    const params = [];

    // Search by store name or address (per requirements)
    if (search.trim()) {
        conditions.push(`
            (
                s.name LIKE ?
                OR s.address LIKE ?
            )
        `);

        const searchValue = `%${search.trim()}%`;

        params.push(
            searchValue,
            searchValue
        );
    }

    // Minimum average rating
    const ratingFilter = Number(minRating) || 0;

    if (ratingFilter > 0) {
        params.push(ratingFilter);
    }

    let query = `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            s.owner_id,
            u.name AS owner_name,

            COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
            COUNT(r.id) AS total_ratings
            ${userId ? ", ur.rating AS user_rating" : ""}

        FROM stores s

        INNER JOIN users u
            ON s.owner_id = u.id

        LEFT JOIN ratings r
            ON s.id = r.store_id
        ${userId ? `
        LEFT JOIN ratings ur
            ON s.id = ur.store_id AND ur.user_id = ?
        ` : ""}

        ${conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : ""
        }

        GROUP BY
            s.id,
            s.name,
            s.email,
            s.address,
            s.owner_id,
            u.name
            ${userId ? ", ur.rating" : ""}

        ${ratingFilter > 0
            ? `HAVING average_rating >= ?`
            : ""
        }
    `;

    const queryParams = userId ? [userId, ...params] : params;
    // Safe sorting - never directly trust user input in ORDER BY
    switch (sort) {

        case "rating":
            query += `
                ORDER BY average_rating DESC,
                         total_ratings DESC,
                         s.name ASC
            `;
            break;

        case "rating_asc":
            query += `
                ORDER BY average_rating ASC,
                         s.name ASC
            `;
            break;

        case "name":
        default:
            query += `
                ORDER BY s.name ASC
            `;
            break;
    }

    const [rows] = await pool.query(query, queryParams);

    return rows;
};

module.exports = {
    getStores
};