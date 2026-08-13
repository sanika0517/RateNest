const pool = require("../config/db");

const createStore = async ({ name, email, address, ownerId }) => {
    // Verify that the owner exists and has STORE_OWNER role
    const [owners] = await pool.query(
        `SELECT id, name, email, role
         FROM users
         WHERE id = ? AND role = 'STORE_OWNER'`,
        [ownerId]
    );

    if (owners.length === 0) {
        const error = new Error(
            "Invalid owner. The selected user must have STORE_OWNER role."
        );
        error.statusCode = 400;
        throw error;
    }

    // Create store
    const [result] = await pool.query(
        `INSERT INTO stores (name, email, address, owner_id)
         VALUES (?, ?, ?, ?)`,
        [
            name.trim(),
            email.toLowerCase().trim(),
            address.trim(),
            ownerId
        ]
    );

    return {
        id: result.insertId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        address: address.trim(),
        owner_id: ownerId
    };
};

module.exports = {
    createStore
};