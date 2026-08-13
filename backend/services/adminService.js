const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const getDashboardStats = async () => {
    const [[usersRow], [storesRow], [ratingsRow]] = await Promise.all([
        pool.query("SELECT COUNT(*) AS total FROM users"),
        pool.query("SELECT COUNT(*) AS total FROM stores"),
        pool.query("SELECT COUNT(*) AS total FROM ratings")
    ]);

    return {
        totalUsers: Number(usersRow[0].total),
        totalStores: Number(storesRow[0].total),
        totalRatings: Number(ratingsRow[0].total)
    };
};

const getUsers = async ({
    search = "",
    role = "",
    sort = "name",
    order = "asc"
}) => {
    const conditions = [];
    const params = [];

    if (search.trim()) {
        conditions.push(`(
            u.name LIKE ?
            OR u.email LIKE ?
            OR u.address LIKE ?
        )`);
        const value = `%${search.trim()}%`;
        params.push(value, value, value);
    }

    if (role.trim()) {
        conditions.push("u.role = ?");
        params.push(role.trim());
    }

    const sortMap = {
        name: "u.name",
        email: "u.email",
        address: "u.address",
        role: "u.role"
    };

    const sortColumn = sortMap[sort] || sortMap.name;
    const sortOrder = order === "desc" ? "DESC" : "ASC";

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const [rows] = await pool.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            u.address,
            u.role,
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS store_average_rating
         FROM users u
         LEFT JOIN stores s ON s.owner_id = u.id
         LEFT JOIN ratings r ON r.store_id = s.id
         ${whereClause}
         GROUP BY u.id, u.name, u.email, u.address, u.role
         ORDER BY ${sortColumn} ${sortOrder}`,
        params
    );

    return rows;
};

const getUserById = async (userId) => {
    const [users] = await pool.query(
        `SELECT id, name, email, address, role
         FROM users
         WHERE id = ?`,
        [userId]
    );

    if (users.length === 0) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    const user = users[0];

    if (user.role === "STORE_OWNER") {
        const [stores] = await pool.query(
            `SELECT
                s.id,
                s.name,
                COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
                COUNT(r.id) AS total_ratings
             FROM stores s
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE s.owner_id = ?
             GROUP BY s.id, s.name`,
            [userId]
        );

        user.stores = stores;
    }

    return user;
};

const createUser = async ({ name, email, address, password, role }) => {
    const [existing] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [email.toLowerCase().trim()]
    );

    if (existing.length > 0) {
        const error = new Error("An account with this email already exists.");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES (?, ?, ?, ?, ?)`,
        [
            name.trim(),
            email.toLowerCase().trim(),
            hashedPassword,
            address.trim(),
            role
        ]
    );

    return {
        id: result.insertId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        address: address.trim(),
        role
    };
};

const getAdminStores = async ({
    search = "",
    sort = "name",
    order = "asc"
}) => {
    const conditions = [];
    const params = [];

    if (search.trim()) {
        conditions.push(`(
            s.name LIKE ?
            OR s.email LIKE ?
            OR s.address LIKE ?
        )`);
        const value = `%${search.trim()}%`;
        params.push(value, value, value);
    }

    const sortMap = {
        name: "s.name",
        email: "s.email",
        address: "s.address",
        rating: "average_rating"
    };

    const sortColumn = sortMap[sort] || sortMap.name;
    const sortOrder = order === "desc" ? "DESC" : "ASC";

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const [rows] = await pool.query(
        `SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            u.name AS owner_name,
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
            COUNT(r.id) AS total_ratings
         FROM stores s
         INNER JOIN users u ON s.owner_id = u.id
         LEFT JOIN ratings r ON r.store_id = s.id
         ${whereClause}
         GROUP BY s.id, s.name, s.email, s.address, u.name
         ORDER BY ${sortColumn} ${sortOrder}`,
        params
    );

    return rows;
};

module.exports = {
    getDashboardStats,
    getUsers,
    getUserById,
    createUser,
    getAdminStores
};
